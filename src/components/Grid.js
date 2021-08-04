import React from 'react';
import Muuri from 'muuri';
import GridItem from './GridItem';
import options from '../utils/muuriOptions';

class Grid extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            grid: null,
        };
    }

    getItems() {
        var items = []
        for (let i = 0; i < 128; i++) {
            const id = this.props.content[i].id;
            const value = this.props.content[i].value;
            const item = (
                <GridItem
                    id={id}
                    content={value}
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
        if (this.props.fade) {
            setTimeout(this.props.modeRendered, 300);
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

export default Grid;