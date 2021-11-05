import { app, BrowserWindow, Menu, nativeImage, Tray } from 'electron';


declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit();
}

class Main {
  private mainWindow: BrowserWindow;

  init() {
   
    app.on('ready', (): void => {
      this.createWindow();
    });

    app.on('window-all-closed', this.onWindowClosed);
    app.on('activate', this.onActivate);
    let tray;
    app.whenReady().then(() => {
      const iconImage = nativeImage.createFromPath('./src/assets/icons/win/icon.ico');
      tray = new Tray(iconImage);
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
    });
  }

  private onWindowClosed = (): void => {
    if (process.platform !== 'darwin') {
      // app.quit();
      // app.hide();
      // this.mainWindow.hide();
    }
  };

  private onActivate() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      this.createWindow();
    }
  }

  private createWindow() {
    const iconImage = nativeImage.createFromPath('../src/assets/icons/win/icon.ico');

    this.mainWindow = new BrowserWindow({
      height: 600,
      width: 360,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        nativeWindowOpen: true,
      },
      icon: iconImage,
    });
    // and load the index.html of the app.
    this.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    this.mainWindow.setMenuBarVisibility(false);

    // Open the DevTools.
    this.mainWindow.webContents.openDevTools({ mode: 'detach' });
   
    this.mainWindow.on('close', (e) => {
      e.preventDefault();
      this.mainWindow.hide();
    });
  }
}

new Main().init();
