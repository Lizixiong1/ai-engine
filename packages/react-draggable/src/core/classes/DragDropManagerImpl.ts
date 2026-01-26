import {
  Backend,
  DragDropManager,
  DragDropMonitor,
  HandlerRegistry,
} from "@/typings";
import type { Action, Store } from "redux";
import { State } from "../reducers";
class DragDropManagerImpl implements DragDropManager {
  private store: Store<State>;
  private monitor: DragDropMonitor;
  private backend: Backend | undefined;
  private isSetUp = false;
  constructor(store: Store<State>, monitor: DragDropMonitor) {
    this.store = store;
    this.monitor = monitor;
  }
  getMonitor(): DragDropMonitor {
    return this.monitor;
  }
  getBackend(): Backend {}
  getRegistry(): HandlerRegistry {}
  getActions(): DragDropActions {}
  dispatch(action: any): void {}

  receiveBackend(backend: Backend) {
    this.backend = backend;
  }
}

export default DragDropManagerImpl;
