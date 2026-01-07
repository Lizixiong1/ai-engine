import Path from "../Path";
import { Schema, Model, Field } from "../typings";

class Fields {
  private schema: Schema;
  private models: Map<Path, Model>;
  fieldItems: any[] = [];
  constructor(schema: Schema) {
    this.schema = schema;
    this.models = new Map();
    this.initialFields();
    
  }

  build(fields: Field[], paths: string[]) {
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const p = [...paths, field.fieldName];
      this.models.set(new Path(p), { ...field.model });
      if (field.children) {
        this.build(field.children, p);
      }
    }
  }
  initialFields() {
    if (!this.schema?.fields) {
      return;
    }
    this.build(this.schema.fields, []);
  }
}

export default Fields;
