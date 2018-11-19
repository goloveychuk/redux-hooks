import { combineReducers, AnyAction } from "redux";

interface ListState {
  list: {}[];
}

interface CountState {
  count: number;
  count2: number;
}

interface AppState {
  list: ListState;
  count: CountState;
}

function countReducer(
  state: CountState = { count: 13, count2: 3 },
  action: AnyAction
): CountState {
  switch (action.type) {
    case "INCREMENT":
      return {
        ...state,
        count: state.count + 1,
        count2: state.count2 + 1
      };
    default:
      return state;
  }
}

function listReducer(state: ListState = { list: [] }, action: any): ListState {
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

export const rootReducer = combineReducers({
  list: listReducer,
  count: countReducer
});

export function countSelector(state: AppState) {
  return state.count.count;
}

export function count2Selector(state: AppState) {
  return state.count.count2;
}

export function listSelector(state: AppState) {
  return state.list.list;
}

export function incrementAction() {
  return {
    type: "INCREMENT"
  };
}

export function updateListAction() {
  return {
    type: "UPDATE_LIST"
  };
}
