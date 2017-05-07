import React from 'react';
import { graphql, gql, compose } from 'react-apollo';

import superagent from 'superagent';

import Timeline from './Timeline';

const USER_ID = 1;

export default class SpecificQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {flickrImg: null};
    }

    fetchPicture() {
        if (!this.state.flickrImg && this.props.data) {
            // superagent.get(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=7c16845b11cf78f1c92fc825345df211&text=garden&per_page=1&format=json&nojsoncallback=1&api_sig=1114f91ef2e2aa1787a9b225a552cfbf`)
            //     .set('Accept', 'application/json')
            //     .end((err, res) => {
            //         console.log(err, res);
            //         let photo = res.body.photos.photo[0];
            //         this.setState({flickrImg: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_z.jpg`});
            //     });
        }
    }

    componentDidUpdate() {
        this.fetchPicture()
    }

    componentDidMount() {
        this.fetchPicture()
    }

    render() {
        console.log(this.props);
        var progress = 1;
        if (this.props.data) {
            var bountyPart;
            if (this.props.showMyBounty && this.props.data.myBounty) {
                let my_bounty = this.props.data.myBounty.edges[0] ? this.props.data.myBounty.edges[0].node.amount : 0;
                bountyPart = <div>
                        {my_bounty ? "" : [1, 3, 10, "..."].map((amount) =>
                        <button className="hugeButton" key={amount} onClick={() => this.props.setBounty(amount)}>${amount}</button>)}
                    </div>;
            }
            var applicationPart;
            if (this.props.showApplications) {
                var selfApplied = false;
                var nOthers = 0;

                for (var edge of this.props.data.applications.edges) {
                    if (edge.node.journalistId == USER_ID) {
                        selfApplied = true;
                    } else {
                        nOthers++;
                    }
                }

                let response = this.props.data.articleByResponseId;

                applicationPart = <div>
                    <p>{selfApplied ? "You and" : ""} {nOthers} other Journalists applied.</p>
                    <p>{response
                        ? (response.body && response.body.length > 0
                            ? "Already written!"
                            : (response.authorId == USER_ID
                               ? <button onClick={() => this.props.onWrite(this.props.data.rowId)}>Write Article</button>
                               : "Being written by someone else"))
                        : <button onClick={() => this.props.onApply(this.props.data.rowId)}>Apply</button>}</p>
                </div>
            }
            var readingPart;
            if (this.props.showReading) {
                let response = this.props.data.articleByResponseId;
                applicationPart = <p>{response
                        ? (response.body && response.body.length > 0
                            ? <button onClick={() => this.props.onRead(this.props.data.rowId)}>Read Now</button>
                            : "")
                        : ""}</p>

            }

            let response = this.props.data.articleByResponseId;
            var author;

            if (response) {
                if (response.body && response.body.length > 0) {
                    author = response.userByAuthorId.username;
                    progress = 3;
                } else {
                    author = response.userByAuthorId.username + " 📝"
                    progress = 2;
                }
            } else {
                author = "???";
                progress = 1;
            }
            return (
            <div>
                <h1>{this.props.data.title}</h1>
                {bountyPart || ""}
                {applicationPart || ""}
                {this.props.showMerge
                    ? <button className="hugeButton single" onClick={() => this.props.onMerge(this.props.data.rowId)}>{this.props.showMerge}</button>
                    : ""
                }
                <Timeline
                    progress={progress}
                    myBounty={(this.props.data.myBounty && this.props.data.myBounty.edges[0]) ? this.props.data.myBounty.edges[0].node.amount : 0}
                    bounty={this.props.data.totalBounty || 0} author={author} timeLeft={7}/> 
                <div className="bg" style={{backgroundImage: `url(http://lorempixel.com/400/200/city?${this.props.data.rowId})`}}></div>
            </div>);
        } else {
            return <p>loading...</p>
        }
    }
}

const QuestionQuery = gql`query QuestionQuery($id: Int!) {
    questionByRowId(rowId: $id) {
        rowId,
        title,
        totalBounty,
        authorId,
        articleByResponseId {
            rowId,
            userByAuthorId{
                username
            },
            body
        },
        myBounty: bountiesByQuestionId(condition: {giverId: ${USER_ID}}) {
          edges {
            node {
              rowId
              amount
            }
          }
        }
    }
}`;

export const SpecificQuestionWithData = graphql(QuestionQuery, {
    options: (props) => ({
        variables: {id: props.id},
        pollInterval: 500,
    }),
    props: (pr) => Object.assign({}, pr, {data: pr.data.questionByRowId})
})(SpecificQuestion);