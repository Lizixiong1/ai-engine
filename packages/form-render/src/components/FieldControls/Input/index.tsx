import { FieldProps } from "@/core/Fields";
import useFieldBinding from "../useFieldBinding";
import ErrorMessage from "../ErrorMessage";
import { classnames } from "@/shared/util";

const Input = (props: FieldProps) => {
  const { value, onChange, validationResult, visible, context, ...otherProps } =
    useFieldBinding(props);

  console.log(otherProps);

  return visible ? (
    <>
      <input
        {...otherProps}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={classnames(
          "form-item-control-input",
          validationResult.isValid ? "" : "form-item-control-input-error",
          otherProps.className
        )}
      />
      <ErrorMessage errorMessage={validationResult.errorMessage} />
    </>
  ) : null;
};

export default Input;
