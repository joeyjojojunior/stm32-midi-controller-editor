// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.



// In renderer process (web page).
const {
    ipcRenderer,
    webFrame
} = require('electron')

delete process.env.ELECTRON_ENABLE_SECURITY_WARNINGS;
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;



ipcRenderer.on('scale', (event, width, height) => {
    console.log(`${width}, ${height}`);

    if (width === 3840) {
        webFrame.setZoomFactor(2);
    } else if (width === 1920) {
        webFrame.setZoomFactor(1);
    }
});

/*
ipcRenderer.on('unmaximize', (event, arg) => {
    webFrame.setZoomFactor(1)
});
*/