import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import SubLabel from './SubLabel';
import SubLabelAdd from './SubLabelAdd';

const NUM_ROWS_PER_COL = 12;
const MAX_SUBLABELS = 128;

class SubLabels extends React.PureComponent {
    constructor(props) {
        super(props);

        const items = [];
        for (let i = 0; i < 128; i++) {
            items.push({ id: uuidv4(), content: "" });
        }
        items.push({ id: uuidv4(), content: "add" });
        this.state = { items }

        this.onDragEnd = this.onDragEnd.bind(this);
    }

    onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) return;

        const items = this.reorder(
            this.state.items,
            result.source.index,
            result.destination.index
        );

        this.setState({ items });
    }

    reorder(list, startIndex, endIndex) {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    }

    createDroppables() {
        const NUM_COLS = Math.ceil(this.state.items.length / NUM_ROWS_PER_COL);
        const droppables = [];
        for (let i = 0; i < NUM_COLS; i++) {
            const startIndex = i * NUM_ROWS_PER_COL;
            if (startIndex >= this.state.items.length) break;
            droppables.push(
                <Droppable droppableId={`droppable${i}`}>
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {this.createDraggables(i * NUM_ROWS_PER_COL)}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            );
        }
        return droppables;
    }

    createDraggables(startIndex) {
        const draggables = [];
        const endIndex = Math.min(startIndex + NUM_ROWS_PER_COL, this.state.items.length);
        for (let i = startIndex; i < endIndex; i++) {
            const item = this.state.items[i];
            const subLabel =
                (item.content !== "add") ?
                    <SubLabel
                        btnID={item.id}
                        deleteItem={this.deleteItem.bind(this)}
                        content={item.content}
                    >
                    </SubLabel>
                    :
                    <SubLabelAdd
                        btnID={item.id}
                        addItem={this.addItem.bind(this)}
                    >
                    </SubLabelAdd>;
            draggables.push(
                <Draggable key={item.id} draggableId={item.id} index={i}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                        >
                            {subLabel}
                        </div>
                    )}
                </Draggable>
            );
        }
        return draggables;
    }

    addItem(e) {
        if (this.state.items.length < MAX_SUBLABELS + 1) {
            const addIndex = this.state.items.findIndex(item => item.id === e.target.id);
            this.setState({
                items: [
                    ...this.state.items.slice(0, addIndex),
                    { id: uuidv4(), content: "" },
                    ...this.state.items.slice(addIndex, this.state.items.length)
                ]
            });
        }
    }

    deleteItem(e) {
        this.setState({
            items: this.state.items.filter(el => el.id !== e.target.id)
        });
    }

    render() {
        return (
            <div className="sublabels">
                <div className="sublabels-label">Sub Labels</div>
                <div className="sublabels-container">
                    <DragDropContext onDragEnd={this.onDragEnd}>
                        {this.createDroppables()}
                    </DragDropContext>
                </div>
            </div>
        );
    }
}

export default SubLabels = React.memo(SubLabels);