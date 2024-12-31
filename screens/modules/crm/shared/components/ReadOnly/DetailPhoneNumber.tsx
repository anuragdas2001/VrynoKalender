import React from "react";
import { get } from "lodash";
import Link from "next/link";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import { useLazyQuery } from "@apollo/client";
import { getTimezone, Timezone } from "countries-and-timezones";
import WhatsappIcon from "remixicon-react/WhatsappFillIcon";
import { getPhoneNumberValue } from "./getPhoneNumberValue";
import {
  IUserPreference,
  SupportedApps,
} from "../../../../../../models/shared";
import { getCountryCodeFromPreference } from "../Form/FormFields/FormFieldPhoneNumber";
import { FETCH_QUERY } from "../../../../../../graphql/queries/fetchQuery";
import {
  FieldSupportedDataType,
  ICustomField,
} from "../../../../../../models/ICustomField";
import { MaskedFieldComponent } from "./Shared/MaskedFieldComponent";
import { NoDataControl } from "./NoDataControl";
import { CopyToClipboard } from "./Shared/CopyToClipboard";
import { Tooltip } from "react-tooltip";
import { IEditInputDetails, ShowFieldEdit } from "./Shared/ShowFieldEdit";
import { FieldEditInput } from "./Shared/FieldEditInput";

type DetailPhoneNumberProps = {
  data: any;
  field: {
    label: string;
    value: string;
    dataType: FieldSupportedDataType;
    field: ICustomField | undefined;
  };
  userPreferences: IUserPreference[];
  timeZone: Timezone | null;
  onSearch?: boolean;
  onDetail: boolean;
  viewType?: "Card" | "List" | undefined;
  fixedWidth?: string;
};

const PhoneNumberInputStyle = ({
  data,
  field,
  userPreferences,
  timeZone,
  onSearch,
  onDetail,
  viewType,
}: DetailPhoneNumberProps) => {
  const value = getPhoneNumberValue(
    data[field.value],
    get(data, field.value),
    userPreferences,
    timeZone
  );
  return (
    <PhoneInput
      value={value}
      inputProps={{
        "data-testid": `${field?.label || field.value}-${value}`,
      }}
      placeholder={value}
      containerStyle={{
        padding: 0,
      }}
      buttonStyle={{
        border: "none",
        backgroundColor: "transparent",
        padding: 0,
        margin: 0,
      }}
      disableCountryGuess={true}
      inputStyle={{
        fontSize: onSearch ? "12px" : onDetail ? "14px" : "13px",
        border: "none",
        cursor: "pointer",
        color: onSearch ? "#000" : "#2F98FF",
        padding: "0px 0px 0px 38px",
        margin: 0,
        height: "100%",
        width: "100%",
        maxWidth: "175px",
        minWidth: viewType === "List" ? "175px" : "100%",
        backgroundColor: "transparent",
      }}
      searchStyle={{
        padding: 0,
        margin: 0,
      }}
      dropdownStyle={{
        padding: 0,
        margin: 0,
      }}
      country={
        getCountryCodeFromPreference(userPreferences)
          ? getCountryCodeFromPreference(userPreferences)
          : timeZone && timeZone?.countries?.length > 0
          ? timeZone?.countries[0]
          : process.env.NEXT_PUBLIC_RECORD_COUNTRY_CODE
      }
      disabled={true}
      disableDropdown={true}
      onClick={(e) => {
        e.preventDefault();
      }}
      data-test-id={`${getPhoneNumberValue(
        data[field.value],
        get(data, field.value),
        userPreferences,
        timeZone
      )}`}
    />
  );
};

const PhoneNumberDisplayContent = ({
  data,
  field,
  userPreferences,
  timeZone,
  onSearch,
  onDetail,
  viewType,
  fixedWidth,
}: DetailPhoneNumberProps) => {
  return (
    <div className={`gap-x-2 inline-flex items-center ${fixedWidth || ""}`}>
      <Tooltip
        id={`${field.label}-tooltip`}
        style={{
          backgroundColor: "rgb(178 209 247)",
          color: "rgb(55 65 81)",
          fontSize: "13px",
          lineHeight: "19.5px",
          borderRadius: "6px",
          padding: "4px 8px",
          margin: "0px",
        }}
        data-tooltip-id={`${field.label}-tooltip`}
        data-tooltip-content={formatPhoneNumberIntl(
          getPhoneNumberValue(
            data[field.value],
            get(data, field.value),
            userPreferences,
            timeZone
          )
        )}
      />
      <a
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="cursor-pointer flex"
        href={`tel:${
          data[field.value].toString() || get(data, field.value).toString()
        }`}
        data-tooltip-id={`${field.label}-tooltip`}
        data-tooltip-content={formatPhoneNumberIntl(
          getPhoneNumberValue(
            data[field.value],
            get(data, field.value),
            userPreferences,
            timeZone
          )
        )}
        data-testid={`${field?.label || field.value}-value`}
      >
        <PhoneNumberInputStyle
          data={data}
          field={field}
          onDetail={onDetail}
          viewType={viewType}
          onSearch={onSearch}
          userPreferences={userPreferences}
          timeZone={timeZone}
        />
      </a>
      <Link
        href={`https://wa.me/${getPhoneNumberValue(
          data[field.value],
          get(data, field.value),
          userPreferences,
          timeZone
        )}`}
        legacyBehavior
      >
        <a
          onClick={(e) => {
            e.stopPropagation();
          }}
          target="_blank"
          className=""
        >
          <WhatsappIcon size={16} className={`text-green-500`} />
        </a>
      </Link>
    </div>
  );
};

export const DetailPhoneNumber = ({
  includeFlagInPhoneNumber,
  data,
  field,
  userPreferences,
  onSearch,
  onDetail,
  truncateData,
  fontSize,
  displayType,
  fontColor = "text-vryno-card-value",
  viewType = "Card",
  showMaskedIcon = false,
  countryCodeInUserPreference,
  appName,
  modelName,
  showFieldEditInput = false,
  updateModelFieldData,
  fixedWidth,
}: {
  includeFlagInPhoneNumber?: boolean;
  data: any;
  field: {
    label: string;
    value: string;
    dataType: FieldSupportedDataType;
    field: ICustomField | undefined;
  };
  userPreferences: IUserPreference[];
  onSearch?: boolean;
  onDetail: boolean;
  truncateData?: boolean;
  fontSize: { header: string; value: string };
  displayType: string;
  fontColor: string | undefined;
  viewType: "List" | "Card" | undefined;
  showMaskedIcon?: boolean;
  countryCodeInUserPreference?: string;
  appName?: SupportedApps;
  modelName?: string;
  showFieldEditInput?: boolean;
  updateModelFieldData?: (field: string, value: any, id: string) => void;
  fixedWidth?: string;
}) => {
  const timeZone = getTimezone(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const fieldDetail = field.field;
  const [showMaskedData, setShowMaskedData] = React.useState(false);
  const [maskedFieldData, setMaskedFieldData] = React.useState<{
    oldValue: any;
    newValue: any;
  }>({
    oldValue: "",
    newValue: "",
  });
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

  React.useEffect(() => {
    setMaskedFieldData({
      ...maskedFieldData,
      oldValue: data[field.value] || get(data, field.value) || "-",
    });
  }, [data[field.value]]);

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
        setMaskedFieldData={(value: { oldValue: any; newValue: any }) =>
          setMaskedFieldData(value)
        }
      />
    );
  }

  const dataValue =
    (data[field.value] && typeof data[field.value] === "string") ||
    (get(data, field.value) && typeof get(data, field.value) === "string")
      ? data[field.value] || get(data, field.value)
      : "";
  const dataToDisplay = !showMaskedIcon
    ? dataValue
    : (data[field.value] && typeof data[field.value] === "string") ||
      (get(data, field.value) && typeof get(data, field.value) === "string")
    ? !showMaskedData
      ? maskedFieldData.oldValue
      : maskedFieldData.newValue || ""
    : "";

  if (
    !fieldDetail?.isMasked &&
    includeFlagInPhoneNumber &&
    (data[field.value] || get(data, field.value))
  ) {
    return (
      <div
        className={
          showFieldEditInput
            ? "flex items-center gap-x-1 group"
            : "inline-block"
        }
      >
        <PhoneNumberDisplayContent
          data={data}
          field={field}
          userPreferences={userPreferences}
          timeZone={timeZone}
          onSearch={onSearch}
          onDetail={onDetail}
          viewType={viewType}
        />
        <ShowFieldEdit
          setEditInputDetails={handleFieldEdit}
          dataToDisplay={dataToDisplay}
          field={field.field}
          showFieldEditInput={showFieldEditInput}
          id={data?.["id"]}
        />
      </div>
    );
  } else {
    if (
      showMaskedData &&
      includeFlagInPhoneNumber &&
      (data[field.value] || get(data, field.value))
    ) {
      return (
        <p
          className={`flex gap-x-1 ${fontColor} ${displayType} ${
            fontSize.value
          } ${fixedWidth || ""} ${
            showFieldEditInput
              ? "flex items-center gap-x-1 group"
              : "inline-block"
          }`}
        >
          <PhoneNumberDisplayContent
            data={{ ...data, [field.value]: maskedFieldData.newValue }}
            field={field}
            userPreferences={userPreferences}
            timeZone={timeZone}
            onSearch={onSearch}
            onDetail={onDetail}
            viewType={viewType}
          />
          <MaskedFieldComponent
            fieldDetail={fieldDetail}
            field={field}
            fetchMaskedFieldData={fetchMaskedFieldData}
            showMaskedData={showMaskedData}
            maskedFieldData={maskedFieldData}
            setShowMaskedData={setShowMaskedData}
            maskedDataLoading={maskedDataLoading}
          />
          {fieldDetail?.isMasked && showMaskedIcon ? (
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
            field={field.field}
            showFieldEditInput={showFieldEditInput}
            id={data?.["id"]}
          />
        </p>
      );
    }

    return (
      <p
        className={`${displayType} ${fontSize.value} ${fontColor} ${
          viewType === "List" || truncateData
            ? "truncate"
            : "break-words whitespace-pre-line"
        } ${
          showFieldEditInput
            ? "flex items-center gap-x-1 group"
            : "inline-block"
        }`}
        title={dataToDisplay}
      >
        <>
          {dataToDisplay ? (
            dataToDisplay
          ) : (
            <NoDataControl
              dataTestId={`${field.label || field.value}--`}
              fontSize={fontSize}
            />
          )}{" "}
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
        </>
        <ShowFieldEdit
          setEditInputDetails={handleFieldEdit}
          dataToDisplay={dataToDisplay !== "-" ? dataToDisplay : null}
          field={field.field}
          showFieldEditInput={showFieldEditInput}
          id={data?.["id"]}
        />
      </p>
    );
  }
};
