// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  ipcMain,
  screen,
  dialog
} = require('electron')
const path = require('path')
fs = require('fs');

function createWindow() {
  const mainWindow = new BrowserWindow({
    title: "STM32 MIDI Controller Editor",
    width: 1920,
    height: 1080,
    //autoHideMenuBar: true,
    //resizable: false,
    useContentSize: true,
    frame: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      //enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  // Load main HTML file
  mainWindow.loadFile('index.html');

  mainWindow.webContents.on('did-finish-load', () => {
    /*
     * Zooming / scaling
     */
    // Open the window on the display with the cursor and maximize
    let cursor = screen.getCursorScreenPoint();
    let currentScreen = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
    mainWindow.setBounds(currentScreen.bounds)
    mainWindow.maximize();

    // Tell renderer that the window has loaded so it can grab the display height
    mainWindow.webContents.send('windowLoaded', currentScreen.bounds.height);

    // Tell renderer to scale the content zoom for the current resolution
    mainWindow.webContents.send('scale', currentScreen.bounds.width, currentScreen.bounds.height);

    // If the display has changed after moving, set its new bounds and scale accordingly
    mainWindow.on('moved', () => {
      let newScreen = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());

      if (newScreen.id !== currentScreen.id) {
        mainWindow.setBounds(newScreen.bounds)
        mainWindow.webContents.send('scale', newScreen.bounds.width, newScreen.bounds.height);
        currentScreen = newScreen;
      }
    });

    // Rescale window if zoom changes (not working right now)
    ipcMain.on('zoomChanged', (event, height) => {
      if (height === 2160) {
        console.log("2160");
        mainWindow.setBounds({
          width: 3840,
          height: 2160
        });
      } else if (height === 1440) {
        console.log("1440");
        mainWindow.setBounds({
          width: 2560,
          height: 1440
        });
      } else if (height === 1080) {
        console.log("1080");
        mainWindow.setBounds({
          width: 1920,
          height: 1080
        });

      }
    });

    /*
     * Titlebar actions
     */
    ipcMain.on('window-minimize', (event) => {
      mainWindow.minimize();
    })

    ipcMain.on('window-maximize', (event) => {
      if (!mainWindow.isMaximized()) {
        mainWindow.maximize();
        mainWindow.setResizable(false);
        event.reply('window-maximize-maximized');
      } else {
        mainWindow.unmaximize();
        mainWindow.setResizable(true);
        event.reply('window-maximize-unmaximized');
      }
    })

    ipcMain.on('window-close', (event) => {
      mainWindow.close();
    })


    /*
     * Menu button actions
     */
    // Save
    ipcMain.on('saveFile', (event, preset, path) => {
      fs.writeFile(path, preset, function (err) {
        if (err) {
          console.error(err)
          return
        }
      });
    });

    // Save As
    ipcMain.on('saveFileAs', (event, preset) => {
      dialog.showSaveDialog({
        properties: ['openFile'],
        filters: [{
          name: "Preset Text Files",
          extensions: ['txt']
        }]
      }).then((pathObj) => {
        if (!pathObj.canceled) {
          fs.writeFile(pathObj.filePath, preset, function (err) {
            if (err) {
              console.error(err)
              return
            }
            event.reply('saveFileAs-saved', pathObj.filePath);
          });
        }
      });
    });

    // Load 
    ipcMain.on('loadFile', (event) => {
      dialog.showOpenDialog({
        filters: [{
          name: "Preset Text Files",
          extensions: ['txt']
        }]
      }).then((pathObj) => {
        if (!pathObj.canceled) {
          fs.readFile(pathObj.filePaths[0], 'utf8', (err, preset) => {
            if (err) {
              console.error(err)
              return
            }
            event.reply('loadFile-loaded', preset, pathObj.filePaths[0]);
          })
        }
      });
    });


  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {


  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.

    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.