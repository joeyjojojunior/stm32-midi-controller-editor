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