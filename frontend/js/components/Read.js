import React from 'react';
import QuestionForm from './QuestionForm';
import SpecificQuestion from './SpecificQuestion';

import { graphql, gql, compose } from 'react-apollo';

const USER_ID = 1;

class Read extends React.Component {
    render() {
        let article = this.props.data.articleByRowId;
        let myRating = article && article.ratingsByArticleId.edges.find((rating) => rating.node.raterId == USER_ID);
        return article ? (
            <div>
                <h1>{article.title}</h1>
                {this.props.editable
                  ? <textarea onChange={(event) => this.props.edit({variables: {
                      id: article.rowId, body: event.target.value
                    }})}></textarea>
                  : <div>{article.body}</div>}
                <p>
                  {
                    myRating
                      ? [1, 2, 3, 4, 5].map((nStars) =>
                        <label key={nStars}><input type="radio" name="stars" value={nStars} checked={myRating ? myRating.node.rating == nStars : false}></input>{nStars}</label>
                      )
                      : [1, 2, 3, 4, 5].map((nStars) =>
                        <label key={nStars}><input type="radio" name="stars" value={nStars} checked={myRating ? myRating.node.rating == nStars : false}
                          onChange={(event) => this.props.rate({variables: {
                            id: article.rowId, raterId: USER_ID, rating: parseFloat(event.target.value)
                          }})}
                        ></input>{nStars}</label>
                      )
                  }
              </p>
            </div>) : <p>loading...</p>
            
    }
}

const ArticleQuery = gql`query ArticleQuery($id: Int!) {
  articleByRowId(rowId: $id) {
    rowId,
    title,
    body
    ratingsByArticleId {
      edges {
        node {
          raterId
          rating
        }
      }
    }
    userByAuthorId {
      username
    }
  }
}`;

const RateMutation = gql`mutation RateMutation($id: Int!, $raterId: Int!, $rating: Float!) {
  createRating(input: {rating: {articleId: $id, raterId: $raterId, rating: $rating}}) {
    rating {
      id
    }
  }
}`;

const EditArticleMutation = gql`mutation EditArticle($id: Int!, $body: String!) {
  updateArticleByRowId(input: {rowId: $id, articlePatch: {body: $body}}) {
    article {
      id
    }
  }
}`;


export default compose(
  graphql(RateMutation, { name: 'rate' }),
  graphql(EditArticleMutation, { name: 'edit' }),
)(graphql(ArticleQuery, {
  options: (props) => ({
    pollInterval: 500,
    variables: {id: props.id}
  })
})(Read));