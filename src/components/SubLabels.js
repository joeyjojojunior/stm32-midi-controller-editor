import React from 'react';
import { MAX_LABEL_CHARS } from '../utils/globals';

class SubLabels extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="sublabels">
                <div className="sublabels-label">Sub Labels</div>
                <ul className="sl-list">
                    <li className="sl-list-item">
                        <div className="sl-drag-handle">
                            <img src="../img/dragIcon.svg" className="sl-drag-icon" alt=""></img>
                        </div>
                        <input className="sl-list-input" maxLength={MAX_LABEL_CHARS} spellCheck="false"></input>
                        <button className="sl-list-btn sl-list-btn-delete">&times;</button>
                    </li>
                </ul>
            </div>
        );
    }
}

export default SubLabels;