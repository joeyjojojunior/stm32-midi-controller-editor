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