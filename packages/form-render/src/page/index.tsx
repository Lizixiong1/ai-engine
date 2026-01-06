import React from "react";
import { create } from "@ai-engine/zustand";
const useStore = create<{ count: number; increment: () => void }>(
  (set, get) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count +1 })),
  })
);
const App = () => {
  const { count, increment } = useStore();

  console.log(count);

  return (
    <div>
      <B />
      <button onClick={() => increment()}>增加</button>
    </div>
  );
};

const B = () => {
  const { count } = useStore();
  console.log(count);
  return <div>{count}</div>;
};
export default App;
