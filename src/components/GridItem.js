import React from 'react';

const { ipcRenderer } = window.require('electron');

class GridItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            content: this.props.content
        }
    }

    render() {
        return (
            <div className={`item ${this.props.active}`} onClick={this.props.eventClick}>
                <div className="item-content">
                    {this.state.content}
                </div>
            </div >
        );
    }
}

export default GridItem;