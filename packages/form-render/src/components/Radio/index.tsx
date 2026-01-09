import { useEffect } from "react";
import useUpdate from "../../hooks/useUpdate";
import { FieldProps } from "@/Fields";

const Radio = (props: FieldProps) => {
  const forceUpdate = useUpdate();
  useEffect(() => {
    props?.fieldCtx?.register(forceUpdate);
  }, []);
  
  const options = props?.control?.options || [];
  const optionList = Array.isArray(options) ? options : [];

  const handleChange = (value: any) => {
    props?.fieldCtx?.onChange(value);
  };

  return (
    <div>
      {optionList.map((option, index) => (
        <label key={index}>
          <input
            type="radio"
            name={props?.fieldCtx?.fieldName}
            checked={props?.fieldCtx?.value === option.value}
            onChange={() => handleChange(option.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default Radio;