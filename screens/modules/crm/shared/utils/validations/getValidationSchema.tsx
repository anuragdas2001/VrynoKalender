import { getDynamicValidationSchemaInternal } from "./getDynamicValidationSchemaInternal";
import { ICustomField } from "../../../../../../models/ICustomField";

export default function getValidationSchema(
  fieldList: Array<ICustomField>,
  modelName?: string
) {
  return getDynamicValidationSchemaInternal(fieldList, modelName);
}
