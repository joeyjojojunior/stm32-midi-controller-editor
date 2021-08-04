import React from 'react';
import SettingsInput from './SettingsInput';
import SettingsCheckbox from './SettingsCheckbox';
import { MAX_LABEL_CHARS } from '../utils/globals';

class SettingsTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { label: "Knob 1", lastActiveId: "" };
    }

    render() {
        /*
        if (this.props.activeID) {
            this.setState({
                lastActiveID: this.props.activeID
            })
        }

        const id = (this.props.activeID) ? this.props.activeID : this.state.lastActiveID;
        */

        const id = this.props.activeID;
        const values = (this.props.activeID) ?
            {
                label: this.props.preset.get(id).label,
                channel: this.props.preset.get(id).label,
                cc: this.props.preset.get(id).label,
                initValue: this.props.preset.get(id).label,
                maxRange: this.props.preset.get(id).label,
            }
            :
            {
                label: "",
                channel: "",
                cc: "",
                initValue: "",
                maxRange: "",
            }


        return (
            <div className="settings-table-container">
                <div className="settings-knob-label">{this.state.label}</div>
                <table>
                    <tbody>
                        <SettingsInput
                            settingLabel="Label"
                            id="inputLabel"
                            value={values.label}
                            maxLength={MAX_LABEL_CHARS}
                            eventInputChanged={this.props.eventInputChanged}
                        >
                        </SettingsInput>

                        <SettingsInput
                            settingLabel="Channel"
                            id="inputChannel"
                            value={values.channel}
                            maxLength="2"
                            eventInputChanged={this.props.eventInputChanged}>
                        </SettingsInput>

                        <SettingsInput
                            settingLabel="CC"
                            id="inputCC"
                            value={values.cc}
                            maxLength="3"
                            eventInputChanged={this.props.eventInputChanged}>
                        </SettingsInput>

                        <SettingsInput
                            settingLabel="Init Value"
                            id="inputInitValue"
                            value={values.initValue}
                            maxLength="3"
                            eventInputChanged={this.props.eventInputChanged}>
                        </SettingsInput>

                        <SettingsInput
                            settingLabel="Max Range"
                            id="inputMaxRange"
                            value={values.maxRange}
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

export default SettingsTable = React.memo(SettingsTable);