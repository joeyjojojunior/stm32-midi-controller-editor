import '../css/App.css';
import '../css/Titlebar.css';
import '../css/Menu.css'
import '../css/Settings.css'
import '../css/SubLabels.css'
import '../css/Presets.css'
import '../css/Grid.css';

import Titlebar from './TitleBar';
import Menu from './Menu';
import Settings from './Settings';
import Grid from './Grid';

function App() {
  return (
    <div className="App">
      <Titlebar></Titlebar>
      <Menu></Menu>
      <Settings></Settings>
      <Grid></Grid>
    </div>
  );
}

export default App;
