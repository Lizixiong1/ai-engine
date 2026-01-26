import { Store } from "redux";
import { State } from "../reducers/dirtyHandlerIds";

class HandlerRegistryImpl {
  private store: Store<State>;
  constructor(store: Store<State>) {
    this.store = store;
  }
}

export default HandlerRegistryImpl;
