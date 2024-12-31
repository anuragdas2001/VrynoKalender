import React from "react";
import { get } from "lodash";
import Link from "next/link";
import { NoDataControl } from "./NoDataControl";
import { DetailFieldPerDataTypeProps } from "./DetailFieldPerDataType";
import { IEditInputDetails, ShowFieldEdit } from "./Shared/ShowFieldEdit";
import { FieldEditInput } from "./Shared/FieldEditInput";

export const DetailUrlControl = ({
  data,
  field,
  truncateData,
  fontSize,
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

  const url =
    data[field.value] || get(data, field.value)
      ? data[field.value] || get(data, field.value)
      : "";

  return url.length ? (
    <Link href={url.includes("http") ? url : `http://${url}`} legacyBehavior>
      <a
        onClick={(e) => {
          e.stopPropagation();
        }}
        target="_blank"
        className={`inline-block text-vryno-theme-light-blue ${
          fontSize.value
        } ${
          viewType === "List" || truncateData
            ? "truncate"
            : /\s/g.test(data[field.value] || get(data, field.value))
            ? "break-words whitespace-pre-line"
            : "whitespace-normal break-all"
        } ${showFieldEditInput ? "flex items-center gap-x-1 group" : ""} ${
          fixedWidth || ""
        }`}
        rel="noopener noreferrer"
        title={url}
        data-testid={`${field.label || field.value}-${url}`}
      >
        {url}
        <ShowFieldEdit
          setEditInputDetails={(value: IEditInputDetails) =>
            setEditInputDetails(value)
          }
          dataToDisplay={url}
          field={field.field}
          showFieldEditInput={showFieldEditInput}
          id={data?.["id"]}
        />
      </a>
    </Link>
  ) : (
    <div
      className={showFieldEditInput ? "flex items-center gap-x-1 group" : ""}
    >
      <NoDataControl
        dataTestId={`${field.label || field.value}--`}
        fontSize={fontSize}
      />
      <ShowFieldEdit
        setEditInputDetails={(value: IEditInputDetails) =>
          setEditInputDetails(value)
        }
        dataToDisplay={""}
        field={field.field}
        showFieldEditInput={showFieldEditInput}
        id={data?.["id"]}
      />
    </div>
  );
};
