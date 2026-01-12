import {
  FreeLayoutItemProps,
  FreeLayoutProps,
} from "@/components/Layouts/FreeLayouts";
import {
  GridLayoutsItemProps,
  GridLayoutsProps,
} from "@/components/Layouts/GridLayouts";
import { FieldProps } from "@/Fields";
import { ComponentType } from "react";

export type ControlType =
  | "input"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "switch"
  | "date"
  | "time"
  | "number"
  | "slider"
  | "upload"
  | "custom";

export interface Field<T extends string | number | symbol = never> {
  fieldName: string;
  control: Control<T>;
  description?: string;
  extra?: string;
  dependencies?: string[];
  // 模型定义
  model?: Model;
  children?: Field<T>[];

  layout?: FreeLayoutItemProps | GridLayoutsItemProps;
}
export interface Model {
  value?: any;
  defaultValue?: any;
  rules?: Rule[];
  dependencies?: string[];
}
export interface Context {
  [key: string]: any;
}
export interface Control<T extends string | number | symbol = never> {
  type: ControlType | T;
  label?: string;
  placeholder?: string;
  options?:
    | Array<{ label: string; value: any }>
    | ((context: Context) => Array<{ label: string; value: any }>);
  props?: { [key: string]: any };
  rules?: Rule[];
  binding?: DataBinding;
  customRender?: (props: FieldProps & { context: Context }) => JSX.Element;
  hidden?: boolean | ((context: Context) => boolean);
}
export interface Rule {
  required?: boolean;
  message?: string;
  pattern?: string | RegExp;
  min?: number;
  max?: number;
  validator?: (value: any, context?: Context) => boolean | Promise<boolean>;
  condition?: (context: Context) => boolean;
}
export interface DataBinding {
  static?: any[];
  async?: {
    url: string;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    params?: { [key: string]: string | ((context: Context) => any) };
    transform?: (response: any) => any;
    dependencies?: string[];
  };

  visible?: {
    field: string;
    value: any;
    operator?: "==" | "!=" | ">" | "<" | ">=" | "<=" | "includes" | "excludes";
  };
}
// 1 基础元件 无子元素   2 容器元件 允许子元素
export type RenderType = 1 | 2;
export interface ComponentsMap<T = any> {
  component: ComponentType<T>;
  renderType?: 1 | 2;
}

export interface FieldRef {
  setValue: (namePath: string[], value: any) => void;
  setValues: (values: any) => void;
  getValue: (namePath: string[]) => any;
  getValues: () => any;
  resetValues: () => void;
}
export interface LiftCycleType {
  onInit?: (content: any) => void; // 初始化
  onMounted?: (fieldRef: FieldRef) => void; // 初始化挂载
  onUnmounted?: () => void; // 卸载前
}
export interface Schema<T extends string | number | symbol = never> {
  // 表单属性
  title?: string;
  description?: string;

  // 字段
  fields?: Field<T>[];

  // 行为上下文
  context?: Context;

  // 作用域 - 允许将字段分组到命名空间下
  scope?: string;
  scopes?: {
    [scopeName: string]: Schema<T>; // 不同作用域下的嵌套模式
  };

  // 可用于此方案的自定义控件
  customControls: T extends never ? undefined : Record<T, ComponentsMap>;

  // 布局
  layout?: FreeLayoutProps | GridLayoutsProps;

  // 提交
  submit?: {
    url: string;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    transform?: (values: any) => any;
    onSuccess?: (response: any) => void;
    onError?: (error: any) => void;
  };

  // 生命周期
  lifeCycles?: LiftCycleType;
  // 事件
  events?: {
    onInit?: (context: Context) => void | Promise<void>;
    onValuesChange?: (
      changedValues: { [key: string]: any },
      allValues: { [key: string]: any }
    ) => void;
    onSubmit?: (values: any) => void | Promise<void>;
    onReset?: () => void;
  };

  // 联动配置
  conditionals?: Array<{
    source: string; // 源字段
    target: string; // 目标字段
    condition: (
      sourceValue: any,
      context: Context
    ) => boolean | Promise<boolean>;
    action: (sourceValue: any, targetValue: any, context: Context) => any;
  }>;

  // 全局规则
  globalRules?: Rule[];

  // 自定义验证器
  validate?: (values: any, context: Context) => boolean | Promise<boolean>;
}
