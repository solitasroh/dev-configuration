import { app, BrowserWindow, ipcMain, Menu, nativeImage, Tray } from 'electron';
import ElectronStore from 'electron-store';
import { ChannelConnectServer } from './ipc/ChannelConnectServer';
import { ChannelReadData } from './ipc/ChannelReadData';
import { IpcChannel } from './ipc/IPCChannel';
import { IpcRequest } from './ipc/IPCRequest';
import IpcService from './IPCService';
import ModbusService from './ModbusService';
import ChannelWriteData from './ipc/ChannelWriteData';
import MotorUnitManagement from './modbus.a2700m/MotorUnitManagement';
import { ChannelReadPCOperation } from './ipc/ChannelReadPCOperation';
import { ChannelRequestCreateFile } from './ipc/ChannelRequestCreateFile';
import { ChannelRequestLoadFile } from './ipc/ChannelRequestLoadFile';
import { ChannelSendToDevice } from './ipc/ChannelSendToDevice';
import { ChannelReadToDevice } from './ipc/ChannelReadToDevice';
import { ChannelGetEnv } from './ipc/ChannelGetEnv';
import { CONNECTION, DISCONNECT } from '@src/ipcChannels';
import ChannelDisconnectServer from './ipc/ChannelDisconnectServer';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit();
}

class Main {
  private mainWindow: BrowserWindow;

  private modbusService: ModbusService;

  private motorUnitManagement: MotorUnitManagement;

  private ipcService: IpcService;

  init(ipcChannels: IpcChannel<IpcRequest>[]) {
    this.modbusService = ModbusService.getInstance();
    this.motorUnitManagement = MotorUnitManagement.getInstance();

    app.on('ready', (): void => {
      this.createWindow();
    });

    app.on('window-all-closed', this.onWindowClosed);
    app.on('activate', this.onActivate);

    app.whenReady().then(() => {
      // initTray();
    });

    this.registerIpcChannels(ipcChannels);
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

  private onActivate() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      this.createWindow();
    }
  }

  private createWindow() {
    // const iconImage = nativeImage.createFromPath('../src/assets/icons/win/icon.ico');

    this.mainWindow = new BrowserWindow({
      height: 600,
      width: 360,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        nativeWindowOpen: true,
      },
      // icon: iconImage,
    });
    // and load the index.html of the app.
    this.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    this.mainWindow.setMenuBarVisibility(false);

    // Open the DevTools.
    this.mainWindow.webContents.openDevTools({ mode: 'detach' });

    this.ipcService = IpcService.getInstance();

    // this.mainWindow.on('close', (e) => {
    //   e.preventDefault();
    //   this.mainWindow.hide();
    // });
    // setInterval(async () => {
    //   const result = await this.modbusService.checkConnection();
    //   if (result) {
    //     this.mainWindow.webContents.send(CONNECTION);
    //   } else {
    //     this.mainWindow.webContents.send(DISCONNECT);
    //   }
    //   console.log('check connection...');
    // }, 1000);

    this.motorUnitManagement.start(this.mainWindow.webContents);
    this.mainWindow.maximize();
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
