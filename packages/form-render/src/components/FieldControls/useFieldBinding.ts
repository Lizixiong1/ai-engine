import { FieldProps } from "@/Fields";
import { ValidationResult } from "@/Fields/validator";
import useUpdate from "@/hooks/useUpdate";
import { useCallback, useEffect, useState } from "react";

export default function useFieldBinding(props: FieldProps) {
  const forceUpdate = useUpdate();
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
  });
  useEffect(() => {
    props.fieldCtx.register(forceUpdate);
  }, []);

  const onChange = useCallback((newValue: any) => {
    props.fieldCtx.onChange?.(newValue);
    validate(newValue);
  }, []);

  const validate = async (newValue: any) => {
    if (props.fieldCtx.validate) {
      const result = await props.fieldCtx.validate(newValue);
      setValidationResult(result);
    } else {
      setValidationResult({ isValid: true });
    }
  };

  return {
    value: props.fieldCtx.value ?? "",
    onChange,
    validationResult,
    visible: props.fieldCtx.visible,
  };
}
