import 'babel-polyfill';

import App from './components/App';
import React from 'react';
import ReactDOM from 'react-dom';

import { ApolloClient, createNetworkInterface, ApolloProvider } from 'react-apollo';
const networkInterface = createNetworkInterface({
  uri: 'http://' + window.location.hostname + ':3000/graphql'
});
const client = new ApolloClient({
  networkInterface: networkInterface
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
