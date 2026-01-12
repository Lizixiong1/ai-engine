import Fields, { FieldItem } from "../Fields";
import { ComponentsMap, Context, Schema } from "../typings";
import { createElement, ReactNode } from "react";
import {
  getDefaultGridLayout,
  GridLayoutsProps,
} from "@/components/Layouts/GridLayouts";
import { FreeLayoutProps } from "@/components/Layouts/FreeLayouts";
import { layoutsMapping } from "@/components/Layouts/index";
import { componentsMap } from "@/components/FieldControls";
import LiftCycle from "@/LiftCycle";
import "@/styles/index.css";
export const getComponentConfig = (
  item: FieldItem,
  customControls: Record<string, ComponentsMap<any>>
) => {
  const config = componentsMap.get(item.field.control.type)
    ? componentsMap.get(item.field.control.type)
    : customControls
    ? (Reflect.get(customControls, item.field.control.type) as ComponentsMap)
    : undefined;
  if (config && !config.renderType) {
    config.renderType = 1;
  }
  return config;
};
class FormStore<T extends string | number | symbol = never> {
  private schema: Schema<T>;
  private context: Context;
  private layout!: GridLayoutsProps | FreeLayoutProps;
  protected lifeCycle: LiftCycle;
  protected fields: Fields;
  constructor(schema: Schema<T>, initialContext?: Context) {
    this.schema = schema;
    this.context = initialContext || schema.context || {};
    this.lifeCycle = new LiftCycle(this.schema.lifeCycles);
    this.initLayout();
    this.fields = new Fields(schema as Schema);
  }
  initLayout() {
    let layout = this.schema.layout;
    if (!layout) {
      layout = getDefaultGridLayout();
    }
    this.layout = layout;
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

  onInit() {
    this.lifeCycle.execute("onInit", this.context);
  }

  onMounted() {
    this.lifeCycle.execute("onMounted", this.fields.getFieldRef());
  }

  onUnmounted() {
    this.fields.clear();
    this.lifeCycle.execute("onUnmounted");
  }

  render() {
    this.onInit();
    const fieldItems = this.fields.fieldItems;
    return this.renderLayout(this.renderNode(fieldItems));
  }

  renderLayout(children?: ReactNode) {
    const Layout = layoutsMapping[this.layout.type];
    return createElement(
      Layout,
      { ...this.layout, key: Math.random() },
      children
    );
  }

  renderLayoutItem(props?: Record<string, any>, children?: ReactNode) {
    const Layout = layoutsMapping[this.layout.type];
    return createElement(
      Layout.Item,
      { ...this.layout.itemProps, ...props },
      children
    );
  }

  renderNode(fieldItems: FieldItem[]): ReactNode {
    const customControls = this.schema.customControls;
    const extraProps = {
      context: this.context,
    };
    return fieldItems.map((item) => {
      let Com = getComponentConfig(item, customControls);
      if (!Com) {
        console.warn("该type的组件 未注册 请注册该组件后使用");
        return null;
      }
      return this.renderLayoutItem(
        { ...item.field.layout, key: item.path.key },
        createElement(
          Com.component,
          Object.assign({}, item.props, extraProps),
          Com.renderType === 1
            ? null
            : item.children
            ? this.renderNode(item.children)
            : null
        )
      );
    });
  }
}

export default FormStore;
