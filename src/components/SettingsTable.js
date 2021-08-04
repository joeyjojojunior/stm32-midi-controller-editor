import React from 'react';
import SettingsInput from './SettingsInput';
import SettingsCheckbox from './SettingsCheckbox';
import { MAX_LABEL_CHARS } from '../utils/globals';

class SettingsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { label: "Knob 1" };
    }

    render() {
        return (
            <div className="settings-table-container">
                <div className="settings-knob-label">{this.state.label}</div>
                <table>
                    <tbody>
                        <SettingsInput
                            settingLabel="Label"
                            id="inputLabel"
                            maxLength={MAX_LABEL_CHARS}
                            eventInputChanged={this.props.eventInputChanged}
                        >
                        </SettingsInput>

                        <SettingsInput
                            settingLabel="Channel"
                            id="inputChannel"
                            maxLength="2"
                            eventInputChanged={this.props.eventInputChanged}>
                        </SettingsInput>

                        <SettingsInput
                            settingLabel="CC"
                            id="inputCC"
                            maxLength="3"
                            eventInputChanged={this.props.eventInputChanged}>
                        </SettingsInput>

                        <SettingsInput
                            settingLabel="Init Value"
                            id="inputInitValue"
                            maxLength="3"
                            eventInputChanged={this.props.eventInputChanged}>
                        </SettingsInput>

                        <SettingsInput
                            settingLabel="Max Range"
                            id="inputMaxRange"
                            maxLength="3"
                            eventInputChanged={this.props.eventInputChanged}>
                        </SettingsInput>

                        <SettingsCheckbox
                            settingLabel="Locked"
                            id="inputIsLocked"
                            eventInputChanged={this.props.eventInputChanged}>
                        </SettingsCheckbox>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default SettingsTable;