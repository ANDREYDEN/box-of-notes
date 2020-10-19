import React from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import BoxCreate from './components/BoxCreate';

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route path="/box" component={BoxCreate}></Route>
          </Switch>

          <h1>Box of Notes</h1>
          <Link to="/box">Create Box</Link>
          <h2>Yours boxes:</h2>
          <ul>
            <li>Box1</li>
            <li>Box2</li>
          </ul>
        </div>
      </BrowserRouter>
    )
  }
}
