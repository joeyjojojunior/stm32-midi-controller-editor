const {
    read
} = require("original-fs");

var MAX_LABEL_CHARS = 14;
var NUM_COLS = 16;
var NUM_ROWS = 8;
var NUM_KNOBS = 128;
var knobs = new Array(NUM_KNOBS);
var presetNum = 0;
var drag = false;

// Initializes all the UI divs for a preset
function init() {
    createGridItems();
    createGrid();
    createSettings();
    createTitle(0);
    showSettings("0");

    // Keeps grid item text in its container
    jQuery(".knobContent").fitText(0.87);

    // Allows moving sub labels around
    $(function () {
        $(".listSublabels").sortable();
        $(".listSublabels").disableSelection();
    });
}

function createTitle(KnobID) {
    var title = document.querySelector(".title");

    var divTitleKnob = document.createElement("div");
    divTitleKnob.className = "divTitleKnob";

    var divTitlePreset = document.createElement("div");
    divTitlePreset.className = "divTitlePreset";
    divTitlePreset.innerHTML = `Preset ${presetNum}`;

    title.appendChild(divTitleKnob);
    title.appendChild(divTitlePreset);

}

function updateTitle(KnobID) {
    var divTitleKnob = document.querySelector(".divTitleKnob");
    divTitleKnob.innerHTML = `Knob ${KnobID}`;
}

// Create a div for each knob that contains all of its settings/sublabels
//   .class  divSettings
//   #id     divSettings${knobID}
function createSettings() {
    var settings = document.querySelector(".settings");

    for (var i = 0; i < NUM_KNOBS; i++) {
        var divSettings = document.createElement("div");
        divSettings.className = "divSettings";
        divSettings.id = `divSettings${i}`;
        divSettings.style.display = "none";
        divSettings.appendChild(createTableSettings(i));
        settings.appendChild(divSettings);
        settings.appendChild(createSublabels(i));
    }
}

// Create a table that contains all the settings for a single knob
//   knobID  knob index
//   return  table  
//   .class  N/A
//   #id     N/A
function createTableSettings(knobID) {
    var tbl = document.createElement("table");

    //var thead = document.createElement("thead");
    //var trHead = document.createElement("tr");
    //var tdHead = document.createElement("td");
    //tdHead.innerHTML += `Knob ${knobID + 1}`;
    //tdHead.colSpan = "2";

    //trHead.appendChild(tdHead);
    //thead.appendChild(trHead);
    //tbl.appendChild(thead);

    var tbdy = document.createElement("tbody");
    var inputLabels = ["Label", "Channel", "CC", "Init Value", "Max Range", "Locked"];

    // Create the input fields for this knob
    var knobInputFields = createInputSettings(knobID);

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



// Create all the input elements in the divSettings div
//   knobID  knob index
//   return  array of input fields and a checkbox  
//   .class  inputField
//           inputCheckbox
//   #id     inputLabel${knobID}      
//           inputChannel{$knobID}    
//           inputCC${knobID}        
//           inputInitValue${knobID}
//           inputMaxRange${knobID}
//           inputIsLocked${knobID}
function createInputSettings(knobID) {
    var label = document.createElement("input");
    var channel = document.createElement("input");
    var cc = document.createElement("input");
    var initValue = document.createElement("input");
    var maxRange = document.createElement("input");
    var isLocked = document.createElement("input");

    label.className = "inputField";
    label.id = `inputLabel${knobID}`;
    label.maxLength = MAX_LABEL_CHARS;

    channel.className = `inputField`;
    channel.id = `inputChannel${knobID}`;
    channel.maxLength = 2;

    cc.className = `inputField`;
    cc.id = `inputCC${knobID}`;
    cc.maxLength = 3;

    initValue.className = `inputField`;
    initValue.id = `inputInitValue${knobID}`;
    initValue.maxLength = 3;

    maxRange.className = `inputField`;
    maxRange.id = `inputMaxRange${knobID}`;
    maxRange.maxLength = 3;

    isLocked.className = `inputCheckbox`;
    isLocked.id = `inputIsLocked${knobID}`;
    isLocked.type = "checkbox";

    var inputs = [label, channel, cc, initValue, maxRange, isLocked];

    for (var i = 0; i < inputs.length - 1; i++) {
        inputs[i].spellcheck = false;
    }

    return inputs;
}

// Create a div that contains all the sublabels for a single knob
//   knobID  knob index
//   .class  divSublabels
//   #id     divSublabels${knobID}
function createSublabels(knobID) {
    // Create the main .divSublabels div
    var divSublabels = document.createElement("div");
    divSublabels.className = "divSublabels";
    divSublabels.id = `divSublabels${knobID}`;

    // Create the label for the sublabels section
    var labelDiv = document.createElement("div");
    labelDiv.className = "divSublabelsLabel";
    labelDiv.innerHTML = "Sub Labels"

    // Create the un-ordererd list for the sublabels
    var listSublabels = document.createElement("ul");
    listSublabels.className = "listSublabels";
    listSublabels.id = `listSublabels${knobID}`;

    // Create test labels
    var labels = new Array(Math.floor(Math.random() * (30 - 1 + 1)) + 1);
    var labels = new Array(128);
    for (var i = 0; i < labels.length; i++) {
        var subLabel = document.createElement("li");
        subLabel.className = 'listSublabelItem'

        var input = document.createElement("input");
        input.className = "inputSubLabel";
        input.id = `inputSubLabel${knobID}`
        input.maxLength = MAX_LABEL_CHARS;
        input.spellcheck = false;

        var dragHandle = document.createElement("div");
        dragHandle.className = "dragHandle";

        var img = document.createElement("img");
        img.src = "./img/dragIcon.png";
        img.className = "dragIcon";
        dragHandle.appendChild(img);

        subLabel.appendChild(dragHandle);
        subLabel.appendChild(input);
        listSublabels.appendChild(subLabel);
    }

    // Hide the div and return in
    divSublabels.appendChild(labelDiv);
    divSublabels.appendChild(listSublabels);
    divSublabels.style.display = "none";

    return divSublabels
}

// Hides all the divSettings divs by setting display to "none"
function hideSettingsAll() {
    var divSettingsAll = document.getElementsByClassName("divSettings");
    var divSublabelsAll = document.getElementsByClassName("divSublabels");
    for (var i = 0; i < divSettingsAll.length; i++) {
        divSettingsAll[i].style.display = "none";
        divSublabelsAll[i].style.display = "none";
    }
}

// Creates the Muuri grid
function createGrid() {
    var grid = new Muuri('.grid', {
        items: knobs,
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

// Creates all the Muuri grid items for the knobs
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

        knobs[i] = gridItem;
    }
}

// Event handler for clicking on a grid item. Shows the settings for
// a knob by unhiding its divSettings div and hiding all the others
//
// TODO: No reason to hide EVERY knob after init since only one
// will be visible at a time. Modify to keep track of the current knob
// and only hide that one.
function eventClickGridItem(e) {
    var settings = document.querySelector(".settings");
    var knobIDString = e.target.id;
    var knobID = (knobIDString.match(/\d+/g) || []).map(n => parseInt(n))[0];
    var divSettings = document.getElementById(`divSettings${knobID}`);
    var divSublabels = document.getElementById(`divSublabels${knobID}`);

    var sl = document.getElementById(`listSublabels${knobID}`);

    if (!drag) {
        //hideSettingsAll();
        hideSettings(presetNum);
        showSettings(knobID);
        //divSettings.style.display = "block";
        //divSublabels.style.display = "block";
    }


}

// Unhides a divSettings div for a knob by setting display to "block"
function showSettings(knobID) {
    var divSettings = document.getElementById(`divSettings${knobID}`);
    var divSublabels = document.getElementById(`divSublabels${knobID}`);
    divSettings.style.display = "block";
    divSublabels.style.display = "block";
    presetNum = knobID;
    updateTitle(knobID);
}

function hideSettings(knobID) {
    var divSettings = document.getElementById(`divSettings${knobID}`);
    var divSublabels = document.getElementById(`divSublabels${knobID}`);
    divSettings.style.display = "none";
    divSublabels.style.display = "none";
}

// Disables zoom by disabling the Ctrl key
function zoomDisable(e) {
    if (e.ctrlKey) {
        return false;
    }
}

const fileInput = document.getElementById("file");
fileInput.addEventListener("change", loadFile, false);
var jsonString = "";
var json = "";

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