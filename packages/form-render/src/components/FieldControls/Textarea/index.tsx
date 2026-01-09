import { FieldProps } from "@/Fields";
import useFieldBinding from "../useFieldBinding";

const Textarea = (props: FieldProps) => {
  const { value, onChange } = useFieldBinding(props);

  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={props?.control?.placeholder}
    />
  );
};

export default Textarea;
