import { FormStore } from "@/index";
import { forwardRef, useEffect, useMemo } from "react";
import { FormRenderProps } from "./index.type";
const formStore = new FormStore();
window.formStore = formStore
const Form = () => {
  const dom = useMemo(() => {
    return formStore
      .init({
        fields: [
          {
            fieldName: "AAA",
            control: {
              type: "input",
              props: {},
            },
            model: {
              defaultValue: "232134",
            },
          },
        ],
      })
      .render();
  }, []);

  return (
    <div>
      <div>{dom}</div>
      <button
        onClick={() => {
          console.log(formStore.getFormData());
        }}
      >
        获取结果
      </button>
    </div>
  );
};

const FormRender = forwardRef(Form) as <T extends object>(
  props: FormRenderProps<T>,
  ref: any,
) => JSX.Element;

export default FormRender;
