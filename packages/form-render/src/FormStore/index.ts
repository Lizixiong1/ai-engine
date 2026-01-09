import { componentsMap } from "@/components";
import Fields, { FieldItem } from "../Fields";
import { ComponentsMap, Context, Schema } from "../typings";
import { createElement } from "react";

export const getComponentConfig = (
  item: FieldItem,
  customControls: Record<string, ComponentsMap<any>>
) => {
  return componentsMap.get(item.field.control.type)
    ? componentsMap.get(item.field.control.type)
    : customControls
    ? (Reflect.get(customControls, item.field.control.type) as ComponentsMap)
    : undefined;
};
class FormStore<T extends string | number | symbol = never> {
  private schema: Schema<T>;
  private context: Context;
  fields: Fields;
  constructor(schema: Schema<T>, initialContext?: Context) {
    this.schema = schema;
    this.context = initialContext || schema.context || {};
    this.fields = new Fields(schema as Schema);
  }

  getFormData() {
    return this.fields.getValues();
  }

  setFormData(values: any) {
    return this.fields.setValues(values);
  }

  resetFormData() {
    return this.fields.resetValues();
  }

  render() {
    const fieldItems = this.fields.fieldItems;
    const customControls = this.schema.customControls;
    const global = {
      context: this.context,
    };
    function renderNode(fieldItems: FieldItem[]): React.ReactNode {
      return fieldItems.map((item) => {
        let Com = getComponentConfig(item, customControls);
        if (!Com) {
          console.warn("该type的组件 未注册 请注册该组件后使用");
          return null;
        }
        Com.renderType = Com.renderType || 1;
        return createElement(
          Com.component,
          Object.assign({}, item.props, global),
          Com.renderType === 1
            ? null
            : item.children
            ? renderNode(item.children)
            : null
        );
      });
    }
    return renderNode(fieldItems);
  }
}
export default FormStore;
