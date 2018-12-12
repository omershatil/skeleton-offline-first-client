import './styles/index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import {ApolloProvider} from 'react-apollo';
import {Provider} from 'react-redux';
import * as serviceWorker from './serviceWorker';

import {AppRouter} from './routers/AppRouter';

import {store, apolloClient} from './store/configureStore';

/**
 * Rendering entry point. Render the router.
 * The Provider will pass the store to all the components automatically.
 * The ApolloProvider wraps all the components so it can inject the client, which is used in <Query>
 * elements in react Components downstream.
 */
const renderApp = () => {
  const jsx = (
    <Provider store={store}>
      <ApolloProvider client={apolloClient}>
        <AppRouter/>
      </ApolloProvider>
    </Provider>
  );
  ReactDOM.render(jsx, document.getElementById('root'));
};
/**
 * Wait for a signal from redux-offline that the the store has rehydrated and
 * only then start rendering. Otherwise we may lose GET requests called when
 * components are initially rendered.
 */
export const onReduxStoreRehydrated = () => {
  renderApp();
};
// Put a temporary message on the screen so the user knows the app is loading.
// It will go away after rehydration
ReactDOM.render(
  <p>Welcome! Loading...</p>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
