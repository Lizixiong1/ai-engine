import { useEffect } from "react";
import useUpdate from "../../hooks/useUpdate";
import { FieldProps } from "@/Fields";

const Select = (props: FieldProps) => {
  const forceUpdate = useUpdate();
  useEffect(() => {
    props?.fieldCtx?.register(forceUpdate);
  }, []);
  
  const options = props?.control?.options || [];
  const optionList = Array.isArray(options) ? options : [];

  return (
    <select
      value={props?.fieldCtx?.value ?? ""}
      onChange={(e) => props?.fieldCtx?.onChange(e.target.value)}
    >
      <option value="">请选择</option>
      {optionList.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;