import { FieldProps } from "@/Fields";
import useFieldBinding from "../useFieldBinding";
import ErrorMessage from "../ErrorMessage";
import { classnames } from "@/shared/util";

const Input = (props: FieldProps) => {
  const { className } = props;
  const { value, onChange, validationResult, visible } = useFieldBinding(props);

  return visible ? (
    <>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={classnames(
          "form-item-control-input",
          validationResult.isValid ? "" : "form-item-control-input-error",
          className
        )}
      />
      <ErrorMessage errorMessage={validationResult.errorMessage} />
    </>
  ) : null;
};

export default Input;
