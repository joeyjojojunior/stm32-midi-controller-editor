import React from 'react';

class Menu extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div class="menu">
                <div class="preset header">
                    <label class="label">Preset</label>
                    <div class="input-container">
                        <input
                            type="text"
                            class="inputFieldLarge"
                            id="inputPresetLabel"
                            placeholder="Label"
                            value={this.props.presetLabel}
                            onChange={this.props.eventInputChanged} />
                    </div>
                    <div class="input-container">
                        <input
                            type="text"
                            class="inputFieldLarge"
                            id="inputPresetSubLabel"
                            placeholder="Sub Label"
                            value={this.props.presetSubLabel}
                            onChange={this.props.eventInputChanged} />
                    </div>
                </div>
                <div class="buttons header">
                    <button class="btn" id="btnPresets" onClick={this.props.eventChangeMode}>Presets</button>
                    <button class="btn" id="btnZoomIn" onClick={this.props.eventIncreaseSize}>Size +</button>
                    <button class="btn" id="btnZoomOut" onClick={this.props.eventDecreaseSize}>Size -</button>
                    &nbsp; &nbsp;
                    <button class="btn" id="btnSave">Save</button>
                    <button class="btn" id="btnSaveAs">Save As</button>
                    <button class="btn" id="btnLoad">Load</button>
                    <button class="btn" id="btnReset">Reset</button>
                </div>
            </div>
        );
    }
}

export default Menu = React.memo(Menu);