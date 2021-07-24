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