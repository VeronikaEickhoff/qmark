import React from 'react';
import {SpecificQuestionWithData} from './SpecificQuestion';
import superagent from 'superagent';

import { graphql, gql, compose } from 'react-apollo';

import {CreateBountyMutation} from './Feed';


class Similar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { similar_ids: [] };
    }

    fetchSimilar() {
        console.log("fetching...")
        superagent.get(`http://${window.location.hostname}:3000/similar/`)
            .query({ q: this.props.target.title })
            .set('Accept', 'application/json')
            .end((err, res) => {
                console.log(err, res);
                this.setState({
                    similar_ids: JSON.parse(res.text).ids
                        .map((id) => parseInt(id, 10))
                });
            });
    }

    componentDidUpdate() {
        (!this.state.similar_ids || (this.state.similar_ids.length == 0)) && this.fetchSimilar();
    }

    componentDidMount() {
        (!this.state.similar_ids || (this.state.similar_ids.length == 0)) && this.fetchSimilar();
    }

    render() {
        return <div className="container">
                <div className="question"><SpecificQuestionWithData id={this.props.target.rowId} showMerge={`Create for $${this.props.amount}`} onMerge={() =>
                    this.props.gotoFeed()
                }/></div>
                {(this.state.similar_ids || [])
                    .filter((id) => id != this.props.target.rowId)
                    .map((id) =>
                    <div className="question"><SpecificQuestionWithData key={"similar" + id} id={id} showMerge={`Join for $${this.props.amount}`} onMerge={(id) => {
                        console.log("merge", id, this.props.target.rowId);
                        this.props.createBounty({variables: {questionId: id, amount: this.props.amount}});
                        this.props.deleteQuestion({variables: {id: this.props.target.rowId}});
                        this.props.gotoFeed();
                    }}/></div>
                )}
        </div>
    }
}

const DeleteQuestionMutation = gql`
    mutation ($id: Int!) {
        deleteQuestionByRowId(input: {rowId: $id}) {
            deletedQuestionId
        }
    }
`;

export default compose(
  graphql(CreateBountyMutation, { name: 'createBounty' }),
  graphql(DeleteQuestionMutation, { name: 'deleteQuestion' }),
)(Similar);