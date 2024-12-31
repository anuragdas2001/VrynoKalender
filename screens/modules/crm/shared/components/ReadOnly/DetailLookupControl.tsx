import React from "react";
import { DetailFieldPerDataTypeProps } from "./DetailFieldPerDataType";
import { NoDataControl } from "./NoDataControl";
import { get } from "lodash";
import { checkLightOrDark } from "../../utils/checkLightDarkColor";
import { IEditInputDetails, ShowFieldEdit } from "./Shared/ShowFieldEdit";
import { FieldEditInput } from "./Shared/FieldEditInput";
import { ICustomField } from "../../../../../../models/ICustomField";

export const lookupMapper = (
  options: {
    id: string;
    label: { en: string };
    recordStatus: string;
    colourHex?: string;
  }[],
  value: string
) => {
  const selectedOption = options.filter((option) => option.id === value);
  return selectedOption.length > 0 ? selectedOption[0].label.en : value;
};

export const lookupMapperColor = (
  options: {
    id: string;
    label: { en: string };
    recordStatus: string;
    colourHex?: string;
  }[],
  value: string
) => {
  const selectedOption = options.filter((option) => option.id === value);
  return selectedOption.length > 0 ? selectedOption[0].colourHex : null;
};

const handleDependencyLookupFiltering = (
  parentLookup: string,
  lookupDependencyFields: any,
  fieldDetail: ICustomField
) => {
  const dependentLookupIds =
    lookupDependencyFields.parentMetadata.fieldDependencyMapping.filter(
      (stage: { parentRecordId: string }) =>
        stage.parentRecordId === parentLookup
    )[0]?.childRecordIds || [];
  const childLookups = lookupDependencyFields.childMetadata.lookupOptions;
  const updatedFieldDetail: ICustomField = { ...fieldDetail };

  if (dependentLookupIds.length === 0) {
    updatedFieldDetail["dataTypeMetadata"] = {
      ...updatedFieldDetail.dataTypeMetadata,
      lookupOptions: childLookups,
    };
  } else {
    const lookupOptions: any[] = [];
    for (let i = 0; i < dependentLookupIds.length; i++) {
      for (let j = 0; j < childLookups.length; j++) {
        if (dependentLookupIds[i] === childLookups[j].id) {
          lookupOptions.push(childLookups[j]);
          break;
        }
      }
    }
    updatedFieldDetail["dataTypeMetadata"] = {
      ...updatedFieldDetail.dataTypeMetadata,
      lookupOptions: lookupOptions,
    };
  }
  return updatedFieldDetail;
};

export const DetailLookupControl = ({
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
  fieldsList,
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
  | "fieldsList"
  | "fixedWidth"
>) => {
  const [fieldDetail, setFieldDetail] = React.useState(field.field);
  const [editInputDetails, setEditInputDetails] =
    React.useState<IEditInputDetails>({
      visible: false,
      fieldData: null,
      id: undefined,
    });

  React.useEffect(() => {
    if (isChildDependentField) {
      let lookupDependencyFields: any = {};
      if (fieldDetail?.parentFieldUniqueName) {
        const dependentField = fieldsList?.filter(
          (fL) => isChildDependentField == fL.uniqueName
        )?.[0];
        if (dependentField) {
          lookupDependencyFields = {
            parentLabel: dependentField.label.en,
            childLabel: fieldDetail.label.en,
            childField: fieldDetail.name,
            parentMetadata: dependentField.dataTypeMetadata,
            childMetadata: fieldDetail.dataTypeMetadata,
          };
          setFieldDetail(
            handleDependencyLookupFiltering(
              data[dependentField.name],
              lookupDependencyFields,
              fieldDetail
            )
          );
        }
      }
    }
  }, []);

  if (editInputDetails?.visible) {
    return (
      <FieldEditInput
        field={fieldDetail}
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

  const getValueData = get(data, field.value);
  const getValue =
    getValueData &&
    typeof getValueData === "object" &&
    !Array.isArray(getValueData)
      ? getValueData.value
      : getValueData;

  const fieldColor = lookupMapperColor(
    fieldDetail?.dataTypeMetadata?.lookupOptions,
    getValue
  );
  const textColor = checkLightOrDark(fieldColor) === "dark" ? "white" : "black";

  const hasFieldDependency = fieldDetail?.dataTypeMetadata
    ?.fieldDependencyMapping?.length
    ? true
    : false;
  const isChildDependentField = hasFieldDependency
    ? false
    : fieldDetail?.parentFieldUniqueName;

  const dataToDisplay = lookupMapper(
    fieldDetail?.dataTypeMetadata?.lookupOptions,
    getValue
  );

  return (
    <p
      className={`${displayType} ${fontSize.value} ${fontColor} ${
        truncateData ? "truncate" : "whitespace-normal break-all"
      } ${fixedWidth || ""}`}
      title={dataToDisplay || "-"}
      data-testid={`${field.label || field.value}-${dataToDisplay || "-"}`}
    >
      {getValue ? (
        fieldDetail?.dataTypeMetadata?.lookupOptions ? (
          <span
            className={`${
              fieldColor ? "px-2 rounded-xl mr-2 inline-flex my-1" : ""
            } ${
              showFieldEditInput && !hasFieldDependency
                ? "flex items-start justify-start gap-x-1 group"
                : "justify-center items-center inline-flex"
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
            }-${dataToDisplay}-color`}
          >
            {dataToDisplay}
            {!hasFieldDependency && (
              <ShowFieldEdit
                setEditInputDetails={(value: IEditInputDetails) =>
                  setEditInputDetails(value)
                }
                dataToDisplay={data[field.value]}
                field={field.field}
                showFieldEditInput={showFieldEditInput}
                id={data?.["id"]}
              />
            )}
          </span>
        ) : (
          <span
            data-testid={`${
              field?.label || field.value
            }-${dataToDisplay}-color`}
          >
            {getValue}
          </span>
        )
      ) : (
        <div
          className={
            showFieldEditInput && !hasFieldDependency
              ? "flex items-center gap-x-1 group"
              : ""
          }
        >
          <NoDataControl fontSize={fontSize} />
          {!hasFieldDependency && (
            <ShowFieldEdit
              setEditInputDetails={(value: IEditInputDetails) =>
                setEditInputDetails(value)
              }
              dataToDisplay={""}
              field={field.field}
              showFieldEditInput={showFieldEditInput}
              id={data?.["id"]}
            />
          )}
        </div>
      )}
    </p>
  );
};
