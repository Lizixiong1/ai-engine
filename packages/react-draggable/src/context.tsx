import { BackendFactory, DragDropManager } from "@/typings";
import { createContext, FC, ReactNode, useContext } from "react";
import { createDragDropManager } from "./core";

export interface DraggableProviderProps {
  value: BackendFactory;
  children?: ReactNode;
}

export const DraggableContext = createContext<DragDropManager | null>(null);
export const DraggableProvider: FC<DraggableProviderProps> = ({
  value,
  children,
}) => {
  const manager = createDragDropManager(value);

  return (
    <DraggableContext.Provider value={manager}>
      {children}
    </DraggableContext.Provider>
  );
};

export const useDraggableContext = () => {
  const context = useContext(DraggableContext);

  if (!context) {
    throw new Error(`未找到provider上下文`);
  }

  return context;
};
