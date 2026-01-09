import { FieldProps } from "@/Fields";
import useUpdate from "@/hooks/useUpdate";
import { useCallback, useEffect } from "react";

export default function useFieldBinding(props: FieldProps) {
  const forceUpdate = useUpdate();
  useEffect(() => {
    props?.fieldCtx?.register(forceUpdate);
  }, []);

  const onChange = useCallback(
    (newValue: any) => {
      props?.fieldCtx?.onChange?.(newValue);
    },
    [props.fieldCtx]
  );
  return {
    value: props?.fieldCtx.value ?? "",
    onChange,
  };
}
