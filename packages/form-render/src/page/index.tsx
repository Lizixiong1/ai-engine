import { useEffect } from "react";
import FormStore from "../FormStore";
import { FieldProps } from "@/Fields";

const Box = (props: FieldProps) => {
  const { children } = props;
  return <div aria-controls="box">{children}</div>;
};

const formStore = new FormStore<"box">({
  lifeCycles: {
    onMounted(fieldRef) {
      console.log(fieldRef.getValues());
    },
  },
  context: {
    a: 1,
  },
  layout: {
    // type: "free_layout",
    type: "grid_layout",
  },
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
        props: {},
      },
      model: {
        value: 4,
      },
      children: [
        {
          fieldName: "aa",
          control: {
            type: "box",
          },
          children: [
            {
              fieldName: "aaa",
              control: {
                type: "input",
              },
            },
            {
              fieldName: "aab",
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
        rules: [
          {
            required: true,
          },
        ],
        binding: {
          visible: { field: "a.aa.aaa", operator: "==", value: "我要验牌" },
        },
      },
      model: {
        defaultValue: 8,
      },
      layout: {
        width: 100,
        height: 100,
        // style: {
        //   background: "#000000",
        //   overflow: "hidden",
        // },
      },
    },
  ],
});
const App = () => {
  console.log(formStore);

  useEffect(() => {
    formStore.onMounted();
    return () => formStore.onUnmounted();
  }, []);
  return (
    <div style={{ width: "80vw", height: 300 }}>
      {formStore.render()}
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
