import { ICustomField } from "../../../../../../../models/ICustomField";
import { DetailBasicControl } from "../../../../shared/components/ReadOnly/DetailBasicControl";
import { DetailFieldPerDataType } from "../../../../shared/components/ReadOnly/DetailFieldPerDataType";
import {
  IAuditActivityCreate,
  IAuditActivityUpdate,
  IAuditFieldUpdate,
  IQuotedItemCreate,
  IQuotedItemUpdate,
} from "../../../../../../../shared/types/auditLogTypes";

export const AuditFieldMessageComponent = ({
  field,
  auditData,
  data,
}: {
  field: ICustomField;
  auditData:
    | IAuditFieldUpdate
    | IAuditActivityCreate
    | IAuditActivityUpdate
    | IQuotedItemCreate
    | IQuotedItemUpdate;
  data: string | null;
}) => {
  return [
    "singleline",
    "number",
    "date",
    "datetime",
    "richText",
    "email",
    "multiline",
    "json",
    "jsonArray",
  ].includes(field.dataType) && auditData ? (
    <DetailFieldPerDataType
      field={{
        label: field.label.en,
        value: field.name,
        dataType: field.dataType,
        field: field,
      }}
      headerVisible={false}
      data={{
        [field.name]:
          field.name === "repeat" && field.moduleName === "task"
            ? data
              ? JSON.parse(data?.replaceAll("'", '"'))
              : null
            : data,
      }}
      marginBottom={"mb-0"}
      fontSize={{
        header: "text-xsm",
        value: "text-xsm",
      }}
      isSample={false}
      modelName={auditData?.moduleName}
      supportedLabelLocation="onLeftSide"
      richTextOverflowScroll={false}
      renderRecordStatusToggle={false}
    />
  ) : (
    // extractedValue[key].oldValue
    <DetailBasicControl
      data={{
        [field.name]:
          field.dataType === "boolean"
            ? data === "True"
              ? "Yes"
              : "No"
            : data,
      }}
      field={{
        label: field.label.en,
        value: field.name,
        dataType: field.dataType,
        field: field,
      }}
      truncateData={false}
      fontSize={{
        header: "text-xsm",
        value: "text-xsm",
      }}
    />
  );
};
