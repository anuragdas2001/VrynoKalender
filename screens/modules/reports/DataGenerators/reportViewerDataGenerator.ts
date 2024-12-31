import { FieldSupportedDataType } from "../../../../models/ICustomField";
import { reportDateTime } from "./reportDateTime";
import { reportDate } from "./reportDate";
import { reportLookup } from "./reportLookup";
import { reportMultiSelectLookup } from "./reportMultiSelectLookup";
import { reportRecordLookup } from "./reportRecordLookup";
import { reportMultiSelectRecordLookup } from "./reportMultiSelectRecordLookup";
import { reportRichText } from "./reportRichText";
import { reportRelatedTo } from "./reportRelatedTo";

export const reportViewerDataGenerator: Partial<
  Record<FieldSupportedDataType, any>
> = {
  date: reportDate,
  datetime: reportDateTime,
  lookup: reportLookup,
  multiSelectLookup: reportMultiSelectLookup,
  recordLookup: reportRecordLookup,
  multiSelectRecordLookup: reportMultiSelectRecordLookup,
  richText: reportRichText,
  relatedTo: reportRelatedTo,
};
