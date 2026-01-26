import { BackendFactory, DragDropManager } from "@/typings";
import DragDropManagerImpl from "./classes/DragDropManagerImpl";
import DragDropMonitorImpl from "./classes/DragDropMonitorImpl";
import { legacy_createStore as createStore, Store } from "redux";
import { reduce, State } from "./reducers";
import HandlerRegistryImpl from "./classes/HandlerRegistryImpl";
// 创建拖拽管理
export function createDragDropManager(
  backendFactory: BackendFactory,
  globalContext: unknown = undefined,
  backendOptions: unknown = {},
  debugMode = false,
): DragDropManager {
  // redux store
  const store = makeStoreInstance(debugMode);

  const monitor = new DragDropMonitorImpl(
    store,
    new HandlerRegistryImpl(store),
  );
  const manager = new DragDropManagerImpl(store, monitor);
  const backend = backendFactory(manager, globalContext, backendOptions);
  manager.receiveBackend(backend);
  return manager;
}

function makeStoreInstance(debugMode?: boolean): Store<State> {
  const reduxDevTools =
    typeof window !== "undefined" &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__;

  return createStore(
    reduce,
    debugMode &&
      reduxDevTools &&
      reduxDevTools({ name: "dnd-core", instanceId: "dnd-core" }),
  );
}
