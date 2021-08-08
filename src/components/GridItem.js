import React from 'react';
//import GridItemContent from './GridItemContent';
//const { ipcRenderer } = window.require('electron');

class GridItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        console.log("item render");
        return (
            <div id={this.props.id} className={`item ${this.props.active}`} onClick={this.props.eventClick}>
                <div className="item-content">
                    {this.props.content}
                </div>
            </div>
        );
    }
}

export default GridItem;