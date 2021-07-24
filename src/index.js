const {
    read
} = require("original-fs");

// Global variables
const MAX_LABEL_CHARS = 14;
const NUM_COLS = 16;
const NUM_ROWS = 4;
const NUM_KNOBS = 128;

var mode = "knob";
var HTML = {
    createTitle: function () {
        var inputPresetLabel = document.getElementById("inputPresetLabel");
        inputPresetLabel.maxLength = MAX_LABEL_CHARS;

        var inputPresetSublabel = document.getElementById("inputPresetSublabel");
        inputPresetSublabel.maxLength = MAX_LABEL_CHARS;
    },

    createTableSettings: function () {
        var tbl = document.createElement("table");

        var tbdy = document.createElement("tbody");
        var inputLabels = ["Label", "Channel", "CC", "Init Value", "Max Range", "Locked"];

        // Create the input fields for this knob
        var knobInputFields = HTML.createInputSettings();

        // Add the labels/fields to the table
        for (var i = 0; i < inputLabels.length - 1; i++) {
            var tr = document.createElement("tr");

            var tdInputLabel = document.createElement("td");
            tdInputLabel.innerHTML = inputLabels[i];

            var tdInputField = document.createElement("td");
            tdInputField.appendChild(knobInputFields[i]);

            tr.appendChild(tdInputLabel);
            tr.appendChild(tdInputField);
            tbdy.appendChild(tr);
        }

        // Do the checkbox separately since it needs its own div for layout purposes
        var divIsLocked = document.createElement("div");
        divIsLocked.className = "divIsLocked";

        var tr = document.createElement("tr");
        var tdInputLabel = document.createElement("td");
        tdInputLabel.innerHTML = inputLabels[inputLabels.length - 1];

        var tdInputField = document.createElement("td");
        tdInputField.appendChild(knobInputFields[knobInputFields.length - 1]);

        divIsLocked.appendChild(tdInputLabel);
        divIsLocked.appendChild(tdInputField);
        tr.appendChild(divIsLocked)
        tbdy.appendChild(tr);
        tbl.appendChild(tbdy);

        document.querySelector(".settings").appendChild(tbl);
    },

    createInputSettings: function () {
        var label = document.createElement("input");
        var channel = document.createElement("input");
        var cc = document.createElement("input");
        var initValue = document.createElement("input");
        var maxRange = document.createElement("input");
        var isLocked = document.createElement("input");

        label.className = "inputField";
        label.id = `inputLabel`;
        label.maxLength = MAX_LABEL_CHARS;
        label.addEventListener("input", HTML.eventInputChanged, false);

        channel.className = `inputField`;
        channel.id = `inputChannel`;
        channel.maxLength = 2;
        channel.addEventListener("input", HTML.eventInputChanged, false);

        cc.className = `inputField`;
        cc.id = `inputCC`;
        cc.maxLength = 3;
        cc.addEventListener("input", HTML.eventInputChanged, false);

        initValue.className = `inputField`;
        initValue.id = `inputInitValue`;
        initValue.maxLength = 3;

        maxRange.className = `inputField`;
        maxRange.id = `inputMaxRange`;
        maxRange.maxLength = 3;

        isLocked.className = `inputCheckbox`;
        isLocked.id = `inputIsLocked`;
        isLocked.type = "checkbox";

        var inputs = [label, channel, cc, initValue, maxRange, isLocked];

        for (var i = 0; i < inputs.length - 1; i++) {
            inputs[i].spellcheck = false;
        }

        return inputs;
    },

    getInputs: function () {
        return {
            presetLabel: document.getElementById("inputPresetLabel"),
            presetSublabel: document.getElementById("inputPresetSublabel"),
            label: document.getElementById("inputLabel"),
            channel: document.getElementById("inputChannel"),
            cc: document.getElementById("inputCC"),
            initValue: document.getElementById("inputInitValue"),
            maxRange: document.getElementById("inputMaxRange"),
            isLocked: document.getElementById("inputIsLocked")
        }
    },

    eventInputChanged: function () {
        /*
        cacheKnob(currKnobID);
        activateItem(currKnobID);
        */
    },

    createSublabels: function (knobID) {
        var oldList = document.getElementsByClassName("sl-list").item(0);
        if (typeof (oldList) != "undefined" && oldList != null) {
            oldList.parentNode.removeChild(oldList);
        }

        // Create the un-ordererd list for the sublabels
        var slList = document.createElement("ul");
        slList.className = "sl-list";
        for (var i = 0; i < Knobs.settings[Knobs.currID].sub_labels.length; i++) {
            var subLabel = document.createElement("li");
            subLabel.className = "sl-list-item"

            var input = document.createElement("input");
            input.className = "sl-list-input";
            input.maxLength = MAX_LABEL_CHARS;
            input.spellcheck = false;
            input.value = knobSettings[Knobs.currID].sub_labels[i];

            var slDragHandle = document.createElement("div");
            slDragHandle.className = "sl-drag-handle";

            var img = document.createElement("img");
            img.src = "../img/dragIcon.svg";
            img.className = "sl-drag-icon";
            slDragHandle.appendChild(img);

            var closeBtn = document.createElement("button");
            closeBtn.className = "sl-list-btn sl-list-btn-delete";
            closeBtn.innerHTML = "&times;";
            closeBtn.addEventListener("click", this.eventSublabelDelete, false);

            subLabel.appendChild(slDragHandle);
            subLabel.appendChild(input);
            subLabel.appendChild(closeBtn);
            slList.appendChild(subLabel);
        }

        /*
        for (var i = 0; i < 20; i++) {
            var subLabel = document.createElement("li");
            subLabel.className = "sl-list-item"

            var input = document.createElement("input");
            input.className = "sl-list-input";
            input.maxLength = MAX_LABEL_CHARS;
            input.spellcheck = false;
            input.value = `zacvbgtrijs${i.toString().padStart(3,"0")}`;

            var slDragHandle = document.createElement("div");
            slDragHandle.className = "sl-drag-handle";

            var img = document.createElement("img");
            img.src = "./img/dragIcon.svg";
            img.className = "sl-drag-icon";
            slDragHandle.appendChild(img);

            var closeBtn = document.createElement("button");
            closeBtn.className = "sl-list-btn sl-list-btn-delete";
            closeBtn.innerHTML = "&times;";
            closeBtn.addEventListener("click", eventSublabelDelete, false);

            subLabel.appendChild(slDragHandle);
            subLabel.appendChild(input);
            subLabel.appendChild(closeBtn);
            slList.appendChild(subLabel);
        }
        */

        // Add dummy entry with add button to add new labels
        var subLabel = document.createElement("li");
        subLabel.className = "sl-list-item sl-list-item-dummy"

        var input = document.createElement("input");
        input.className = "sl-list-input sl-list-input-dummy";
        input.maxLength = MAX_LABEL_CHARS;
        input.placeholder = "Add Sub Label ";
        input.disabled = "true";

        var slDragHandle = document.createElement("div");
        slDragHandle.className = "sl-drag-handle sl-drag-handle-dummy";

        var img = document.createElement("img");
        img.src = "../img/dragIcon.svg";
        img.className = "sl-drag-icon";
        slDragHandle.appendChild(img);

        var addBtn = document.createElement("button");
        addBtn.className = "sl-list-btn sl-list-btn-add";
        addBtn.innerHTML = "&plus;";
        addBtn.addEventListener("click", this.eventSublabelAdd, false);

        subLabel.appendChild(slDragHandle);
        subLabel.appendChild(input);
        subLabel.appendChild(addBtn);
        slList.appendChild(subLabel);

        document.querySelector(".sublabels").appendChild(slList);

        // Allows moving sub labels around
        $(function () {
            $(".sl-list").sortable();
            $(".sl-list").disableSelection();
        });
    },

    eventSublabelDelete: function (e) {
        var parentLI = e.target.parentNode;
        parentLI.parentNode.removeChild(parentLI);

        var prevLI = parentLI.previousSibling;
        if (prevLI !== null) {
            var prevLILabel = prevLI.childNodes[1];
            prevLILabel.focus();
        }
    },

    eventSublabelAdd: function (e) {
        var dummyLI = e.target.parentNode;
        var parentUL = e.target.parentNode.parentNode;

        var subLabel = document.createElement("li");
        subLabel.className = "sl-list-item"

        var input = document.createElement("input");
        input.className = "sl-list-input";
        input.maxLength = MAX_LABEL_CHARS;
        input.spellcheck = false;
        input.value = "";

        var slDragHandle = document.createElement("div");
        slDragHandle.className = "sl-drag-handle";

        var img = document.createElement("img");
        img.src = "./img/dragIcon.svg";
        img.className = "sl-drag-icon";
        slDragHandle.appendChild(img);

        var closeBtn = document.createElement("button");
        closeBtn.className = "sl-list-btn sl-list-btn-delete";
        closeBtn.innerHTML = "&times;";
        closeBtn.addEventListener("click", this.eventSublabelDelete, false);

        subLabel.appendChild(slDragHandle);
        subLabel.appendChild(input);
        subLabel.appendChild(closeBtn);

        parentUL.insertBefore(subLabel, dummyLI);
        input.focus();
    },

    update: function () {
        var inputs = this.getInputs();

        inputs.label.value = Knobs.settings[Knobs.currID].label;
        inputs.channel.value = Knobs.settings[Knobs.currID].channel;
        inputs.cc.value = Knobs.settings[Knobs.currID].cc;
        inputs.initValue.value = Knobs.settings[Knobs.currID].init_value;
        inputs.maxRange.value = Knobs.settings[Knobs.currID].max_range;
        inputs.isLocked.checked = (Knobs.settings[Knobs.currID].isLocked === "true");
        this.createSublabels();

        document.querySelector(".knob").innerHTML = `Knob ${Knobs.currID + 1}`;
    },

    getSublabels: function (id) {
        var inputs = this.getInputs();
        var slInputs = $('.sl-list-input').not('.sl-list-input-dummy');

        var slArray = new Array();
        for (var i = 0; i < slInputs.length; i++) {
            if (slInputs[i].disabled === "true") {
                continue;
            }
            slArray[i] = slInputs[i].value;
        }

        return slArray;
    },

    init: function () {
        HTML.createTitle();
        HTML.createTableSettings();
    }
};
var Presets = {
    currID: 0,
    settings: [],
    content: [],
    path: "",
    currFilename: "",

    init: function () {
        for (var i = 0; i < NUM_KNOBS; i++) {
            this.settings[i] = {
                name: "",
                sublabel: "",
                index: `${i}`
            }
        }
    }
};
var Knobs = {
    currID: 0,
    settings: [],
    content: [],

    init: function () {
        for (var i = 0; i < NUM_KNOBS; i++) {
            this.settings[i] = {
                label: `${i}`,
                channel: "1",
                cc: `${i}`,
                init_value: "0",
                max_range: "127",
                isLocked: "false",
                sub_labels: []
            }
            this.content[i] = this.settings[i].label;
        }
    },

    cache: function (inputs, sublabels) {
        this.settings[Knobs.currID] = {
            label: inputs.label.value,
            channel: inputs.channel.value,
            cc: inputs.cc.value,
            init_value: inputs.initValue.value,
            max_range: inputs.maxRange.value,
            isLocked: inputs.isLocked.checked.toString(),
            sub_labels: sublabels
        }
    },

};
var Grid = {
    content: [],
    grid: {},
    firstRun: true,

    initContent: function () {
        var content = [];
        for (var i = 0; i < NUM_KNOBS; i++) {
            var gridItem = document.createElement("div");
            gridItem.className = "item";
            gridItem.id = `item${i}`;
            gridItem.addEventListener('click', Grid.eventClick);

            var gridItemContent = document.createElement("div");
            gridItemContent.className = "item-content";
            gridItemContent.id = `item-content${i}`;

            gridItem.appendChild(gridItemContent);
            content[i] = gridItem;
        }
        return content;
    },

    layout: function (grid, layoutId, items, width, height, callback) {
        var layout = {
            id: layoutId,
            items: items,
            slots: [],
            styles: {},
        };

        var item;
        var m;
        var x = 0;
        var y = 0;
        var w = 0;
        var h = 0;

        var maxW = width / 2;
        var currentW = 0;
        var currentRowH = 0;
        var currentRowW = 0;
        var rowSizes = [];
        var rowFixes = [];

        var xPre, yPre, wPre, hPre;
        var numToFix = 0;

        for (var i = 0; i < items.length; i++) {
            item = items[i];

            m = item.getMargin();
            wPre = item.getWidth() + m.left + m.right;
            hPre = item.getHeight() + m.top + m.bottom;
            xPre += wPre;

            if (hPre > currentRowH) {
                currentRowH = hPre;
            }

            if (w < currentRowW) {
                currentRowW = wPre;
            }

            rowSizes.push(width / 2);
            numToFix++;
            currentW += wPre;

            var k = 0;

            for (var j = 0; j < numToFix; j++) {
                rowSizes[i - j] -= wPre / 2;
            }

            if (numToFix > 1) {
                rowSizes[i] -= (wPre / 2) * (numToFix - 1);
                k += (wPre / 2);
            }

            currentW -= k;
            rowFixes.push(k);

            if (currentW >= maxW) {
                yPre += currentRowH;
                currentRowH = 0;
                xPre = 0;
                numToFix -= 1;
                currentW = 0;
                numToFix = 0;
                k = 0;
            }
        }

        maxW = width / 2;
        currentW = 0;
        currentRowH = 0;
        currentRowW = 0;

        for (var i = 0; i < items.length; i++) {
            item = items[i];
            x += w;

            if (h > currentRowH) {
                currentRowH = h;
            }

            if (w < currentRowW) {
                currentRowW = w;
            }

            currentW += w - rowFixes[i];

            if (currentW >= maxW) {
                y += currentRowH;
                currentRowH = 0;
                x = 0;
                currentW = 0;
            }

            m = item.getMargin();
            w = item.getWidth() + m.left + m.right;
            h = item.getHeight() + m.top + m.bottom;
            layout.slots.push(x + rowSizes[i], y);
        }

        layout.styles.width = '100%';
        layout.styles.height = y + h + 1 + 'px';

        callback(layout);
    },

    gridOptions: function (content) {
        return {
            items: content,
            dragEnabled: true,
            dragSortHeuristics: {
                sortInterval: 200,
                minDragDistance: 20,
                minBounceBackAngle: 1
            },
            dragStartPredicate: {
                delay: 100,
                distance: 10
            },
            dragSortPredicate: {
                threshold: 50,
                action: 'swap',
                migrateAction: 'move'
            },
            layout: Grid.layout
        };
    },

    eventClick: function (e) {
        var newKnobID = (e.target.id.match(/\d+/g) || []).map(n => parseInt(n))[0];
        Controller.selectKnob(newKnobID);


        /*
        if (currKnobID !== newKnobID) {
            var ktContainer = document.querySelector(".knob-top-container");
            ktContainer.classList.add("fade-out-fast");
            setTimeout(() => {
                ktContainer.classList.add("fade-in-fast");
            }, 200);
            ktContainer.classList.remove("fade-in-fast");

            cacheKnob(currKnobID);
            activateItem(newKnobID);
            currKnobID = newKnobID;
        }
        */
    },

    eventMove: function (data) {
        var movedItem = data.item;
        var swappedItem = Grid.grid.getItem(data.fromIndex);
        var temp = movedItem._id;
        var movedIndex = data.fromIndex;
        var swappedIndex = data.toIndex;

        movedItem._id = swappedItem._id;
        swappedItem._id = temp;

        movedGridItem = document.getElementById(`item${movedIndex}`);
        swappedGridItem = document.getElementById(`item${swappedIndex}`);
        movedGridItem.id = `item${swappedIndex}`;
        swappedGridItem.id = `item${movedIndex}`;

        movedGridItemContent = document.getElementById(`item-content${movedIndex}`);
        swappedGridItemContent = document.getElementById(`item-content${swappedIndex}`);
        movedGridItemContent.id = `item-content${swappedIndex}`;
        swappedGridItemContent.id = `item-content${movedIndex}`;

        //updateKnobContent(movedIndex);
        //updateKnobContent(swappedIndex);

        // If we moved the current knob, update the saved index and re-show it
        if (movedGridItem.classList.contains("active")) {
            Controller.selectKnob(swappedIndex);
        }
    },

    eventDragMove: function (item, event) {
        var gridItems = document.getElementsByClassName("item");
        for (var i = 0; i < gridItems.length; i++) {
            gridItems[i].removeEventListener("click", Grid.eventClick);
        }
    },

    eventDragReleaseEnd: function (item, event) {
        var gridItems = document.getElementsByClassName("item");
        for (var i = 0; i < gridItems.length; i++) {
            gridItems[i].addEventListener("click", Grid.eventClick);
        }
    },

    eventLayoutEnd: function () {
        if (Grid.firstRun) {
            console.log("firstRun true");
            console.log("layoutEnd");
            Grid.grid.move(0, 1);
            Grid.grid.move(1, 0);
            Grid.firstRun = false;
        }
    },

    update: function () {
        for (var i = 0; i < Grid.content.length; i++) {
            Grid.content[i].firstChild.innerHTML = Knobs.content[i];
        }
    },

    select: function (id) {
        var gridItemOld = document.getElementById(`item${Knobs.currID}`);
        var gridItemNew = document.getElementById(`item${id}`);
        Grid.content[id].firstChild.innerHTML = Knobs.content[id];
        gridItemOld.classList.remove("active");
        gridItemNew.classList.add("active");
    },

    init: function () {
        Grid.content = Grid.initContent();
        Grid.grid = new Muuri('.grid', Grid.gridOptions(Grid.content));
        Grid.grid.on('click', Grid.eventClick);
        Grid.grid.on('move', Grid.eventMove);
        Grid.grid.on('dragMove', Grid.eventDragMove);
        Grid.grid.on('dragReleaseEnd', Grid.eventDragReleaseEnd);
        Grid.grid.on('layoutEnd', Grid.eventLayoutEnd);
        Grid.grid.layout();
        Grid.update();

        // Keeps grid item text in its container
        jQuery(".item-content").fitText(0.87);
    }
}
var Controller = {
    firstRun: true,

    selectKnob: function (id) {
        var ktContainer = document.querySelector(".knob-top-container");
        ktContainer.classList.add("fade-out-fast");
        setTimeout(() => {
            ktContainer.classList.add("fade-in-fast");
        }, 200);
        ktContainer.classList.remove("fade-in-fast");

        // Want to show a knob first run, but if we don't update
        // before caching, we will end up updating blank labels
        // since the cache pulls from the current input field values.
        //
        // TODO: might not be necessary once we start the app in
        // preset mode as intended

        if (this.firstRun) {
            HTML.update();
            this.firstRun = false;
        }


        Knobs.cache(HTML.getInputs(), HTML.getSublabels());
        Grid.select(id);
        Knobs.currID = id;
        HTML.update();

        this.firstRun = false;
    },




};
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