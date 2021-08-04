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
    var preset = new Map();
    for (let i = 0; i < NUM_KNOBS; i++) {
      const id = uuidv4();
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
          subLabels: []
        }
      )

      if (i === 0) preset.get(id).label = "Cutoff";
      if (i === 1) preset.get(id).label = "Resonance";
    }

    var presets = new Map();
    for (let i = 0; i < NUM_KNOBS; i++) {
      const id = uuidv4();
      presets.set(
        id,
        {
          id: id,
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

    this.state = {
      mode: Mode.PRESETS,
      presetPath: "",
      preset: preset,
      presets: presets,
      content: content,
      activeItem: null,
      activeID: content[0].id,
      isDragging: false,
      fade: false,
      presetsLoaded: false
    };
  }

  componentDidMount() {
    this.setState({
      activeItem: document.getElementById(`${this.state.content[0].id}`)
    });

    // Check for an existing path in the options.json file
    ipcRenderer.on('options-loaded', (event, options) => {
      if (options != null && options !== undefined) {
        this.setState({ presetPath: options.presetPath });
      }
    });
  }

  fetchPresets() {
    ipcRenderer.send('fetch-presets', this.state.presetPath);
    ipcRenderer.on('fetch-presets-fetched', (event, presetStrings) => {
      presetStrings.sort((e1, e2) => {
        let indexE1 = parseInt(e1.split(',')[2], 10);
        let indexE2 = parseInt(e2.split(',')[2], 10);
        if (indexE1 < indexE2) return -1;
        if (indexE1 > indexE2) return 1;
        return 0;
      })

      let i = 0;
      const newPresets = new Map(this.state.presets);
      for (const [uuid, settings] of newPresets) {
        if (i < presetStrings.length) {
          let presetStr = presetStrings[i].split(',');
          settings.label = presetStr[0];
          settings.subLabel = presetStr[1];
        } else {
          settings.label = "";
          settings.subLabel = "";
        }
        i++;
      }
      this.setState({ presets: newPresets });
    });
  }

  // Updates the content to be displayed in 
  // the grid based on the current preset
  updateContent() {
    var content = [];
    var data = (this.state.mode === Mode.PRESETS) ? this.state.presets : this.state.preset;

    for (const [uuid, settings] of data) {
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
        presetPath: path,
        presetsLoaded: false
      });
    });
  }

  eventPresetDirChanged() {
    this.fetchPresets();
  }


  // Selects a Grid item to edit
  eventClick(e) {
    if (!this.state.isDragging) {
      if (this.state.activeItem !== null) {
        this.state.activeItem.classList.remove("active");
      }
      e.target.classList.add("active");
      this.setState({ activeItem: e.target, activeID: e.target.id });
    }
  }

  // Updates the preset and content with the new input 
  eventInputChanged(e) {
    const id = this.state.activeItem.id;
    const value = e.target.value;
    const newPreset = new Map(this.state.preset);
    switch (e.target.id) {
      case "inputLabel":
        newPreset.get(id).label = value;
        this.setState({ preset: newPreset });
        this.updateContent();
        break;
      default:
        break;
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

  // Call back used by the Grid in its componentDidUpdate.
  // Lets us know the transition between modes has completed
  // and we can disable fading in FadeProps. 
  modeRendered() {
    this.setState({ fade: false });
  }

  profile(
    id, // the "id" prop of the Profiler tree that has just committed
    phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
    actualDuration, // time spent rendering the committed update
    baseDuration, // estimated time to render the entire subtree without memoization
    startTime, // when React began rendering this update
    commitTime, // when React committed this update
    interactions // the Set of interactions belonging to this update
  ) {
    //console.log(actualDuration);
  }


  render() {
    if (this.state && !this.state.presetsLoaded && this.state.presetPath) {
      this.fetchPresets();
      setTimeout(() => { this.updateContent() }, 0);
      this.setState({ presetsLoaded: true });
    }

    const modeComponents = [
      <Presets
        presetPath={this.state.presetPath}
        eventPresetDirChanged={this.eventPresetDirChanged.bind(this)}
        eventSetPresetDir={this.eventSetPresetDir.bind(this)}>
      </Presets>,
      <Settings activeID={this.state.activeID} preset={this.state.preset} eventInputChanged={this.eventInputChanged.bind(this)}></Settings>
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
            preset={this.state.preset}
            content={this.state.content}
            modeRendered={this.modeRendered.bind(this)}
            eventClick={this.eventClick.bind(this)}>
          </Grid>
        </FadeProps>
      </div >
    );
  }
}

export default App = React.memo(App);
