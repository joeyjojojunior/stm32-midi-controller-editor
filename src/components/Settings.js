import React from "react";
import SettingsTable from "./SettingsTable";
import SubLabels from "./SubLabels";

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="settings">
                <SettingsTable
                    activeID={this.props.activeID}
                    preset={this.props.preset}
                    eventInputChanged={this.props.eventInputChanged}
                ></SettingsTable>
                <SubLabels
                    activeID={this.props.activeID}
                    preset={this.props.preset}
                    eventInputChanged={this.props.eventInputChanged}
                    eventAddSubLabel={this.props.eventAddSubLabel}
                    eventDeleteSubLabel={this.props.eventDeleteSubLabel}
                    eventOrderSubLabels={this.props.eventOrderSubLabels}
                ></SubLabels>
            </div>
        );
    }
}

export default Settings;
