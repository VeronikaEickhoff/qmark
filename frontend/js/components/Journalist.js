import React from 'react';
import QuestionForm from './QuestionForm';
import SpecificQuestion from './SpecificQuestion';

import { graphql, gql, compose } from 'react-apollo';

const USER_ID = 1;

class Journalist extends React.Component {
    render() {
        var questions = this.props.data.allQuestions ? this.props.data.allQuestions.edges.slice() : [];
        questions.sort((a, b) => b.node.totalBounty - a.node.totalBounty);
        return (
            <div className="container">
                    {questions.map(edge => {
                        return <div className="question"><SpecificQuestion data={edge.node} showApplications={true} onApply={(questionId) =>
                            this.props.mutate({variables: {questionId, journalistId: USER_ID}})    
                        }/></div>
                    })}
            </div>)
    }
}

const AllQuestionsQuery = gql`query AllQuestionsQuery {
  allQuestions(first: 10) {
    edges {
      node {
        id,
        rowId,
        title,
        totalBounty,
        authorId,
        articleByResponseId {
            rowId,
            authorId,
            userByAuthorId{
                username
            },
            body
        },
        applications: applicationsByQuestionId {
          edges {
              node {
                  journalistId
              }
          }
        }
      }
    }
  }
}`;

const ApplyMutation = gql`mutation ApplyMutation($journalistId: Int!, $questionId: Int!) {
    createApplication(input: {application: {questionId: $questionId, journalistId: $journalistId}}) {
        application {
            id
        }
    }
}`;

export default 
graphql(ApplyMutation)(
graphql(AllQuestionsQuery, {
  options: { pollInterval: 200 },
})(Journalist));