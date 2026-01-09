import { useEffect } from "react";
import useUpdate from "../../hooks/useUpdate";
import { FieldProps } from "@/Fields";

const Switch = (props: FieldProps) => {
  const forceUpdate = useUpdate();
  useEffect(() => {
    props?.fieldCtx?.register(forceUpdate);
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props?.fieldCtx?.onChange(e.target.checked);
  };

  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={!!props?.fieldCtx?.value}
        onChange={handleChange}
      />
      <span className="slider"></span>
    </label>
  );
};

export default Switch;