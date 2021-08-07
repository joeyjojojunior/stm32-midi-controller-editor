import React from "react";

class Presets extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        return (
            <div className={`preset-browser ${this.state.classes}`}>
                <div className="preset-title">Presets</div>
                <div className="preset-path-container">
                    <input
                        className="preset-path-input"
                        readonly="true"
                        value={this.props.presetsPath}
                        onChange={this.props.eventPresetDirChanged}>
                    </input>
                    <button
                        className="preset-path-btn"
                        onClick={this.props.eventSetPresetDir}>
                        Select Dir
                    </button>
                </div>
            </div>
        );
    }
}

export default Presets = React.memo(Presets);
