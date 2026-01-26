import { Action } from "@/typings";

export interface State extends Array<string> {
  dirtyHandlerIds: DirtyHandlerIdsState;
  dragOffset: DragOffsetState;
  refCount: RefCountState;
  dragOperation: DragOperationState;
  stateId: StateIdState;
}

export function reduce(state: State = {} as State, action: Action<any>): State {
  const newState = {
    // dirtyHandlerIds: dirtyHandlerIds(state.dirtyHandlerIds, {
    //   type: action.type,
    //   payload: {
    //     ...action.payload,
    //     prevTargetIds: get<string[]>(state, "dragOperation.targetIds", []),
    //   },
    // }),
    dirtyHandlerIds: [],
    // dragOffset: dragOffset(state.dragOffset, action),
    dragOffset: [],
    // refCount: refCount(state.refCount, action),
    refCount: 0,
    // dragOperation: dragOperation(state.dragOperation, action),
    dragOperation: 0,
    // stateId: stateId(state.stateId),
    stateId: "",
  } as State;
  return newState;
}
