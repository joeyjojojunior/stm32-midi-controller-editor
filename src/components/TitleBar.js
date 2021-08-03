import React from 'react';

class TitleBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <header id="titlebar">
                <div id="titlebar-drag-region" className="drag">
                    <div id="titlebar-title">STM32 Midi Controller Editor</div>
                </div>
                <div id="titlebar-btns">
                    <button class="titlebar-btn titlebar-btn-min">
                        <svg x="0px" y="0px" viewBox="0 0 10.2 1">
                            <rect x="0" y="50%" width="10.2" height="1" /></svg>
                    </button>
                    <button class="titlebar-btn titlebar-btn-max">
                        <svg viewBox="0 0 10 10">
                            <path d="M0,0v10h10V0H0z M9,9H1V1h8V9z" /></svg>
                    </button>
                    <button class="titlebar-btn titlebar-btn-close">
                        <svg viewBox="0 0 10 10">
                            <polygon
                                points="10.2,0.7 9.5,0 5.1,4.4 0.7,0 0,0.7 4.4,5.1 0,9.5 0.7,10.2 5.1,5.8 9.5,10.2 10.2,9.5 5.8,5.1" />
                        </svg>
                    </button>
                </div>
            </header>
        );
    }
}

export default TitleBar;