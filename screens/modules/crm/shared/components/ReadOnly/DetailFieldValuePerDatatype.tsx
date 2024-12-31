import React, { useContext } from "react";
import { NoDataControl } from "./NoDataControl";
import { DetailRecordImageControl } from "./DetailRecordImageControl";
import { DetailImageControl } from "./DetailImageControl";
import { DetailBooleanControl } from "./DetailBooleanControl";
import { DetailBasicControl } from "./DetailBasicControl";
import { DetailRecordLookup } from "./DetailRecordLookup";
import { DetailDateControl } from "./DetailDateControl";
import { DetailDatetimeControl } from "./DetailDatetimeControl";
import { DetailStringLookupControl } from "./DetailStringLookupControl";
import { DetailRichTextControl } from "./DetailRichTextControl";
import { DetailLookupControl } from "./DetailLookupControl";
import { camelCase, get } from "lodash";
import { DetailUrlControl } from "./DetailUrlControl";
import { DetailRelatedTo } from "./DetailRelatedTo";
import { AccountModels } from "../../../../../../models/Accounts";
import { UserStoreContext } from "../../../../../../stores/UserStore";
import { DetailMultiSelectLookupControl } from "./DetailMultiSelectLookupControl";
import { DetailMultiSelectRecordLookup } from "./DetailMultiSelectRecordLookup";
import { DetailAutoNumberControl } from "./DetailAutoNumberControl";
import { DetailJsonControl } from "./DetailJsonControl";
import { DetailExpressionControl } from "./DetailExpressionControl";
import { DetailJsonArrayControl } from "./DetailJsonArrayControl";
import { GeneralStoreContext } from "../../../../../../stores/RootStore/GeneralStore/GeneralStore";
import {
  FieldSupportedDataType,
  ICustomField,
} from "../../../../../../models/ICustomField";
import {
  evaluateDisplayExpression,
  getFieldsFromDisplayExpression,
} from "../../utils/getFieldsFromDisplayExpression";
import { DetailPhoneNumber } from "./DetailPhoneNumber";
import { DetailRecordStatus } from "./DetailRecordStatus";
import { SupportedApps } from "../../../../../../models/shared";

export type DetailFieldPerDataTypeProps = {
  field: {
    label: string;
    value: string;
    dataType: FieldSupportedDataType;
    field: ICustomField | undefined;
  };
  data: any;
  isSample: boolean;
  modelName?: string;
  headerVisible: boolean;
  fontSize: { header: string; value: string };
  truncateData?: boolean;
  showIcons?: boolean;
  onDetail: boolean;
  fontColor?: string;
  includeBaseUrl?: boolean;
  from?: string;
  imageSize?: string;
  includeFlagInPhoneNumber?: boolean;
  dataProcessed?: boolean;
  dataProcessing?: boolean;
  viewType?: "Card" | "List";
  richTextOverflowScroll?: boolean;
  onSearch?: boolean;
  displayType?: string;
  fieldsList: ICustomField[] | undefined;
  customOpacity?: string | null;
  showMaskedIcon?: boolean;
  renderRecordStatusToggle?: boolean;
  handleRowClick?: (record: Record<string, string>) => void;
  countryCodeInUserPreference?: string;
  appName?: SupportedApps;
  showFieldEditInput?: boolean;
  updateModelFieldData?: (field: string, value: any, id: string) => void;
  fixedWidth?: string;
  imageServiceName?: SupportedApps.crm | SupportedApps.accounts;
  imageServiceModelName?: string;
  imageServiceSubdomain?: string;
};

export const DetailFieldValuePerDatatype = ({
  field,
  data,
  isSample,
  modelName,
  fontSize,
  truncateData,
  showIcons,
  onDetail,
  fontColor,
  includeBaseUrl,
  from,
  imageSize,
  includeFlagInPhoneNumber = true,
  dataProcessed,
  dataProcessing,
  viewType,
  richTextOverflowScroll,
  onSearch = false,
  displayType = "block",
  fieldsList,
  customOpacity,
  showMaskedIcon = false,
  renderRecordStatusToggle = false,
  handleRowClick,
  countryCodeInUserPreference,
  appName,
  showFieldEditInput = false,
  updateModelFieldData,
  fixedWidth,
  imageServiceName,
  imageServiceModelName,
  imageServiceSubdomain,
}: DetailFieldPerDataTypeProps) => {
  const userContext = useContext(UserStoreContext);
  const { user } = userContext;
  const { generalModelStore } = useContext(GeneralStoreContext);
  const { userPreferences, genericModels } = generalModelStore;

  if (field.dataType === "expression") {
    return (
      <DetailExpressionControl
        data={data}
        field={field}
        truncateData={truncateData}
        fontSize={fontSize}
        fontColor={fontColor}
        viewType={viewType}
        displayType={displayType}
        fixedWidth={fixedWidth}
      />
    );
  } else if (field.dataType === "jsonArray") {
    return (
      <DetailJsonArrayControl
        data={data}
        field={field}
        truncateData={truncateData}
        fontSize={fontSize}
        fontColor={fontColor}
        viewType={viewType}
        displayType={displayType}
      />
    );
  } else if (field.dataType === "json") {
    return (
      <DetailJsonControl
        data={data}
        field={field}
        truncateData={truncateData}
        fontSize={fontSize}
        fontColor={fontColor}
        viewType={viewType}
        displayType={displayType}
      />
    );
  } else if (field.dataType === "recordImage") {
    return (
      <DetailRecordImageControl
        onDetail={onDetail}
        data={data}
        field={field}
        isSample={isSample}
        modelName={modelName}
        from={from}
        imageSize={imageSize}
        customOpacity={customOpacity}
        imageServiceName={imageServiceName}
        imageServiceModelName={imageServiceModelName}
        imageServiceSubdomain={imageServiceSubdomain}
      />
    );
  } else if (field.dataType === "image") {
    return (
      <DetailImageControl data={data} field={field} modelName={modelName} />
    );
  } else if (field.dataType === "boolean") {
    return (
      <DetailBooleanControl
        data={data}
        field={field}
        truncateData={truncateData}
        fontSize={fontSize}
        showIcons={showIcons}
        displayType={displayType}
        appName={appName}
        modelName={modelName}
        showFieldEditInput={showFieldEditInput}
        updateModelFieldData={updateModelFieldData}
      />
    );
  } else if (field.dataType === "singleline") {
    if (field.value === "recordStatus") {
      return (
        <DetailRecordStatus
          data={data}
          field={field}
          truncateData={truncateData}
          fontSize={fontSize}
          fontColor={fontColor}
          viewType={viewType}
          displayType={displayType}
          showMaskedIcon={showMaskedIcon}
          renderRecordStatusToggle={renderRecordStatusToggle}
        />
      );
    } else {
      return (
        <DetailBasicControl
          data={data}
          field={field}
          truncateData={truncateData}
          fontSize={fontSize}
          fontColor={fontColor}
          viewType={viewType}
          displayType={displayType}
          showMaskedIcon={showMaskedIcon}
          appName={appName}
          modelName={modelName}
          showFieldEditInput={showFieldEditInput}
          updateModelFieldData={updateModelFieldData}
          fixedWidth={fixedWidth}
        />
      );
    }
  } else if (field.dataType === "multiline") {
    return (
      <DetailBasicControl
        data={data}
        field={field}
        truncateData={truncateData}
        fontSize={fontSize}
        fontColor={fontColor}
        viewType={viewType}
        displayType={displayType}
        appName={appName}
        modelName={modelName}
        showFieldEditInput={showFieldEditInput}
        updateModelFieldData={updateModelFieldData}
        fixedWidth={fixedWidth}
      />
    );
  } else if (field.dataType === "richText") {
    return (
      <DetailRichTextControl
        data={data}
        field={field}
        truncateData={truncateData}
        fontSize={fontSize}
        fontColor={fontColor}
        richTextOverflowScroll={richTextOverflowScroll}
        displayType={displayType}
        appName={appName}
        modelName={modelName}
        showFieldEditInput={showFieldEditInput}
        updateModelFieldData={updateModelFieldData}
        fixedWidth={fixedWidth}
      />
    );
  } else if (field.dataType === "number") {
    return (
      <DetailBasicControl
        data={data}
        field={field}
        truncateData={truncateData}
        fontSize={fontSize}
        fontColor={fontColor}
        displayType={displayType}
        appName={appName}
        modelName={modelName}
        showFieldEditInput={showFieldEditInput}
        updateModelFieldData={updateModelFieldData}
        fixedWidth={fixedWidth}
      />
    );
  } else if (field.dataType === "autoNumber") {
    return (
      <DetailAutoNumberControl
        data={data}
        field={field}
        truncateData={truncateData}
        fontSize={fontSize}
        fontColor={fontColor}
        displayType={displayType}
        fixedWidth={fixedWidth}
      />
    );
  } else if (field.dataType === "phoneNumber") {
    return (
      <DetailPhoneNumber
        includeFlagInPhoneNumber={includeFlagInPhoneNumber}
        data={data}
        field={field}
        userPreferences={userPreferences}
        onSearch={onSearch}
        onDetail={onDetail}
        truncateData={truncateData}
        fontSize={fontSize}
        displayType={displayType}
        fontColor={fontColor}
        viewType={viewType}
        showMaskedIcon={showMaskedIcon}
        countryCodeInUserPreference={countryCodeInUserPreference}
        appName={appName}
        modelName={modelName}
        showFieldEditInput={showFieldEditInput}
        updateModelFieldData={updateModelFieldData}
        fixedWidth={fixedWidth}
      />
    );
  } else if (field.dataType === "email") {
    return (
      <DetailBasicControl
        data={data}
        field={field}
        truncateData={truncateData}
        fontSize={fontSize}
        fontColor={fontColor}
        displayType={displayType}
        showMaskedIcon={showMaskedIcon}
        viewType={viewType}
        appName={appName}
        modelName={modelName}
        showFieldEditInput={showFieldEditInput}
        updateModelFieldData={updateModelFieldData}
        fixedWidth={fixedWidth}
      />
    );
  } else if (field.dataType === "lookup") {
    return (
      <DetailLookupControl
        data={data}
        field={field}
        truncateData={truncateData}
        fontSize={fontSize}
        fontColor={fontColor}
        displayType={displayType}
        allowColour={field.field?.dataTypeMetadata?.allowColour}
        appName={appName}
        modelName={modelName}
        showFieldEditInput={showFieldEditInput}
        updateModelFieldData={updateModelFieldData}
        fieldsList={fieldsList}
        fixedWidth={fixedWidth}
      />
    );
  } else if (field.dataType === "multiSelectLookup") {
    return (
      <DetailMultiSelectLookupControl
        data={data}
        field={field}
        truncateData={truncateData}
        fontSize={fontSize}
        fontColor={fontColor}
        displayType={displayType}
        allowColour={field.field?.dataTypeMetadata?.allowColour}
        appName={appName}
        modelName={modelName}
        showFieldEditInput={showFieldEditInput}
        updateModelFieldData={updateModelFieldData}
        fixedWidth={fixedWidth}
      />
    );
  } else if (field.dataType === "stringLookup") {
    return (
      <DetailStringLookupControl
        data={data}
        field={field}
        truncateData={truncateData}
        fontSize={fontSize}
        fontColor={fontColor}
        displayType={displayType}
        viewType={viewType}
        appName={appName}
        modelName={modelName}
        showFieldEditInput={showFieldEditInput}
        updateModelFieldData={updateModelFieldData}
        fixedWidth={fixedWidth}
      />
    );
  } else if (field.dataType === "recordLookup") {
    const fieldDetail = field.field;
    const appName =
      fieldDetail?.dataTypeMetadata?.allLookups[0]?.moduleName.split(".")[0];
    const modelName = camelCase(
      fieldDetail?.dataTypeMetadata?.allLookups[0]?.moduleName.split(".")[1]
    );
    const fieldDisplayExpression = getFieldsFromDisplayExpression(
      fieldDetail?.dataTypeMetadata?.allLookups[0]?.displayExpression
    );
    const searchBy =
      fieldDetail?.dataTypeMetadata?.allLookups[0]?.moduleName.split(".")[1] ===
      AccountModels.User
        ? ["firstName", "lastName"]
        : evaluateDisplayExpression(
            fieldDisplayExpression,
            genericModels[modelName]?.layouts[0]?.config?.fields || []
          );
    return (
      <DetailRecordLookup
        appName={appName}
        modelName={modelName}
        fieldDetail={fieldDetail}
        fontSize={fontSize.value}
        truncatedData={!!truncateData}
        value={data[field.value]}
        searchBy={searchBy}
        fieldDisplayExpression={fieldDisplayExpression}
        fontColor={fontColor}
        data={data}
        includeBaseUrl={includeBaseUrl}
        dataProcessed={dataProcessed}
        dataProcessing={dataProcessing}
        displayType={displayType}
        viewType={viewType}
        fixedWidth={fixedWidth}
        showFieldEditInput={showFieldEditInput}
        updateModelFieldData={updateModelFieldData}
      />
    );
  } else if (field.dataType === "multiSelectRecordLookup") {
    const fieldDetail = field.field;
    const modelName = camelCase(
      fieldDetail?.dataTypeMetadata?.allLookups[0]?.moduleName.split(".")[1]
    );
    const fieldDisplayExpression = getFieldsFromDisplayExpression(
      fieldDetail?.dataTypeMetadata?.allLookups[0]?.displayExpression
    );
    return (
      <DetailMultiSelectRecordLookup
        appName={
          fieldDetail?.dataTypeMetadata?.allLookups[0]?.moduleName.split(".")[0]
        }
        modelName={camelCase(
          fieldDetail?.dataTypeMetadata?.allLookups[0]?.moduleName.split(".")[1]
        )}
        fieldDetail={fieldDetail}
        fontSize={fontSize.value}
        truncatedData={!!truncateData}
        value={data[field.value]}
        searchBy={
          fieldDetail?.dataTypeMetadata?.allLookups[0]?.moduleName.split(
            "."
          )[1] === AccountModels.User
            ? ["firstName", "lastName"]
            : evaluateDisplayExpression(
                fieldDisplayExpression,
                genericModels[modelName]?.layouts[0]?.config?.fields || []
              )
        }
        fieldDisplayExpression={fieldDisplayExpression}
        fontColor={fontColor}
        data={data}
        includeBaseUrl={includeBaseUrl}
        displayType={displayType}
        viewType={viewType}
        fixedWidth={fixedWidth}
        showFieldEditInput={showFieldEditInput}
        updateModelFieldData={updateModelFieldData}
      />
    );
  } else if (field.dataType === "uuidArray") {
    if (!data[field.value]) {
      return <NoDataControl fontSize={fontSize} />;
    } else {
      const fieldDetail = field.field;
      return data[field.value].map((value: string, index: number) => {
        return (
          <DetailRecordLookup
            key={index}
            appName={
              fieldDetail?.dataTypeMetadata?.allLookups[0]?.moduleName.split(
                "."
              )[0]
            }
            modelName={
              fieldDetail?.dataTypeMetadata?.allLookups[0]?.moduleName.split(
                "."
              )[1]
            }
            fieldDetail={fieldDetail}
            fontSize={fontSize.value}
            truncatedData={!!truncateData}
            value={value}
            searchBy={
              fieldDetail?.dataTypeMetadata?.allLookups[0]
                ?.fieldName as string[]
            }
            fieldDisplayExpression={
              fieldDetail?.dataTypeMetadata?.allLookups[0]
                ?.fieldName as string[]
            }
            fontColor={fontColor}
            dataProcessing={dataProcessing}
            displayType={displayType}
            fixedWidth={fixedWidth}
          />
        );
      });
    }
  } else if (field.dataType === "date") {
    return (
      <DetailDateControl
        fontSize={fontSize}
        truncateData={truncateData}
        data={data}
        field={field}
        fontColor={fontColor}
        user={user ?? undefined}
        displayType={displayType}
        countryCodeInUserPreference={countryCodeInUserPreference}
        appName={appName}
        modelName={modelName}
        showFieldEditInput={showFieldEditInput}
        updateModelFieldData={updateModelFieldData}
        fixedWidth={fixedWidth}
      />
    );
  } else if (field.dataType === "datetime") {
    return (
      <DetailDatetimeControl
        fontSize={fontSize}
        truncateData={truncateData}
        data={data}
        field={field}
        fontColor={fontColor}
        user={user ?? undefined}
        displayType={displayType}
        countryCodeInUserPreference={countryCodeInUserPreference}
        appName={appName}
        modelName={modelName}
        showFieldEditInput={showFieldEditInput}
        updateModelFieldData={updateModelFieldData}
        fixedWidth={fixedWidth}
      />
    );
  } else if (field.dataType === "url") {
    return (
      <DetailUrlControl
        data={data}
        field={field}
        truncateData={truncateData}
        fontSize={fontSize}
        viewType={viewType}
        appName={appName}
        modelName={modelName}
        showFieldEditInput={showFieldEditInput}
        updateModelFieldData={updateModelFieldData}
        fixedWidth={fixedWidth}
      />
    );
  } else if (field.dataType === "relatedTo") {
    return (
      <DetailRelatedTo
        data={data}
        field={field}
        truncateData={truncateData}
        fontSize={fontSize}
        fieldsList={fieldsList}
        handleRowClick={handleRowClick}
      />
    );
  }

  return <NoDataControl fontSize={fontSize} />;
};
