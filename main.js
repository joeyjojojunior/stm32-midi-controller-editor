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

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    resizable: false,
    useContentSize: true,
    //fullscreen: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      //useContentSize: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  });


  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  mainWindow.webContents.on('did-finish-load', () => {
    let cursor = screen.getCursorScreenPoint();
    let currentScreen = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
    mainWindow.setBounds(currentScreen.bounds)


    mainWindow.webContents.send('scale', currentScreen.bounds.width, currentScreen.bounds.height);

    mainWindow.on('moved', () => {
      console.log("moved");

      let newScreen = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
      console.log(newScreen);

      if (newScreen.id !== currentScreen.id) {
        mainWindow.setBounds(newScreen.bounds)
        mainWindow.webContents.send('scale', newScreen.bounds.width, newScreen.bounds.height);
        currentScreen = newScreen;
      }

    });


    mainWindow.maximize();


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