import { useEffect } from "react";
import useUpdate from "../../hooks/useUpdate";
import { FieldProps } from "@/Fields";

const Slider = (props: FieldProps) => {
  const forceUpdate = useUpdate();
  useEffect(() => {
    props?.fieldCtx?.register(forceUpdate);
  }, []);
  
  return (
    <input
      type="range"
      min={props?.control?.props?.min ?? 0}
      max={props?.control?.props?.max ?? 100}
      value={props?.fieldCtx?.value ?? props?.control?.props?.defaultValue ?? 0}
      onChange={(e) => props?.fieldCtx?.onChange(Number(e.target.value))}
    />
  );
};

export default Slider;