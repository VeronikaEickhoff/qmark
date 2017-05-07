import React from 'react';
import Feed from './Feed';
import Similar from './Similar';
import Journalist from './Journalist';
import Read from './Read';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: window.location.hash,
      articleId: 1
    };
  }

  render() {
    console.log(this.state);
    if (this.state.page === "#feed") {
      return <Feed gotoSimilar={(target, amount) => {
        this.setState({page: "#similar", target: target, amount: amount})}
      }/>;
    } else if (this.state.page === "#similar") {
      return <Similar target={this.state.target} amount={this.state.amount} gotoFeed={() =>
        this.setState({page: "#feed"})
      }/>;
    } else if (this.state.page === "#journalist") {
      return <Journalist />;
    } else if (this.state.page === "#read") {
      return <Read id={this.state.articleId}/>
    }
  }
}

