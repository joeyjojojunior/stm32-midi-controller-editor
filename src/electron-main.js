
const { webContents } = require('electron');
const { dialog } = require('electron')
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const fs = require('fs');

const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const BASE_WIDTH = 1920;
const BASE_HEIGHT = 920;

let isDialogOpen = false;
let isFetchingPresets = false;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: BASE_WIDTH,
        height: BASE_HEIGHT,
        useContentSize: true,
        frame: false,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, './preload.js'),
        }
    });

    // and load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
    });
    mainWindow.loadURL(startUrl);
    // Open the DevTools.
    //mainWindow.webContents.openDevTools();

    mainWindow.webContents.on('did-finish-load', () => {
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
         * Preset browser actions
         */
        // Set the default preset path
        ipcMain.on('set-preset-dir', (event) => {
            if (!isDialogOpen) {
                isDialogOpen = true;
                dialog.showOpenDialog({
                    title: "Select a preset folder...",
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
                    isDialogOpen = false;
                });
            }
        });

        ipcMain.on('fetch-presets', (event, presetPath) => {
            if (!isFetchingPresets) {
                var presetStrings = [];
                try {
                    isFetchingPresets = true;
                    const presets = fs.readdirSync(presetPath);
                    presets.forEach(p => {
                        if (path.extname(p) === ".txt") {
                            try {
                                const preset = fs.readFileSync(`${presetPath}\\${p}`, 'utf-8');
                                presetStrings.push(preset.split('\n')[0]);
                            } catch (err) {
                                console.error(err);
                            }
                        }
                    });
                } catch (err) {
                    console.error(err);
                }
                isFetchingPresets = false;
                event.reply('fetch-presets-fetched', presetStrings);
            }
        })
    });


    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.