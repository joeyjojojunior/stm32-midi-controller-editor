import React from 'react';

class SettingsInput extends React.Component {
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
                    >
                    </input>
                </td>
            </tr>
        );
    }
}

export default SettingsInput;