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

var BASE_WIDTH = 1920;
var BASE_HEIGHT = 918;

function createWindow() {
    const mainWindow = new BrowserWindow({
        title: "STM32 MIDI Controller Editor",
        width: BASE_WIDTH,
        height: BASE_HEIGHT,
        x: 0,
        y: 0,
        //autoHideMenuBar: true,
        resizable: false,
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
         * Zooming/scaling
         * --------------------------------------------------------
         * The index.js window object has a resize event listener.
         *
         * Zooming in/out triggers this event and calls function
         * eventZoomChanged() in the render process.
         *
         * The fn then gets the new zoom factor and sends it to the
         * main process which uses it to rescale the content size
         * so the window will scale to fit the new content exactly.
         */
        ipcMain.on('zoom-changed', (event, zScale) => {
            var newWidth = Math.trunc(BASE_WIDTH * zScale);
            var newHeight = Math.trunc(BASE_HEIGHT * zScale);
            mainWindow.setContentSize(newWidth, newHeight);
        });

        /*
         * Main window maximize events
         */
        mainWindow.on('maximize', (event) => {
            mainWindow.webContents.send('window-maximize-maximized');
            console.log("maximize");
        });

        mainWindow.on('unmaximize', (event) => {
            mainWindow.webContents.send('window-maximize-unmaximized');
            console.log("unmaximize");

        });

        /*
         * Options loading
         */
        fs.readFile("./options.json", 'utf8', (err, options) => {
            if (err) {
                console.error(err)
                return
            }
            mainWindow.webContents.send('options-loaded', JSON.parse(options));
        })

        /*
         * Titlebar actions
         */
        ipcMain.on('window-minimize', (event) => {
            mainWindow.minimize();
        });

        ipcMain.on('window-maximize', (event) => {
            if (!mainWindow.isMaximized()) {
                mainWindow.maximize();
                //mainWindow.setResizable(false);
                event.reply('window-maximize-maximized');
            } else {
                mainWindow.unmaximize();
                //mainWindow.setResizable(true);
                event.reply('window-maximize-unmaximized');
            }
        });

        ipcMain.on('window-close', (event) => {
            mainWindow.close();
        });

        /*
         * Preset browser actions
         */
        // Set the default preset path
        ipcMain.on('set-preset-path', (event) => {
            dialog.showOpenDialog({
                properties: ['openDirectory']
            }).then((pathObj) => {
                if (!pathObj.canceled) {
                    var optionsJSON = {
                        presetPath: pathObj.filePaths[0]
                    };

                    fs.writeFile("./options.json", JSON.stringify(optionsJSON), function (err) {
                        if (err) {
                            console.error(err)
                            return
                        }
                    });
                    event.reply('set-preset-path-ready', pathObj.filePaths[0]);
                }
            });
        });

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