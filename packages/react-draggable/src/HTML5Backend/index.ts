import {
  Backend,
  BackendFactory,
  DragDropManager,
  Unsubscribe,
} from "@/typings/index.ts";
export type HTML5BackendContext = Window | undefined;

export interface HTML5BackendOptions {
  rootElement: Node;
}

class HTML5BackendImpl implements Backend {
  constructor(
    manager: DragDropManager,
    context?: HTML5BackendContext,
    options?: HTML5BackendOptions,
  ) {
    // this.options = new OptionsReader(globalContext, options);
    // this.actions = manager.getActions();
    // this.monitor = manager.getMonitor();
    // this.registry = manager.getRegistry();
    // this.enterLeaveCounter = new EnterLeaveCounter(this.isNodeInDocument);
  }
  setup(): void {}
  teardown(): void {}
  connectDragSource(sourceId: any, node?: any, options?: any): Unsubscribe {
    return () => {};
  }
  connectDragPreview(sourceId: any, node?: any, options?: any): Unsubscribe {
    return () => {};
  }
  connectDropTarget(targetId: any, node?: any, options?: any): Unsubscribe {
    return () => {};
  }
  profile(): Record<string, number> {
    return {};
  }
}

const HTML5Backend: BackendFactory = function createBackend(
  manager: DragDropManager,
  context?: HTML5BackendContext,
  options?: HTML5BackendOptions,
): HTML5BackendImpl {
  return new HTML5BackendImpl(manager, context, options);
};

export default HTML5Backend;
