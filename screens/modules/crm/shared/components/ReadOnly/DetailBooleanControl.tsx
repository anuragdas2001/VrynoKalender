import TrueIcon from "remixicon-react/CheckLineIcon";
import FalseIcon from "remixicon-react/CloseLineIcon";
import { get } from "lodash";
import React from "react";
import { DetailFieldPerDataTypeProps } from "./DetailFieldPerDataType";
import { IEditInputDetails, ShowFieldEdit } from "./Shared/ShowFieldEdit";
import { FieldEditInput } from "./Shared/FieldEditInput";

export const DetailBooleanControl = ({
  showIcons,
  data,
  field,
  truncateData,
  fontSize,
  displayType,
  appName,
  modelName,
  showFieldEditInput = false,
  updateModelFieldData,
}: Pick<
  DetailFieldPerDataTypeProps,
  | "showIcons"
  | "data"
  | "field"
  | "truncateData"
  | "fontSize"
  | "displayType"
  | "appName"
  | "modelName"
  | "showFieldEditInput"
  | "updateModelFieldData"
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
        editInputDetails={editInputDetails}
        setEditInputDetails={(value: IEditInputDetails) =>
          setEditInputDetails(value)
        }
        updateModelFieldData={updateModelFieldData ?? null}
      />
    );
  }
  const text = get(data, [field.value], "false");
  return (
    <p
      className={`text-vryno-card-value ${displayType} ${fontSize.value}  ${
        truncateData ? "truncate" : "break-all"
      } ${showFieldEditInput ? "flex items-center gap-x-1 group" : ""}`}
    >
      {showIcons ? (
        data[field.value] ? (
          <TrueIcon
            className="text-vryno-label-gray"
            data-testid={`${field.label || field.value}-Yes`}
          />
        ) : (
          <FalseIcon
            className="text-vryno-label-gray"
            data-testid={`${field.label || field.value}-No`}
          />
        )
      ) : (
        // <span className="text-gray-500">{capitalCase(text.toString())}</span>
        <span
          className="text-gray-500"
          data-testid={`${field.label || field.value}-${
            text && text !== "false" ? "Yes" : "No"
          }`}
        >
          {text && text !== "false" ? "Yes" : "No"}
        </span>
      )}
      <ShowFieldEdit
        setEditInputDetails={(value: IEditInputDetails) =>
          setEditInputDetails(value)
        }
        dataToDisplay={data[field.value]}
        field={field.field}
        showFieldEditInput={showFieldEditInput}
        id={data?.["id"]}
      />
    </p>
  );
};
