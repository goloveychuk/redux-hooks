import { Selector } from "reselect";
import React, { useContext, useState, useEffect, useMemo } from "react";
import { Provider } from "react-redux";
import { Store, ActionCreator, Dispatch } from "redux";

const MyStoreContext = React.createContext<Store | null>(null);

function bindDispatch<T extends ActionCreator<any>>(
  fn: T,
  dispatch: Dispatch
): T {
  return (((...args: any[]) => dispatch((fn as any)(...args))) as any) as T;
}

export function createRedux(
  context: React.Context<Store | null> = MyStoreContext
) {
  function useSelector<S>(selector: Selector<any, S>) {
    const store = useContext(context)!;

    const [_, forceRerender] = useState(null);
    let curState = selector(store.getState());
    useEffect(
      () =>
        store.subscribe(() => {
          const newState = selector(store.getState());
          if (curState !== newState) {
            curState = newState;
            forceRerender(null);
          }
        }),
      []
    );
    return curState;
  }

  function useAction<T extends ActionCreator<any>>(action: T): T {
    const store = useContext(context)!;
    return useMemo(() => bindDispatch(action, store.dispatch), [action]);
  }

  const ReduxProvider: React.SFC<{ store: Store }> = ({ store, children }) => (
    <context.Provider value={store}>
      <Provider store={store}>{children}</Provider>
    </context.Provider>
  );

  return { useAction, useSelector, ReduxProvider };
}

const { useAction, useSelector, ReduxProvider } = createRedux();

export { useAction, useSelector, ReduxProvider };
