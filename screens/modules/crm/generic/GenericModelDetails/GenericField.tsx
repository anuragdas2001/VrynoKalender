import { DetailFieldPerDataType } from "../../shared/components/ReadOnly/DetailFieldPerDataType";
import { fieldConvertor } from "../../shared/utils/getOrderedFieldsList";
import { ICustomField } from "../../../../../models/ICustomField";
import { getAppPathParts } from "../../shared/utils/getAppPathParts";

export const GenericField = ({
  data,
  fieldsList,
  fieldName,
  headerVisible,
  fontSize,
  fontColor,
  marginBottom,
}: {
  data: any;
  fieldsList: Array<ICustomField>;
  fieldName: string;
  headerVisible: boolean;
  fontSize: { header: string; value: string };
  fontColor?: string;
  marginBottom?: string;
}) => {
  const { modelName } = getAppPathParts();
  const customField = fieldsList.find(
    (f) => f.name.toLowerCase() === fieldName.toLowerCase()
  );
  if (customField === undefined) return null;
  const field = fieldConvertor(customField);

  return (
    <DetailFieldPerDataType
      field={{
        label: field.label,
        value: field.value,
        dataType: field.dataType,
        field: field.field,
      }}
      data={data}
      headerVisible={headerVisible}
      fontSize={fontSize}
      fontColor={fontColor}
      modelName={modelName}
      marginBottom={marginBottom}
    />
  );
};
