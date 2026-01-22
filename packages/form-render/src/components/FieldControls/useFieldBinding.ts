import { FieldProps } from "@/core/Fields";
import { ValidationResult } from "@/core/Fields/validator";
import useUpdate from "@/hooks/useUpdate";
import { useCallback, useEffect, useState } from "react";

export default function useFieldBinding(props: FieldProps) {
  const { fieldCtx, ...otherProps } = props;
  const forceUpdate = useUpdate();
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
  });
  useEffect(() => {
    fieldCtx.register(forceUpdate);
  }, []);

  const onChange = useCallback((newValue: any) => {
    fieldCtx.onChange?.(newValue);
    validate(newValue);
  }, []);

  const validate = async (newValue: any) => {
    if (fieldCtx.validate) {
      const result = await fieldCtx.validate(newValue);
      setValidationResult(result);
    } else {
      setValidationResult({ isValid: true });
    }
  };

  return {
    value: fieldCtx.value ?? "",
    onChange,
    validationResult,
    visible: fieldCtx.visible,
    ...otherProps,
  };
}
