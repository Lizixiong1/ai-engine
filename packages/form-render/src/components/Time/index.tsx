import { useEffect } from "react";
import useUpdate from "../../hooks/useUpdate";
import { FieldProps } from "@/Fields";

const Time = (props: FieldProps) => {
  const forceUpdate = useUpdate();
  useEffect(() => {
    props?.fieldCtx?.register(forceUpdate);
  }, []);
  
  return (
    <input
      type="time"
      value={props?.fieldCtx?.value ?? ""}
      onChange={(e) => props?.fieldCtx?.onChange(e.target.value)}
    />
  );
};

export default Time;