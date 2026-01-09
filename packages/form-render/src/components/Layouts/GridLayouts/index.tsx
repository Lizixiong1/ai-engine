import { ReactNode, CSSProperties } from "react";
import { LayoutItemProps, LayoutProps } from "../index";

export interface GridLayoutsProps extends LayoutProps {
  columns?: number;
  gap?: number | string;
  rowGap?: number | string;
  columnGap?: number | string;
  width?: number | string;
  height?: number | string;
  className?: string;
  itemProps?: GridLayoutsItemProps;
}

export interface GridLayoutsItemProps extends LayoutItemProps {
  children?: ReactNode;
  colSpan?: number;
  rowSpan?: number;
  area?: string;
}

export const getDefaultGridLayout = (): GridLayoutsProps => {
  return {
    type: "grid_layout",
  };
};
const GridLayouts = (props: GridLayoutsProps) => {
  const {
    children,
    columns = 12,
    gap = "16px",
    rowGap,
    columnGap,
    width,
    height,
    className,
  } = props;

  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap,
    ...(rowGap !== undefined && { rowGap }),
    ...(columnGap !== undefined && { columnGap }),
    width,
    height,
  };

  return (
    <div style={gridStyle} className={className}>
      {children}
    </div>
  );
};

const LayoutItem = (props: GridLayoutsItemProps) => {
  const { children, colSpan = 1, rowSpan = 1, area, className, style } = props;

  const itemStyle: CSSProperties = {
    ...(area
      ? { gridArea: area }
      : {
          gridColumn: `span ${colSpan}`,
          gridRow: `span ${rowSpan}`,
        }),
  };

  return (
    <div style={{ ...style, ...itemStyle }} className={className}>
      {children}
    </div>
  );
};

GridLayouts.Item = LayoutItem;
export default GridLayouts;
