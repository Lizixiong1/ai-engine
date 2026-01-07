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
  | "custom"
  | string;
export interface Field {
  fieldName: string;
  control: Control;
  description?: string;
  extra?: string;
  dependencies?: string[];
  // 模型定义
  model?: Model;
  children?: Field[];
  // onChange?: (value: any, context: Context) => void | Promise<void>;
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
export interface Control {
  type: ControlType;
  label?: string;
  placeholder?: string;
  options?:
    | Array<{ label: string; value: any }>
    | ((context: Context) => Array<{ label: string; value: any }>);
  props?: { [key: string]: any };
  rules?: Rule[];
  binding?: DataBinding;
  children?: Schema[]; // For nested forms
  customRender?: (
    value: any,
    onChange: (value: any) => void,
    context?: Context
  ) => JSX.Element;
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
  // Static binding
  static?: any[];
  // Async binding with API configuration
  async?: {
    url: string;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    params?: { [key: string]: string | ((context: Context) => any) };
    transform?: (response: any) => any;
    dependencies?: string[];
  };
  // Conditional display based on other fields
  visible?: {
    field: string;
    value: any;
    operator?: "==" | "!=" | ">" | "<" | ">=" | "<=" | "includes" | "excludes";
  };
}

export interface Schema {
  // 表单属性
  title?: string;
  description?: string;

  // 字段
  fields?: Field[];

  // 行为上下文
  context?: Context;

  // 作用域 - 允许将字段分组到命名空间下
  scope?: string;
  scopes?: {
    [scopeName: string]: Schema; // 不同作用域下的嵌套模式
  };

  // 可用于此方案的自定义控件
  customControls?: {
    [controlName: string]: Control;
  };

  // 布局
  layout?: {
    type?: "horizontal" | "vertical" | "inline";
    labelCol?: number;
    wrapperCol?: number;
  };

  // 提交
  submit?: {
    url: string;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    transform?: (values: any) => any;
    onSuccess?: (response: any) => void;
    onError?: (error: any) => void;
  };
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
