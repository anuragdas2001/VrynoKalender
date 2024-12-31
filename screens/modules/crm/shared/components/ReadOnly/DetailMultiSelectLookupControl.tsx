import React from "react";
import { DetailFieldPerDataTypeProps } from "./DetailFieldPerDataType";
import { NoDataControl } from "./NoDataControl";
import { get } from "lodash";
import { lookupMapperColor } from "./DetailLookupControl";
import { checkLightOrDark } from "../../utils/checkLightDarkColor";
import { IEditInputDetails, ShowFieldEdit } from "./Shared/ShowFieldEdit";
import { FieldEditInput } from "./Shared/FieldEditInput";

export const DetailMultiSelectLookupControl = ({
  data,
  field,
  truncateData,
  fontSize,
  fontColor = "text-vryno-card-value",
  displayType,
  allowColour,
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
  | "allowColour"
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

  const lookupMapper = (
    options: { id: string; label: { en: string }; recordStatus: string }[],
    value: string
  ) => {
    const selectedOption = options.filter((option) => option.id === value);
    return selectedOption.length > 0 ? selectedOption[0].label.en : value;
  };
  const fieldDetail = field.field;

  const values = get(data, field.value, []);
  let titleText: string = "";
  if (Array.isArray(values) && values?.length) {
    values.forEach((value: string, index: number) => {
      fieldDetail?.dataTypeMetadata?.lookupOptions
        ? (titleText += `${lookupMapper(
            fieldDetail?.dataTypeMetadata?.lookupOptions,
            value
          )}${index === values.length - 1 ? "" : ","}`)
        : (titleText += `${value}${index === values.length - 1 ? "" : ","}`);
    });
  }

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

  return (
    <p
      className={`${displayType} ${fontSize.value} ${fontColor} ${
        truncateData ? "truncate" : "whitespace-normal break-all"
      } ${showFieldEditInput ? "flex items-center gap-x-1 group" : ""} ${
        fixedWidth || ""
      }`}
      data-testid={`${field.label || field.value}-value`}
    >
      {Array.isArray(values) && values?.length > 0 ? (
        <>
          <div>
            {values?.map((value: string, index: number) => {
              if (fieldDetail?.dataTypeMetadata?.lookupOptions) {
                const fieldValue = lookupMapper(
                  fieldDetail?.dataTypeMetadata?.lookupOptions,
                  value
                );
                const fieldColor = lookupMapperColor(
                  fieldDetail?.dataTypeMetadata?.lookupOptions,
                  value
                );
                const textColor =
                  checkLightOrDark(fieldColor) === "dark" ? "white" : "black";
                return (
                  <p key={index} className="inline-flex items-center gap-x-1">
                    <>
                      <span
                        // className={`break-words pr-1 ${
                        //   viewType === "List" ? "inline-block" : "block"
                        // }`}
                        className={`break-words  ${
                          fieldColor
                            ? "px-2 rounded-xl inline-flex justify-center items-center my-1"
                            : ""
                        }`}
                        style={
                          fieldColor && allowColour
                            ? {
                                backgroundColor: `${fieldColor}`,
                                color: textColor,
                              }
                            : {}
                        }
                        data-testid={`${
                          field?.label || field.value
                        }-${fieldValue}-color`}
                        title={titleText}
                      >
                        {fieldValue}
                      </span>
                      <span className="mr-2">
                        {index === values.length - 1 ? "" : ","}
                      </span>
                    </>
                  </p>
                );
              } else {
                return `${value}${index === values.length - 1 ? "" : ","}`;
              }
            })}
          </div>
          <ShowFieldEdit
            setEditInputDetails={(value: IEditInputDetails) =>
              setEditInputDetails(value)
            }
            dataToDisplay={data[field.value] || []}
            field={field.field}
            showFieldEditInput={showFieldEditInput}
            id={data?.["id"]}
          />
        </>
      ) : (
        <div
          className={
            showFieldEditInput ? "flex items-center gap-x-1 group" : ""
          }
        >
          <NoDataControl fontSize={fontSize} />
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
      )}
    </p>
  );
};
