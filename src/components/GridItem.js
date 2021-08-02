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