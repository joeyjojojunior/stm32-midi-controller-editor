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

/*
 * Zooming/scaling
 */
/*
ipcRenderer.on('windowLoaded', (event, height) => {
    displayHeight = height;
});

// Scale the content according to resolution height
ipcRenderer.on('scale', (event, width, height) => {
    webFrame.setZoomFactor(defaultZoomFactors[height]);
    displayHeight = height;
    zoomFactor = webFrame.getZoomFactor();
});
*/

function pathInputSize(path) {
    return `${(path.length + 2) * 8}px`
}

/*
 * Options loading
 */
ipcRenderer.on('options-loaded', (event, options) => {
    if (options != null && options != undefined) {
        var presetPathInput = document.querySelector(".preset-path-input");
        presetPathInput.value = options.presetPath;
        presetPathInput.style.width = pathInputSize(options.presetPath);
    }
});

/*
 * Titlebar actions
 */
function eventBtnMin() {
    ipcRenderer.send('window-minimize');
}

function eventBtnMax() {
    ipcRenderer.send('window-maximize');
}

ipcRenderer.on('window-maximize-maximized', (event) => {
    var tbr = document.getElementById("titlebar-drag-region");
    tbr.classList.remove("drag");
    tbr.classList.add("no-drag");
    console.log("drag off");

});

ipcRenderer.on('window-maximize-unmaximized', (event) => {
    var tbr = document.getElementById("titlebar-drag-region");
    tbr.classList.remove("no-drag");
    tbr.classList.add("drag");
    console.log("drag on");
});

function eventBtnClose() {
    ipcRenderer.send('window-close');
}

/*
 * Preset browser actions
 */
function setPresetPath() {
    ipcRenderer.send('set-preset-path')
}

ipcRenderer.on('set-preset-path-ready', (event, path) => {
    var presetPathInput = document.querySelector(".preset-path-input");
    presetPathInput.value = path;
    presetPathInput.style.width = pathInputSize(path);
});

/*
 * Menu button actions
 */
function fetchPresets(path) {

}

function saveFile(preset, path) {
    ipcRenderer.send('saveFile', preset, path);
}

function saveFileAs(preset) {
    ipcRenderer.send('saveFileAs', preset);
}

ipcRenderer.on('saveFileAs-saved', (event, path) => {
    currFilename = path;
})

function loadFile() {
    ipcRenderer.send('loadFile');
}

ipcRenderer.on('loadFile-loaded', (event, preset, fname) => {
    //console.log(preset);
    var presetStrings = preset.split("\n");

    var presetInfo = presetStrings[0];
    var presetTokens = presetInfo.split(',');

    var inputPresetLabel = document.getElementById("inputPresetLabel");
    inputPresetLabel.value = presetTokens[0];

    var inputPresetSublabel = document.getElementById("inputPresetSublabel");
    inputPresetSublabel.value = presetTokens[1];

    var knobsInfo = presetStrings.slice(1, presetStrings.length);

    for (var i = 0; i < NUM_KNOBS; i++) {
        var knobInfo = knobsInfo[i].split(',');

        knobSettings[i].label = knobInfo[0];
        knobSettings[i].channel = knobInfo[1];
        knobSettings[i].cc = knobInfo[2];
        knobSettings[i].init_value = knobInfo[3];
        knobSettings[i].max_values = knobInfo[4];
        knobSettings[i].max_range = knobInfo[5];
        knobSettings[i].isLocked = (knobInfo[6] === "0") ? "false" : "true";

        var sl_index = 8;
        for (var j = sl_index; j < knobInfo.length; j++) {
            knobSettings[i].sub_labels[j - sl_index] = knobInfo[j];
        }
    }

    currFilename = fname;
    showKnob(0);
    updateDisplays();
});


/*
 * Test stuff
 */
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