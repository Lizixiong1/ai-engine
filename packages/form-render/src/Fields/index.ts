import Path from "../Path";
import { Schema, Model, Field, FieldRef } from "../typings";
import { _set, findLeafNodes } from "@/shared/util";
import { FORCE_UPDATE_KEY } from "@/shared/common";
import { ReactNode } from "react";
import Validator, { ValidationResult } from "./validator";
import DataRelation from "./dataRelation";

export interface FieldModel extends Model {
  isMounted: boolean;
  isVisible: boolean;
}

export interface BaseFieldProps extends Record<string, any> {
  className?: string;
}
export interface FieldProps extends BaseFieldProps {
  key: React.Key;
  fieldCtx: FieldCtx;
  children?: ReactNode;
}

export type Validate = (newValue: any) => Promise<ValidationResult>;
export interface FieldCtx {
  methods: Record<string, Function>;
  register: (forceUpdate: Function) => void;
  value: any;
  onChange: (newValue: any) => void;
  validate: Validate;
  visible: boolean;
}

export interface FieldItem {
  path: Path;
  field: Field;
  props: FieldProps;
  forceUpdate: () => void;
  children?: FieldItem[];
}

class Fields {
  private fieldRef: FieldRef | undefined;
  private validator: Validator;
  private dataRelation: DataRelation;
  models: Map<Path, FieldModel>;
  items: Map<Path, FieldItem>;
  fieldItems: FieldItem[] = [];

  constructor(schema: Schema) {
    this.models = new Map();
    this.items = new Map();
    this.validator = new Validator();
    this.dataRelation = new DataRelation(this);
    this.initialFields(schema.fields);
  }

  resetValues() {
    this.models.forEach((model) => {
      model.value = model.defaultValue;
    });
  }

  getValues() {
    const values = {};
    this.models.forEach((model, path) => {
      if (model.isMounted) {
        _set(values, path.path, model.value);
      }
    });
    return values;
  }
  getValue(pathName: string[] | string) {
    pathName = Array.isArray(pathName) ? pathName : Path.revert(pathName);
    return this.models.get(Path.getPath(pathName))?.value;
  }

  setValue(pathName: string[], value: any) {
    const model = this.models.get(Path.getPath(pathName));
    if (model) {
      model.value = value;
    }
  }

  setValues(values?: Record<string, any>) {
    if (values) {
      findLeafNodes(values).map(({ value, pathName }) => {
        const path = Path.getPath(pathName);
        const model = this.models.get(path);
        if (model) {
          model.value = value;
        }
      });
    }
  }

  build(fields: Field[], paths: string[]) {
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];

      const { fieldItem, pathName } = this.generateItem(paths, field);

      if (!paths.length) {
        this.fieldItems.push(fieldItem);
      }

      this.dataRelation.registerFieldDependencies(pathName, field);

      if (field.children) {
        this.build(field.children, pathName);
      }
    }
  }
  initialFields(fields?: Field[]) {
    if (!fields) {
      return;
    }
    this.build(fields, []);
  }

  getFieldCtx(path: Path) {
    const models = this.models;
    const items = this.items;
    const _validator = this.validator;
    const ctx: FieldCtx = {
      methods: {},
      register(forceUpdate) {
        const model = models.get(path);
        if (model) {
          model.isMounted = true;
        }
        this.methods[FORCE_UPDATE_KEY] = forceUpdate;
      },
      async validate(newValue: any) {
        const item = items.get(path);
        return await _validator.validate(newValue, item?.field.control.rules);
      },

      get visible() {
        const model = models.get(path);
        return model ? model.isVisible : true;
      },

      get value() {
        const model = models.get(path);
        return typeof model?.value === "undefined"
          ? model?.defaultValue
          : model?.value;
      },
      onChange(newValue: any) {
        const model = models.get(path);
        if (model) {
          model.value = newValue;
        }
      },
    };
    return ctx;
  }

  getProxyModel(field: Field, path: Path) {
    const _this = this;
    const model: FieldModel = {
      ...field.model,
      isMounted: false,
      isVisible: this.dataRelation.initialSetVisible(
        path,
        field.control?.binding?.visible
      ),
      value: field.model?.value || field.model?.defaultValue,
    };

    return new Proxy(model, {
      get(target, p) {
        return Reflect.get(target, p);
      },
      set(target, p, newValue) {
        const oldValue = Reflect.get(target, p);
        if (oldValue === newValue) {
          return Reflect.set(target, p, newValue);
        }
        const result = Reflect.set(target, p, newValue);
        if (p === "value" || p === "isVisible") {
          // 字段联动绑定
          _this.dataRelation.triggerDependencyUpdates(path, newValue);
          // 更新组件
          _this.items.get(path)?.forceUpdate();
        }
        return result;
      },
    });
  }

  generateItem(
    paths: string[],
    field: Field
  ): { fieldItem: FieldItem; pathName: string[] } {
    const pathName = [...paths, field.fieldName];
    const path = Path.getPath(pathName) || new Path(pathName);
    const fieldCtx = this.getFieldCtx(path);
    const fieldItem: FieldItem = {
      path,
      field,
      props: {
        key: path.key,
        fieldCtx,
      },
      forceUpdate() {
        fieldCtx.methods[FORCE_UPDATE_KEY]?.();
      },
    };

    let proxyModel = this.getProxyModel(field, path);

    if (!this.models.get(path)) {
      this.models.set(path, proxyModel);
      this.items.set(path, fieldItem);
    }

    if (field.children) {
      fieldItem.children = field.children?.map(
        (field) => this.generateItem(pathName, field).fieldItem
      );
    }
    return {
      fieldItem,
      pathName,
    };
  }

  getFieldRef(): FieldRef {
    if (!this.fieldRef) {
      this.fieldRef = {
        getValue: this.getValue.bind(this),
        getValues: this.getValues.bind(this),
        setValue: this.setValue.bind(this),
        setValues: this.setValues.bind(this),
        resetValues: this.resetValues.bind(this),
      };
    }
    return this.fieldRef;
  }

  clear() {
    this.dataRelation.clearAllDependencies();
    this.fieldItems = [];
    this.models.clear();
    this.items.clear();
  }
}

export default Fields;
