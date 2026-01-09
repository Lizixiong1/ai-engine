import { useEffect } from "react";
import FormStore from "../FormStore";
import { FieldProps } from "@/Fields";

const Box = (props: FieldProps) => {
  const { children } = props;
  return <div aria-controls="box">{children}</div>;
};

const formStore = new FormStore<"box">({
  layout: {
    type: "free_layout",
    // type: "grid_layout",
  },
  customControls: {
    box: {
      component: Box,
      renderType: 2,
    },
  },
  fields: [
    // {
    //   fieldName: "a",
    //   control: {
    //     type: "box",
    //   },
    //   layout: {
    //     width: 100,
    //     height: 100,
    //     x: 100,
    //     y: 60,
    //     style: {
    //       // background: '#000000',
    //       overflow: "hidden",
    //     },
    //   },
    //   model: {
    //     value: 4,
    //   },
    //   children: [
    //     {
    //       fieldName: "a.a",
    //       control: {
    //         type: "box",
    //       },
    //       children: [
    //         {
    //           fieldName: "a.a.a",
    //           control: {
    //             type: "input",
    //           },
    //         },
    //       ],
    //     },
    //   ],
    // },
    {
      fieldName: "test",
      control: {
        type: "input",
      },
      model: {
        defaultValue: 8,
      },
      layout: {
        width: 100,
        height: 100,
        style: {
          background: '#000000',
          overflow: 'hidden'
        }
      }
    },
    {
      fieldName: "abb",
      control: {
        type: "box",
      },
    },
  ],
});
const App = () => {
  console.log(formStore);

  useEffect(() => {
    // formStore.
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
