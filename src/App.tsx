import React, {
  Component,
  useContext,
  useMemo,
  useState,
  useEffect
} from "react";
import { ReactReduxContext, Provider } from "react-redux";
import { Selector } from "reselect";
import { combineReducers, AnyAction,Dispatch, ActionCreator, Store } from "redux";

import { createStore } from "redux";

// function useSelectorOld<S>(selector: Selector<AppState, S>) {
//   const state = useContext(ReactReduxContext).storeState as AppState;

//   const val = selector(state);
//   return val;
// }


// function useActionOld<T extends ActionCreator<any>>(action: T): T {
//   const store = useContext(ReactReduxContext).store;
//   return bindDispatch(action, store.dispatch)
// }


function useSelector<S>(selector: Selector<AppState, S>) {
  const store = useContext(MyStoreContext)!

  const [compState, setCompState] = useState(()=>selector(store.getState()));
  let prevState = compState
  useEffect(
    () => {
      console.log('calling subscribe')
      return store.subscribe(() => {
        const newState = selector(store.getState());
        if (prevState !== newState) {
          // debugger;
          console.log('setting new state')
          prevState = newState
          setCompState(newState);
        }
      })},
    []
  );
  return compState;
}

export function bindDispatch<T extends ActionCreator<any>>(
  fn: T,
  dispatch: Dispatch,
): T {
  return (((...args: any[]) => dispatch((fn as any)(...args))) as any) as T;
}


function useAction<T extends ActionCreator<any>>(action: T): T {
  const store = useContext(MyStoreContext)!
  // const [compState, setCompState] = useState(()=>selector(store.getState()));
  return bindDispatch(action, store.dispatch)
}

////////////////////////////////////////////////////////////////////////////////////

interface CardsState {
  list: {}[];
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

function cardsReducer(
  state: CardsState = { list: [] },
  action: any
): CardsState {
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
  // debugger;
  const num = useSelector(countSelector);
  const onClick = useAction(incrementAction);
  console.log("rerendering button");
  return (
    <div>
      <button onClick={onClick}>{`button ${num}`}</button>
    </div>
  );
};

const List = () => {
  // const num = useSelector(countSelector);
  const onClick = useAction(updateList);
  console.log("rerendering list");
  return (
    <div>
      <button onClick={onClick}>{`update list`}</button>
    </div>
  );
};

function StatelessList() {
  console.log("rerendering stateless list!!!!!!!, WHY?");

  return null;
}
const MyStoreContext = React.createContext<Store | null>(null)

class App extends Component {
  store = createStore(rootReducer);
  render() {
    return (
      <MyStoreContext.Provider value={this.store}>
      <Provider store={this.store}>
        <div className="App">
          <Button />
          <List />
          <StatelessList />
        </div>
      </Provider>
      </MyStoreContext.Provider>
    );
  }
}

export default App;
