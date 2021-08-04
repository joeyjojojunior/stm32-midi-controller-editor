import "../css/App.css";
import "../css/Titlebar.css";
import "../css/Menu.css";
import "../css/Settings.css";
import "../css/SubLabels.css";
import "../css/Presets.css";
import "../css/Grid.css";
import "../css/Transitions.css"

import React from "react";
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
      content: content,
      activeItem: null,
      isDragging: false,
      fade: false
    };
  }

  // Updates the content to be displayed in 
  // the grid based on the current preset
  updateContent() {
    var content = [];
    for (const [uuid, settings] of this.state.preset) {
      content.push({
        id: uuid,
        value: this.formatContent(settings)
      });
    }

    this.setState({
      content: content
    });
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
        presetPath: path
      });
    });
  }


  // Selects a Grid item to edit
  eventClick(e) {
    if (!this.state.isDragging) {
      if (this.state.activeItem !== null) {
        this.state.activeItem.classList.remove("active");
      }
      e.target.classList.add("active");
      this.setState({
        activeItem: e.target
      });
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
        this.setState({
          preset: newPreset
        });
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
  }

  // Call back used by the Grid in its componentDidUpdate.
  // Lets us know the transition between modes has completed
  // and we can disable fading in FadeProps. 
  modeRendered() {
    this.setState({
      fade: false,
    });
  }


  render() {
    const modeComponents = [
      <Presets fade={this.state.fade} modeRendered={this.modeRendered.bind(this)} presetPath={this.state.presetPath} eventSetPresetDir={this.eventSetPresetDir.bind(this)} ></Presets>,
      <Settings fade={this.state.fade} modeRendered={this.modeRendered.bind(this)} eventInputChanged={this.eventInputChanged.bind(this)}></Settings>
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

export default App;
