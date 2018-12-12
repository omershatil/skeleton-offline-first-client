import NetworkError from '@redux-offline/redux-offline/lib/defaults/effect';

import {apolloClient} from '../store/configureStore';

/**
 * Handle gql errors thrown due to various reasons.
 * Map those to redux-offline NetworkError, so that they are handled correctly.
 * Attempt to set some kind of status. If no status is set, the request
 * will be dropped by redux offline. Default to 500, which means request
 * will be retried. 4xx means it will be dropped.
 * @param error -- The gql error to be converted to Redux Offline error.
 */
const translateToOfflineErrors = (error) => {
  // default to 500, so that the request will get retried
  let status = 500;
  if (error.graphQLErrors && error.graphQLErrors.length && !error.networkError) {
    // a grapql error probably b/c the query was bad (dev error) set to 400, which means it will get discarded.
    status = 400;
  }
  console.log(`Error: ${error.message}, Status: ${status}`);
  throw new NetworkError(error, status);
};
/**
 * Calls the backend server.
 * Often used by redux-offline 'effect' method, but can also be used outside
 * of the store, if needed.
 * Will get retried by redux-offline as per the plan applied.
 * @param params -- The parameters for the API.
 */
export const callBackendServer = (params) => {
  const query = params.query;
  // NOTE: default to network-only, which bypasses the cache but persists the results for
  // later queries by each component render
  const fetchPolicy = params.fetchPolicy && 'network-only';
  // enable polling on interval. 0, the default, means no polling
  const pollInterval = params.pollInterval ? Number(params.pollInterval) : 0;
  const variables = params.variables ? params.variables : {};
  return apolloClient.query({query, fetchPolicy, pollInterval, variables})
    .then(res => {
      console.log('graphql query results: ', res.data);
    })
    .catch(res => {
      console.log('graphql query failure: ', res);
      translateToOfflineErrors(res);
    });
};
