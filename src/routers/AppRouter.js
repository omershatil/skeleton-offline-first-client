import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { App } from '../components/App';
import { NotFound } from '../components/NotFound';
import { HOME_PAGE } from '../utils/constants';

/**
 * Application router.
 * Note that we test for session first. If no session, go to login page.
 */
export class AppRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rerender: false
    }
  }

  /**
   * Handler for logging out. Simply cause a re-render.
   * The router will redirect to the login page.
   * @param event
   */
  onClickLogout = (event) => {
    event.preventDefault();
    this.setState(() => ({ rerender: true }));
  };

  /**
   * Application routing happens here.
   * @returns {*}
   */
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path={HOME_PAGE} component={() => (
            <App onClickLogout={this.onClickLogout} path={HOME_PAGE} />
          )}/>
          <Route component={NotFound}/>
        </Switch>
      </BrowserRouter>
    )
  }
}

