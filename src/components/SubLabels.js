import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import SubLabel from './SubLabel';
import SubLabelAdd from './SubLabelAdd';

const NUM_ROWS_PER_COL = 12;

class SubLabels extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { items: [], activeSettingsID: this.props.activeSettingsID }
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    componentDidMount() {
        this.initItems();
    }

    componentDidUpdate() {
        const preset = this.props.preset.get(this.props.activeSettingsID);
        if (preset === undefined) return

        if (this.props.activeSettingsID !== this.state.activeSettingsID || this.labelsChanged()) {
            this.initItems();
        }
    }

    initItems() {
        const preset = this.props.preset.get(this.props.activeSettingsID);
        if (preset === undefined) return;

        const items = [];
        const subLabels = preset.subLabels;
        for (const [uuid, subLabel] of subLabels) {
            items.push({ id: uuid, content: subLabel });
        }
        this.setState({ items: items, activeSettingsID: this.props.activeSettingsID })
    }

    labelsChanged() {
        const preset = this.props.preset.get(this.props.activeSettingsID);
        const subLabels = preset.subLabels;

        if (subLabels.size !== this.state.items.length)
            return true;

        let isLabelsChanged = false;
        for (let i = 0; i < this.state.items.length; i++) {
            if (subLabels.get(this.state.items[i].id) !== this.state.items[i].content) {
                isLabelsChanged = true;
            }
        }
        return isLabelsChanged;
    }

    onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) return;

        const items = this.reorder(
            this.state.items,
            result.source.index,
            result.destination.index
        );
        this.props.eventOrderSubLabels(items);

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
                item.content !== item.id ? (
                    <SubLabel
                        slID={item.id}
                        btnID={item.id}
                        content={this.state.items[i].content}
                        eventInputChanged={this.props.eventInputChanged}
                        eventDeleteSubLabel={this.props.eventDeleteSubLabel}
                    ></SubLabel>
                ) : (
                    <SubLabelAdd
                        slID={item.id}
                        btnID={item.id}
                        eventAddSubLabel={this.props.eventAddSubLabel}
                    ></SubLabelAdd>
                );
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