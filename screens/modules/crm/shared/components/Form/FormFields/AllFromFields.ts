import { FieldSupportedDataType } from "../../../../../../../models/ICustomField";
import { FormFieldRecordImage as recordImage } from "./FormFieldRecordImage";
import { FormFieldImage as image } from "./FormFieldImage";
import { FormFieldSingleLine as singleline } from "./FormFieldSingleLine";
import { FormFieldMultiLine as multiline } from "./FormFieldMultiLine";
import { FormFieldNumber as number } from "./FormFieldNumber";
import { FormFieldEmail as email } from "./FormFieldEmail";
import { FormFieldLookup as lookup } from "./FormFieldLookup";
import { FormFieldMultiSelectLookup as multiSelectLookup } from "./FormFieldMultiSelectLookup";
import { FormFieldMultiSelectRecordLookup as multiSelectRecordLookup } from "./FormFieldMultiSelectRecordLookup";
import { FormFieldRecordLookup as recordLookup } from "./FormFieldRecordLookup";
import { FormFieldUuidArray as uuidArray } from "./FormFieldUuidArray";
import { FormFieldStringLookup as stringLookup } from "./FormFieldStringLookup";
import { FormFieldDateTime as datetime } from "./FormFieldDateTime";
import { FormFieldDate as date } from "./FormFieldDate";
import { FormFieldPhoneNumber as phoneNumber } from "./FormFieldPhoneNumber";
import { FormFieldBoolean as boolean } from "./FormFieldBoolean";
import { FormFieldRichText as richText } from "./FormFieldRichText";
import { FormFieldUrl as url } from "./FormFieldUrl";
import { FormFieldJson as json } from "./FormFieldJson";
import { FormFieldSingleLine as autoNumber } from "./FormFieldSingleLine";
import { FormFieldExpression as expression } from "./FormFieldExpression";
import { FormFieldJsonDateTime as jsonDateTime } from "./FormFieldJsonDateTime";
import { FormFieldPerDataTypeProps } from "../FormFieldPerDataTypeProps";

export const AllFormFields: Partial<
  Record<
    FieldSupportedDataType,
    (props: FormFieldPerDataTypeProps) => JSX.Element | null
  >
> = {
  recordImage,
  image,
  singleline,
  multiline,
  number,
  email,
  lookup,
  multiSelectLookup,
  multiSelectRecordLookup,
  recordLookup,
  uuidArray,
  stringLookup,
  datetime,
  date,
  phoneNumber,
  boolean,
  richText,
  url,
  json,
  autoNumber,
  expression,
  jsonDateTime,
};
