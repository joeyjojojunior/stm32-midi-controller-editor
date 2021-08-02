import React from 'react';

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div class="menu">
                <div class="preset header">
                    <label class="label">Preset</label>

                    <div class="input-container">
                        <input type="text" class="inputFieldLarge" id="inputPresetLabel" placeholder="Label" />
                    </div>

                    <div class="input-container">
                        <input type="text" class="inputFieldLarge" id="inputPresetSublabel" placeholder="Sub Label" />
                    </div>
                </div>

                <div class="buttons header">
                    <button class="btn" id="btnPresets">Presets</button>
                    <button class="btn" id="btnZoomIn">Size +</button>
                    <button class="btn" id="btnZoomOut">Size -</button>
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

export default Menu;