import React from "react";
import PhoneInput, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { IconInsideInputBox, IconLocation } from "../../IconInsideInputBox";
import { useFormikContext } from "formik";
import { SupportedLabelLocations } from "../../SupportedLabelLocations";
import { paramCase } from "change-case";
import RequiredIndicator from "../Shared/RequiredIndicator";
import { useLazyQuery } from "@apollo/client";
import { FETCH_QUERY } from "../../../../graphql/queries/fetchQuery";
import { handleDebounceSearch } from "../SearchBox/debounceHandler";
import { Loading } from "../../Loading/Loading";
import { appsUrlGenerator } from "../../../../screens/modules/crm/shared/utils/appsUrlGenerator";
import { AllowedViews } from "../../../../models/allowedViews";
import _, { get } from "lodash";
import getCountryCode from "country-codes-list";
import { getDataObject } from "../../../../screens/modules/crm/shared/utils/getDataObject";
import { MobileInputProps } from "./MobileInputProps";

function FormMobileInputBox({
  placeholder = "",
  label,
  leftIcon,
  rightIcon,
  appName,
  modelName,
  id,
  name,
  countryCodeInUserPreference,
  labelLocation = SupportedLabelLocations.OnTop,
  disabled = false,
  required = false,
  country,
  currentFormLayer,
  allowMargin = true,
  rejectRequired,
  addClear,
  formResetted,
  checkDuplicacy,
  systemDefined,
  countryCodeFromTimezone,
  useCountryCode = false,
  paddingInPixelForInputBox,
  labelUsedForError,
  rightIconClick = () => {},
  onChange = () => {},
  dataTestId,
  hideValidationMessages,
}: MobileInputProps) {
  const { errors, touched, setFieldTouched, setFieldValue, values } =
    useFormikContext<Record<string, string>>();
  const [searchProcessing, setSearchProcessing] =
    React.useState<boolean>(false);
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [checkDuplicacyMessage, setCheckDuplicacyMessage] =
    React.useState<boolean>();
  const [invalidCountryCodeError, setInvalidCountryCodeError] =
    React.useState<boolean>(false);
  const [lastSearchedValue, setLastSearchedValue] = React.useState<string>();
  const [formDisabled, setFormDisabled] = React.useState(disabled);
  const isValid = touched[name] ? errors[name] === undefined : true;
  const [countryCode, setCountryCode] = React.useState<string>("");
  const [countryDetails, setCountryDetails] =
    React.useState<Record<string, string | number>>();
  const [dialCode, setDialCode] = React.useState<string>();

  const buttonContainerStyle = {
    borderColor: !isValid ? "#fecaca" : "#DDE2E8",
    borderRadius: "0.375rem",
    height: paddingInPixelForInputBox ? "35px" : "39px",
  };
  const inputContainerStyle = {
    width: "100%",
    fontSize: "14px",
    height: paddingInPixelForInputBox ? "35px" : "39px",
    borderColor: !isValid ? "#fecaca" : "#DDE2E8",
    borderRadius: "0.375rem",
  };
  const divFlexCol =
    labelLocation === SupportedLabelLocations.OnTop
      ? "flex-col"
      : "items-center";
  const labelClasses =
    labelLocation === SupportedLabelLocations.OnLeftSide
      ? "w-1/3 text-right pr-6"
      : "";
  const textBoxClasses =
    labelLocation === SupportedLabelLocations.OnLeftSide ? "w-3/4" : "";

  const [getSearchResults] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });
  const handleOnChange = async (value: string) => {
    if (appName && modelName) {
      if (lastSearchedValue === value) return;
      setSearchProcessing(true);
      await getSearchResults({
        variables: {
          modelName: modelName,
          fields: ["id", systemDefined ? name : `fields.${name}`],
          filters: [
            {
              operator: "eq",
              name: systemDefined ? name : `fields.${name}`,
              value: value,
            },
          ],
        },
      }).then((responseOnCompletion) => {
        if (responseOnCompletion?.data?.fetch?.data) {
          const filterSearchResult = responseOnCompletion?.data.fetch.data
            ? responseOnCompletion?.data.fetch.data.filter(
                (item: any) => item.id !== id
              )
            : [];
          setSearchResults(
            filterSearchResult.map((val: Record<string, any>) =>
              getDataObject(val)
            )
          );
        } else {
          setSearchResults([]);
        }
        setSearchProcessing(false);
      });
      setSearchProcessing(false);
      setLastSearchedValue(value);
    }
  };

  React.useEffect(() => {
    if (formDisabled === disabled) return;
    setFormDisabled(disabled);
  }, [disabled]);
  React.useEffect(() => {
    if (searchResults?.length > 0) {
      setCheckDuplicacyMessage(true);
    } else {
      setCheckDuplicacyMessage(false);
    }
  }, [searchResults]);
  React.useEffect(() => {
    if (formResetted) {
      setSearchResults([]);
    }
  }, [formResetted]);

  // Note: User preference in future. This is for when we upload values via mass update and there is no country code.
  //here
  React.useEffect(() => {
    if (
      values[name] &&
      !values[name].includes("+") &&
      countryDetails &&
      Object.keys(countryDetails)?.length > 0 &&
      useCountryCode
    ) {
      setFieldValue(
        name,
        `${
          countryDetails?.countryCallingCode
            ? `+${countryDetails?.countryCallingCode}`
            : "+91"
        } ${!values[name].includes("null") ? values[name] : "undefined"}`.trim()
      );
    }
  }, [values[name], countryDetails]);

  React.useEffect(() => {
    if (values[name] && !values[name].includes("+")) {
      setInvalidCountryCodeError(true);
    } else {
      setInvalidCountryCodeError(false);
    }
    setCountryDetails(
      getCountryCode
        .all()
        .filter(
          (countryName) =>
            countryName.countryCode.toLowerCase() ===
            (countryCodeInUserPreference && countryCodeInUserPreference !== ""
              ? countryCodeInUserPreference
              : country && country !== ""
              ? country
              : countryCodeFromTimezone && countryCodeFromTimezone !== ""
              ? countryCodeFromTimezone
              : "in"
            )?.toLowerCase()
        )[0]
    );
    setCountryCode(
      (countryCodeInUserPreference &&
      countryCodeInUserPreference !== "" &&
      !values[name]
        ? countryCodeInUserPreference
        : countryCodeInUserPreference &&
          countryCodeInUserPreference !== "" &&
          values[name]
        ? ""
        : country && country !== ""
        ? country
        : countryCodeFromTimezone &&
          countryCodeFromTimezone !== "" &&
          !values[name]
        ? countryCodeFromTimezone
        : values[name]
        ? ""
        : process.env.NEXT_PUBLIC_RECORD_COUNTRY_CODE || ""
      ).toLowerCase()
    );
  }, [
    countryCodeInUserPreference,
    country,
    countryCodeFromTimezone,
    values[name],
  ]);

  const handlePhoneChange = React.useCallback(
    (
      value: string,
      data: {} | CountryData,
      event: React.ChangeEvent<HTMLInputElement>,
      formattedValue: string
    ) => {
      setCountryDetails({});
      if (formattedValue) {
        let updatedDialCode = _.get(data, "dialCode", "");
        if (
          (!values[name] ||
            (formattedValue?.length === 2 && formattedValue.includes("+"))) &&
          formattedValue
        ) {
          event.target?.focus();
          if (event.target?.setSelectionRange) {
            event.target?.setSelectionRange(
              formattedValue?.length ?? 0 + 4,
              formattedValue?.length ?? 0 + 4
            );
          }
        }
        if (
          !dialCode &&
          !values[name] &&
          !formattedValue.includes(`+${updatedDialCode}`)
        ) {
          setFieldValue(name, updatedDialCode + formattedValue);
          setFieldTouched(name);
        } else {
          setFieldValue(name, formattedValue);
        }
      } else {
        setFieldValue(name, undefined);
      }
      setDialCode(_.get(data, "dialCode", ""));
    },
    [values[name]]
  );

  return (
    <div className={`flex ${divFlexCol} ${allowMargin && "my-2"}`}>
      <div className="w-full flex justify-between">
        {label && (
          <label
            htmlFor={paramCase(name)}
            className={`mb-2.5 text-sm tracking-wide text-vryno-label-gray ${labelClasses}`}
          >
            {label}
            <RequiredIndicator required={rejectRequired ? false : required} />
          </label>
        )}
        {addClear && !required && (
          <div className="flex self-start">
            <input
              id={`clear-${name}`}
              data-testid={paramCase(`clear-${name}`)}
              type="checkbox"
              onClick={() => {
                if (formDisabled) {
                  setFieldValue(name, "");
                  setFormDisabled(false);
                  return;
                }
                setFieldValue(name, null);
                setFormDisabled(true);
              }}
              className="cursor-pointer mr-1.5"
            />
            <label htmlFor={`clear-${name}`} className="cursor-pointer text-xs">
              clear
            </label>
          </div>
        )}
      </div>
      <div className={`relative ${textBoxClasses}`} onChange={onChange}>
        {leftIcon && IconInsideInputBox(leftIcon, IconLocation.Left)}
        <PhoneInput
          onBlur={() => {
            setFieldTouched(name);
          }}
          prefix={
            values[name] === null || values[name] === "+" ? undefined : "+"
          }
          onChange={
            checkDuplicacy
              ? (phoneValue, countryData, event, formattedValue) => {
                  handlePhoneChange(
                    phoneValue,
                    countryData,
                    event,
                    formattedValue
                  );
                  handleDebounceSearch({
                    fieldName: paramCase(name + modelName + currentFormLayer),
                    handleOnDebounce: (value) => handleOnChange(value),
                    setProcessingData: () => {},
                  });
                }
              : (phoneValue, countryData, event, formattedValue) => {
                  handlePhoneChange(
                    phoneValue,
                    countryData,
                    event,
                    formattedValue
                  );
                }
          }
          inputProps={{
            id: paramCase(name + modelName + currentFormLayer),
            name: paramCase(name + modelName + currentFormLayer),
            "data-testid": dataTestId
              ? paramCase(dataTestId)
              : paramCase(`${name}`),
          }}
          placeholder={
            values[name] && Array.isArray(values[name])
              ? placeholder
              : values[name]
              ? values[name]
              : placeholder
          }
          value={
            values[name] && Array.isArray(values[name])
              ? null
              : values[name]
              ? values[name]
              : null
          }
          disabled={formDisabled}
          buttonStyle={buttonContainerStyle}
          inputStyle={inputContainerStyle}
          country={
            values[name] === undefined
              ? ""
              : useCountryCode && !values[name]
              ? countryCode
              : (countryCodeInUserPreference &&
                countryCodeInUserPreference !== "" &&
                !values[name]
                  ? countryCodeInUserPreference
                  : countryCodeInUserPreference &&
                    countryCodeInUserPreference !== "" &&
                    values[name]
                  ? ""
                  : country && country !== ""
                  ? country
                  : countryCodeFromTimezone &&
                    countryCodeFromTimezone !== "" &&
                    !values[name]
                  ? countryCodeFromTimezone
                  : values[name]
                  ? ""
                  : process.env.NEXT_PUBLIC_RECORD_COUNTRY_CODE || ""
                ).toLowerCase()
          }
          inputClass={"h-28"}
        />
        {searchProcessing && checkDuplicacy ? (
          <div
            className={`absolute flex rounded-tl-lg rounded-bl-lg top-0 h-full w-10 right-0`}
          >
            <div
              className={`flex items-center justify-center rounded-tl-lg rounded-bl-lg text-lg h-full w-full ${
                disabled ? "text-gray-300" : "text-gray-600"
              }`}
            >
              <Loading color="Blue" />
            </div>
          </div>
        ) : (
          rightIcon &&
          IconInsideInputBox(rightIcon, IconLocation.Right, rightIconClick)
        )}
      </div>
      {hideValidationMessages ? (
        <></>
      ) : rejectRequired ? (
        !(touched[name] ? errors[name] === undefined : true) &&
        !errors[name]?.includes("required") ? (
          <label className="text-red-600 ml-2 mt-1 text-xs box-decoration-clone">
            {errors[name]}
          </label>
        ) : (
          <></>
        )
      ) : invalidCountryCodeError ? (
        <label className="text-red-600 ml-2 mt-1 text-xs box-decoration-clone">
          {`Invalid ${
            label ? label : labelUsedForError ? labelUsedForError : name
          }`}
        </label>
      ) : !touched[name] ? (
        errors[name] === undefined ? (
          <></>
        ) : (
          <></>
        )
      ) : (
        touched[name] &&
        errors[name] && (
          <label className="text-red-600 ml-2 mt-1 text-xs box-decoration-clone">
            {errors[name]}
          </label>
        )
      )}
      {checkDuplicacyMessage && (
        <label className="text-vryno-theme-blue-secondary ml-2 mt-1 text-xs box-decoration-clone block">
          <a
            href={appsUrlGenerator(
              appName ?? "",
              modelName ?? "",
              AllowedViews.detail,
              get(searchResults[0], "id", "")
            )}
            target="_blank"
            rel="noreferrer"
          >
            {values[name]} in {label} already exists.
          </a>
        </label>
      )}
    </div>
  );
}
export default FormMobileInputBox;
