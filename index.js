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
        initValue: "",
        maxRange: "",
        isLocked: "false",
        sublabels: [""]
    }
}

knobSettings[0] = {
    label: "Cutoff",
    channel: "3",
    cc: "18",
    initValue: "34",
    maxRange: "128",
    isLocked: "true",
    sublabels: [
        "Label 1",
        "Label 2",
        "Label 3"
    ]
}
knobSettings[1] = {
    label: "Resonance",
    channel: "1",
    cc: "33",
    initValue: "0",
    maxRange: "16",
    isLocked: "false",
    sublabels: [
        "Boo 1",
        "Boo 2",
        "Boo 3",
        "Boo 4",
        "Boo 5"
    ]
}

// Title Divs
var title = document.querySelector(".title");
var knob = document.querySelector(".knob");
var preset = document.querySelector(".preset");
var channel = document.querySelector(".channel");
var menu = document.querySelector(".menu");

// Settings Divs
var settings = document.querySelector(".settings");
var mainSettings = document.querySelector(".main-settings");
var sublabels = document.querySelector(".sublabels");
var slLabel = document.querySelector(".sl-label");
var grid = document.querySelector(".grid");


function init() {
    createTitle();
    mainSettings.appendChild(createTableSettings());
    createGridItems();
    createGrid();
    showKnob(currKnobID);

    const fileInput = document.getElementById("file");
    fileInput.addEventListener("change", loadFile, false);

    // Keeps grid item text in its container
    jQuery(".knobContent").fitText(0.87);

    // Allows moving sub labels around
    $(function () {
        $(".slList").sortable();
        $(".slList").disableSelection();
    });
}

function createTitle() {

}

function updateTitle(knobID) {
    var knobLabel = document.querySelector(".knob");
    knob.innerHTML = `Knob ${knobID + 1}`;
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

    console.log(knobSettings[knobID].sublabels.length);

    for (var i = 0; i < knobSettings[knobID].sublabels.length; i++) {
        var subLabel = document.createElement("li");
        subLabel.className = "sl-list-item"

        var input = document.createElement("input");
        input.className = "sl-list-input";
        input.id = `sl-list-input${i}`
        input.maxLength = MAX_LABEL_CHARS;
        input.spellcheck = false;
        input.value = knobSettings[knobID].sublabels[i];

        var slDragHandle = document.createElement("div");
        slDragHandle.className = "sl-drag-handle";

        var img = document.createElement("img");
        img.src = "./img/dragIcon.png";
        img.className = "sl-drag-icon";
        slDragHandle.appendChild(img);

        subLabel.appendChild(slDragHandle);
        subLabel.appendChild(input);
        slList.appendChild(subLabel);
    }

    // Create test labels
    /*
    var labels = new Array(Math.floor(Math.random() * (30 - 1 + 1)) + 1);
    var labels = new Array(128);
    for (var i = 0; i < labels.length; i++) {
        var subLabel = document.createElement("li");
        subLabel.className = "sl-list-item"

        var input = document.createElement("input");
        input.className = "sl-list-input";
        input.id = `sl-list-input${i}`
        input.maxLength = MAX_LABEL_CHARS;
        input.spellcheck = false;

        var slDragHandle = document.createElement("div");
        slDragHandle.className = "sl-drag-handle";

        var img = document.createElement("img");
        img.src = "./img/dragIcon.png";
        img.className = "sl-drag-icon";
        slDragHandle.appendChild(img);

        subLabel.appendChild(slDragHandle);
        subLabel.appendChild(input);
        slList.appendChild(subLabel);
    }
    */
    sublabels.appendChild(slList);
}

// Creates the Muuri grid
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

            var timerId = window.setTimeout(function () {
                var item, m, x = 0,
                    y = 0,
                    w = 0,
                    h = 0;

                for (var i = 0; i < items.length; i++) {
                    item = items[i];
                    x += w;
                    if (i % NUM_COLS == 0) {
                        x = 0;
                        y += h;
                    }
                    m = item.getMargin();
                    w = item.getWidth() + m.left +
                        m.right;
                    h = item.getHeight() + m.top + m.bottom;
                    layout.slots.push(x, y);
                }

                w += x;
                h += y;

                // Set the CSS styles that should be applied to the grid element.
                layout.styles.width = w + 'px';
                layout.styles.height = h + 'px';

                // When the layout is fully computed let 's call the callback function and 
                // provide the layout object as it's argument.
                callback(layout);
            }, 200);

            // If you are doing an async layout you _can_ (if you want to) return a 
            // function that cancels this specific layout calculations if it 's still 
            // processing/queueing when the next layout is requested.
            return function () {
                window.clearTimeout(timerId);
            };
        },
    });
}

// Creates all the Muuri grid items for the knobContent
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

    // Update values for newly selected knob
    inputLabel.value = knobSettings[knobID].label;
    inputChannel.value = knobSettings[knobID].channel;
    inputCC.value = knobSettings[knobID].cc;
    inputInitValue.value = knobSettings[knobID].initValue;
    inputMaxRange.value = knobSettings[knobID].maxRange;
    inputIsLocked.checked = (knobSettings[knobID].isLocked === "true");
    createSublabels(knobID);
}

function cacheKnob(knobID) {
    var inputLabel = document.getElementById("inputLabel");
    var inputChannel = document.getElementById("inputChannel");
    var inputCC = document.getElementById("inputCC");
    var inputInitValue = document.getElementById("inputInitValue");
    var inputMaxRange = document.getElementById("inputMaxRange");
    var inputIsLocked = document.getElementById("inputIsLocked");

    // Cache existing knob
    var label = inputLabel.value;
    var channel = inputChannel.value;
    var cc = inputCC.value
    var initValue = inputInitValue.value;
    var maxRange = inputMaxRange.value;
    var isLocked = inputIsLocked.checked.toString();
    var slInputs = document.getElementsByClassName('sl-list-input');

    var slArray = new Array();
    for (var i = 0; i < slInputs.length; i++) {
        slArray[i] = slInputs[i].value;
    }

    knobSettings[knobID] = {
        label: label,
        channel: channel,
        cc: cc,
        initValue: initValue,
        maxRange: maxRange,
        isLocked: isLocked,
        sublabels: slArray
    }
}

// Event handler for clicking on a grid item. Shows the settings for
// a knob by unhiding its divSettings div and hiding all the others
//
// TODO: No reason to hide EVERY knob after init since only one
// will be visible at a time. Modify to keep track of the current knob
// and only hide that one.
function eventClickGridItem(e) {
    var newKnobID = (e.target.id.match(/\d+/g) || []).map(n => parseInt(n))[0];
    if (!drag) {
        cacheKnob(currKnobID);
        currKnobID = newKnobID;
        showKnob(currKnobID);
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

    //window.addEventListener('resize', eventZoomChanged);
    // window.onkeydown = zoomDisable;
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