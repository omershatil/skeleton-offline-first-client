import {createStore, compose, combineReducers} from 'redux';
import {offline} from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import localForage from 'localforage';

import {onReduxStoreRehydrated} from '../index';
import {callBackendServer} from '../utils/serverAPI';
import {apolloReducer} from 'apollo-cache-redux';
import {ReduxCache} from 'apollo-cache-redux/lib/index';
import ApolloClient from 'apollo-client/index';
import {HttpLink} from 'apollo-link-http/lib/index';

// custom config for redux-offline
const defaultQueue = offlineConfig.queue;
const customConfig = {
  ...offlineConfig,
  // pass a callback to persist so we can gate rendering till store is rehydrated
  persistCallback: () => {
    onReduxStoreRehydrated();
  },
  // call axios w/the passed in parameters and the current token
  effect: (effect) => callBackendServer(effect),
  // Last Value Queue. Only keep the last action for each GET URL-method pair.
  // Avoid redundancy caused by each new page render that results in a new GET.
  queue: {
    ...defaultQueue,
    enqueue(array, action) {
      try {
        const actionUrl = action.meta.offline.effect.url;
        const actionMethod = action.meta.offline.effect.method;
        const newArray = array.filter((item) => {
          const itemUrl = item.meta.offline.effect.url;
          const itemMethod = item.meta.offline.effect.method;
          // reject duplicates
          return !(itemMethod === 'GET' && itemMethod === actionMethod && itemUrl === actionUrl);
        });
        // after we filtered out all identical actions, got to push one back in.
        newArray.push(action);
        return newArray;
      } catch (err) {
        // if something went wrong with the above, default to original queue
        console.log('failed overriding offline enqueue', err.message);
        return array;
      }
    }
  },
  // override redux-persist defaults: use localForage b/c it's recommended
  // for web apps and b/c localStorage can't store all our data.
  persistOptions: {
    storage: localForage
  }
};

// allow debugging redux in the browser, if in development mode
let composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// define reducers
const appReducers = combineReducers({});
const uiReducers = combineReducers({});
// Store Creation
const configureStore = () => {
  return createStore(
    combineReducers({
      // we combine all our custom reduces w/the apollo client reducer.
      apollo: apolloReducer,
      app: appReducers,
      ui: uiReducers
    }),
    composeEnhancers(
      offline(customConfig)
    )
  );
};

// store and apollo client configuration
export const store = configureStore();
// create the graphql client and pass it the store we created manually so we and redux-offline have control over it.
// NOTE: auth.getToken() will get called for every graphql query, and so a call to graphql will fail if there's no
// authenticated user logged in, as it should.
export const apolloClient = new ApolloClient({
  link: new HttpLink({uri: process.env.REACT_APP_BACKEND_SERVER_GRAPHQL_URL}),
  cache: new ReduxCache({store})
});
