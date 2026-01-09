import { useEffect } from "react";
import useUpdate from "../../hooks/useUpdate";
import { FieldProps } from "@/Fields";

const Custom = (props: FieldProps) => {
  const forceUpdate = useUpdate();
  useEffect(() => {
    props?.fieldCtx?.register(forceUpdate);
  }, []);

  // Custom 组件可以通过 customRender 属性来自定义渲染
  const customRender = props?.control?.customRender;
  if (customRender) {
    return customRender(props);
  }

  return (
    <div>
      <p>自定义组件区域</p>
    </div>
  );
};

export default Custom;
