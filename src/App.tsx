import React, { Component, useContext, useMemo } from "react";
import { ReactReduxContext, Provider } from "react-redux";
import { Selector } from "reselect";
import { combineReducers, AnyAction } from "redux";

import { createStore } from "redux";






function useSelector<S>(selector: Selector<AppState, S>) {
  const state = useContext(ReactReduxContext).storeState as AppState;
  const val = selector(state);
  return val;
}

function useAction<T>(action: T): T {
  const store = useContext(ReactReduxContext).store
  //@ts-ignore
  return (...args) => store.dispatch(action(...args))
}


////////////////////////////////////////////////////////////////////////////////////

interface CardsState {
  list: {}[]
}

interface CountState {
  count: number;
}

interface AppState {
  cards: CardsState;
  count: CountState;
}

function countSelector(state: AppState) {
  return state.count.count;
}

function incrementAction() {
  return {
    type: "INCREMENT"
  };
}

function updateList() {
  return {
    type: "UPDATE_LIST"
  };
}

function countReducer(
  state: CountState = { count: 13 },
  action: AnyAction
): CountState {
  switch (action.type) {
    case "INCREMENT":
      return {
        ...state,
        count: state.count + 1
      };
    default:
      return state;
  }
}

function cardsReducer(state: CardsState = {list: []}, action: any): CardsState {
  switch (action.type) {
    case "UPDATE_LIST":
      return {
        ...state,
        list: [...state.list, {}]
      };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  cards: cardsReducer,
  count: countReducer
});


////////////////////////////////////////////////////////////////////////////////////////


const Button = () => {
  const num = useSelector(countSelector);
  const onClick = useAction(incrementAction)
  console.log('rerendering button')
  return (
    <div>
      <button
        onClick={onClick}
      >{`button ${num}`}</button>
    </div>
  );
};

const List = () => {
  // const num = useSelector(countSelector);
  const onClick = useAction(updateList)
  console.log('rerendering list')
  return (
    <div>
      <button
        onClick={onClick}
      >{`update list`}
      </button>
    </div>
  );
};


class App extends Component {
  store = createStore(rootReducer);

  render() {

    return (
      <Provider store={this.store}>
        <div className="App">
          <Button />
          <List />
        </div>
      </Provider>
    );
  }
}

export default App;
