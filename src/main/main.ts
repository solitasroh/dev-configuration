import { app, BrowserWindow, ipcMain, Menu, nativeImage, Tray } from 'electron';
import RequestChannel from './ipc/RequestChannel';
import { IpcChannel } from './ipc/IPCChannel';
import { IpcRequest } from './ipc/IPCRequest';
import IpcService from './IPCService';
import ModbusService from './ModbusService';
import WriteRequestChannel from './ipc/WriteRequestChannel';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit();
}

class Main {
  private mainWindow: BrowserWindow;

  private modbusService: ModbusService;

  private ipcService: IpcService;

  init(ipcChannels: IpcChannel<IpcRequest>[]) {
    this.modbusService = ModbusService.getInstance();

    app.on('ready', (): void => {
      this.createWindow();
    });

    app.on('window-all-closed', this.onWindowClosed);
    app.on('activate', this.onActivate);

    app.whenReady().then(() => {
      // initTray();
      this.modbusService.start('10.10.23.41', 502);
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
    this.ipcService.registerCallback((channel, ...args) => {
      this.mainWindow.webContents.send(channel, ...args);
    });
    // this.mainWindow.on('close', (e) => {
    //   e.preventDefault();
    //   this.mainWindow.hide();
    // });
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

new Main().init([new RequestChannel(), new WriteRequestChannel()]);
