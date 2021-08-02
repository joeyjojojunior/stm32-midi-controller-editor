import React from 'react';
import { MAX_LABEL_CHARS } from '../utils/globals';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import dragIcon from '../img/dragIcon.svg'

class SubLabels extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [{ id: "item0", content: "item 0" }, { id: "item1", content: "item 1" }]
        };
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

    render() {
        return (
            <div className="sublabels">
                <div className="sublabels-label">Sub Labels</div>

                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {this.state.items.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
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
                                                    <input className="sublabels-list-input" maxLength={MAX_LABEL_CHARS} spellCheck="false"></input>
                                                    <button className="sublabels-list-btn sublabels-list-btn-delete">&times;</button>
                                                </div>

                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        );
    }
}

export default SubLabels;

/*
        <li className="sublabels-list-item">
            <div className="sublabels-drag-handle">
                <img src="../img/dragIcon.svg" className="sublabels-drag-icon" alt=""></img>
            </div>
            <input className="sublabels-list-input" maxLength={MAX_LABEL_CHARS} spellCheck="false"></input>
            <button className="sublabels-list-btn sublabels-list-btn-delete">&times;</button>
        </li>
</div>
*/