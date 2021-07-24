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