import React from 'react';

class GridItemContent extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            content: null
        }
    }

    render() {

        return (
            <div id={this.props.id} className={`item ${this.props.active}`} onClick={this.props.eventClick}>
                <div className="item-content">
                    {this.state.content}
                </div>
            </div >
        );
    }
}

export default GridItemContent = React.memo(GridItemContent);