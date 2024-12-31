import { getDate } from "../../../../../../components/TailwindControls/DayCalculator";
import React from "react";

import { DetailFieldPerDataTypeProps } from "./DetailFieldPerDataType";
import { IEditInputDetails, ShowFieldEdit } from "./Shared/ShowFieldEdit";
import { FieldEditInput } from "./Shared/FieldEditInput";

export const DetailDateControl = ({
  fontSize,
  truncateData,
  data,
  field,
  fontColor = "text-vryno-card-value",
  user,
  displayType,
  appName,
  modelName,
  showFieldEditInput = false,
  updateModelFieldData,
  countryCodeInUserPreference,
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
  | "appName"
  | "modelName"
  | "showFieldEditInput"
  | "updateModelFieldData"
  | "countryCodeInUserPreference"
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
        appName={appName}
        modelName={modelName}
        countryCodeInUserPreference={countryCodeInUserPreference}
        editInputDetails={editInputDetails}
        setEditInputDetails={(value: IEditInputDetails) =>
          setEditInputDetails(value)
        }
        updateModelFieldData={updateModelFieldData ?? null}
      />
    );
  }

  const dataToDisplay = data[field.value]
    ? getDate(data[field.value], user)
    : "-";

  return (
    <p
      className={`${displayType} text-vryno-card-value ${
        fontSize.value
      } ${fontColor} ${truncateData ? "truncate" : "break-all"} ${
        showFieldEditInput ? "flex items-center gap-x-1 group" : ""
      } ${fixedWidth || ""}`}
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
