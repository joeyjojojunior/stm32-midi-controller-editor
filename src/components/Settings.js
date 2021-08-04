import React from 'react';
import SettingsTable from './SettingsTable';
import SubLabels from './SubLabels';

class Settings extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        return (
            <div className="settings">
                <SettingsTable activeID={this.props.activeID} preset={this.props.preset} eventInputChanged={this.props.eventInputChanged}>
                </SettingsTable>
                <SubLabels></SubLabels>
            </div>
        );
    }
}

export default Settings = React.memo(Settings);