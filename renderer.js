// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

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

// In renderer process (web page).
const {
    ipcRenderer,
    webFrame
} = require('electron')

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
    /*
        if (height === 2160) {
            maxZoom = allowedZoomFactors.length - 1;
        } else if (height === 1440) {
            maxZoom = allowedZoomFactors.length - 2;
        } else if (height === 1080) {
            maxZoom = allowedZoomFactors.length - 3;
        }

        if (currZoomFactor - zoomFactor > 0) {
            webFrame.setZoomFactor

        }

        */


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