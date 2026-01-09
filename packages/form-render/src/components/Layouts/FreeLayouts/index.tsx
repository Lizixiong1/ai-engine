import { ReactNode, CSSProperties } from "react";
import { LayoutItemProps, LayoutProps } from "../index";

export interface FreeLayoutProps extends LayoutProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  itemProps?: FreeLayoutItemProps;
}

export interface FreeLayoutItemProps extends LayoutItemProps {
  children?: ReactNode;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  zIndex?: number;
  className?: string;
}
export const getDefaultFreeLayout = (): FreeLayoutProps => {
  return {
    type: "free_layout",
  };
};
const FreeLayouts = (props: FreeLayoutProps) => {
  const { children, width, height, className } = props;

  const containerStyle: CSSProperties = {
    position: "relative",
    width: width || "100%",
    height: height || "100%",
    overflow: "hidden",
  };

  return (
    <div style={containerStyle} className={className}>
      {children}
    </div>
  );
};

const LayoutItem = (props: FreeLayoutItemProps) => {
  const {
    children,
    x = 0,
    y = 0,
    width,
    height,
    zIndex,
    className,
    style,
  } = props;

  const itemStyle: CSSProperties = {
    ...style,
    position: "absolute",
    left: x,
    top: y,
    width: width,
    height: height,
    zIndex: zIndex,
  };

  return (
    <div style={itemStyle} className={className}>
      {children}
    </div>
  );
};

FreeLayouts.Item = LayoutItem;
export default FreeLayouts;
