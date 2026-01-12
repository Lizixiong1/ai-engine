import { FieldProps } from "@/Fields";
import useFieldBinding from "../useFieldBinding";
import ErrorMessage from "../ErrorMessage";

const Textarea = (props: FieldProps) => {
  const { value, onChange, validationResult } = useFieldBinding(props);

  return (
    <>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={props?.control?.placeholder}
      />
      <ErrorMessage errorMessage={validationResult.errorMessage} />
    </>
  );
};

export default Textarea;
