import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { BoxCreate } from './components/BoxCreate';
import { Home } from './components/Home';

import { history } from './history'
import { Urls } from './types/urls';

export const App: React.FC = () => {
  return (
    <Router history={history}>
      <div className="App">
        <Switch>
          <Route exact path={Urls.NewBox} component={Home} />
          <Route path={Urls.NewBox} component={BoxCreate} />
        </Switch>
      </div>
    </Router>
  )
}
