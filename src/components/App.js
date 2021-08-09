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

class App extends React.PureComponent {
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
            activeSettingsID: initData.preset.keys().next().value,
            activePresetItem: null,
            activePresetID: initData.preset.keys().next().value,
            isDragging: false,
            fade: false,
            presetsLoaded: false
        };
    }

    componentDidMount() {
        this.setState({
            activePresetItem: document.getElementById(`${this.state.preset.keys().next().value}`),
            activeSettingsItem: document.getElementById(`${this.state.preset.keys().next().value}`)
        });


        // Check for an existing path in the options.json file
        ipcRenderer.on('options-loaded', (event, options) => {
            if (options != null && options !== undefined) {
                this.setState({ presetsPath: options.presetsPath });
                this.fetchPresets();
                this.updateAllContent();
            }
        });

    }

    componentDidUpdate() {
        if (!this.state.presetsLoaded && this.state.presetsPath) {
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
        var content = new Map();
        for (let i = 0; i < uuids.length; i++) {
            const id = uuids[i];
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
            content.set(id, "");
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
            this.loadPreset(this.state.activePresetID);

        });

    }

    loadPreset(id) {
        var presetData = this.state.presets.get(id);
        if (presetData === undefined) return;

        if (presetData.fileName === "") {
            const initData = this.initData(this.state.uuids);
            this.setState({
                preset: initData.preset,
                activeID: initData.preset.keys().next().value,
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

    updateAllContent() {
        setTimeout(() => {
            var content = new Map();
            var data = (this.state.mode === Mode.PRESETS) ? this.state.presets : this.state.preset;

            for (const [uuid, settings] of data) {
                content.set(uuid, this.formatContent(settings));
            }
            this.setState({ content: content });
        }, 0);
    }

    updateContent() {
        setTimeout(() => {
            var content = new Map(this.state.content);
            var data = (this.state.mode === Mode.PRESETS) ? this.state.presets : this.state.preset;
            var id = (this.state.mode === Mode.PRESETS) ? this.state.activePresetID : this.state.activeSettingsID;
            content.set(id, this.formatContent(data.get(id)));
            this.setState({ content: content });
        }, 0);
    }

    // Formats content to be displayed in each Grid item
    formatContent(content) {
        let subLabel = "";
        if (content.subLabels !== undefined && content.subLabels.size > 0) {
            subLabel = content.subLabels.entries().next().value[1];
        }
        return (this.state.mode === Mode.PRESETS) ?
            <div id="preset-content">
                <div id="preset-content-label">
                    {content.label}
                </div>
                <div id="preset-content-sublabel">
                    {content.subLabel}
                </div>
            </div>
            :
            <div id="settings-content">
                <div id="settings-content-head">
                    <div>
                        CH: {content.channel}
                    </div>
                    <div>
                        CC: {content.cc}
                    </div>
                </div>
                <div id="settings-content-foot">
                    {content.label}<br></br>
                    {subLabel}
                </div>
            </div>
    }

    /*
     * Event Handlers
     */
    // Opens a file dialog to set the default directory for loading presets
    eventSetPresetDir(e) {
        ipcRenderer.send('set-preset-dir');
        ipcRenderer.on('set-preset-path-ready', (event, path) => {
            const initData = this.initData(this.state.uuids);
            this.setState({
                presetsPath: path,
                presetsLoaded: false,
                preset: initData.preset,
                presets: initData.presets,
                content: initData.content

            });
            this.fetchPresets();
            this.updateAllContent();
        });
    }

    // Selects a Grid item to edit
    eventClick(e) {
        console.log(e.target.id);

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
        const newPresets = new Map(this.state.presets);
        if (e.target.className === "sublabels-list-input") {
            let subLabels = newPreset.get(id).subLabels;
            subLabels.set(e.target.id, value);
            this.setState({ preset: newPreset });
            this.updateContent();

        } else {
            switch (e.target.id) {
                case "inputLabel":
                    newPreset.get(id).label = value;
                    this.setState({ preset: newPreset });
                    break;
                case "inputPresetLabel":
                    newPresets.get(id).label = value;
                    this.setState({ presets: newPresets })
                    break;
                case "inputPresetSubLabel":
                    break;
                default:
                    break;
            }
            this.updateContent();

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
        //this.loadPreset(this.state.activePresetID);
        this.updateAllContent();
    }

    eventAddSubLabel(e) {
        const id = this.state.activeSettingsItem.id;
        const newPreset = new Map(this.state.preset);
        const subLabels = newPreset.get(id).subLabels;
        subLabels.set(uuidv4(), "");
        this.setState({ preset: newPreset });
    }

    eventDeleteSubLabel(e) {
        console.log("delete");
        const id = this.state.activeSettingsItem.id;
        const newPreset = new Map(this.state.preset);
        const subLabels = newPreset.get(id).subLabels;
        console.log(subLabels);
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
        console.log("render");
        const modeComponents = [
            <Presets
                presetsPath={this.state.presetsPath}
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
        const currentPreset = this.state.presets.get(this.state.activePresetID);
        return (
            <div className="App">
                <Titlebar></Titlebar>
                <Menu
                    presetLabel={(currentPreset !== undefined) ? currentPreset.label : ""}
                    presetSubLabel={(currentPreset !== undefined) ? currentPreset.subLabel : ""}
                    eventChangeMode={this.eventChangeMode.bind(this)}
                    eventInputChanged={this.eventInputChanged.bind(this)}>
                </Menu>
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

export default App = React.memo(App);
