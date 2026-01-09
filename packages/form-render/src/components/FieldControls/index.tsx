import Input from "./Input";
import Textarea from "./Textarea";
import Custom from "./Custom";
import { ComponentsMap, ControlType } from "@/typings";

export const componentsMap = new Map<ControlType, ComponentsMap>([
  [
    "input",
    {
      component: Input,
      renderType: 1,
    },
  ],
  [
    "textarea",
    {
      component: Textarea,
      renderType: 1,
    },
  ],
  [
    "custom",
    {
      component: Custom,
      renderType: 1,
    },
  ],
]);
