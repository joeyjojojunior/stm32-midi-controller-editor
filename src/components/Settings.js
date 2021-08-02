import React from 'react';
import SettingsTable from './SettingsTable';
import SubLabels from './SubLabels';

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="settings">
                <SettingsTable></SettingsTable>
                <SubLabels></SubLabels>
            </div>
        );
    }
}

export default Settings;