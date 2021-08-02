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
                <ul className="sublabels-list">
                    <li className="sublabels-list-item">
                        <div className="sublabels-drag-handle">
                            <img src="../img/dragIcon.svg" className="sublabels-drag-icon" alt=""></img>
                        </div>
                        <input className="sublabels-list-input" maxLength={MAX_LABEL_CHARS} spellCheck="false"></input>
                        <button className="sublabels-list-btn sublabels-list-btn-delete">&times;</button>
                    </li>
                </ul>
            </div>
        );
    }
}

export default SubLabels;