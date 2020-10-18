import React from 'react';

export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <h1>Box of Notes</h1>
        <button>Create Box</button>
        <h2>You boxes:</h2>
        <ul>
          <li>Box1</li>
          <li>Box2</li>
        </ul>
      </div>
    )
  }
}
