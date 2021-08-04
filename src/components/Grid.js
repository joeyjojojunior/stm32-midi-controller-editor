import React from 'react';
import Muuri from 'muuri';
import GridItem from './GridItem';
import options from '../utils/muuriOptions';
import { NUM_KNOBS } from '../utils/globals';

class Grid extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { grid: null };
    }

    getItems() {
        var items = []
        for (let i = 0; i < NUM_KNOBS; i++) {
            const id = this.props.content[i].id;
            const value = this.props.content[i].value;
            const item = (
                <GridItem
                    id={id}
                    content={this.props.content[i].value}
                    active={(i === 0) ? "active" : ""}
                    eventClick={this.props.eventClick}>
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
        if (this.props.fade) {
            setTimeout(this.props.modeRendered, 0);
        }
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