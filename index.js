 var MAX_LABEL_CHARS = 14;
 var MAX_SL_PER_COL = 12;
 var NUM_COLS = 16;
 var NUM_ROWS = 8;
 var NUM_KNOBS = 128;
 var currKnob = 0;
 var knobs = new Array(NUM_KNOBS);
 var isWindowLoaded = false;
 var isFirstRun = true;

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

 function createKnobDivSettings() {
     var editDiv = document.querySelector(".editDiv");

     for (var i = 0; i < NUM_KNOBS; i++) {
         var knobDivSettings = document.createElement("div");
         knobDivSettings.className = "knobDivSettings";
         knobDivSettings.id = `knobDivSettings${i}`;
         knobDivSettings.style.display = "none";
         knobDivSettings.appendChild(createKnobTableSettings(i));
         editDiv.appendChild(knobDivSettings);
         editDiv.appendChild(createKnobDivSublabels(i));
     }
 }

 function createKnobDivPreset() {
     //var preset = document.createElement("div")
 }

 function createKnobDivSublabels(knobID) {
     var listDivSublabels = document.createElement("div");
     listDivSublabels.className = "listDivSublabels";
     listDivSublabels.id = `listDivSublabels${knobID}`;

     var labelDiv = document.createElement("div");
     labelDiv.className = "listDivSublabelsLabel";
     labelDiv.innerHTML = "Sub Labels"

     var listSublabels = document.createElement("ul");
     listSublabels.className = "listSublabels";
     listSublabels.id = `listSublabels${knobID}`;

     var labels = new Array(Math.floor(Math.random() * (30 - 1 + 1)) + 1);
     //var labels = new Array(128);

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
         img.src = "dragIcon.png";
         img.className = "dragIcon";
         dragHandle.appendChild(img);

         subLabel.appendChild(dragHandle);
         subLabel.appendChild(input);
         listSublabels.appendChild(subLabel);

     }

     var test = labels.length / MAX_SL_PER_COL;
     listSublabels.style.columnCount = Math.floor(labels.length / MAX_SL_PER_COL);

     listDivSublabels.appendChild(labelDiv);
     listDivSublabels.appendChild(listSublabels);
     listDivSublabels.style.display = "none";
     return listDivSublabels
 }

 function createKnobTableSettings(knobID) {
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
     var inputLabels = ["Label", "Channel", "CC", "Init Value", "Max Values", "Max Range", "Locked"];
     var knobInputFields = createKnobInputFields(knobID);

     for (var i = 0; i < inputLabels.length; i++) {
         var tr = document.createElement("tr");

         var tdInputLabel = document.createElement("td");
         tdInputLabel.innerHTML = inputLabels[i];
         if (inputLabels[i] === "Locked") tdInputLabel.className = "tdLocked";


         var tdInputField = document.createElement("td");
         tdInputField.appendChild(knobInputFields[i]);

         tr.appendChild(tdInputLabel);
         tr.appendChild(tdInputField);
         tbdy.appendChild(tr);
     }

     tbl.appendChild(tbdy);

     return tbl;
 }

 function createKnobInputFields(knobID) {
     var label = document.createElement("input");
     var channel = document.createElement("input");
     var cc = document.createElement("input");
     var initValue = document.createElement("input");
     var maxValues = document.createElement("input");
     var maxRange = document.createElement("input");
     var radioBtnYes = document.createElement("input");
     var radioBtnNo = document.createElement("input");
     var radioBtnYesLabel = document.createElement("label");
     var radioBtnNoLabel = document.createElement("label");

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

     maxValues.className = `inputField`;
     maxValues.id = `inputMaxValues${knobID}`;
     maxValues.maxLength = 3;

     maxRange.className = `inputField`;
     maxRange.id = `inputMaxRange${knobID}`;
     maxRange.maxLength = 3;

     radioBtnYes.type = "radio";
     radioBtnYes.class = "radioBtn";
     radioBtnYes.id = 'radioBtnYes';
     radioBtnYes.name = "isLocked";
     radioBtnYes.value = "true";
     radioBtnYesLabel.for = "radioBtnYes";
     radioBtnYesLabel.innerHTML = "Yes";
     radioBtnYesLabel.className = "radioBtnLabel";

     radioBtnNo.type = "radio";
     radioBtnNo.class = "radioBtn";
     radioBtnNo.id = "radioBtnNo";
     radioBtnNo.name = "isLocked";
     radioBtnNo.value = "false";
     radioBtnNoLabel.for = "radioBtnNo";
     radioBtnNoLabel.innerHTML = "No";
     radioBtnNoLabel.className = "radioBtnLabel";

     var radioBtnDiv = document.createElement("div");
     radioBtnDiv.className = "radioBtnDiv";

     var radioBtnSubDiv1 = document.createElement("div");
     radioBtnSubDiv1.className = "radioBtnSubDiv";

     var radioBtnSubDiv2 = document.createElement("div");
     radioBtnSubDiv2.className = "radioBtnSubDiv";

     radioBtnSubDiv1.appendChild(radioBtnYes);
     radioBtnSubDiv1.appendChild(radioBtnYesLabel);
     radioBtnSubDiv2.appendChild(radioBtnNo);
     radioBtnSubDiv2.appendChild(radioBtnNoLabel);
     radioBtnDiv.appendChild(radioBtnSubDiv1);
     radioBtnDiv.appendChild(radioBtnSubDiv2);

     var inputs = [label, channel, cc, initValue, maxValues, maxRange, radioBtnDiv];

     for (var i = 0; i < inputs.length; i++) {
         inputs[i].spellcheck = false;
     }

     return inputs;
 }

 function eventClickGridItem(e) {
     var editDiv = document.querySelector(".editDiv");
     var knobIDString = e.target.id;
     var knobID = (knobIDString.match(/\d+/g) || []).map(n => parseInt(n))[0];
     var knobDivSettings = document.getElementById(`knobDivSettings${knobID}`);
     var listDivSublabels = document.getElementById(`listDivSublabels${knobID}`);

     var sl = document.getElementById(`listSublabels${knobID}`);

     if (!drag) {
         hideKnobDivSettingsAll();
         knobDivSettings.style.display = "block";
         listDivSublabels.style.display = "block";
     }
     currKnob = knobID;
 }

 function showKnobDivSettings(knobID) {
     var knobDivSettings = document.getElementById(`knobDivSettings${knobID}`);
     var listDivSublabels = document.getElementById(`listDivSublabels${knobID}`);

     knobDivSettings.style.display = "block";
     listDivSublabels.style.display = "block";
 }

 function hideKnobDivSettingsAll() {
     var knobDivSettingsAll = document.getElementsByClassName("knobDivSettings");
     var listDivSublabelsAll = document.getElementsByClassName("listDivSublabels");
     for (var i = 0; i < knobDivSettingsAll.length; i++) {
         knobDivSettingsAll[i].style.display = "none";
         listDivSublabelsAll[i].style.display = "none";
     }
 }

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

         // Calculate the slots asynchronously. Note that the timeout is here only
         // as an example and does not help at all in the calculations. You should
         // offload the calculations to web workers if you want real benefits.
         // Also note that doing asynchronous layout is completely optional and you
         // can call the callback function synchronously also.
         var timerId = window.setTimeout(function () {
             var item,
                 m,
                 x = 0,
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

 let drag = false;

 document.addEventListener(
     'mousedown', () => drag = false);

 document.addEventListener(
     'mousemove', () => drag = true);

 document.addEventListener(
     'mouseup', () => drag ? 'drag' : 'click');

 createKnobDivSettings();
 showKnobDivSettings("0");

 // Keeps grid item text in its container
 jQuery(".knobContent").fitText(0.87);

 // Allows moving sub labels around
 $(function () {
     $(".listSublabels").sortable();
     $(".listSublabels").disableSelection();
 });

 window.addEventListener('load', (event) => {});

 //window.addEventListener('resize', eventZoomChanged);

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

 // window.onkeydown = zoomDisable;

 function zoomDisable(e) {
     if (e.ctrlKey) {
         return false;
     }
 }