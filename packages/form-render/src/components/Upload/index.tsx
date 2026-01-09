import { useEffect } from "react";
import useUpdate from "../../hooks/useUpdate";
import { FieldProps } from "@/Fields";

const Upload = (props: FieldProps) => {
  const forceUpdate = useUpdate();
  useEffect(() => {
    props?.fieldCtx?.register(forceUpdate);
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      props?.fieldCtx?.onChange(files[0]);
    }
  };

  return (
    <input
      type="file"
      onChange={handleChange}
      accept={props?.control?.props?.accept}
    />
  );
};

export default Upload;