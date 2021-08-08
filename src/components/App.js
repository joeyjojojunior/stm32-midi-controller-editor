import "../css/App.css";
import "../css/Titlebar.css";
import "../css/Menu.css";
import "../css/Settings.css";
import "../css/SubLabels.css";
import "../css/Presets.css";
import "../css/Grid.css";
import "../css/Transitions.css"

import React, { Profiler } from "react";
import { v4 as uuidv4 } from 'uuid';

import FadeProps from './FadeProps';
import Titlebar from "./TitleBar";
import Menu from "./Menu";
import Settings from "./Settings";
import Presets from "./Presets";
import Grid from "./Grid";
import { NUM_KNOBS } from '../utils/globals';

const { ipcRenderer } = window.require('electron');

const Mode = { PRESETS: 0, SETTINGS: 1 };
const ANIM_LENGTH = 250;

class App extends React.Component {
    constructor(props) {
        super(props);

        // Create blank preset 
        const uuids = this.initUUIDs();
        const initData = this.initData(uuids);
        this.state = {
            uuids: uuids,
            mode: Mode.PRESETS,
            presetsPath: "",
            preset: initData.preset,
            presets: initData.presets,
            content: initData.content,
            activeSettingsItem: null,
            activeSettingsID: initData.content[0].id,
            activePresetItem: null,
            activePresetID: initData.content[0].id,
            isDragging: false,
            fade: false,
            presetsLoaded: false
        };
    }

    componentDidMount() {
        this.setState({
            activePresetItem: document.getElementById(`${this.state.content[0].id}`),
            activeSettingsItem: document.getElementById(`${this.state.content[0].id}`)
        });


        // Check for an existing path in the options.json file
        ipcRenderer.on('options-loaded', (event, options) => {
            if (options != null && options !== undefined) {
                this.setState({ presetsPath: options.presetsPath });
                setTimeout(() => { this.updateContent() }, 50);
            }
        });
        //this.loadPreset(this.state.activePresetID);
    }

    componentDidUpdate() {
        if (!this.state.presetsLoaded && this.state.presetsPath) {
            this.fetchPresets();
            this.setState({ presetsLoaded: true });
        }

    }


    initUUIDs() {
        let uuids = [];
        for (let i = 0; i < NUM_KNOBS; i++) {
            uuids[i] = uuidv4();
        }
        return uuids;
    }

    initData(uuids) {
        var preset = new Map();
        var presets = new Map();
        for (let i = 0; i < uuids.length; i++) {
            const id = uuids[i];
            console.log(id);
            preset.set(
                id,
                {
                    id: id,
                    label: "",
                    channel: "1",
                    cc: `${i}`,
                    initValue: "0",
                    maxRange: "127",
                    isLocked: "false",
                    subLabels: new Map()
                }
            )

            presets.set(
                id,
                {
                    id: id,
                    fileName: "",
                    label: "",
                    subLabel: ""
                }
            )
        }

        // Create initial content based on blank preset
        var content = [];
        for (const [uuid, settings] of preset) {
            content.push({
                id: uuid,
                value: this.formatContent(settings)
            });
        }

        return {
            preset: preset,
            presets: presets,
            content: content
        };
    }

    fetchPresets() {
        ipcRenderer.send('fetch-presets', this.state.presetsPath);
        ipcRenderer.on('fetch-presets-fetched', (event, presetStrings) => {
            presetStrings.sort((e1, e2) => {
                let indexE1 = parseInt(e1.split(',')[3], 10);
                let indexE2 = parseInt(e2.split(',')[3], 10);
                if (indexE1 < indexE2) return -1;
                if (indexE1 > indexE2) return 1;
                return 0;
            })

            let i = 0;
            const newPresets = new Map(this.state.presets);
            for (const [uuid, settings] of newPresets) {
                if (i < presetStrings.length) {
                    let presetStr = presetStrings[i].split(',');
                    settings.fileName = presetStr[0];
                    settings.label = presetStr[1];
                    settings.subLabel = presetStr[2];
                } else {
                    settings.label = "";
                    settings.subLabel = "";
                }
                i++;
            }
            this.setState({ presets: newPresets });
        });
    }

    loadPreset(id) {
        var presetData = this.state.presets.get(id);
        if (presetData === undefined) return;

        if (presetData.fileName === "") {
            const initData = this.initData(this.state.uuids);
            this.setState({
                preset: initData.preset,
                activeID: initData.content[0].id,
            })
        }

        var presetPath = `${this.state.presetsPath}\\${presetData.fileName}`
        ipcRenderer.send('loadPreset', presetPath);
        ipcRenderer.on('loadPreset-loaded', (event, presetStr) => {
            let knobSettings = presetStr.split('\n').slice(1);
            let newPreset = new Map(this.state.preset);
            let i = 0;
            for (const [uuid, settings] of newPreset) {
                let knob = knobSettings[i].split(',');
                settings.label = knob[0];
                settings.channel = knob[1];
                settings.cc = knob[2];
                settings.initValue = knob[3];
                settings.maxRange = knob[4];
                settings.isLocked = (knob[5] === "0") ? false : true;

                let subLabelStrings = knob.slice(8);
                let newSubLabels = new Map();
                for (let j = 0; j < subLabelStrings.length; j++) {
                    newSubLabels.set(uuidv4(), subLabelStrings[j]);
                }
                settings.subLabels = newSubLabels;
                i++;
            }
            this.setState({ preset: newPreset });
        });
    }

    // Updates the content to be displayed in 
    // the grid based on the current preset
    updateContent() {
        var content = [];
        var data = (this.state.mode === Mode.PRESETS) ? this.state.presets : this.state.preset;

        for (const [uuid, settings] of data) {
            console.log(data);
            content.push({
                id: uuid,
                value: this.formatContent(settings)
            });
        }
        this.setState({ content: content });
    }

    // Formats content to be displayed in each Grid item
    formatContent(content) {
        return (
            <div>
                {content.label}
            </div>
        );

    }

    /*
     * Event Handlers
     */
    // Opens a file dialog to set the default directory for loading presets
    eventSetPresetDir(e) {
        ipcRenderer.send('set-preset-dir');
        ipcRenderer.on('set-preset-path-ready', (event, path) => {
            this.setState({
                presetsPath: path,
                presetsLoaded: false
            });
        });
    }

    eventPresetDirChanged() {
        this.fetchPresets();
    }


    // Selects a Grid item to edit
    eventClick(e) {
        switch (this.state.mode) {
            case Mode.PRESETS:
                this.loadPreset(e.target.id);
                this.setState({ activePresetItem: e.target, activePresetID: e.target.id });
                break;
            case Mode.SETTINGS:
                this.setState({ activeSettingsItem: e.target, activeSettingsID: e.target.id });
                break;
            default:
                break;
        }
    }

    // Updates the preset and content with the new input 
    eventInputChanged(e) {
        const id = this.state.activeSettingsItem.id;
        const value = e.target.value;
        const newPreset = new Map(this.state.preset);
        if (e.target.className === "sublabels-list-input") {
            let subLabels = newPreset.get(id).subLabels;
            subLabels.set(e.target.id, value);
            this.setState({ preset: newPreset });
        } else {
            switch (e.target.id) {
                case "inputLabel":
                    newPreset.get(id).label = value;
                    this.setState({ preset: newPreset });
                    this.updateContent();
                    break;
                case "sublabels-list-input":
                    break;
                default:
                    break;
            }
        }
    }

    // Enables fade transition on FadeProps and switches the current mode
    eventChangeMode(e) {
        // Prevent changing modes unless a fade has been completed
        if (!this.state.fade) {
            this.setState({
                fade: true,
                mode: (this.state.mode === Mode.PRESETS) ? Mode.SETTINGS : Mode.PRESETS
            });
        }
        setTimeout(() => { this.updateContent() }, 0);
    }

    eventAddSubLabel(e) {
        const id = this.state.activeSettingsItem.id;
        const newPreset = new Map(this.state.preset);
        const subLabels = newPreset.get(id).subLabels;
        subLabels.set(uuidv4(), "");
        this.setState({ preset: newPreset });
    }

    eventDeleteSubLabel(e) {
        const id = this.state.activeSettingsItem.id;
        const newPreset = new Map(this.state.preset);
        const subLabels = newPreset.get(id).subLabels;
        subLabels.delete(e.target.id)
        this.setState({ preset: newPreset });
    }

    eventOrderSubLabels(e) {
        const id = this.state.activeSettingsItem.id;
        const newPreset = new Map(this.state.preset);
        const newSubLabels = new Map();
        for (let i = 0; i < e.length; i++) {
            if (e[i].content === "add") continue;
            newSubLabels.set(e[i].id, e[i].content);
        }
        newPreset.get(id).subLabels = newSubLabels;
        this.setState({ preset: newPreset });
    }

    // Call back used by the Grid in its componentDidUpdate.
    // Lets us know the transition between modes has completed
    // and we can disable fading in FadeProps. 
    modeRendered() {
        this.setState({ fade: false });
    }

    render() {
        const modeComponents = [
            <Presets
                presetsPath={this.state.presetsPath}
                eventPresetDirChanged={this.eventPresetDirChanged.bind(this)}
                eventSetPresetDir={this.eventSetPresetDir.bind(this)}>
            </Presets>,
            <Settings
                activeSettingsID={this.state.activeSettingsID}
                preset={this.state.preset}
                eventInputChanged={this.eventInputChanged.bind(this)}
                eventAddSubLabel={this.eventAddSubLabel.bind(this)}
                eventDeleteSubLabel={this.eventDeleteSubLabel.bind(this)}
                eventOrderSubLabels={this.eventOrderSubLabels.bind(this)}
            ></Settings>
        ];

        return (
            <div className="App">
                <Titlebar></Titlebar>
                <Menu eventChangeMode={this.eventChangeMode.bind(this)}></Menu>
                <FadeProps active={this.state.fade} animationLength={ANIM_LENGTH}>
                    {modeComponents[this.state.mode]}
                </FadeProps>
                <FadeProps active={this.state.fade} animationLength={ANIM_LENGTH}>
                    <Grid
                        fade={this.state.fade}
                        content={this.state.content}
                        activeID={(this.state.mode === Mode.PRESETS) ? this.state.activePresetID : this.state.activeSettingsID}
                        modeRendered={this.modeRendered.bind(this)}
                        eventClick={this.eventClick.bind(this)}>
                    </Grid>
                </FadeProps>
            </div >
        );
    }
}

export default App;
