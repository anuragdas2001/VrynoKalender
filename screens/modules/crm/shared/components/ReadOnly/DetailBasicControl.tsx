import React from "react";
import { DetailFieldPerDataTypeProps } from "./DetailFieldPerDataType";
import { NoDataControl } from "./NoDataControl";
import { get } from "lodash";
import { parse } from "expression-eval";
import { EvaluateExpressionType } from "./EvaluateExpressionType";
import Link from "next/link";
import { toast } from "react-toastify";
import { useLazyQuery } from "@apollo/client";
import { FETCH_QUERY } from "../../../../../../graphql/queries/fetchQuery";
import { MaskedFieldComponent } from "./Shared/MaskedFieldComponent";
import { CopyToClipboard } from "./Shared/CopyToClipboard";
import { FieldEditInput } from "./Shared/FieldEditInput";
import { IEditInputDetails, ShowFieldEdit } from "./Shared/ShowFieldEdit";

export const DetailBasicControl = ({
  data,
  field,
  truncateData,
  fontSize,
  fontColor = "text-vryno-card-value",
  viewType = "Card",
  value,
  displayType,
  showMaskedIcon = false,
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
  | "viewType"
  | "value"
  | "displayType"
  | "showMaskedIcon"
  | "appName"
  | "modelName"
  | "showFieldEditInput"
  | "updateModelFieldData"
  | "fixedWidth"
>) => {
  const fieldDetail = field.field;
  const [showMaskedData, setShowMaskedData] = React.useState(false);
  const [maskedFieldData, setMaskedFieldData] = React.useState<{
    oldValue: any;
    newValue: any;
  }>({
    oldValue: "",
    newValue: "",
  });
  const textRef: React.RefObject<HTMLSpanElement> = React.useRef(null);
  const emailRef: React.RefObject<HTMLSpanElement> = React.useRef(null);
  const [maskedDataLoading, setMaskedDataLoading] = React.useState(false);
  const [editInputDetails, setEditInputDetails] =
    React.useState<IEditInputDetails>({
      visible: false,
      fieldData: null,
      id: undefined,
    });

  const [getDataById] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "crm",
      },
    },
  });

  const fetchMaskedFieldData = async (fieldName: string) => {
    setMaskedDataLoading(true);
    try {
      const response = await getDataById({
        variables: {
          modelName: fieldDetail?.moduleName || "",
          fields: ["id", fieldName],
          filters: [
            { name: "id", operator: "eq", value: data["id"]?.toString() || "" },
          ],
          options: {
            unmask: true,
          },
        },
      });
      if (response?.data?.fetch.data) {
        setMaskedFieldData({
          ...maskedFieldData,
          newValue: response.data.fetch.data[0]?.[fieldName],
        });
        setMaskedDataLoading(false);
        return response.data.fetch.data[0]?.[fieldName];
      } else {
        toast.error(response?.data?.fetch.message);
        setMaskedDataLoading(false);
        return null;
      }
    } catch (error) {
      console.error(error);
      toast.error(
        `Something went wrong while fetching masked ${field.label} field data`
      );
      setMaskedDataLoading(false);
      return null;
    }
  };

  const handleFieldEdit = async (value: IEditInputDetails) => {
    if (fieldDetail?.isMasked) {
      const data = !maskedFieldData.newValue
        ? await fetchMaskedFieldData(
            fieldDetail?.systemDefined ? field.value : `fields.${field.value}`
          )
        : maskedFieldData.newValue;
      setEditInputDetails({ ...value, fieldData: data });
      return;
    }
    setEditInputDetails(value);
  };

  React.useEffect(() => {
    if (showMaskedIcon)
      setMaskedFieldData({
        ...maskedFieldData,
        oldValue: data[field.value] || get(data, field.value) || "-",
      });
  }, [data[field.value]]);

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
        setMaskedFieldData={(value: { oldValue: any; newValue: any }) =>
          setMaskedFieldData(value)
        }
      />
    );
  }

  if (value && (typeof value === "string" || typeof value === "number")) {
    return (
      <p
        className={`${displayType} ${fontSize.value} ${fontColor} ${
          viewType === "List" || truncateData
            ? "truncate"
            : "whitespace-normal break-all"
        } ${fixedWidth || ""}`}
        title={value}
        data-testid={`${field.label || field.value}-${value}`}
      >
        {value}
      </p>
    );
  } else if (fieldDetail?.expression) {
    const fieldExpression = fieldDetail.expression;
    const fieldsInExpression = parse(fieldExpression);
    const dataToDisplay =
      data[field.value] || get(data, field.value)
        ? field.dataType === "number" &&
          fieldDetail?.dataTypeMetadata?.precision !== null
          ? Number(data[field.value])?.toFixed(
              fieldDetail?.dataTypeMetadata?.precision ?? 0
            ) ||
            Number(get(data, field.value))?.toFixed(
              fieldDetail?.dataTypeMetadata?.precision ?? 0
            )
          : data[field.value] || get(data, field.value)
        : "";
    return (
      <p
        className={`${displayType} ${fontSize.value} ${fontColor} ${
          viewType === "List" || truncateData
            ? "truncate"
            : "whitespace-normal break-all"
        } ${fixedWidth || ""}`}
        title={dataToDisplay}
        data-testid={
          dataToDisplay ? (
            `${field.label || field.value}-${dataToDisplay || "-"}`
          ) : (
            <EvaluateExpressionType
              data={data}
              expression={fieldsInExpression}
              fontSize={fontSize}
            />
          )
        }
      >
        {dataToDisplay ? (
          dataToDisplay
        ) : (
          <EvaluateExpressionType
            data={data}
            expression={fieldsInExpression}
            fontSize={fontSize}
          />
        )}
      </p>
    );
  } else if (Array.isArray(data[field.value]) && data[field.value].length) {
    const dataToDisplay = data[field.value].map(
      (item: string, index: number) =>
        `${index !== 0 ? ", " : ""}${
          field.dataType === "number" &&
          fieldDetail?.dataTypeMetadata?.precision !== null
            ? Number(item)?.toFixed(
                fieldDetail?.dataTypeMetadata?.precision ?? 0
              )
            : item
        }`
    );
    return (
      <p
        className={`${displayType} text-vryno-card-value ${fontSize.value} ${
          viewType === "List" || truncateData
            ? "truncate"
            : "whitespace-normal break-all"
        } ${fixedWidth || ""}`}
        title={dataToDisplay}
        data-testid={`${field.label || field.value}-${dataToDisplay || "-"}`}
      >
        {dataToDisplay}
      </p>
    );
  } else if (
    (data[field.value] || get(data, field.value)) &&
    field.dataType === "email"
  ) {
    const dataToDisplay =
      !fieldDetail?.isMasked || !showMaskedIcon
        ? data[field.value] || get(data, field.value) || ""
        : !showMaskedData
        ? maskedFieldData.oldValue
        : maskedFieldData.newValue || "";
    return (
      <Link
        href={`mailto:${data[field.value] || get(data, field.value)}?`}
        legacyBehavior
      >
        <a
          className={`items-center gap-x-1 ${displayType} ${
            fontSize.value
          } ${fontColor} ${
            viewType === "List" || truncateData
              ? "truncate"
              : "whitespace-normal break-all"
          } ${showFieldEditInput ? "flex items-center gap-x-1 group" : ""} ${
            fixedWidth ? `${fixedWidth} inline-block` : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <span
            ref={emailRef}
            data-testid={`${field.label || field.value}-${
              dataToDisplay || "-"
            }`}
          >
            {dataToDisplay}
          </span>
          {showMaskedIcon && dataToDisplay ? (
            <MaskedFieldComponent
              fieldDetail={fieldDetail}
              field={field}
              fetchMaskedFieldData={fetchMaskedFieldData}
              showMaskedData={showMaskedData}
              maskedFieldData={maskedFieldData}
              setShowMaskedData={setShowMaskedData}
              maskedDataLoading={maskedDataLoading}
            />
          ) : (
            ""
          )}
          {fieldDetail?.isMasked && showMaskedIcon && dataToDisplay ? (
            <CopyToClipboard
              maskedFieldData={maskedFieldData}
              fetchMaskedFieldData={fetchMaskedFieldData}
              fieldDetail={fieldDetail}
              field={field}
            />
          ) : (
            ""
          )}
          <ShowFieldEdit
            setEditInputDetails={handleFieldEdit}
            dataToDisplay={dataToDisplay}
            field={fieldDetail}
            showFieldEditInput={showFieldEditInput}
            id={data?.["id"]}
          />
        </a>
      </Link>
    );
  } else {
    const dataValue = data[field.value] || get(data, field.value);
    const dataToDisplay =
      fieldDetail?.dataType === "number"
        ? dataValue === null || dataValue === undefined
          ? ""
          : typeof dataValue === "number" ||
            (typeof Number(dataValue) === "number" && !Number.isNaN(dataValue))
          ? fieldDetail?.dataTypeMetadata?.precision !== null
            ? Number(String(data[field.value]))?.toFixed(
                fieldDetail?.dataTypeMetadata?.precision ?? 0
              ) ||
              Number(String(get(data, field.value)))?.toFixed(
                fieldDetail?.dataTypeMetadata?.precision ?? 0
              )
            : Number(String(dataValue))
          : dataValue
          ? fieldDetail?.dataTypeMetadata?.precision !== null
            ? dataValue
            : Number(dataValue)?.toFixed(
                fieldDetail?.dataTypeMetadata?.precision ?? 0
              )
          : ""
        : dataValue &&
          (typeof dataValue === "number" || !Number.isNaN(Number(dataValue)))
        ? Number(String(dataValue))
        : (data[field.value] && typeof data[field.value] === "string") ||
          (get(data, field.value) && typeof get(data, field.value) === "string")
        ? !fieldDetail?.isMasked || !showMaskedIcon
          ? dataValue || ""
          : !showMaskedData
          ? maskedFieldData.oldValue
          : maskedFieldData.newValue || ""
        : "";

    return (
      <p
        className={`${displayType} ${fontSize.value} ${fontColor} ${
          viewType === "List" || truncateData
            ? "truncate"
            : "whitespace-normal break-all"
        } ${showFieldEditInput ? "flex items-center gap-x-1 group" : ""} ${
          fixedWidth || ""
        } ${
          fieldDetail?.dataType === "multiline" && showFieldEditInput
            ? "whitespace-pre-line"
            : ""
        }`}
        title={dataToDisplay}
      >
        <span
          ref={textRef}
          data-testid={`${field.label || field.value}-${dataToDisplay || "-"}`}
        >
          {dataToDisplay ? (
            dataToDisplay
          ) : (
            <NoDataControl fontSize={fontSize} />
          )}
        </span>{" "}
        {showMaskedIcon && dataToDisplay ? (
          <MaskedFieldComponent
            fieldDetail={fieldDetail}
            field={field}
            fetchMaskedFieldData={fetchMaskedFieldData}
            showMaskedData={showMaskedData}
            maskedFieldData={maskedFieldData}
            setShowMaskedData={setShowMaskedData}
            maskedDataLoading={maskedDataLoading}
          />
        ) : (
          ""
        )}
        {fieldDetail?.isMasked && showMaskedIcon && dataToDisplay ? (
          <CopyToClipboard
            maskedFieldData={maskedFieldData}
            fetchMaskedFieldData={fetchMaskedFieldData}
            fieldDetail={fieldDetail}
            field={field}
          />
        ) : (
          ""
        )}
        <ShowFieldEdit
          setEditInputDetails={handleFieldEdit}
          dataToDisplay={dataToDisplay}
          field={fieldDetail}
          showFieldEditInput={showFieldEditInput}
          id={data?.["id"]}
        />
      </p>
    );
  }
};
