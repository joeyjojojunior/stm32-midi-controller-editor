import React from 'react';
import { MAX_LABEL_CHARS } from '../utils/globals';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import dragIcon from '../img/dragIcon.svg'
const NUM_COLS = 11;
const NUM_ROWS_PER_COL = 12;

class SubLabels extends React.Component {
    constructor(props) {
        super(props);

        const items = [];
        for (let i = 0; i < 128; i++) {
            items.push({ id: `item${i}`, content: `item${i}` });
        }
        items.push({ id: `item${items.length + 1}`, content: "dummy" });
        this.state = {
            items: items
        }
        this.onDragEnd = this.onDragEnd.bind(this);

    }

    reorder(list, startIndex, endIndex) {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    }

    onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = this.reorder(
            this.state.items,
            result.source.index,
            result.destination.index
        );

        this.setState({
            items
        });
    }

    createDroppables() {
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
            draggables.push(
                <Draggable key={item.id} draggableId={item.id} index={i}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                        >
                            <div className="sublabels-list-item">
                                <div className="sublabels-drag-handle">
                                    <img src={dragIcon} className="sublabels-drag-icon" alt=""></img>
                                </div>
                                <input className="sublabels-list-input" maxLength={MAX_LABEL_CHARS} spellCheck="false" value={item.content}></input>
                                <button className="sublabels-list-btn sublabels-list-btn-delete">&times;</button>
                            </div>
                        </div>
                    )}
                </Draggable>
            );
        }
        return draggables;
    }

    render() {
        console.log(this.state.items);
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

export default SubLabels;

/*
  <Draggable key={item.id} draggableId={item.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <div className="sublabels-list-item sublabels-list-item-dummy">
                                                        <div className="sublabels-drag-handle sublabels-drag-handle-dummy">
                                                            <img src={dragIcon} className="sublabels-drag-icon" alt=""></img>
                                                        </div>
                                                        <input className="sublabels-list-input sublabels-list-input-dummy" maxLength={MAX_LABEL_CHARS} spellCheck="false" placeholder="Add Sub Label " disabled="true"></input>
                                                        <button className="sublabels-list-btn sublabels-list-btn-add">&#43;</button>
                                                    </div>

                                                </div>
                                            )}
                                        </Draggable>



        <li className="sublabels-list-item">
            <div className="sublabels-drag-handle">
                <img src="../img/dragIcon.svg" className="sublabels-drag-icon" alt=""></img>
            </div>
            <input className="sublabels-list-input" maxLength={MAX_LABEL_CHARS} spellCheck="false"></input>
            <button className="sublabels-list-btn sublabels-list-btn-delete">&times;</button>
        </li>
</div>
*/