import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import BoxCreate from './components/BoxCreate';
import Home from './components/Home';

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/box" component={BoxCreate} />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}
