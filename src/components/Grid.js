import React from 'react';
import Muuri from 'muuri';
import { v4 as uuidv4 } from 'uuid';
import GridItem from './GridItem';
import options from '../utils/muuriOptions';
import { NUM_KNOBS } from '../utils/globals';

class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: null,
            items: this.initItems(),
            activeItem: null,
            isDragging: false
        };
    }

    initItems() {
        var items = [];
        for (var i = 0; i < NUM_KNOBS; i++) {
            items[i] = <GridItem id={uuidv4()} eventClick={this.eventClick.bind(this)}></GridItem>
        }
        return items;
    }

    eventClick(e) {
        if (!this.state.isDragging) {
            if (this.state.activeItem !== null) {
                this.state.activeItem.classList.remove("active");
            }
            e.target.classList.add("active");
            this.setState({
                activeItem: e.target
            });
        }
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

    render() {
        return (
            <div className="grid">
                {this.state.items}
            </div>
        )
    }
}

export default Grid;