import { useEffect } from "react";
import useUpdate from "../../hooks/useUpdate";
import { FieldProps } from "@/Fields";

const Date = (props: FieldProps) => {
  const forceUpdate = useUpdate();
  useEffect(() => {
    props?.fieldCtx?.register(forceUpdate);
  }, []);
  
  return (
    <input
      type="date"
      value={props?.fieldCtx?.value ?? ""}
      onChange={(e) => props?.fieldCtx?.onChange(e.target.value)}
    />
  );
};

export default Date;