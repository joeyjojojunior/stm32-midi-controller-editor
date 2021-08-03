import "../css/App.css";
import "../css/Titlebar.css";
import "../css/Menu.css";
import "../css/Settings.css";
import "../css/SubLabels.css";
import "../css/Presets.css";
import "../css/Grid.css";
import "../css/Transitions.css"

import React from "react";
import FadeProps from 'fade-props';
import Titlebar from "./TitleBar";
import Menu from "./Menu";
import Settings from "./Settings";
import Presets from "./Presets";
import Grid from "./Grid";

const Mode = { PRESETS: 0, SETTINGS: 1 };
const ANIM_LENGTH = 200;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: Mode.PRESETS,
      modeComponents: [<Presets></Presets>, <Settings></Settings>]
    };
  }

  eventClickPresets(e) {
    this.setState({
      mode: (this.state.mode === Mode.PRESETS) ? Mode.SETTINGS : Mode.PRESETS
    });
  }

  render() {
    return (
      <div className="App">
        <Titlebar></Titlebar>
        <Menu eventClickPresets={this.eventClickPresets.bind(this)}></Menu>
        <FadeProps animationLength={ANIM_LENGTH}>
          {this.state.modeComponents[this.state.mode]}
        </FadeProps>
        <FadeProps animationLength={ANIM_LENGTH}>
          <Grid></Grid>
        </FadeProps>

      </div >
    );
  }
}

export default App;
