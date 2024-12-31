import React from "react";
import { FieldEditInput } from "./Shared/FieldEditInput";
import { DetailFieldPerDataTypeProps } from "./DetailFieldPerDataType";
import { IEditInputDetails, ShowFieldEdit } from "./Shared/ShowFieldEdit";
import { getDateAndTime } from "../../../../../../components/TailwindControls/DayCalculator";

export const DetailDatetimeControl = ({
  fontSize,
  truncateData,
  data,
  field,
  user,
  fontColor = "text-vryno-card-value",
  displayType,
  countryCodeInUserPreference,
  appName,
  modelName,
  showFieldEditInput = false,
  updateModelFieldData,
  fixedWidth,
}: Pick<
  DetailFieldPerDataTypeProps,
  | "fontSize"
  | "truncateData"
  | "data"
  | "field"
  | "fontColor"
  | "user"
  | "displayType"
  | "countryCodeInUserPreference"
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

  if (editInputDetails?.visible) {
    return (
      <FieldEditInput
        field={field.field}
        countryCodeInUserPreference={countryCodeInUserPreference}
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

  const dataToDisplay = data[field.value]
    ? getDateAndTime(data[field.value], user)
    : "-";

  return (
    <p
      className={`${displayType} ${fontSize.value} ${fontColor} ${
        truncateData ? "truncate" : "break-all"
      } ${showFieldEditInput ? "flex items-center gap-x-1 group" : ""} ${
        fixedWidth || ""
      }`}
      title={dataToDisplay}
      data-testid={`${field.label || field.value}-${dataToDisplay}`}
    >
      {dataToDisplay}
      <ShowFieldEdit
        setEditInputDetails={(value: IEditInputDetails) =>
          setEditInputDetails(value)
        }
        dataToDisplay={dataToDisplay !== "-" ? data[field.value] : null}
        field={field.field}
        showFieldEditInput={showFieldEditInput}
        id={data?.["id"]}
      />
    </p>
  );
};
