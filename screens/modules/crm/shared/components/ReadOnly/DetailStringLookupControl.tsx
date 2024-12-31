import React from "react";
import { DetailFieldPerDataTypeProps } from "./DetailFieldPerDataType";
import { NoDataControl } from "./NoDataControl";
import { get } from "lodash";
import { IEditInputDetails, ShowFieldEdit } from "./Shared/ShowFieldEdit";
import { FieldEditInput } from "./Shared/FieldEditInput";

export const DetailStringLookupControl = ({
  data,
  field,
  truncateData,
  fontSize,
  fontColor = "text-vryno-card-value",
  displayType,
  viewType,
  appName,
  modelName,
  showFieldEditInput = false,
  updateModelFieldData,
  fixedWidth,
}: Pick<
  DetailFieldPerDataTypeProps,
  | "data"
  | "field"
  | "truncateData"
  | "fontSize"
  | "fontColor"
  | "displayType"
  | "viewType"
  | "appName"
  | "modelName"
  | "showFieldEditInput"
  | "updateModelFieldData"
  | "fixedWidth"
>) => {
  const [editInputDetails, setEditInputDetails] =
    React.useState<IEditInputDetails>({
      visible: false,
      fieldData: null,
      id: undefined,
    });

  const fieldDetail = field.field;
  const stringLookupMapper = (
    options: { lookupOptions: { key: string; label: string }[] },
    value: string
  ) => {
    const selectedOption = options?.lookupOptions?.filter(
      (option) => option.key === value
    );
    return selectedOption?.length > 0 ? selectedOption[0].label : value;
  };

  if (editInputDetails?.visible) {
    return (
      <FieldEditInput
        field={field.field}
        appName={appName}
        modelName={modelName}
        editInputDetails={editInputDetails}
        setEditInputDetails={(value: IEditInputDetails) =>
          setEditInputDetails(value)
        }
        updateModelFieldData={updateModelFieldData ?? null}
      />
    );
  }

  const dataToDisplay = get(data, field.value)
    ? fieldDetail?.dataTypeMetadata
      ? stringLookupMapper(
          fieldDetail?.dataTypeMetadata,
          get(data, field.value)
        )
      : get(data, field.value)
    : "";

  return (
    <p
      className={`${displayType} ${fontSize.value} ${fontColor} ${
        viewType === "List" || truncateData
          ? "truncate"
          : /\s/g.test(dataToDisplay)
          ? "break-words whitespace-pre-line"
          : "whitespace-normal break-all"
      } ${showFieldEditInput ? "flex items-center gap-x-1 group" : ""} ${
        fixedWidth || ""
      }`}
      data-testid={`${field.label || field.value}-${dataToDisplay || "-"}`}
    >
      {dataToDisplay || <NoDataControl fontSize={fontSize} />}
      <ShowFieldEdit
        setEditInputDetails={(value: IEditInputDetails) =>
          setEditInputDetails(value)
        }
        dataToDisplay={dataToDisplay?.length ? dataToDisplay : ""}
        field={field.field}
        showFieldEditInput={showFieldEditInput}
        id={data?.["id"]}
      />
    </p>
  );
};
