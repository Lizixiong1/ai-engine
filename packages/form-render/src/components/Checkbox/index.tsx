import { useEffect } from "react";
import useUpdate from "../../hooks/useUpdate";
import { FieldProps } from "@/Fields";

const Checkbox = (props: FieldProps) => {
  const forceUpdate = useUpdate();
  useEffect(() => {
    props?.fieldCtx?.register(forceUpdate);
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props?.fieldCtx?.onChange(e.target.checked);
  };

  return (
    <label>
      <input
        type="checkbox"
        checked={!!props?.fieldCtx?.value}
        onChange={handleChange}
      />
      {props?.control?.label}
    </label>
  );
};

export default Checkbox;