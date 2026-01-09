import { FieldProps } from "@/Fields";
import useFieldBinding from "../useFieldBinding";

const Input = (props: FieldProps) => {
  const { value, onChange } = useFieldBinding(props);

  return (
    <input value={value} onChange={(e) => onChange(e.target.value)}></input>
  );
};

export default Input;
