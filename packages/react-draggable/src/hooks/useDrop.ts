import { useDraggableContext } from "../context";

export interface DropOptions {}

type CreateFunc = () => any;

function useDrop(create) {
  const context = useDraggableContext();
  console.log(context);
  context.getMonitor();
  const instance = {};

  const drop = (el) => {
    // console.log(el);
  };
  return [instance, drop];
}

export default useDrop;
