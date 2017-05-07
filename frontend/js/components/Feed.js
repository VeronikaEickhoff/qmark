import React from 'react';
import QuestionForm from './QuestionForm';
import SpecificQuestion from './SpecificQuestion';

import { graphql, gql, compose } from 'react-apollo';

const USER_ID = 1;

class Feed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focusing: null
        }
    }

    render() {
        var questions = this.props.data.allQuestions ? this.props.data.allQuestions.edges.slice() : [];
        questions.reverse();
        return (
            <div className="container">
                {this.state.focusing
                    ? ""
                    : <QuestionForm onSubmit={(question) => {
                        console.log(question);
                        this.props.createQuestion({ variables: question }).then(res => {
                            console.log("res", res)
                            this.setState({focusing: res.data.createQuestion.question.id})
                        });
                    }} />
                }

                {questions.map(edge => {
                    return <div className="question" style={{
                        opacity: (!this.state.focusing || this.state.focusing === edge.node.id) ? 1.0 : 0.3,
                        order: (!this.state.focusing || this.state.focusing === edge.node.id) ? 0 : 1
                    }}>
                        <SpecificQuestion data={edge.node} showMyBounty={this.state.focusing === edge.node.id} showReading={true} setBounty={(amount) => {
                            this.props.setBounty({ variables: { questionId: edge.node.rowId, amount: amount } });
                            this.props.gotoSimilar(edge.node, amount);
                        }}/>
                    </div>
                })}

            </div>)
    }
}

const AllQuestionsQuery = gql`query AllQuestionsQuery {
  allQuestions(first:10, orderBy: PRIMARY_KEY_ASC) {
    edges {
      node {
        id,
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
    }
  }
}`;

const CreateQuestionMutation = gql`mutation CreateQuestionMutation($title: String!, $urgency: Int!) {
  createQuestion(input: {question: {title: $title, urgency: $urgency, authorId: ${USER_ID}}}) {
    question {
      id
      title
    }
  }
}`;

export const CreateBountyMutation = gql`mutation CreateBountyMutation($questionId: Int!, $amount: Float!) {
  createBounty(input: {bounty: {questionId: $questionId, amount: $amount, giverId: ${USER_ID}}}) {
    bounty {
      id
      amount
    }
  }
}`;

export default compose(
  graphql(CreateQuestionMutation, { name: 'createQuestion' }),
  graphql(CreateBountyMutation, { name: 'setBounty' }),
)(graphql(AllQuestionsQuery, {
  options: { pollInterval: 500 },
})(Feed));