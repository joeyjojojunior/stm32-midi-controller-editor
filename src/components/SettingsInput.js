import React from 'react';

class SettingsInput extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {



        return (
            <tr>
                <td>{this.props.settingLabel}</td>
                <td>
                    <input
                        id={this.props.id}
                        className="inputField"
                        maxLength={this.props.maxLength}
                        spellcheck="false"
                        value={this.props.value}
                        onChange={this.props.eventInputChanged}
                    >
                    </input>
                </td>
            </tr>
        );
    }
}

export default SettingsInput = React.memo(SettingsInput);