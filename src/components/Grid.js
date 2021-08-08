import React from 'react';
import Muuri from 'muuri';
import GridItem from './GridItem';
import options from '../utils/muuriOptions';
import { NUM_KNOBS } from '../utils/globals';

class Grid extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { grid: null, isDragging: false };
    }

    getItems() {
        if (this.props.content.size === 0) return "";

        var items = []
        for (let i = 0; i < NUM_KNOBS; i++) {
            const id = this.props.content[i].id;
            const value = this.props.content[i].value;
            const item = (
                <GridItem
                    id={id}
                    content={value}
                    active={(id === this.props.activeID) ? "active" : ""}
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
        return (
            <div className="grid">
                {this.getItems()}
            </div>
        )
    }
}

export default Grid = React.memo(Grid);