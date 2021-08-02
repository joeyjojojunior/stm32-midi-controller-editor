import React from 'react';

class SettingsCheckbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <tr>
                <div className="settings-checkbox-div">
                    <td>{this.props.settingLabel}</td>
                    <td>
                        <input
                            id={this.props.id}
                            className="inputField"
                            type="checkbox"
                        >
                        </input>
                    </td>
                </div>
            </tr>
        );
    }
}

export default SettingsCheckbox;