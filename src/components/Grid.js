import React from 'react';
import Muuri from 'muuri';
import GridItem from './GridItem';
import options from '../utils/muuriOptions';
const { webFrame } = window.require('electron');

class Grid extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { grid: null, isDragging: false };
        this.firstRun = true;
    }

    getItems() {
        if (this.props.content.size === 0) return "";

        var items = []
        for (const [uuid, c] of this.props.content) {
            const item = (
                <GridItem
                    id={uuid}
                    content={c}
                    active={(uuid === this.props.activeID) ? "active" : ""}
                    eventClick={(!this.state.isDragging) && this.props.eventClick}>
                </GridItem>
            );
            items.push(item);
        }
        return items;
    }

    componentDidMount() {
        if (this.state.grid === null) {
            const grid = new Muuri('.grid', options);

            grid.on("dragMove", () => {
                this.setState({
                    isDragging: true
                })
            });
            grid.on('dragReleaseEnd', () => {
                this.setState({
                    isDragging: false
                })
            });


            this.setState({ grid: grid });
        }
    }

    componentDidUpdate() {
        // Turn off the fade transition if we switched modes
        if (this.props.fade) this.props.modeRendered();
    }

    render() {
        if (this.state.grid && webFrame.getZoomFactor() !== this.state.getZoomFactor) {
            setTimeout(() => { this.state.grid.layout(); }, 0)
        }

        return (
            <div className="grid">
                {this.getItems()}
            </div>
        )
    }
}

export default Grid = React.memo(Grid);