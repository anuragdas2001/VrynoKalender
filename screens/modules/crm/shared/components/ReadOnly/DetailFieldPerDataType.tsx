import React from "react";
import { User } from "../../../../../../models/Accounts";
import { getAppPathParts } from "../../utils/getAppPathParts";
import {
  IUserPreference,
  SupportedApps,
} from "../../../../../../models/shared";
import { AllowedViews } from "../../../../../../models/allowedViews";
import { DetailFieldValuePerDatatype } from "./DetailFieldValuePerDatatype";
import {
  FieldSupportedDataType,
  ICustomField,
} from "../../../../../../models/ICustomField";
import { getCountryCodeFromPreference } from "../Form/FormFields/FormFieldPhoneNumber";

export type DetailFieldPerDataTypeProps = {
  field: {
    label: string;
    value: string;
    dataType: FieldSupportedDataType;
    field: ICustomField | undefined;
  };
  detailSizeImage?: boolean;
  data: any;
  headerVisible: boolean;
  fontSize: { header: string; value: string };
  includeFlagInPhoneNumber?: boolean;
  truncateData?: boolean;
  isSample?: boolean;
  showIcons?: boolean;
  fontColor?: string;
  modelName?: string;
  manualModelName?: string;
  includeBaseUrl?: boolean;
  marginBottom?: string;
  user?: User;
  value?: string;
  userPreferences?: IUserPreference[];
  dataProcessed?: boolean;
  dataProcessing?: boolean;
  viewType?: "Card" | "List";
  supportedLabelLocation?: "onTop" | "onLeftSide";
  richTextOverflowScroll?: boolean;
  displayType?: string;
  fieldsList?: ICustomField[];
  colSpan?: number;
  customOpacity?: string | null;
  allowColour?: boolean;
  showMaskedIcon?: boolean;
  dataTestId?: string;
  renderRecordStatusToggle?: boolean;
  handleRowClick?: (record: Record<string, string>) => void;
  countryCodeInUserPreference?: string;
  appName?: SupportedApps;
  showFieldEditInput?: boolean;
  updateModelFieldData?: (field: string, value: any, id: string) => void;
  imageServiceName?: SupportedApps.crm | SupportedApps.accounts;
  imageServiceModelName?: string;
  imageServiceSubdomain?: string;
  fixedWidth?: string;
};

export function DetailFieldPerDataType({
  field,
  data,
  headerVisible = true,
  fontSize = {
    header: "text-sm",
    value: "text-sm",
  },
  truncateData = false,
  detailSizeImage,
  isSample = false,
  showIcons = false,
  fontColor,
  manualModelName,
  includeBaseUrl,
  marginBottom,
  dataProcessed,
  dataProcessing,
  supportedLabelLocation = "onTop",
  includeFlagInPhoneNumber = true,
  fieldsList,
  colSpan,
  richTextOverflowScroll,
  showMaskedIcon,
  renderRecordStatusToggle = false,
  handleRowClick,
  userPreferences,
  appName,
  showFieldEditInput = false,
  updateModelFieldData,
  imageServiceModelName,
  imageServiceSubdomain,
}: DetailFieldPerDataTypeProps) {
  const { ui, modelName } = getAppPathParts();
  const onDetail = ui === AllowedViews.detail;

  const [countryCodeInUserPreference, setCountryCodeInUserPreference] =
    React.useState<string>(
      userPreferences ? getCountryCodeFromPreference(userPreferences) : ""
    );
  React.useEffect(() => {
    if (userPreferences)
      setCountryCodeInUserPreference(
        getCountryCodeFromPreference(userPreferences)
      );
  }, [userPreferences]);

  return (
    <div
      className={`flex ${
        supportedLabelLocation === "onLeftSide"
          ? "gap-x-4 truncate"
          : "flex-col"
      } ${
        field.dataType === "recordImage"
          ? "col-span-full items-center justify-center "
          : field.dataType === "image"
          ? "items-center justify-center "
          : ""
      } ${colSpan ? `col-span-${colSpan}` : ""}  ${
        headerVisible ? (marginBottom ? marginBottom : "mb-3.5") : ""
      }`}
    >
      <span
        className={`text-gray-400 ${
          supportedLabelLocation === "onLeftSide" ? "whitespace-nowrap" : ""
        } ${fontSize.header} ${headerVisible ? "" : "hidden"} ${
          field.dataType === "image" || field.dataType === "recordImage"
            ? "hidden"
            : ""
        }`}
        data-testid={`${field.label}-label`}
      >
        {field.label}
      </span>
      <DetailFieldValuePerDatatype
        field={field}
        data={data}
        headerVisible={headerVisible}
        fontSize={fontSize}
        truncateData={truncateData}
        showIcons={showIcons}
        onDetail={detailSizeImage ? detailSizeImage : onDetail}
        modelName={manualModelName ? manualModelName : modelName}
        isSample={isSample}
        fontColor={fontColor}
        includeBaseUrl={includeBaseUrl}
        dataProcessed={dataProcessed}
        dataProcessing={dataProcessing}
        includeFlagInPhoneNumber={includeFlagInPhoneNumber}
        fieldsList={fieldsList}
        richTextOverflowScroll={richTextOverflowScroll}
        showMaskedIcon={showMaskedIcon}
        renderRecordStatusToggle={renderRecordStatusToggle}
        handleRowClick={handleRowClick}
        countryCodeInUserPreference={countryCodeInUserPreference}
        appName={appName}
        showFieldEditInput={showFieldEditInput}
        updateModelFieldData={updateModelFieldData}
        imageServiceModelName={imageServiceModelName}
        imageServiceSubdomain={imageServiceSubdomain}
      />
    </div>
  );
}
