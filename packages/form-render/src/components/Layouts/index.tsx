import {  ComponentType, CSSProperties, ReactNode } from "react";

import FreeLayouts, {
  FreeLayoutItemProps,
  FreeLayoutProps,
} from "./FreeLayouts";
import GridLayouts, {
  GridLayoutsItemProps,
  GridLayoutsProps,
} from "./GridLayouts";

export interface LayoutProps {
  children?: ReactNode;
  type: "free_layout" | "grid_layout";
}

export interface LayoutItemProps {
  className?: string;
  style?: CSSProperties;
}
export interface LayoutsMapping {
  free_layout: ComponentType<FreeLayoutProps> & {
    Item: ComponentType<FreeLayoutItemProps>;
  };
  grid_layout: ComponentType<GridLayoutsProps> & {
    Item: ComponentType<GridLayoutsItemProps>;
  };
}
export const layoutsMapping: LayoutsMapping = {
  free_layout: FreeLayouts,
  grid_layout: GridLayouts,
};
export { FreeLayouts, GridLayouts };
