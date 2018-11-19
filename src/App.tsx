import React, { Component } from "react";

import { createStore } from "redux";
import { useSelector, useAction, ReduxProvider } from "./lib";
import {
  countSelector,
  count2Selector,
  incrementAction,
  updateListAction,
  listSelector,
  rootReducer
} from "./state";



const Button = () => {
  const num = useSelector(countSelector);
  const num2 = useSelector(count2Selector);
  const onClick = useAction(incrementAction);
  console.log("rerendering button");
  return (
    <div>
      <button onClick={onClick}>{`button ${num}, count2: ${num2}`}</button>
    </div>
  );
};

const useList = () => useSelector(listSelector)


const List = () => {
  const list = useList()
  const onClick = useAction(updateListAction);
  console.log("rerendering list");
  return (
    <div>
      <button onClick={onClick}>{`update list`}</button>
      {list.map((_, ind) => (
        <div key={ind}>listItem</div>
      ))}
    </div>
  );
};

function StatelessList() {
  console.log("rerendering stateless list!!!!!!!, WHY?");

  return null;
}

class App extends Component {
  store = createStore(rootReducer);
  render() {
    return (
      <ReduxProvider store={this.store}>
        <div className="App">
          <Button />
          <List />
          <StatelessList />
        </div>
      </ReduxProvider>
    );
  }
}

export default App;
