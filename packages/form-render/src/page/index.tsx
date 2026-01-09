import { useMemo } from "react";
import FormStore from "../FormStore";
import { FieldProps } from "@/Fields";

const Box = (props: FieldProps) => {
  const { children } = props;
  return <div aria-controls="box">{children}</div>;
};

const App = () => {
  const formStore = new FormStore<"box">({
    customControls: {
      box: {
        component: Box,
        renderType: 2,
      },
    },
    fields: [
      {
        fieldName: "a",
        control: {
          type: "box",
        },
        model: {
          value: 4,
        },
        children: [
          {
            fieldName: "a.a",
            control: {
              type: "box",
            },
            children: [
              {
                fieldName: "a.a.a",
                control: {
                  type: "input",
                },
              },
            ],
          },
        ],
      },
      {
        fieldName: "test",
        control: {
          type: "input",
        },
        model: {
          defaultValue: 2,
        },
      },
      {
        fieldName: "abb",
        control: {
          type: "box",
        },
      },
    ],
  });

  console.log(formStore);

  console.log("根组件更新");

  const dom = useMemo(() => formStore.render(), []);

  return (
    <div>
      {dom}
      <div>
        <button
          onClick={() => {
            console.log(formStore.getFormData());
          }}
        >
          获取数据
        </button>
        <button
          onClick={() => {
            formStore.setFormData({
              a: {
                "a.a": {
                  "a.a.a": "24215412521",
                },
              },
              test: "wodfas",
            });
          }}
        >
          设置数据
        </button>
        <button
          onClick={() => {
            formStore.resetFormData();
          }}
        >
          重置
        </button>
      </div>
    </div>
  );
};

export default App;
