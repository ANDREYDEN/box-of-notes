import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { BoxCreate } from './components/BoxCreate';
import BoxPage from './components/BoxPage';
import { Home } from './components/Home';

import { history } from './history'
import { Urls } from './types/urls';

export const App: React.FC = () => {
  return (
    <Router history={history}>
      <div className="App">
        <Switch>
          <Route exact path={Urls.Home} component={Home} />
          <Route exact path={Urls.NewBox} component={BoxCreate} />
          <Route path='/box/:id' component={BoxPage} />
        </Switch>
      </div>
    </Router>
  )
}
