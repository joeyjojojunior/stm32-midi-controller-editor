import React from 'react';

const { ipcRenderer } = window.require('electron');

class GridItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            content: this.props.content,
            id: this.props.id,
            active: ""
        }
    }

    render() {
        console.log(`render ${this.state.id}`);
        return (
            <div className={`item ${this.state.active}`} onClick={this.props.eventClick} >
                <div className="item-content">
                    {this.state.content}
                </div>
            </div>
        );
    }
}

export default GridItem;