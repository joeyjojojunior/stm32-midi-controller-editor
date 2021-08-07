import React from 'react';
import { MAX_LABEL_CHARS } from '../utils/globals';
import dragIcon from '../img/dragIcon.svg'

class SubLabelAdd extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="sublabels-list-item sublabels-list-item-dummy">
                <div className="sublabels-drag-handle sublabels-drag-handle-dummy">
                    <img src={dragIcon} className="sublabels-drag-icon" alt=""></img>
                </div>
                <input
                    className="sublabels-list-input sublabels-list-input-dummy"
                    maxLength={MAX_LABEL_CHARS}
                    spellCheck="false"
                    disabled="true"
                    placeholder="Add Sub Label "
                >
                </input>
                <button
                    id={this.props.btnID}
                    className="sublabels-list-btn sublabels-list-btn-add"
                    onClick={this.props.eventAddSubLabel}
                >
                    &#43;
                </button>
            </div>
        );
    }
}

export default SubLabelAdd = React.memo(SubLabelAdd);
