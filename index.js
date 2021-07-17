const {
    read
} = require("original-fs");

// Global variables
const MAX_LABEL_CHARS = 14;
const NUM_COLS = 16;
const NUM_ROWS = 8;
const NUM_KNOBS = 128;

var currKnobID = 0;
var drag = false;
var jsonString = "";
var json = "";
var knobContent = new Array(NUM_KNOBS);
var knobSettings = new Array(NUM_KNOBS);

for (var i = 0; i < knobSettings.length; i++) {
    knobSettings[i] = {
        label: "",
        channel: "",
        cc: "",
        init_value: "",
        max_range: "",
        isLocked: "false",
        sub_labels: [""]
    }
}

knobSettings[0] = {
    label: "Cutoff",
    channel: "3",
    cc: "18",
    init_value: "34",
    max_range: "128",
    isLocked: "true",
    sub_labels: [
        "Label 1",
        "Label 2",
        "Label 3",
        "Label 4",
        "Label 5",
        "Label 6",
        "Label 7",
        "Label 8",
        "Label 9",
        "Label 10",
        "Label 11",
        "Label 12",
        "Label 13",
        "Label 14",
        "Label 15"
    ]
}
knobSettings[1] = {
    label: "Resonance",
    channel: "1",
    cc: "33",
    init_value: "0",
    max_range: "16",
    isLocked: "false",
    sub_labels: [
        "Boo 1",
        "Boo 2",
        "Boo 3",
        "Boo 4",
        "Boo 5"
    ]
}

// Title Divs
var topLeft = document.querySelector(".top-left");
var knob = document.querySelector(".knob");
var settings = document.querySelector(".settings");

var topRight = document.querySelector(".top-right");
var menu = document.querySelector(".menu");
var preset = document.querySelector(".preset");
var channel = document.querySelector(".channel");
var buttons = document.querySelector(".buttons");
var sublabels = document.querySelector(".sublabels");
var slLabel = document.querySelector(".sl-label");

var grid = document.querySelector(".grid");

function init() {
    createTitle();
    settings.appendChild(createTableSettings());
    createGridItems();
    createGrid();
    showKnob(currKnobID);

    const fileInput = document.getElementById("file");
    fileInput.addEventListener("change", loadFile, false);

    // Keeps grid item text in its container
    jQuery(".knobContent").fitText(0.87);
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

    return tbl;
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

    channel.className = `inputField`;
    channel.id = `inputChannel`;
    channel.maxLength = 2;

    cc.className = `inputField`;
    cc.id = `inputCC`;
    cc.maxLength = 3;

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

    sublabels.appendChild(slList);

    // Allows moving sub labels around
    $(function () {
        $(".sl-list").sortable();
        $(".sl-list").disableSelection();
    });
}

function eventClickSublabelDelete(e) {
    var parentLI = e.target.parentNode;
    parentLI.parentNode.removeChild(parentLI);
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
}

function createGrid() {
    var grid = new Muuri('.grid', {
        items: knobContent,
        dragEnabled: true,
        dragSortHeuristics: {
            sortInterval: 200,
            minDragDistance: 20,
            minBounceBackAngle: 1
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
}

function eventClickGridItem(e) {
    var newKnobID = (e.target.id.match(/\d+/g) || []).map(n => parseInt(n))[0];
    if (!drag && currKnobID !== newKnobID) {
        cacheKnob(currKnobID);
        currKnobID = newKnobID;
        showKnob(currKnobID);
    }
}

function createGridItems() {
    for (var i = 0; i < NUM_KNOBS; i++) {
        gridDiv = document.getElementById("knobGrid");

        gridItem = document.createElement("div");
        gridItem.className = "item";
        gridItem.id = `gridItem${i}`;
        gridItem.addEventListener("mouseup", eventClickGridItem, false);

        gridItemContent = document.createElement("div");
        gridItemContent.className = "item-content";
        gridItemContent.id = `gridItemContent${i}`;

        gridKnobContent = document.createElement("div");
        gridKnobContent.className = "knobContent";
        gridKnobContent.id = `knobContent${i}`;
        gridKnobContent.innerHTML += `${i + 1}<br>THIS IS 14 CHR`

        gridItemContent.appendChild(gridKnobContent);
        gridItem.appendChild(gridItemContent);

        knobContent[i] = gridItem;
    }
}

function showKnob(knobID) {
    var inputLabel = document.getElementById("inputLabel");
    var inputChannel = document.getElementById("inputChannel");
    var inputCC = document.getElementById("inputCC");
    var inputInitValue = document.getElementById("inputInitValue");
    var inputMaxRange = document.getElementById("inputMaxRange");
    var inputIsLocked = document.getElementById("inputIsLocked");

    inputLabel.value = knobSettings[knobID].label;
    inputChannel.value = knobSettings[knobID].channel;
    inputCC.value = knobSettings[knobID].cc;
    inputInitValue.value = knobSettings[knobID].init_value;
    inputMaxRange.value = knobSettings[knobID].max_range;
    inputIsLocked.checked = (knobSettings[knobID].isLocked === "true");
    createSublabels(knobID);
    knob.innerHTML = `Knob ${knobID + 1}`;
}

function cacheKnob(knobID) {
    var label = document.getElementById("inputLabel").value;
    var channel = document.getElementById("inputChannel").value;
    var cc = document.getElementById("inputCC").value
    var initValue = document.getElementById("inputInitValue").value;
    var maxRange = document.getElementById("inputMaxRange").value;
    var isLocked = document.getElementById("inputIsLocked").checked.toString();
    var slInputs = $('.sl-list-input').not('.sl-list-input-dummy');

    var slArray = new Array();
    for (var i = 0; i < slInputs.length; i++) {
        if (slInputs[i].disabled === "true") {
            console.log(`cacheKnob disabled: ${slInputs[i]}`);
            continue;
        }
        slArray[i] = slInputs[i].value;
    }

    knobSettings[knobID] = {
        label: label,
        channel: channel,
        cc: cc,
        init_value: initValue,
        max_range: maxRange,
        isLocked: isLocked,
        sub_labels: slArray
    }
}


// Disables zoom by disabling the Ctrl key
/*
function zoomDisable(e) {
    if (e.ctrlKey) {
        return false;
    }
}
*/


function loadFile() {
    var file = document.getElementById("file").files[0];
    console.log(`file: ${file}`);
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = () => saveFile(reader.result);
    }
    console.log(`string: \n ${jsonString}`);
    json = JSON.parse(jsonString);
    console.log(`string: \n ${json}`);
    console.log(json.name);
}

function saveFile(result) {
    jsonString = result;
    console.log(`string: \n ${jsonString}`);
    json = JSON.parse(jsonString);
    console.log(`string: \n ${json}`);
    console.log(json.name);
}

// Sets the drag flag which is used to prevent firing click 
// events at the start and end of dragging actions
window.onload = () => {
    document.addEventListener(
        'mousedown', () => drag = false);

    document.addEventListener(
        'mousemove', () => drag = true);

    document.addEventListener(
        'mouseup', () => drag ? 'drag' : 'click');

    var btnPresets = document.getElementById("btnPresets");
    btnPresets.addEventListener("click", (e) => {
        alert("preset div clicked!");
    });

    var btnLoad = document.getElementById("btnLoad-label");
    btnLoad.addEventListener("click", loadFile, false);
}

init();

/*
    var mainDiv = document.querySelector(".mainDiv");

    var b1 = document.createElement("button");
    b1.innerHTML += "1080p";
    b1.addEventListener('click', testZoom1080);

    var b2 = document.createElement("button");
    b2.innerHTML += "1440p";
    b2.addEventListener('click', testZoom1440);

    var b3 = document.createElement("button");
    b3.innerHTML += "2160p";
    b3.addEventListener('click', testZoom2160);

    mainDiv.appendChild(b1);
    mainDiv.appendChild(b2);
    mainDiv.appendChild(b3);
*/