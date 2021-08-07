import React from 'react';
import { MAX_LABEL_CHARS } from '../utils/globals';
import dragIcon from '../img/dragIcon.svg'

class SubLabel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="sublabels-list-item">
                <div className="sublabels-drag-handle">
                    <img src={dragIcon} className="sublabels-drag-icon" alt=""></img>
                </div>
                <input
                    id={this.props.slID}
                    className="sublabels-list-input"
                    maxLength={MAX_LABEL_CHARS}
                    spellCheck="false"
                    value={this.props.content}
                    onChange={this.props.eventInputChanged}
                >
                </input>
                <button
                    id={this.props.btnID}
                    className="sublabels-list-btn sublabels-list-btn-delete"
                    onClick={this.props.eventDeleteSubLabel}
                >
                    &times;
                </button>
            </div>
        );
    }
}

export default SubLabel;
