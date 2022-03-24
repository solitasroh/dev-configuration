import { app, BrowserWindow, ipcMain, Menu, nativeImage, Tray } from 'electron';
import WindowInformation, {
  debugWindowConfig,
  loadWindowConfig,
  saveWindowConfig,
} from '@src/main/WindowConfig';
import { CONNECTION, DISCONNECT } from '@src/ipcChannels';
import { ChannelConnectServer } from './ipc/ChannelConnectServer';
import { ChannelReadData } from './ipc/ChannelReadData';
import { IpcChannel } from './ipc/IPCChannel';
import { IpcRequest } from './ipc/IPCRequest';
import IpcService from './IPCService';
import ModbusService, { ConnectionStatus } from './ModbusService';
import ChannelWriteData from './ipc/ChannelWriteData';
import MotorUnitManagement from './modbus.a2700m/MotorUnitManagement';
import { ChannelReadPCOperation } from './ipc/ChannelReadPCOperation';
import { ChannelRequestCreateFile } from './ipc/ChannelRequestCreateFile';
import { ChannelRequestLoadFile } from './ipc/ChannelRequestLoadFile';
import { ChannelSendToDevice } from './ipc/ChannelSendToDevice';
import { ChannelReadToDevice } from './ipc/ChannelReadToDevice';
import { ChannelGetEnv } from './ipc/ChannelGetEnv';
import ChannelDisconnectServer from './ipc/ChannelDisconnectServer';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit();
}

class Main {
  private windowInformation: WindowInformation;

  private mainWindow: BrowserWindow;

  private modbusService: ModbusService;

  private motorUnitManagement: MotorUnitManagement;

  private ipcService: IpcService;

  init(ipcChannels: IpcChannel<IpcRequest>[]) {
    this.windowInformation = {
      x: 10,
      y: 10,
      width: 1000,
      height: 500,
      validity: true,
      isMaximized: false,
    };

    this.modbusService = ModbusService.getInstance();
    this.motorUnitManagement = MotorUnitManagement.getInstance();
    this.ipcService = IpcService.getInstance();

    app.on('ready', async (): Promise<void> => {
      await this.createWindow();
    });

    app.on('window-all-closed', this.onWindowClosed);
    app.on('activate', this.onActivate);

    app.whenReady().then(() => {
      // initTray();
    });
    app.disableHardwareAcceleration();
    app.commandLine.appendSwitch('in-process-gpu');
    ModbusService.modbusInit();

    this.registerIpcChannels(ipcChannels);
  }

  private modbusConnected() {
    if (this.mainWindow !== null) this.mainWindow.webContents.send(CONNECTION);
  }

  private modbusDisconnected() {
    if (this.mainWindow !== null) this.mainWindow.webContents.send(DISCONNECT);
  }

  private initTray() {
    const iconImage = nativeImage.createFromPath(
      './src/assets/icons/win/icon.ico',
    );
    const tray = new Tray(iconImage);
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'program exit',
        type: 'normal',
        click: () => {
          if (this.mainWindow.isEnabled()) this.mainWindow.destroy();
          app.quit();
        },
      },
    ]);

    tray.setToolTip('File-Watcher');
    tray.setTitle('File-Watcher');
    tray.setContextMenu(contextMenu);
    tray.on('click', () => {
      if (this.mainWindow != null) {
        if (!this.mainWindow.isVisible()) {
          this.mainWindow.show();
        }
      }
    });
  }

  private onWindowClosed = (): void => {
    app.quit();
  };

  private async onActivate() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      await this.createWindow();
    }
  }

  private modbusStatusOld: number;

  private static getIconsPath(): string {
    if (process.platform === 'darwin') {
      return '../src/assets/icons/mac/icon.icns';
    }
    return '../src/assets/icons/win/icon.ico';
  }

  private async createWindow() {
    const iconImage = nativeImage.createFromPath(Main.getIconsPath());

    this.mainWindow = new BrowserWindow({
      height: 600,
      width: 1000,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        nativeWindowOpen: true,
      },
      // show: false,
      icon: iconImage,
    });

    await this.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    this.mainWindow.setMenuBarVisibility(false);

    // Open the DevTools.
    this.mainWindow.webContents.openDevTools();

    this.mainWindow.on('close', (e) => {
      // e.preventDefault();
      // this.mainWindow.hide();
      ModbusService.modbusRelease();
      if (this.windowInformation.x === undefined) {
        const [x, y] = this.mainWindow.getPosition();
        const rect = this.mainWindow.getContentBounds();
        this.windowInformation.x = x;
        this.windowInformation.y = y;
        this.windowInformation.width = rect.width;
        this.windowInformation.height = rect.height;
      }
      saveWindowConfig(this.windowInformation);
    });

    this.mainWindow.on('ready-to-show', () => {
      console.log(`ready to show window`);
      this.windowInformation = loadWindowConfig();
      debugWindowConfig('load', this.windowInformation);
      this.mainWindow.setContentBounds({
        x: this.windowInformation.x,
        y: this.windowInformation.y,
        width: this.windowInformation.width,
        height: this.windowInformation.height,
      });
      this.mainWindow.show();
      if (this.windowInformation.isMaximized) {
        this.mainWindow.maximize();
      }
    });

    this.mainWindow.on('maximize', () => {
      this.windowInformation.isMaximized = true;
    });

    this.mainWindow.on('unmaximize', () => {
      this.windowInformation.isMaximized = false;
    });

    this.mainWindow.on('moved', () => {
      const position = this.mainWindow.getPosition();
      const [x, y] = position;
      this.windowInformation.x = x;
      this.windowInformation.y = y;
    });

    this.mainWindow.on('resized', () => {
      const { width, height } = this.mainWindow.getContentBounds();
      this.windowInformation.width = width;
      this.windowInformation.height = height;
    });

    this.motorUnitManagement.start(this.mainWindow.webContents);
    let forcedCount = 0;
    setInterval(() => {
      const { connectionState } = ModbusService.getInstance();
      if (this.modbusStatusOld !== connectionState) {
        if (
          this.modbusStatusOld === ConnectionStatus.Connected &&
          connectionState === ConnectionStatus.Disconnected
        ) {
          this.mainWindow.webContents.send(DISCONNECT);
        } else if (
          this.modbusStatusOld === ConnectionStatus.Disconnected &&
          connectionState === ConnectionStatus.Connected
        ) {
          this.mainWindow.webContents.send(CONNECTION);
        }
      }

      if (forcedCount === 10) {
        forcedCount = 0;
        if (connectionState === ConnectionStatus.Connected) {
          this.mainWindow.webContents.send(CONNECTION);
        }

        if (connectionState === ConnectionStatus.Disconnected) {
          this.mainWindow.webContents.send(DISCONNECT);
        }
      }
      forcedCount += 1;
      this.modbusStatusOld = connectionState;
    }, 500);
  }

  private registerIpcChannels = (
    ipcChannels: IpcChannel<IpcRequest>[],
  ): void => {
    ipcChannels.forEach((channel) =>
      ipcMain.on(channel.getChannelName(), (event, request) =>
        channel.handle(event, request),
      ),
    );
  };
}

new Main().init([
  new ChannelReadData(),
  new ChannelWriteData(),
  new ChannelConnectServer(),
  new ChannelDisconnectServer(),
  new ChannelReadPCOperation(),
  new ChannelRequestCreateFile(),
  new ChannelRequestLoadFile(),
  new ChannelSendToDevice(),
  new ChannelReadToDevice(),
  new ChannelGetEnv(),
]);
