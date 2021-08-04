import React from 'react';
import SettingsTable from './SettingsTable';
import SubLabels from './SubLabels';

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidUpdate() {
        console.log("settings rendered");

    }

    render() {

        return (
            <div className="settings">
                <SettingsTable eventInputChanged={this.props.eventInputChanged}>
                </SettingsTable>
                <SubLabels></SubLabels>
            </div>
        );
    }
}

export default Settings;