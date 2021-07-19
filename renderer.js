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

const ZOOM_1080P = 1;
const ZOOM_1440P = 1.3333333; // sqrt(2560p/1920p)
const ZOOM_2160P = 2;

const defaultZoomFactors = {
    2160: ZOOM_2160P,
    1440: ZOOM_1440P,
    1080: ZOOM_1080P
}

let displayHeight = 0;
let zoomFactor = 0;
let isZoomLocked = false;


delete process.env.ELECTRON_ENABLE_SECURITY_WARNINGS;
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

ipcRenderer.on('windowLoaded', (event, height) => {
    displayHeight = height;
});

// Scale the content according to resolution height
ipcRenderer.on('scale', (event, width, height) => {
    webFrame.setZoomFactor(defaultZoomFactors[height]);
    displayHeight = height;
    zoomFactor = webFrame.getZoomFactor();
});

function saveFile(preset) {
    ipcRenderer.send('saveFile', preset);
}

function eventZoomChanged() {
    currZoomFactor = webFrame.getZoomFactor();
    if (currZoomFactor - zoomFactor < 0) {
        if (currZoomFactor > ZOOM_1440P && currZoomFactor < ZOOM_2160P) {
            webFrame.setZoomFactor(ZOOM_1440P);
            ipcRenderer.send('zoomChanged', 1440);
        } else if (currZoomFactor > ZOOM_1080P && currZoomFactor < ZOOM_1440P) {
            webFrame.setZoomFactor(ZOOM_1080P);
            ipcRenderer.send('zoomChanged', 1080);
        } else {
            //webFrame.setZoomFactor(ZOOM_2160P);
        }

    }
    console.log("eventZoomChanged");
    zoomFactor = currZoomFactor;
}

function testZoom1080() {
    ipcRenderer.send('zoomChanged', 1080);

    webFrame.setZoomFactor(ZOOM_1080P);

}

function testZoom1440() {
    ipcRenderer.send('zoomChanged', 1440);

    webFrame.setZoomFactor(ZOOM_1440P);

}

function testZoom2160() {
    ipcRenderer.send('zoomChanged', 2160);

    webFrame.setZoomFactor(ZOOM_2160P);

}