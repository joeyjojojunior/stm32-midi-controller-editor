import React from 'react';
import SettingsInput from './SettingsInput';
import SettingsCheckbox from './SettingsCheckbox';
import { MAX_LABEL_CHARS } from '../utils/globals';

class SettingsTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            label: "Knob 1",
            lastActiveId: "",
            valueCache:
            {
                label: "",
                channel: "",
                cc: "",
                initValue: "",
                maxRange: ""
            }
        };
    }
    eventInputUpdated(e) {
        if (e !== undefined) {
            this.setState({
                valueCache: {
                    label: e.target.value,
                    channel: e.target.value,
                    cc: e.target.value,
                    initValue: e.target.value,
                    maxRange: e.target.value
                }
            })
        }
    }

    render() {
        const id = this.props.activeID;
        let values;
        try {
            values = {
                label: this.props.preset.get(id).label,
                channel: this.props.preset.get(id).channel,
                cc: this.props.preset.get(id).cc,
                initValue: this.props.preset.get(id).initValue,
                maxRange: this.props.preset.get(id).maxRange
            };
        } catch { // Sometimes state doesn't update in time
            values = this.state.valueCache;
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
                            eventInputUpdated={this.eventInputUpdated.bind(this)}
                        >
                        </SettingsInput>

                        <SettingsInput
                            settingLabel="Channel"
                            id="inputChannel"
                            value={values.channel}
                            maxLength="2"
                            eventInputChanged={this.props.eventInputChanged}
                            eventInputUpdated={this.eventInputUpdated.bind(this)}
                        >
                        </SettingsInput>

                        <SettingsInput
                            settingLabel="CC"
                            id="inputCC"
                            value={values.cc}
                            maxLength="3"
                            eventInputChanged={this.props.eventInputChanged}
                            eventInputUpdated={this.eventInputUpdated.bind(this)}
                        >
                        </SettingsInput>

                        <SettingsInput
                            settingLabel="Init Value"
                            id="inputInitValue"
                            value={values.initValue}
                            maxLength="3"
                            eventInputChanged={this.props.eventInputChanged}
                            eventInputUpdated={this.eventInputUpdated.bind(this)}
                        >
                        </SettingsInput>

                        <SettingsInput
                            settingLabel="Max Range"
                            id="inputMaxRange"
                            value={values.maxRange}
                            maxLength="3"
                            eventInputChanged={this.props.eventInputChanged}
                            eventInputUpdated={this.eventInputUpdated.bind(this)}
                        >
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