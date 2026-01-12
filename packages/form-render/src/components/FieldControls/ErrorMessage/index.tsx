import { ValidationResult } from "@/Fields/validator";
import { classnames } from "@/shared/util";
import { FC } from "react";

const ErrorMessage: FC<{ errorMessage: ValidationResult["errorMessage"] }> = ({
  errorMessage,
}) => {
  return errorMessage ? (
    <div className={classnames("form-item-explain-error")}>{errorMessage}</div>
  ) : null;
};

export default ErrorMessage;
