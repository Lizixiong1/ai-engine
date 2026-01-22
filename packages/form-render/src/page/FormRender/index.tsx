import { FormStore } from "@/index";
import { forwardRef, useRef } from "react";
import { FormRenderProps } from "./index.type";

const Form = () => {
  const formStore = useRef(new FormStore());

  return <div></div>;
};

const FormRender = forwardRef(Form) as <T extends object>(
  props: FormRenderProps<T>,
  ref: any,
) => JSX.Element;

export default FormRender;
