import Input from "./Input";
import Textarea from "./Textarea";
import Select from "./Select";
import Checkbox from "./Checkbox";
import Radio from "./Radio";
import Switch from "./Switch";
import Date from "./Date";
import Time from "./Time";
import Number from "./Number";
import Slider from "./Slider";
import Upload from "./Upload";
import Custom from "./Custom";
import { ComponentsMap, ControlType } from "../typings";

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
    "select",
    {
      component: Select,
      renderType: 1,
    },
  ],
  [
    "checkbox",
    {
      component: Checkbox,
      renderType: 1,
    },
  ],
  [
    "radio",
    {
      component: Radio,
      renderType: 1,
    },
  ],
  [
    "switch",
    {
      component: Switch,
      renderType: 1,
    },
  ],
  [
    "date",
    {
      component: Date,
      renderType: 1,
    },
  ],
  [
    "time",
    {
      component: Time,
      renderType: 1,
    },
  ],
  [
    "number",
    {
      component: Number,
      renderType: 1,
    },
  ],
  [
    "slider",
    {
      component: Slider,
      renderType: 1,
    },
  ],
  [
    "upload",
    {
      component: Upload,
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
