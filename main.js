// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  webFrame,
  ipcMain,
  screen
} = require('electron')
const path = require('path')

function createWindow() {
  const mainWindow = new BrowserWindow({
    title: "STM32 MIDI Controller Editor",
    width: 1920,
    height: 1080,
    //resizable: false,
    useContentSize: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.webContents.on('did-finish-load', () => {
    // Open the window on the display with the cursor and maximize
    let cursor = screen.getCursorScreenPoint();
    let currentScreen = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
    mainWindow.setBounds(currentScreen.bounds)
    mainWindow.maximize();

    mainWindow.webContents.send('windowLoaded', currentScreen.bounds.height);

    // Scale the content zoom for the current resolution
    mainWindow.webContents.send('scale', currentScreen.bounds.width, currentScreen.bounds.height);

    // If the display has changed after moving, set its new bounds and scale accordingly
    mainWindow.on('moved', () => {
      let newScreen = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());

      if (newScreen.id !== currentScreen.id) {
        mainWindow.setBounds(newScreen.bounds)
        mainWindow.webContents.send('scale', newScreen.bounds.width, newScreen.bounds.height);
        currentScreen = newScreen;
      }

      console.log("moved");
    });

    mainWindow.webContents.on('resize', () => {
      console.log("mainresize");
    });

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

  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {


  createWindow();

  //zoom - changed

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