import Fields from "../Fields";
import { Context, Schema } from "../typings";

class FormStore {
  private schema: Schema;
  private context: Context;
  fields: Fields;
  constructor(schema: Schema, initialContext?: Context) {
    this.schema = schema;
    this.context = initialContext || schema.context || {};

    this.fields = new Fields(schema);
  }
}
export default FormStore;
