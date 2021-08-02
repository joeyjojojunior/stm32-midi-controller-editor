import React from 'react';
import Muuri from 'muuri';
import GridItem from './GridItem';
import options from '../utils/muuriOptions';
import { NUM_KNOBS } from '../utils/globals';

class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.state = { grid: null, items: this.initItems(), activeItem: null };
    }

    initItems() {
        var items = [];
        for (var i = 0; i < NUM_KNOBS; i++) {
            items[i] = <GridItem eventClick={this.eventClick.bind(this)} id={i}></GridItem>
        }
        return items;
    }

    eventClick(e) {
        if (this.state.activeItem !== null) {
            this.state.activeItem.classList.remove("active");
        }
        e.target.classList.add("active");
        this.setState({
            activeItem: e.target
        });

    }


    componentDidMount() {
        if (this.state.grid === null) {
            this.setState({ grid: new Muuri('.grid', options) });
        }
    }

    render() {
        console.log(this.state.grid);
        return (
            <div className="grid">
                {this.state.items}
            </div>
        )
    }
}

export default Grid;