import React from 'react';

export default class QuestionForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            urgency: 0,
            stage: 0
        };
    }

    render() {
        return (
            <div className="question">
                <form onSubmit={(event) => {event.preventDefault(); this.setState({stage: 1});}}>
                    {this.state.stage == 0
                        ? <input className="input" autoFocus type="text" placeholder="Write your own headline..." value={this.state.title} onChange={(event) => this.setState({title: event.target.value})}></input>
                        : <div>
                            <button className="hugeButton" onClick={() => this.props.onSubmit({title: this.state.title, urgency: 0})}>Day-Short</button>
                            <button className="hugeButton" onClick={() => this.props.onSubmit({title: this.state.title, urgency: 1})}>Week-Wide</button>
                            <button className="hugeButton" onClick={() => this.props.onSubmit({title: this.state.title, urgency: 2})}>Month-Deep</button>
                            <button className="hugeButton" onClick={() => this.props.onSubmit({title: this.state.title, urgency: 3})}>Year-Long</button>
                        </div>
                        }
                </form>
            </div>
        );
    }

}