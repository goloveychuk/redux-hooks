import 'react-redux'
import {Store} from 'redux'
declare module "react-redux" {
    const ReactReduxContext: React.Context<{store: Store<unknown>, storeState: unknown}>
}