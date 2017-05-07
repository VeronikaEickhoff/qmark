import React from 'react';

export default class Timeline extends React.Component{
    render() {
        return <div className="timeline">
            <div className="bounty">{this.props.myBounty ? `$${this.props.myBounty}/` : ''}${this.props.bounty}</div>
            <div className="author" style={{opacity: this.props.progress > 1 ? 1.0 : 0.3}}>{this.props.author}</div>
            {this.props.timeLeft > 0 ? <div className="timeLeft" style={{opacity: this.props.progress > 2 ? 1.0 : 0.3}}>{this.props.timeLeft} days</div> : ""}
            <div className="free" style={{opacity: this.props.progress >= 3 ? 1.0 : 0.3}}>Free</div>
        </div>
    }
}