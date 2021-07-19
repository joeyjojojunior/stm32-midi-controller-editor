const {
    read
} = require("original-fs");

// Global variables
const MAX_LABEL_CHARS = 14;
const NUM_COLS = 16;
const NUM_ROWS = 4;
const NUM_KNOBS = 128;

var grid;
var currKnobID = 0; // keeps track of currently displayed knob

var drag = false; // prevent grid click event on drag start/stop
var dragging = 0;

var knobContent = new Array(NUM_KNOBS); // Content of each grid item
var knobSettings = new Array(NUM_KNOBS); // Cache of settings for each knob

function init() {
    initKnobSettings();
    createTitle();
    createTableSettings();
    createGridItems();
    createGrid();
    showKnob(currKnobID);
    updateDisplays();

    // Keeps grid item text in its container
    jQuery(".knobContent").fitText(0.87);
}

function initKnobSettings() {
    for (var i = 0; i < knobSettings.length; i++) {
        knobSettings[i] = {
            label: `${i}`,
            channel: "1",
            cc: `${i}`,
            init_value: "0",
            max_range: "127",
            isLocked: "false",
            sub_labels: []
        }
    }
}

function createTitle() {
    var inputPresetLabel = document.getElementById("inputPresetLabel");
    inputPresetLabel.maxLength = MAX_LABEL_CHARS;

    var inputPresetSublabel = document.getElementById("inputPresetSublabel");
    inputPresetSublabel.maxLength = MAX_LABEL_CHARS;
}

function createTableSettings() {
    var tbl = document.createElement("table");

    var tbdy = document.createElement("tbody");
    var inputLabels = ["Label", "Channel", "CC", "Init Value", "Max Range", "Locked"];

    // Create the input fields for this knob
    var knobInputFields = createInputSettings();

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
}

function createInputSettings() {
    var label = document.createElement("input");
    var channel = document.createElement("input");
    var cc = document.createElement("input");
    var initValue = document.createElement("input");
    var maxRange = document.createElement("input");
    var isLocked = document.createElement("input");

    label.className = "inputField";
    label.id = `inputLabel`;
    label.maxLength = MAX_LABEL_CHARS;
    label.addEventListener("input", eventInputChanged, false);

    channel.className = `inputField`;
    channel.id = `inputChannel`;
    channel.maxLength = 2;
    channel.addEventListener("input", eventInputChanged, false);

    cc.className = `inputField`;
    cc.id = `inputCC`;
    cc.maxLength = 3;
    cc.addEventListener("input", eventInputChanged, false);

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
}

function createSublabels(knobID) {
    var oldList = document.getElementsByClassName("sl-list").item(0);
    if (typeof (oldList) != "undefined" && oldList != null) {
        oldList.parentNode.removeChild(oldList);
    }

    // Create the un-ordererd list for the sublabels
    var slList = document.createElement("ul");
    slList.className = "sl-list";
    for (var i = 0; i < knobSettings[knobID].sub_labels.length; i++) {
        var subLabel = document.createElement("li");
        subLabel.className = "sl-list-item"

        var input = document.createElement("input");
        input.className = "sl-list-input";
        input.maxLength = MAX_LABEL_CHARS;
        input.spellcheck = false;
        input.value = knobSettings[knobID].sub_labels[i];

        var slDragHandle = document.createElement("div");
        slDragHandle.className = "sl-drag-handle";

        var img = document.createElement("img");
        img.src = "./img/dragIcon.svg";
        img.className = "sl-drag-icon";
        slDragHandle.appendChild(img);

        var closeBtn = document.createElement("button");
        closeBtn.className = "sl-list-btn sl-list-btn-delete";
        closeBtn.innerHTML = "&times;";
        closeBtn.addEventListener("click", eventClickSublabelDelete, false);

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
        closeBtn.addEventListener("click", eventClickSublabelDelete, false);

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
    img.src = "./img/dragIcon.svg";
    img.className = "sl-drag-icon";
    slDragHandle.appendChild(img);

    var addBtn = document.createElement("button");
    addBtn.className = "sl-list-btn sl-list-btn-add";
    addBtn.innerHTML = "&plus;";
    addBtn.addEventListener("click", eventClickSublabelAdd, false);

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
}

function eventClickSublabelDelete(e) {
    var parentLI = e.target.parentNode;
    parentLI.parentNode.removeChild(parentLI);

    var prevLI = parentLI.previousSibling;
    if (prevLI !== null) {
        var prevLILabel = prevLI.childNodes[1];
        prevLILabel.focus();
    }
}

function eventClickSublabelAdd(e) {
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
    closeBtn.addEventListener("click", eventClickSublabelDelete, false);

    subLabel.appendChild(slDragHandle);
    subLabel.appendChild(input);
    subLabel.appendChild(closeBtn);

    parentUL.insertBefore(subLabel, dummyLI);
    input.focus();
}

function updateDisplays() {
    for (var i = 0; i < NUM_KNOBS; i++) {
        var knobContent = document.getElementById(`knobContent${i}`);
        knobContent.innerHTML = knobSettings[i].label;
    }
}

function eventLoadFile(e) {
    var file = document.getElementById("file-load").files[0];
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = () => loadFile(reader.result);
    }
}

function eventDropLoadFile(e) {
    const file = e.dataTransfer.files[0];
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = () => loadFile(reader.result);
    }
}

function loadFile(result) {
    var presetStrings = result.split("\n");

    var presetInfo = presetStrings[0];
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
    showKnob(0);
    updateDisplays();
}

function eventSaveFile(e) {
    var preset = createPresetString();
    saveFile(preset);
    /*
    const inputs = getInputs();
    const pLabel = inputs.presetLabel.value
    const pSublabel = inputs.presetSublabel.value;

    const separator = (pLabel !== "" || pSublabel !== "") ? "_" : "preset";
    const element = document.createElement("a");
    const file = new Blob([createPresetString()], {
        type: "text/plain"
    });
    element.href = URL.createObjectURL(file);
    element.download = `${pLabel}${separator}${pSublabel}.txt`;
    */
    //element.click();
}

function createPresetString() {
    var presetJSON = new Object();
    var presetString = new Array();
    var inputs = getInputs();

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
            //label: `abcdefghijk${i.toString().padStart(3,"0")}`,
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


function getInputs() {
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
}

function createGrid() {
    grid = new Muuri('.grid', {
        items: knobContent,
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
        }
    });

    // Update knobIDs when moving
    grid.on('move', (data) => {
        var movedItem = data.item;
        var swappedItem = grid.getItem(data.fromIndex);
        var temp = movedItem._id;
        var movedIndex = data.fromIndex;
        var swappedIndex = data.toIndex;

        movedItem._id = swappedItem._id;
        swappedItem._id = temp;

        movedGridItem = document.getElementById(`gridItem${movedIndex}`);
        swappedGridItem = document.getElementById(`gridItem${swappedIndex}`);
        movedGridItem.id = `gridItem${swappedIndex}`;
        swappedGridItem.id = `gridItem${movedIndex}`;

        movedGridItemContent = document.getElementById(`gridItemContent${movedIndex}`);
        swappedGridItemContent = document.getElementById(`gridItemContent${swappedIndex}`);
        movedGridItemContent.id = `gridItemContent${swappedIndex}`;
        swappedGridItemContent.id = `gridItemContent${movedIndex}`;

        movedKnobContent = document.getElementById(`knobContent${movedIndex}`);
        swappedKnobContent = document.getElementById(`knobContent${swappedIndex}`);
        movedKnobContent.id = `knobContent${swappedIndex}`;
        swappedKnobContent.id = `knobContent${movedIndex}`;

        updateKnobContent(movedIndex);
        updateKnobContent(swappedIndex);

        // If we moved the current knob, update the saved index and re-show it
        if (movedGridItem.classList.contains("active")) {
            currKnobID = swappedIndex;
            showKnob(swappedIndex);
        }
    });

    grid.on('dragMove', (item, event) => {
        var gridItems = document.getElementsByClassName("item");
        for (var i = 0; i < gridItems.length; i++) {
            gridItems[i].removeEventListener("click", eventClickGridItem);
        }
    });

    grid.on('dragReleaseEnd', (item, event) => {
        var gridItems = document.getElementsByClassName("item");
        for (var i = 0; i < gridItems.length; i++) {
            gridItems[i].addEventListener("click", eventClickGridItem);
        }
    });
}

function createGridItems() {
    for (var i = 0; i < NUM_KNOBS; i++) {
        gridDiv = document.getElementById("knobGrid");

        gridItem = document.createElement("div");
        gridItem.className = "item";
        gridItem.id = `gridItem${i}`;

        gridItem.addEventListener('click', eventClickGridItem);

        gridItemContent = document.createElement("div");
        gridItemContent.className = "item-content";
        gridItemContent.id = `gridItemContent${i}`;

        gridKnobContent = document.createElement("div");
        gridKnobContent.className = "knobContent";
        gridKnobContent.id = `knobContent${i}`;

        gridItemContent.appendChild(gridKnobContent);
        gridItem.appendChild(gridItemContent);

        knobContent[i] = gridItem;
    }
}

function updateKnobContent(knobID) {
    document.getElementById(`knobContent${knobID}`).innerHTML = knobSettings[knobID].label;
}

function eventInputChanged() {
    cacheKnob(currKnobID);
    showKnob(currKnobID);
}

function eventClickGridItem(e) {
    var newKnobID = (e.target.id.match(/\d+/g) || []).map(n => parseInt(n))[0];
    if (currKnobID !== newKnobID) {
        cacheKnob(currKnobID);
        showKnob(newKnobID);
        currKnobID = newKnobID;
    }
}

function showKnob(knobID) {
    var gridItemOld = document.getElementById(`gridItem${currKnobID}`);
    var gridItemNew = document.getElementById(`gridItem${knobID}`);

    var inputs = getInputs();

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
}

function cacheKnob(knobID) {
    var inputs = getInputs();
    var slInputs = $('.sl-list-input').not('.sl-list-input-dummy');

    var slArray = new Array();
    for (var i = 0; i < slInputs.length; i++) {
        if (slInputs[i].disabled === "true") {
            continue;
        }
        slArray[i] = slInputs[i].value;
    }

    knobSettings[knobID] = {
        label: inputs.label.value,
        channel: inputs.channel.value,
        cc: inputs.cc.value,
        init_value: inputs.initValue.value,
        max_range: inputs.maxRange.value,
        isLocked: inputs.isLocked.checked.toString(),
        sub_labels: slArray
    }
}

window.onload = () => {
    /*
    document.addEventListener(
        'mousedown', () => drag = false);

    document.addEventListener(
        'mousemove', () => drag = true);

    document.addEventListener(
        'mouseup', () => drag ? 'drag' : 'click');
        */
}

document.addEventListener("DOMContentLoaded", function (event) {
    const fileInput = document.getElementById("file-load");
    fileInput.addEventListener("change", eventLoadFile, false);

    var btnSaveAs = document.getElementById("btnSaveAs");
    btnSaveAs.addEventListener("click", eventSaveFile, false);
});

/*
var dropArea = window;
dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
});

dropArea.addEventListener('drop', eventDropLoadFile, false);
*/


init();