import React, { useContext, useRef } from "react";
import { useTranslation } from "next-i18next";
import { FormikValues, useFormikContext } from "formik";
import { useLazyQuery } from "@apollo/client";
import {
  FETCH_QUERY,
  FetchData,
  FetchVars,
} from "../../../../../../graphql/queries/fetchQuery";
import FormInputBox from "../../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import FormDropdown from "../../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import FormDatePicker from "../../../../../../components/TailwindControls/Form/DatePicker/FormDatePicker";
import FormDateTimePicker from "../../../../../../components/TailwindControls/Form/DateTimePicker/FormDateTimePicker";
import SwitchToggle from "../../../../../../components/TailwindControls/Form/SwitchToggle/SwitchToggle";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import { ILayout } from "../../../../../../models/ILayout";
import { ICustomField } from "../../../../../../models/ICustomField";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import { ConnectedMultipleValuesLookupBox } from "../../../../../../components/ConnectedControls/ConnectedMultipleValuesLookupBox/ConnectedMultipleValuesLookupBox";
import { camelCase } from "change-case";
import { AccountModels } from "../../../../../../models/Accounts";
import FormMultipleValuesDropdown from "../../../../../../components/TailwindControls/Form/MultipleValuesDropdown/FormMultipleValuesDropdown";
import { getSortedFieldList } from "../../../../crm/shared/utils/getOrderedFieldsList";
import { UserStoreContext } from "../../../../../../stores/UserStore";
import { InfoMessage } from "../../../../crm/shared/components/InfoMessage";
import FormTextAreaBox from "../../../../../../components/TailwindControls/Form/TextArea/FormTextAreaBox";
import { Loading } from "../../../../../../components/TailwindControls/Loading/Loading";
import { MixpanelActions } from "../../../../../Shared/MixPanel";
import { parse, eval as evaluate } from "expression-eval";
import { toast } from "react-toastify";
import { lookupMapper } from "../../../../crm/shared/utils/staticLookupMapper";
import { Option } from "../../../../../../components/TailwindControls/Form/MultipleValuesLookupBox/MultipleValuesLookupBoxProps";
import _ from "lodash";
import { setUpdatedOptions } from "../../../../../../components/TailwindControls/Form/MultipleValuesLookupBox/MultipleValuesLookupBox";

type CustomizationFormFieldsProps = {
  data: any;
  editMode: boolean;
  saveLoading: boolean;
  handleSave: () => void;
  onCancel: () => void;
  modules: IModuleMetadata[];
  fieldList: ICustomField[];
  currentModule?: string;
};

const fieldType = [
  { value: "singleline", label: "Single line Text" },
  { value: "number", label: "Number" },
  { value: "autoNumber", label: "Auto Number" },
  { value: "image", label: "Image" },
  { value: "date", label: "Date" },
  { value: "datetime", label: "Date & Time" },
  { value: "boolean", label: "Yes / No" },
  { value: "email", label: "Email" },
  { value: "url", label: "URL" },
  { value: "phoneNumber", label: "Phone Number" },
  { value: "multiline", label: "Text Area" },
  { value: "richText", label: "Text Editor" },
  { value: "expression", label: "Formula Field" },
  { value: "recordLookup", label: "Search box" },
  { value: "multiSelectRecordLookup", label: "Multi Select Search Box" },
  { value: "lookup", label: "Pick List" },
  { value: "multiSelectLookup", label: "Multi Select Pick List" },
  { value: "stringLookup", label: "Text Dropdown" },
];

const CustomizationFormFields = ({
  data,
  editMode,
  saveLoading,
  handleSave,
  onCancel,
  modules,
  fieldList,
  currentModule,
}: CustomizationFormFieldsProps) => {
  const { t } = useTranslation(["common"]);
  const formulaBuilderRef = useRef(null);
  const userContext = useContext(UserStoreContext);
  const { user } = userContext;
  const { values, setFieldValue } = useFormikContext<FormikValues>();
  const [dataTypeChanged, setDataTypeChanged] = React.useState(false);
  const [recordLookupFieldList, setRecordLookupFieldList] = React.useState<
    ICustomField[]
  >([]);
  const [editModeValues, setEditModeValues] = React.useState<Option[]>([]);
  const [recordLookupFieldListLoading, setRecordLookupFieldListLoading] =
    React.useState(true);
  const [fieldExist, setFieldExist] = React.useState<string | null>(null);
  const [pickupListError, setPickupListError] = React.useState<
    { error: boolean; fieldName: string }[]
  >([]);
  const [resetSearchBy, setResetSearchBy] = React.useState<boolean>();
  const [checkValidExpression, setCheckValidExpression] =
    React.useState<boolean>(true);
  const [currentCursorPosition, setCurrentCursorPosition] =
    React.useState<number>();
  const [moduleExists, setModuleExists] = React.useState<boolean>(true);

  const [getLayout] = useLazyQuery<FetchData<ILayout>, FetchVars>(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data?.length) {
        setRecordLookupFieldList(
          getSortedFieldList(responseOnCompletion.fetch.data[0].config.fields)
        );
      }
      setRecordLookupFieldListLoading(false);
    },
  });

  React.useEffect(() => {
    if (
      (values["recordLookupAppName"] &&
        values["recordLookupAppName"] !== "accounts") ||
      values["dataType"] === "expression"
    ) {
      const moduleExist =
        values["recordLookupModule"] === "lookup"
          ? []
          : modules.filter(
              (module) => module.name === values["recordLookupModule"]
            );
      if (
        !moduleExist.length &&
        values["recordLookupModule"] !== "lookup" &&
        values["dataType"] !== "expression"
      ) {
        setModuleExists(false);
        setRecordLookupFieldListLoading(false);
        return;
      }
      getLayout({
        context: {
          headers: {
            vrynopath:
              values["dataType"] === "expression"
                ? "crm"
                : values["recordLookupAppName"],
          },
        },
        variables: {
          modelName: "Layout",
          fields: ["id", "name", "moduleName", "layout", "config", "type"],
          filters: [
            {
              name: "moduleName",
              operator: "eq",
              value: [
                values["dataType"] === "expression"
                  ? currentModule ?? ""
                  : values["recordLookupModule"],
              ],
            },
          ],
        },
      });
    } else {
      setRecordLookupFieldListLoading(false);
    }
  }, [editMode, values["dataType"]]);

  React.useEffect(() => {
    if (!editMode) {
      setFieldValue("visible", true);
      setFieldValue("dataType", fieldType[0].value);
      setFieldValue("minVal", 5);
      setFieldValue("maxVal", 50);
    }
  }, []);
  React.useEffect(() => {
    let fieldName = `${camelCase(`custom ${values["label"]}`)}`;
    let fieldAlreadyExist = fieldList.filter(
      (field) => field.name === fieldName
    );
    if (fieldAlreadyExist.length > 0) {
      setFieldExist("Field already exist");
    } else {
      setFieldExist(null);
    }
  }, [values["label"]]);
  React.useEffect(() => {
    if (!values["label"] && !editMode) {
      setFieldValue("name", values["label"]);
    }
    if (values["label"] && !editMode) {
      let fieldName = `${camelCase(`custom ${values["label"]}`)}`;
      setFieldValue("name", fieldName);
    }
  }, [values["label"]]);

  React.useEffect(() => {
    if (values["mandatory"]) setFieldValue("visible", true);
  }, [values["mandatory"]]);

  React.useEffect(() => {
    if (values["mandatory"] && !values["visible"])
      setFieldValue("mandatory", false);
  }, [values["visible"]]);

  React.useEffect(() => {
    if (resetSearchBy) setResetSearchBy(false);
  }, [resetSearchBy]);

  const handlePickupListError = (value: {
    error: boolean;
    fieldName: string;
  }) => {
    const updatedPickupListError = [...pickupListError];
    const foundAt = updatedPickupListError.findIndex(
      (item) => item.fieldName === value.fieldName
    );
    if (foundAt !== -1) {
      updatedPickupListError[foundAt] = {
        error: value.error,
        fieldName: value.fieldName,
      };
      setPickupListError(updatedPickupListError);
    } else {
      setPickupListError([
        ...updatedPickupListError,
        { error: value.error, fieldName: value.fieldName },
      ]);
    }
  };

  const getCursorPosition = () => {
    if (formulaBuilderRef.current) {
      const cursorPosition = formulaBuilderRef.current["selectionStart"];
      setCurrentCursorPosition(cursorPosition);
    }
  };

  React.useEffect(() => {
    if (values["dataType"] === "autoNumber") {
    }
  }, [values["dataType"]]);

  React.useEffect(() => {
    if (values["formulaBuilder"]) {
      let fieldExpression: string = values["formulaBuilder"];
      const variableRegex = /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g;
      let modifiedExpression =
        fieldExpression &&
        fieldExpression.replace(variableRegex, (match: string) => match);
      try {
        if (
          !["BinaryExpression", "Literal", "MemberExpression"].includes(
            parse(modifiedExpression)?.type
          )
        ) {
          setCheckValidExpression(false);
          return;
        }
        setCheckValidExpression(true);
      } catch (error) {
        setCheckValidExpression(false);
      }
    }
  }, [values["formulaBuilder"]]);

  React.useEffect(() => {
    if (values["defaultOption"] && editModeValues?.length > 0) {
      let updatedOptions: Option[] = _.cloneDeep(
        (editModeValues as Option[]).map((option) => {
          if (option?.newRecord) {
            if (option.id == values["defaultOption"]) {
              return { ...option, defaultOption: true };
            } else {
              return { ...option, defaultOption: false };
            }
          } else {
            if (option.value == values["defaultOption"]) {
              return { ...option, defaultOption: true };
            } else {
              return { ...option, defaultOption: false };
            }
          }
        })
      );
      setFieldValue(
        "lookupOptions",
        setUpdatedOptions(_.cloneDeep(updatedOptions), values["dataType"])
      );
    }
  }, [values["defaultOption"]]);

  React.useEffect(() => {
    if (
      values["multiDefaultOptions"] &&
      Array.isArray(values["multiDefaultOptions"]) &&
      editModeValues?.length > 0
    ) {
      let updatedOptions: Option[] = _.cloneDeep(
        (editModeValues as Option[]).map((option) => {
          if (option?.newRecord) {
            if (
              values["multiDefaultOptions"]?.filter(
                (value: string[]) => value == (option.id as any)
              )?.length > 0
            ) {
              return { ...option, defaultOption: true };
            } else {
              return { ...option, defaultOption: false };
            }
          } else {
            if (
              values["multiDefaultOptions"]?.filter(
                (value: string[]) => value == (option.value as any)
              )?.length > 0
            ) {
              return { ...option, defaultOption: true };
            } else {
              return { ...option, defaultOption: false };
            }
          }
        })
      );
      setFieldValue(
        "lookupOptions",
        setUpdatedOptions(_.cloneDeep(updatedOptions), values["dataType"])
      );
    }
  }, [values["multiDefaultOptions"]]);

  return (
    <div className="w-full">
      <div className="w-full max-h-[55vh] overflow-y-auto pr-1.5 card-scroll mt-4">
        {!moduleExists && (
          <p className="text-vryno-danger text-sm" id="module-not-found">
            **Related crm module not found!
          </p>
        )}
        <div className={"w-full grid sm:grid-cols-2 gap-x-6"}>
          <FormInputBox
            name="label"
            label="Label"
            type="text"
            required={true}
          />
          <FormInputBox
            name="name"
            label="Name"
            type="text"
            disabled={editMode}
            externalError={!editMode && fieldExist ? fieldExist : ""}
            required={true}
          />
          <FormDropdown
            name="dataType"
            label="Field Type"
            options={
              editMode
                ? fieldType
                : fieldType?.filter((type) => type.value !== "stringLookup")
            }
            disabled={editMode}
            required={true}
            onChange={(selectedOption) => {
              setFieldValue("dataType", selectedOption.currentTarget.value);
              setFieldValue("minVal", null);
              setFieldValue("maxVal", null);
              setFieldValue("numberPrecision", "0");
              setDataTypeChanged(true);
              if (selectedOption.currentTarget.value === "expression") {
                getLayout({
                  context: {
                    headers: {
                      vrynopath: "crm",
                    },
                  },
                  variables: {
                    modelName: "Layout",
                    fields: [
                      "id",
                      "name",
                      "moduleName",
                      "layout",
                      "config",
                      "type",
                    ],
                    filters: [
                      {
                        name: "moduleName",
                        operator: "eq",
                        value: [currentModule ?? ""],
                      },
                    ],
                  },
                });
              }
            }}
          />
          {["expression"].includes(values["dataType"]) && (
            <>
              <FormDropdown
                name="numberPrecision"
                label="Decimal Number Upto Precision"
                options={[
                  { value: "0", label: "0 decimal point" },
                  { value: "2", label: "2 decimal point" },
                  { value: "4", label: "4 decimal point" },
                ]}
                onChange={(selectedOption) => {
                  setFieldValue(
                    "numberPrecision",
                    selectedOption.currentTarget.value
                  );
                }}
              />
              {recordLookupFieldListLoading ? (
                <div
                  className={`col-span-full flex items-center justify-center border border-dashed p-2 rounded-lg bg-gray-200 mt-4 `}
                >
                  <Loading color="Blue" />
                </div>
              ) : recordLookupFieldList?.filter(
                  (field) => field.dataType === "number"
                )?.length > 0 ? (
                <div
                  className={`col-span-full grid grid-cols-3 gap-x-4 border border-dashed p-2 rounded-lg bg-gray-200 mt-4 `}
                >
                  <FormDropdown
                    name="expressionBrackets"
                    label="Brackets available"
                    options={[
                      { value: "(", label: "Open Bracket (" },
                      { value: ")", label: "Closed Bracket )" },
                    ]}
                    onChange={(selectedOption) => {
                      setFieldValue(
                        "formulaBuilder",
                        values["formulaBuilder"]
                          ? values["formulaBuilder"]
                              .concat(selectedOption.currentTarget.value)
                              .concat(" ")
                          : selectedOption.currentTarget.value.concat(" ")
                      );
                    }}
                  />
                  <FormDropdown
                    name="expressionFields"
                    label="Available Fields"
                    options={recordLookupFieldList
                      ?.filter((field) => field.dataType === "number")
                      ?.map((field) => {
                        return {
                          value: field.name,
                          label: field.label.en,
                        };
                      })}
                    onChange={(selectedOption) => {
                      setFieldValue(
                        "formulaBuilder",
                        values["formulaBuilder"]
                          ? values["formulaBuilder"]
                              .concat(
                                `${currentModule}.${selectedOption.currentTarget.value}`
                              )
                              .concat(" ")
                          : `${currentModule}.${selectedOption.currentTarget.value}`.concat(
                              " "
                            )
                      );
                    }}
                  />
                  <FormDropdown
                    name="expressionArithmeticOperator"
                    label="Arithmetic Operator"
                    options={[
                      { value: "+", label: "Add ( + )" },
                      { value: "-", label: "Subtract ( - )" },
                      { value: "*", label: "Multiply ( * )" },
                      { value: "/", label: "Divide ( / )" },
                      { value: "%", label: "Module ( % )" },
                    ]}
                    onChange={(selectedOption) => {
                      setFieldValue(
                        "formulaBuilder",
                        values["formulaBuilder"]
                          ? values["formulaBuilder"]
                              .concat(selectedOption.currentTarget.value)
                              .concat(" ")
                          : selectedOption.currentTarget.value.concat(" ")
                      );
                    }}
                  />
                  <div className="col-span-full">
                    <FormTextAreaBox
                      name="formulaBuilder"
                      label="Formula Builder"
                      required={true}
                      rows={4}
                      reference={formulaBuilderRef}
                      externalError={
                        values["formulaBuilder"] && !checkValidExpression
                          ? "Expression is invalid"
                          : ""
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className={`col-span-full`}>
                  <InfoMessage
                    messageType="warning"
                    message="No field of number datatype available on this module."
                  />
                </div>
              )}
            </>
          )}
          {["recordLookup", "multiSelectRecordLookup"].includes(
            values["dataType"]
          ) &&
            values["name"] !== "dealPipelineId" &&
            values["name"] !== "dealStageId" &&
            values["name"] !== "productTaxIds" && (
              <FormDropdown
                name="recordLookupAppName"
                label="Record Lookup App"
                options={[
                  { value: "crm", label: "CRM" },
                  { value: "accounts", label: "Accounts" },
                ]}
                disabled={editMode || values["recordLookupFields"]?.length > 0}
                onChange={(selectedOption) => {
                  if (
                    values["isSubform"] &&
                    selectedOption.currentTarget.value === "accounts"
                  ) {
                    toast.error("Subform cannot be created for Accounts");
                    return;
                  }
                  setFieldValue(
                    "recordLookupAppName",
                    selectedOption.currentTarget.value
                  );
                  setFieldValue("recordLookupModule", null);
                }}
              />
            )}
          {moduleExists &&
            ["recordLookup", "multiSelectRecordLookup"].includes(
              values["dataType"]
            ) &&
            values["name"] !== "dealPipelineId" &&
            values["name"] !== "dealStageId" &&
            values["name"] !== "productTaxIds" &&
            values["recordLookupAppName"] && (
              <FormDropdown
                name="recordLookupModule"
                label="Record Lookup Module"
                options={
                  values["recordLookupAppName"] === "accounts"
                    ? [{ value: "user", label: "User" }]
                    : values["recordLookupAppName"] === "crm"
                    ? modules.map((module) => {
                        return { value: module.name, label: module.label.en };
                      })
                    : []
                }
                disabled={editMode || values["recordLookupFields"]?.length > 0}
                editMode={editMode}
                onChange={(selectedOption) => {
                  setFieldValue(
                    "recordLookupModule",
                    selectedOption.currentTarget.value
                  );
                  setFieldValue("searchByFields", []);
                  setResetSearchBy(true);
                  {
                    values["recordLookupAppName"] !== "accounts" &&
                      getLayout({
                        context: {
                          headers: {
                            vrynopath: values["recordLookupAppName"],
                          },
                        },
                        variables: {
                          modelName: "Layout",
                          fields: [
                            "id",
                            "name",
                            "moduleName",
                            "layout",
                            "config",
                            "type",
                          ],
                          filters: [
                            {
                              name: "moduleName",
                              operator: "eq",
                              value: [selectedOption.currentTarget.value],
                            },
                          ],
                        },
                      });
                  }
                }}
              />
            )}

          {moduleExists &&
            ["recordLookup", "multiSelectRecordLookup"].includes(
              values["dataType"]
            ) &&
            values["recordLookupModule"] &&
            values["name"] !== "dealPipelineId" &&
            values["name"] !== "dealStageId" &&
            values["name"] !== "productTaxIds" &&
            values["recordLookupModule"] !== "Lookup" &&
            values["recordLookupModule"] !== AccountModels.User && (
              <div className="">
                <FormInputBox
                  label={`Displayed in ${
                    modules.filter(
                      (module) => module.name === values["recordLookupModule"]
                    )?.length > 0 &&
                    modules.filter(
                      (module) => module.name === values["recordLookupModule"]
                    )[0].label.en
                  } as`}
                  name="displayInReverseLookupAs"
                />
              </div>
            )}
          {moduleExists &&
            ["recordLookup", "multiSelectRecordLookup"].includes(
              values["dataType"]
            ) &&
            values["recordLookupModule"] &&
            values["name"] !== "dealPipelineId" &&
            values["name"] !== "dealStageId" &&
            values["name"] !== "productTaxIds" &&
            values["recordLookupModule"] !== "Lookup" &&
            values["recordLookupModule"] !== AccountModels.User && (
              <div className="col-span-full">
                <FormMultipleValuesDropdown
                  label={`Search by in ${
                    values["recordLookupModule"] === AccountModels.User
                      ? "User"
                      : modules.filter(
                          (module) =>
                            module.name === values["recordLookupModule"]
                        )?.length > 0 &&
                        modules.filter(
                          (module) =>
                            module.name === values["recordLookupModule"]
                        )[0].label.en
                  } `}
                  name="searchByFields"
                  formResetted={resetSearchBy}
                  options={
                    values["recordLookupModule"] === AccountModels.User
                      ? [
                          { label: "First Name", value: "firstName" },
                          { label: "Last Name", value: "lastName" },
                          { label: "Email", value: "email" },
                        ]
                      : recordLookupFieldList
                          ?.filter(
                            (field) =>
                              (field.dataType === "singleline" ||
                                field.dataType === "email") &&
                              field.name !== "recordStatus"
                          )
                          .map((field) => {
                            return {
                              label: field?.label?.en,
                              value: field?.name,
                            };
                          })
                  }
                  limitSelectionTo={2}
                  editMode={editMode}
                  disabled={values["recordLookupModule"] === AccountModels.User}
                />
              </div>
            )}
          {["string", "singleline", "multiline", "number"].includes(
            values["dataType"]
          ) && (
            <>
              <div
                className={`${values["dataType"] === "number" ? "" : "hidden"}`}
              >
                <FormDropdown
                  name="numberPrecision"
                  label="Decimal Number Upto Precision"
                  options={[
                    { value: "0", label: "0 decimal point" },
                    { value: "2", label: "2 decimal point" },
                    { value: "4", label: "4 decimal point" },
                  ]}
                  onChange={(selectedOption) => {
                    setFieldValue(
                      "numberPrecision",
                      selectedOption.currentTarget.value
                    );
                  }}
                />
              </div>
              <FormInputBox
                name="minVal"
                label={`${
                  values["dataType"] === "string" ||
                  values["dataType"] === "singleline" ||
                  values["dataType"] === "multiline"
                    ? "Minimum Character length"
                    : values["dataType"] === "number"
                    ? "Lowest Number"
                    : ""
                }`}
                type={`number`}
                precision={Number(values["numberPrecision"]) ?? 0}
                disabled={data?.readOnly}
                systemDefined={data?.systemDefined}
              />
              <FormInputBox
                name="maxVal"
                label={`${
                  values["dataType"] === "string" ||
                  values["dataType"] === "singleline" ||
                  values["dataType"] === "multiline"
                    ? "Maximum Character length"
                    : values["dataType"] === "number"
                    ? "Highest Number"
                    : ""
                }`}
                type={`number`}
                externalError={
                  values["maxVal"]
                    ? values["maxVal"] < values["minVal"]
                      ? "Maximum value cannot be less than minimum value"
                      : ""
                    : ""
                }
                precision={Number(values["numberPrecision"]) ?? 0}
                disabled={data?.readOnly}
                systemDefined={data?.systemDefined}
              />
              {["string", "singleline", "multiline"].includes(
                values["dataType"]
              ) && <FormInputBox name="matches" label="Regular Expression" />}
            </>
          )}
          {values["dataType"] === "date" && (
            <>
              <FormDatePicker
                name="minVal"
                label={"Minimum Date"}
                editMode={editMode}
                placeholder="Date"
                type="date"
                user={user ?? undefined}
              />
              <FormDatePicker
                name="maxVal"
                label={"Maximum Date"}
                editMode={editMode}
                placeholder="Date"
                type="date"
                user={user ?? undefined}
                externalError={
                  values["maxVal"]
                    ? values["maxVal"] < values["minVal"]
                      ? "Maximum value cannot be less than minimum value"
                      : ""
                    : ""
                }
              />
            </>
          )}
          {values["dataType"] === "autoNumber" && (
            <>
              <FormInputBox name="prefix" label={`Prefix`} type={`text`} />
              <FormInputBox name="suffix" label={`Suffix`} type={`text`} />
              <FormInputBox
                name="paddingCharacter"
                label={`Padding Character`}
                type={`text`}
                maxLength={1}
              />
              <FormInputBox
                name="paddingLength"
                label={`Padding Length`}
                type={`number`}
                externalError={
                  Number(values["paddingLength"]) > 10
                    ? "Please enter value less than 10"
                    : undefined
                }
              />
            </>
          )}
          {values["dataType"] === "datetime" && (
            <>
              <FormDateTimePicker
                name="minVal"
                label={"Minimum Date"}
                editMode={editMode}
                type="datetime"
                modelName={values["recordLookupModule"]}
                user={user ?? undefined}
                disabled={data?.readOnly}
              />
              <FormDateTimePicker
                name="maxVal"
                label={"Maximum Date"}
                editMode={editMode}
                type="datetime"
                user={user ?? undefined}
                externalError={
                  values["maxVal"]
                    ? values["maxVal"] < values["minVal"]
                      ? "Maximum value cannot be less than minimum value"
                      : ""
                    : ""
                }
                disabled={data?.readOnly}
              />
            </>
          )}
          {values["name"] !== "dealPipelineId" &&
            values["name"] !== "dealStageId" &&
            values["name"] !== "productTaxIds" &&
            [
              "array-string",
              "array-number",
              "lookup",
              "multiSelectLookup",
            ].includes(values["dataType"]) && (
              <>
                <div>
                  <SwitchToggle
                    name={"allowColour"}
                    label={"Allow Colour"}
                    onChange={() => {
                      setFieldValue("allowColour", !values["allowColour"]);
                      MixpanelActions.track(
                        `switch-customization-add-field-allow-lookup-colourHex:toggle-click`,
                        {
                          type: "switch",
                        }
                      );
                    }}
                    value={values["allowColour"]}
                    labelLocation="Top"
                    disabled={false}
                  />
                </div>
                <div className="col-span-2">
                  <ConnectedMultipleValuesLookupBox
                    name="lookupOptions"
                    label={"Dropdown Values"}
                    editMode={editMode}
                    type={
                      values["dataType"] === "array-number" ? "number" : "text"
                    }
                    dataTypeChanged={dataTypeChanged}
                    onDataTypeChange={() => setDataTypeChanged(false)}
                    appName={values["recordLookupAppName"]}
                    modelName={values["recordLookupModule"]}
                    fields={values["recordLookupFields"]}
                    filters={values["recordLookupFilters"]}
                    dataType={values["dataType"]}
                    pickupListError={pickupListError}
                    editModeValues={editModeValues}
                    setEditModeValues={setEditModeValues}
                    setPickupListError={(value) => handlePickupListError(value)}
                    allowLookupColourHex={values["allowColour"] ? true : false}
                  />
                </div>
                <div className="col-span-2">
                  {values["dataType"] === "multiSelectLookup" ? (
                    <FormMultipleValuesDropdown
                      label={`Select default values`}
                      name="multiDefaultOptions"
                      options={lookupMapper((editModeValues as any[]) ?? [])}
                      editMode={editMode}
                    />
                  ) : (
                    <FormDropdown
                      name="defaultOption"
                      label="Select default value"
                      options={lookupMapper((editModeValues as any[]) ?? [])}
                      onChange={(selectedOption) => {
                        setFieldValue(
                          "defaultOption",
                          selectedOption.currentTarget.value
                        );
                      }}
                      editMode={editMode}
                    />
                  )}
                </div>
              </>
            )}
        </div>
        <div
          className={`grid ${
            values["dataType"] === "email" ||
            values["dataType"] === "singleline" ||
            values["dataType"] === "phoneNumber"
              ? "sm:grid-cols-2"
              : "grid-cols-2 sm:grid-cols-3"
          }  w-full gap-x-4 `}
        >
          <div>
            <SwitchToggle
              name="mandatory"
              label="Mandatory"
              onChange={() => {
                setFieldValue("mandatory", !values["mandatory"]);
                MixpanelActions.track(
                  `switch-customization-add-field-mandatory:toggle-click`,
                  {
                    type: "switch",
                  }
                );
              }}
              value={values["mandatory"]}
              labelLocation="Top"
              disabled={
                values["isSubform"] ||
                values["dataType"] === "autoNumber" ||
                values["dataType"] === "expression"
                  ? true
                  : data?.readOnly
                  ? true
                  : data?.restricted
                  ? data?.restricted
                  : false
              }
            />
          </div>
          <div className="">
            <SwitchToggle
              name={"visible"}
              label={"Visible"}
              onChange={() => {
                MixpanelActions.track(
                  `switch-customization-add-field-visible:toggle-click`,
                  {
                    type: "switch",
                  }
                );
                if (data?.dataTypeMetadata?.isSubform || values["isSubform"]) {
                  let subFormFieldsCount = 0;
                  fieldList.map((field) => {
                    if (field.dataTypeMetadata?.isSubform && field.visible) {
                      subFormFieldsCount++;
                    }
                  });
                  if (
                    !editMode &&
                    subFormFieldsCount >= 3 &&
                    values["isSubform"]
                  ) {
                    toast.error(
                      "Only 3 subform fields can be visible at a time."
                    );
                    return;
                  }
                  if (
                    editMode &&
                    values["visible"] == false &&
                    subFormFieldsCount >= 3
                  ) {
                    toast.error(
                      "Only 3 subform fields can be visible at a time."
                    );
                    return;
                  }
                  setFieldValue("visible", !values["visible"]);
                } else {
                  setFieldValue("visible", !values["visible"]);
                }
              }}
              value={values["visible"]}
              labelLocation="Top"
              disabled={data?.restricted ? data?.restricted : false}
            />
          </div>
          <div>
            <SwitchToggle
              name={"showInQuickCreate"}
              label={"Show In Quick Create"}
              onChange={() => {
                setFieldValue(
                  "showInQuickCreate",
                  !values["showInQuickCreate"]
                );
                MixpanelActions.track(
                  `switch-customization-add-field-quick-create:toggle-click`,
                  {
                    type: "switch",
                  }
                );
              }}
              value={values["showInQuickCreate"]}
              labelLocation="Top"
              disabled={
                values["isSubform"] ||
                values["dataType"] === "autoNumber" ||
                values["dataType"] === "expression"
                  ? true
                  : data?.readOnly
                  ? true
                  : data?.restricted
                  ? data?.restricted
                  : false
              }
            />
          </div>
          {(values["dataType"] === "email" ||
            values["dataType"] === "singleline" ||
            values["dataType"] === "phoneNumber") && (
            <SwitchToggle
              name="checkDuplicacy"
              label="Check Duplicacy"
              onChange={() => {
                setFieldValue("checkDuplicacy", !values["checkDuplicacy"]);
                MixpanelActions.track(
                  `switch-customization-add-check-duplicacy:toggle-click`,
                  {
                    type: "switch",
                  }
                );
              }}
              value={values["checkDuplicacy"]}
              labelLocation="Top"
              disabled={data?.readOnly}
            />
          )}
          {values["dataType"] === "multiSelectRecordLookup" && (
            <SwitchToggle
              name={"isSubform"}
              label={"Sub Form"}
              onChange={() => {
                let subFormFieldsCount = 0;
                fieldList.map((field) => {
                  if (field.dataTypeMetadata?.isSubform && field.visible) {
                    subFormFieldsCount++;
                  }
                });
                MixpanelActions.track(
                  `switch-customization-add-field-sub-form:toggle-click`,
                  {
                    type: "switch",
                  }
                );
                if (
                  !values["isSubform"] &&
                  subFormFieldsCount >= 3 &&
                  !data?.dataTypeMetadata?.isSubform &&
                  values["visible"]
                ) {
                  toast.error(
                    "Subform limit reached. You can add only 3 subforms."
                  );
                  return;
                }
                setFieldValue("isSubform", !values["isSubform"]);
              }}
              value={values["isSubform"]}
              labelLocation="Top"
              disabled={
                (editMode && data?.dataTypeMetadata?.isSubform) ||
                values["mandatory"] ||
                values["recordLookupAppName"] === "accounts" ||
                values["showInQuickCreate"]
                  ? true
                  : data?.restricted
                  ? data?.restricted
                  : false
              }
            />
          )}
          {["phoneNumber", "singleline", "email"].includes(
            values["dataType"]
          ) && (
            <div
              className={`${
                values["isMasked"] ? "col-span-full grid grid-cols-2" : ""
              }`}
            >
              <SwitchToggle
                name="isMasked"
                label="Mask Field"
                onChange={() => {
                  setFieldValue("isMasked", !values["isMasked"]);
                  MixpanelActions.track(
                    `switch-customization-add-field-MaskField:toggle-click`,
                    {
                      type: "switch",
                    }
                  );
                  if (!!values["isMasked"])
                    setFieldValue("maskedPattern", null);
                  else {
                    if (!values["maskedPatter"])
                      setFieldValue("maskedPattern", "x");
                  }
                }}
                value={values["isMasked"]}
                labelLocation="Top"
                disabled={values["isSubform"]}
              />
              {values["isMasked"] && (
                <FormInputBox
                  name="maskedPattern"
                  label="Masked With"
                  type="text"
                  required={true}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 w-full gap-x-4 mt-6.5">
        <Button
          id="cancel-form"
          disabled={saveLoading}
          onClick={onCancel}
          kind="back"
          userEventName="customization-form-fields-save:cancel-click"
        >
          {t("common:cancel")}
        </Button>
        <Button
          id="save-form"
          loading={saveLoading}
          disabled={
            ["expression"].includes(values["dataType"]) &&
            recordLookupFieldList?.filter(
              (field) => field.dataType === "number"
            )?.length <= 0
              ? true
              : ["expression"].includes(values["dataType"])
              ? !values["formulaBuilder"]
                ? true
                : values["formulaBuilder"] && !checkValidExpression
                ? true
                : false
              : [
                  "string",
                  "singleline",
                  "multiline",
                  "number",
                  "date",
                  "datetime",
                ].includes(values["dataType"])
              ? values["maxVal"]
                ? values["maxVal"] < values["minVal"]
                  ? true
                  : false
                : false
              : values["dataType"] === "autoNumber"
              ? (values["paddingLength"] &&
                  Number(values["paddingLength"]) > 10) ||
                (!values["paddingCharacter"] && values["paddingLength"]) ||
                (!values["paddingLength"] && values["paddingCharacter"])
                ? true
                : false
              : pickupListError.filter((item) => item.error === true)?.length >
                0
              ? true
              : saveLoading ||
                (values["dataType"] === "recordLookup" ||
                values["dataType"] === "multiSelectRecordLookup"
                  ? !values["recordLookupAppName"] ||
                    !values["recordLookupModule"]
                  : ["array-string", "array-number", "lookup"].includes(
                      values["dataType"]
                    ) && values["lookupOptions"]?.length === 0
                  ? true
                  : false)
          }
          onClick={() => {
            handleSave();
          }}
          kind="primary"
          userEventName="customization-form-fields-save:submit-click"
        >
          {t("common:save")}
        </Button>
      </div>
    </div>
  );
};
export default CustomizationFormFields;
