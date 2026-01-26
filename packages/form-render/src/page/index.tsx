import { useEffect, useRef } from "react";
import FormDesign from "./FormDesign";
import {
  DraggableProvider,
  HTML5Backend,
  useDrag,
  useDrop,
} from "@ai-engine/react-draggable";
import "./index.css";
import { useAudioMessage } from "./useAudioMessage";
const cards = [
  { id: 1, name: "1" },
  { id: 2, name: "2" },
  { id: 3, name: "3" },
  { id: 4, name: "4" },
  { id: 5, name: "5" },
];

// const Cards = () => {
//   useDrag();

//   const [collectedProps, drop] = useDrop(() => ({}));
//   ref({});
//   return (
//     <div className="card">
//       {/* {cards.map((card) => (
//         <div className="card-item" key={card.id} ref={drop}>
//           {card.name}
//         </div>
//       ))} */}
//     </div>
//   );
// };
const App = () => {
  useAudioMessage({ messageList: [], audioConfig: {}, playConfig: {} });
  return (
    <DraggableProvider value={HTML5Backend}>
      {/* <Cards /> */}

      <div></div>
    </DraggableProvider>
  );
};

export default App;
