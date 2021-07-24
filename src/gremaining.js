function init() {
    HTML.init();
    Presets.init();
    Knobs.init();
    Grid.init();
    Controller.selectKnob(0);
}


/*
 * Grid display update functions
 */
function updateDisplays() {
    for (var i = 0; i < NUM_KNOBS; i++) {
        updateKnobContent(i);
    }
}

function updateKnobContent(knobID) {
    var knobContent = document.getElementById(`knobContent${knobID}`);
    knobContent.innerHTML = formatContent(knobID);
}

function formatContent(knobID) {
    if (mode === "preset" && typeof presetSettings[knobID] !== "undefined") {
        return `${presetSettings[knobID].name}<br>${presetSettings[knobID].sublabel}`;
    } else if (mode === "knob") {
        var sublabel = (knobSettings[knobID].sub_labels.length > 0) ? knobSettings[knobID].sub_labels[0] : "";
        return `${knobSettings[knobID].label}<br>${sublabel}`;
    }
}


function activateItem(knobID) {
    /*
    var gridItemOld = document.getElementById(`gridItem${currKnobID}`);
    var gridItemNew = document.getElementById(`gridItem${knobID}`);

    var inputs = HTML.getInputs();

    inputs.label.value = knobSettings[knobID].label;
    inputs.channel.value = knobSettings[knobID].channel;
    inputs.cc.value = knobSettings[knobID].cc;
    inputs.initValue.value = knobSettings[knobID].init_value;
    inputs.maxRange.value = knobSettings[knobID].max_range;
    inputs.isLocked.checked = (knobSettings[knobID].isLocked === "true");
    createSublabels(knobID);

    gridItemOld.classList.remove("active");
    gridItemNew.classList.add("active");

    document.querySelector(".knob").innerHTML = `Knob ${knobID + 1}`;
    updateKnobContent(knobID);
    */
}

/*
 * Preset loading
 */
function createPresetString() {
    var presetJSON = new Object();
    var presetString = new Array();
    var inputs = HTML.getInputs();

    cacheKnob(currKnobID); // Save currently open knob

    // TODO: Index!
    presetJSON.name = inputs.presetLabel.value;
    presetJSON.sub_label = inputs.presetSublabel.value;
    presetJSON.index = "0";
    presetJSON.knobs = new Array();

    presetString += `${presetJSON.name},${presetJSON.sub_label},${presetJSON.index}`

    for (var i = 0; i < NUM_KNOBS; i++) {
        var line = "\n";

        presetJSON.knobs[i] = {
            label: knobSettings[i].label,
            sub_labels: knobSettings[i].sub_labels,
            channel: knobSettings[i].channel,
            cc: knobSettings[i].cc,
            init_value: knobSettings[i].init_value,
            max_values: (slLength > 1) ? `${slLength}` : "128",
            max_range: knobSettings[i].max_range,
            is_locked: (knobSettings[i] === "true") ? "1" : "0"
        }

        line += `${presetJSON.knobs[i].label},${presetJSON.knobs[i].channel},`
        line += `${presetJSON.knobs[i].cc},${presetJSON.knobs[i].init_value},`
        line += `${presetJSON.knobs[i].max_values},${presetJSON.knobs[i].max_range},`
        line += `${presetJSON.knobs[i].is_locked},`

        var slLength = knobSettings[i].sub_labels.length;
        line += `${slLength}`;
        for (var j = 0; j < slLength; j++) {
            line += `,${knobSettings[i].sub_labels[j]}`;
        }

        presetString += `${line}`;
    }
    return presetString
}

window.onload = () => {
    var dropArea = window;
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    });

    window.addEventListener('resize', r_eventZoomChanged);

}

document.addEventListener("DOMContentLoaded", function (event) {
    // Rescale the window to fit the current zoom factor
    // Needs some delay so electron can register the proper factor
    setTimeout(() => {
        r_eventZoomChanged();
    }, 20);

    /*
     * Titlebar actions
     */
    // Titlebar button click events
    var tbr = document.getElementById("titlebar-drag-region");
    var btnMin = document.querySelector(".titlebar-btn-min");
    var btnMax = document.querySelector(".titlebar-btn-max");
    var btnClose = document.querySelector(".titlebar-btn-close");

    tbr.classList.add("drag");
    btnMin.addEventListener("click", r_eventBtnMin);
    btnMax.addEventListener("click", r_eventBtnMax);
    btnClose.addEventListener("click", r_eventBtnClose);

    /*
     * Preset browser actions
     */
    //var presetPathBtn = document.querySelector(".preset-path-btn");
    //presetPathBtn.addEventListener("click", r_setPresetPath);
    setTimeout(r_fetchPresets, 50); // Initial preset load needs some delay

    /*
     * Menu button actions
     */
    var top = document.querySelector(".top");
    var presetBrowser = document.querySelector(".preset-browser")
    var knob = document.querySelector(".knob");
    var mainDiv = document.querySelector(".mainDiv");
    var presetGrid = document.querySelector(".preset-grid");
    //var knobGrid = document.querySelector(".knob-grid");

    // Hide knob and top by default since app starts in preset mode
    //mainDiv.style.display = "none";
    //knobGrid.style.display = "none";

    //knob.style.display = "none";
    //top.style.display = "none";

    // Preset/knob switch button action
    var btnPresets = document.getElementById("btnPresets");
    btnPresets.addEventListener("click", () => {
        mode = (mode === "knob") ? "preset" : "knob";

        // Fetch the presets if a path is defined
        if (mode == "preset" && presetPath.length > 0) {
            r_fetchPresets();
        }


        /*
        // Two blocks below control fade-in/out of elems for preset/knob mode switching
        mainDiv.classList.add("fade-out");
        presetBrowser.classList.add("fade-out");
        setTimeout(() => {
            var knobElems = [document.querySelector(".top"), document.querySelector(".knob"), presetBrowser];
            for (var i = 0; i < knobElems.length; i++) {
                knobElems[i].style.display = (knobElems[i].style.display === "none") ? "flex" : "none";
            }
        }, 250);

        mainDiv.classList.add("hide");
        setTimeout(() => {
            presetBrowser.classList.add("fade-in-slow");
            mainDiv.classList.remove("hide");
            mainDiv.classList.add("fade-in");
        }, 300);
        presetBrowser.classList.remove("fade-in-slow");
        mainDiv.classList.remove("fade-in")
        */

        // Want some delay before updating the displays since we don't
        // want to see knobContent change during the switch
        /*
        setTimeout(() => {
            updateDisplays();
            (mode === "preset") ? activateItem(currPresetID): activateItem(currKnobID);
        }, 310);
        */
    });

    // Save button click event
    var btnSave = document.getElementById("btnSave");
    btnSave.addEventListener("click", (e) => {
        var preset = createPresetString();

        if (currFilename === "") {
            r_saveFileAs(preset);
        } else {
            r_saveFile(preset, currFilename);
        }
    });

    // Save As button click event
    var btnSaveAs = document.getElementById("btnSaveAs");
    btnSaveAs.addEventListener("click", (e) => {
        var preset = createPresetString();
        r_saveFileAs(preset);
    });

    // Load button click event
    var btnLoad = document.getElementById("btnLoad");
    btnLoad.addEventListener("click", r_loadFile);

    // Reset button click event
    var btnReset = document.getElementById("btnReset");
    btnReset.addEventListener("click", () => {
        if (mode === "knob") {
            var inputPresetLabel = document.getElementById("inputPresetLabel");
            var inputPresetSublabel = document.getElementById("inputPresetSublabel");
            inputPresetLabel.value = "";
            inputPresetSublabel.value = "";
            initKnobSettings();
            updateDisplays();
            activateItem(0);
        }
    });
});

init();