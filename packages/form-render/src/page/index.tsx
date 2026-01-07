import React from "react";
import FormStore from "../FormStore";

const App = () => {
  const a = new FormStore({
    fields: [
      {
        fieldName: "a",
        control: {
          type: "input",
        },
        children: [
          {
            fieldName: "a.a",
            control: {
              type: "input",
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
          {
            fieldName: "a.b",
            control: {
              type: "input",
            },
          },
        ],
      },
    ],
  });
  console.log(a);

  return <div>App</div>;
};

export default App;
