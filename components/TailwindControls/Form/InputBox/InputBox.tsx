import React, { useRef } from "react";
import { IconInsideInputBox, IconLocation } from "../../IconInsideInputBox";
import { SupportedLabelLocations } from "../../SupportedLabelLocations";
import { kebabCase } from "change-case";
import RequiredIndicator from "../Shared/RequiredIndicator";
import { useFormikContext } from "formik";
import { useLazyQuery } from "@apollo/client";
import { handleDebounceSearch } from "../SearchBox/debounceHandler";
import { FETCH_QUERY } from "../../../../graphql/queries/fetchQuery";
import { Loading } from "../../Loading/Loading";
import { appsUrlGenerator } from "../../../../screens/modules/crm/shared/utils/appsUrlGenerator";
import { AllowedViews } from "../../../../models/allowedViews";
import { get } from "lodash";
import { ICustomField } from "../../../../models/ICustomField";
import { parse, eval as evaluate } from "expression-eval";
import InformationIcon from "remixicon-react/InformationFillIcon";
import { ClickOutsideToClose } from "../../shared/ClickOutsideToClose";
import { getDataObject } from "../../../../screens/modules/crm/shared/utils/getDataObject";

export const getPrecisedValueBack = (
  value: string | number,
  precision: number | undefined,
  findIndexOfdecimal: number
) => {
  if (findIndexOfdecimal === -1) return value;
  if (precision) {
    return Number(
      String(value)
        .substring(0, findIndexOfdecimal)
        .concat(
          String(value).substring(
            findIndexOfdecimal,
            findIndexOfdecimal + precision + 1
          )
        )
    );
  } else {
    return Number(String(value).substring(0, findIndexOfdecimal));
  }
};

export type InputBoxProps = {
  name: string;
  type?: string;
  dataTestId?: string;
  field?: ICustomField;
  fieldList?: ICustomField[];
  appName?: string;
  modelName?: string;
  id?: string;
  placeholder?: string;
  autoComplete?: string;
  label?: string;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  currentFormLayer?: boolean;
  labelLocation?: SupportedLabelLocations;
  value?: string;
  additionalFieldName?: string;
  replaceFromExpression?: string;
  isValid?: boolean;
  error?: string;
  externalError?: string;
  disabled?: boolean;
  required?: boolean;
  helpText?: React.ReactElement;
  allowMargin?: boolean;
  autoFocus?: boolean;
  allowHtmlFor?: boolean;
  wFull?: boolean;
  externalExpressionToCalculateValue?: string;
  marginTop?: string;
  rejectRequired?: boolean;
  addClear?: boolean;
  formResetted?: boolean;
  checkDuplicacy?: boolean;
  systemDefined?: boolean;
  maxLength?: number;
  precision?: number;
  nameId?: string;
  additionalValueToRemove?: number;
  showFieldExpression?: boolean;
  formulaExpressionToShow?: string;
  paddingInPixelForInputBox?: number;
  allowNegative?: boolean;
  rightIconClick?: () => void;
  onBlur?: () => void;
  onChange?: (e: React.ChangeEvent<any>) => void;
  onKeyPress?: (e: any) => void;
  handleFocus?: () => void;
  useExpression?: boolean;
  hideValidationMessages?: boolean;
};

function InputBox(
  {
    type = "text",
    placeholder = "",
    label,
    leftIcon,
    rightIcon,
    appName,
    modelName,
    additionalFieldName,
    externalExpressionToCalculateValue,
    replaceFromExpression,
    id,
    dataTestId,
    field,
    fieldList = [],
    name,
    currentFormLayer,
    isValid = true,
    labelLocation = SupportedLabelLocations.OnTop,
    value = "",
    error = undefined,
    externalError,
    disabled = false,
    required = false,
    helpText,
    autoComplete = "on",
    allowMargin = true,
    allowHtmlFor = true,
    wFull = false,
    marginTop = "",
    rejectRequired,
    formResetted,
    addClear,
    allowNegative,
    checkDuplicacy,
    systemDefined,
    maxLength,
    precision,
    nameId,
    additionalValueToRemove,
    showFieldExpression = false,
    formulaExpressionToShow,
    paddingInPixelForInputBox,
    rightIconClick = () => {},
    onBlur = () => {},
    onChange = () => {},
    onKeyPress,
    handleFocus,
    useExpression = true,
    hideValidationMessages = false,
  }: InputBoxProps,
  ref: React.Ref<any>
) {
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const wrapperRef = useRef(null);
  ClickOutsideToClose(wrapperRef, (value: boolean) => setShowExpression(value));
  const [searchProcessing, setSearchProcessing] =
    React.useState<boolean>(false);
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [formDisabled, setFormDisabled] = React.useState(disabled);
  const [checkDuplicacyMessage, setCheckDuplicacyMessage] =
    React.useState<boolean>();
  const paddingLeftClass = leftIcon ? "pl-12" : "pl-2";
  const paddingRightClass = rightIcon ? "pr-12" : "pr-2";
  const [lastSearchedValue, setLastSearchedValue] = React.useState<string>();
  const [precisionErrors, setPrecisionErrors] = React.useState<
    string | undefined
  >(undefined);
  const [showExpression, setShowExpression] = React.useState<boolean>(false);
  const [formBuilderMandatoryAllowed, setFormBuilderMandatoryAllowed] =
    React.useState<boolean>(true);

  let fieldExpression: string =
    externalExpressionToCalculateValue ??
    field?.dataTypeMetadata?.expression?.replaceAll(replaceFromExpression, "");
  const [fieldNameExpression, setFieldNameExpression] = React.useState<string>(
    externalExpressionToCalculateValue ??
      formulaExpressionToShow ??
      fieldExpression
  );

  const variableRegex = /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g;
  let modifiedExpression =
    fieldExpression &&
    fieldExpression.replace(
      variableRegex,
      (match: string) => match + (additionalFieldName ?? "")
    );
  let fieldNames = modifiedExpression?.match(variableRegex);
  let fieldsInExpression: any = modifiedExpression && parse(modifiedExpression);
  let dependingFields = fieldNames
    ?.map((field) => values[field])
    .concat(values[name])
    .concat([String(additionalValueToRemove)]);

  const divFlexCol =
    labelLocation === SupportedLabelLocations.OnTop
      ? "flex-col"
      : "items-center gap-x-4";
  const labelClasses =
    labelLocation === SupportedLabelLocations.OnLeftSide
      ? "w-1/3 pr-6"
      : "w-full";
  const borderClass =
    isValid || rejectRequired
      ? "border-vryno-form-border-gray"
      : "border-red-200";
  const focusBorderClass = isValid
    ? "focus:border-blue-200"
    : "focus:border-red-200";
  const textBoxClasses =
    labelLocation === SupportedLabelLocations.OnLeftSide ? "w-3/4" : "w-full";

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
              operator: "ieq",
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

  React.useEffect(() => {
    if (!values[name] || type !== "number") return;
    if (precision) {
      const findIndexOfdecimal = Number(String(values[name])?.lastIndexOf("."));
      if (findIndexOfdecimal === -1) {
        return;
      }
      if (findIndexOfdecimal !== -1 && String(values[name])?.length > 16) {
        return;
      }
      setFieldValue(
        name,
        getPrecisedValueBack(values[name], precision, findIndexOfdecimal)
      );
      setPrecisionErrors(undefined);
      return;
    } else {
      const findIndexOfdecimal = Number(String(values[name])?.indexOf("."));
      if (findIndexOfdecimal === -1) {
        setPrecisionErrors("Decimal is not allowed");
        return;
      }
      if (findIndexOfdecimal !== -1 && String(values[name])?.length > 16) {
        return;
      }
      setFieldValue(
        name,
        getPrecisedValueBack(values[name], precision, findIndexOfdecimal)
      );
      setPrecisionErrors(undefined);
      return;
    }
  }, [values[name], precision]);

  React.useEffect(() => {
    if (!dependingFields) return;
    if (!useExpression) return;
    if (
      (field && field.dataType === "expression") ||
      externalExpressionToCalculateValue
    ) {
      let context = {};
      fieldNames?.forEach(
        (value) =>
          (context = {
            ...context,
            [`${value}`]: Number(
              values[`${value}`]
                ? typeof values[`${value}`] === "string" &&
                  values[`${value}`] !== "NaN"
                  ? values[`${value}`]
                  : typeof values[`${value}`] === "number" &&
                    values[`${value}`] !== "NaN"
                  ? values[`${value}`]
                  : 0
                : 0
            ),
          })
      );
      const result =
        evaluate(fieldsInExpression, context) + (additionalValueToRemove ?? 0);
      const findIndexOfdecimal = Number(String(result)?.indexOf("."));
      setFieldValue(
        name,
        getPrecisedValueBack(result, precision, findIndexOfdecimal)
      );
    }
  }, dependingFields);

  React.useEffect(() => {
    if (fieldList?.length > 0) {
      let updatedFieldNameExpression: string[] =
        fieldNameExpression?.split(" ");
      if (!updatedFieldNameExpression) return;
      updatedFieldNameExpression = [
        ...updatedFieldNameExpression?.map((fieldName) => {
          const findIndex = fieldList.findIndex(
            (field) => `${replaceFromExpression}${field.name}` === fieldName
          );
          if (findIndex === -1) return fieldName;
          return `${fieldList[findIndex]?.label?.en}`;
        }),
      ];
      setFieldNameExpression(
        updatedFieldNameExpression.join(" ").replace(",", " ").trim()
      );
    }
    if (fieldList?.length > 0) {
      let updatedFieldNameExpression: string[] =
        fieldNameExpression?.split(" ");
      updatedFieldNameExpression?.forEach((fieldName) => {
        const findIndex = fieldList.findIndex(
          (field) => `${replaceFromExpression}${field.name}` === fieldName
        );
        if (findIndex === -1) return;
        if (!fieldList[findIndex]?.mandatory) {
          setFormBuilderMandatoryAllowed(false);
        }
      });
    }
  }, [fieldList]);

  return (
    <div
      className={`flex ${divFlexCol} ${
        type === "color" ? "my-1" : allowMargin && "my-2"
      } ${marginTop} ${wFull ? "w-full" : ""}`}
      data-control-type="input-box"
    >
      <div
        className={`${labelClasses} flex justify-between ${
          type === "color" ? "w-full" : ""
        }`}
      >
        <div
          className="flex gap-x-1"
          data-testid={`${label ? label : kebabCase(name)}-field`}
        >
          {label && (
            <label
              htmlFor={allowHtmlFor ? kebabCase(name) : ""}
              className={`text-sm tracking-wide text-vryno-label-gray whitespace-nowrap ${
                labelLocation === SupportedLabelLocations.OnTop ? "mb-2.5" : ""
              } w-full`}
            >
              {label}
              <RequiredIndicator
                required={
                  field?.dataType === "expression"
                    ? formBuilderMandatoryAllowed
                    : rejectRequired
                    ? false
                    : required
                }
              />
            </label>
          )}
          {label && showFieldExpression && fieldNameExpression && (
            <div className="relative inline-block">
              <InformationIcon
                id="not-clickable"
                size={18}
                className="text-vryno-gray cursor-pointer"
                onPointerEnter={() => setShowExpression(true)}
                onPointerLeave={() => setShowExpression(false)}
              />
              {showExpression && (
                <div
                  className="origin-top-right bg-gray-100 z-[1000] absolute right-0 mt-[0.5px] py-2 w-[200px] rounded-md ring-1 focus:outline-none"
                  role="menu"
                  id="navbarMenu"
                  ref={wrapperRef}
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                >
                  <label className="text-black ml-2 text-xsm box-decoration-clone break-all">
                    <span className=" text-gray-600 italic">Formula : </span>
                    {fieldNameExpression}
                  </label>
                </div>
              )}
            </div>
          )}
        </div>
        {addClear && !required && field?.dataType !== "expression" && (
          <div className="flex self-start">
            <input
              id={`clear-${nameId || kebabCase(name)}`}
              data-testid={kebabCase(`clear-${name}`)}
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
      <div className={`${textBoxClasses}`}>
        <div className={`relative w-full`}>
          {leftIcon && IconInsideInputBox(leftIcon, IconLocation.Left)}
          <input
            id={nameId || kebabCase(name)}
            data-testid={dataTestId ? kebabCase(dataTestId) : kebabCase(name)}
            name={name}
            type={type}
            maxLength={maxLength}
            onFocus={handleFocus}
            onChange={
              checkDuplicacy
                ? (e) => {
                    onChange(e);
                    handleDebounceSearch({
                      fieldName: kebabCase(name),
                      handleOnDebounce: (value) => handleOnChange(value),
                      setProcessingData: () => {},
                      ref: inputRef,
                    });
                  }
                : onChange
            }
            onBlur={onBlur}
            onKeyDown={
              onKeyPress
                ? onKeyPress
                : type === "number"
                ? (e) => {
                    if (
                      (e.code === "Minus" || e.charCode === 45) &&
                      !allowNegative
                    ) {
                      e.preventDefault();
                    }
                  }
                : onKeyPress
            }
            placeholder={
              (type === "number" || field?.dataType === "expression") &&
              typeof value === "number"
                ? !Number.isNaN(value)
                  ? value
                  : placeholder
                : value
                ? value
                : placeholder
            }
            value={
              (type === "number" || field?.dataType === "expression") &&
              typeof value === "number"
                ? !Number.isNaN(value)
                  ? value
                  : ""
                : value
                ? value
                : ""
            }
            disabled={formDisabled || disabled}
            ref={inputRef}
            min={allowNegative ? "" : "0"}
            step={precision ? "" : "1"}
            autoComplete={autoComplete}
            className={`border relative w-full rounded-md text-sm placeholder-vryno-placeholder focus:shadow-md focus:outline-none ${
              type === "color"
                ? `type-color-style ${
                    disabled || formDisabled ? "opacity-40" : ""
                  }`
                : paddingInPixelForInputBox
                ? `py-[${paddingInPixelForInputBox}px]`
                : "py-2"
            } ${borderClass} ${focusBorderClass} ${paddingRightClass} ${paddingLeftClass}`}
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
        {helpText}
        {hideValidationMessages ? (
          <></>
        ) : rejectRequired ? (
          !isValid || (error && !error?.includes("required")) ? (
            <label className="text-red-600 ml-2 mt-1 text-xs box-decoration-clone">
              {error}
            </label>
          ) : (
            <></>
          )
        ) : externalError ? (
          <label className="text-red-600 ml-2 mt-1 text-xs box-decoration-clone">
            {externalError}
          </label>
        ) : (
          !isValid &&
          error && (
            <label className="text-red-600 ml-2 mt-1 text-xs box-decoration-clone">
              {error}
            </label>
          )
        )}
        {values[name]
          ? checkDuplicacyMessage && (
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
            )
          : null}
      </div>
    </div>
  );
}
export default React.forwardRef(InputBox);
