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

/*
 * Zooming/scaling
 */
// Triggered when the zoom changes and prompts the main 
// process to resize the window to fit the contents
function r_eventZoomChanged() {
    ipcRenderer.send('zoom-changed', webFrame.getZoomFactor());
}

ipcRenderer.on('zoom-changed-complete', (event, zScale) => {
    webFrame.setZoomFactor(zScale);
});

ipcRenderer.on('size-increased', (event, zScale) => {
    webFrame.setZoomFactor(zScale);
});

/*
 * Options loading
 */
ipcRenderer.on('options-loaded', (event, options) => {
    if (options != null && options != undefined) {
        /*
        var presetPathInput = document.querySelector(".preset-path-input");
        presetPath = options.presetPath;
        presetPathInput.value = options.presetPath;
        presetPathInput.style.width = pathInputSize(options.presetPath);
        */
    }
});

// Helper function returns the width needed to
// fit the path input field text exactly
function pathInputSize(path) {
    return `${Math.trunc((path.length) * 8.5)}px`
}

/*
 * Titlebar actions
 */
// Titlebar minimize button action
function r_eventBtnMin() {
    ipcRenderer.send('window-minimize');
}

// Titlebar maximize button action
function r_eventBtnMax() {
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

// Titlebar close button action
function r_eventBtnClose() {
    ipcRenderer.send('window-close');
}

/*
 * Preset browser actions
 */
// Set the preset path to the user's selection in an open dialog
function r_setPresetPath() {
    ipcRenderer.send('set-preset-path')
}

ipcRenderer.on('set-preset-path-ready', (event, path) => {
    var presetPathInput = document.querySelector(".preset-path-input");
    presetPathInput.value = path;
    presetPathInput.style.width = pathInputSize(path);
});

// Fetch the list of presets in the preset path
function r_fetchPresets() {
    console.log("renderer fetching");
    ipcRenderer.send('fetch-presets', Presets.path);
}

ipcRenderer.on('fetch-presets-fetched', (event, presetStrings) => {
    for (var i = 0; i < presetStrings.length; i++) {
        var presetStr = presetStrings[i].split(',');
        var name = presetStr[0];
        var sublabel = presetStr[1];
        var index = parseInt(presetStr[2], 10);
        presetSettings[index] = {
            name: name,
            sublabel: sublabel,
            index: `${index}`
        };
    }
});

/*
 * Menu button actions
 */
function fetchPresets(path) {}

// Save file
function r_saveFile(preset, path) {
    ipcRenderer.send('saveFile', preset, path);
}

// Save As file
function r_saveFileAs(preset) {
    ipcRenderer.send('saveFileAs', preset);
}

ipcRenderer.on('saveFileAs-saved', (event, path) => {
    currFilename = path;
})

// Load file
function r_loadFile() {
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
    activateItem(0);
    updateDisplays();
});