import React, { useContext } from "react";
import FormDropdown from "../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import FormInputBox from "../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import { useFormikContext } from "formik";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { useTranslation } from "next-i18next";
import { useLazyQuery } from "@apollo/client";
import {
  FetchData,
  FetchVars,
  FETCH_QUERY,
} from "../../../../../graphql/queries/fetchQuery";
import { ICustomView } from "../../../../../models/shared";
import { IWidget } from "../../../../../models/Dashboard";
import {
  ICustomField,
  SupportedDataTypes,
} from "../../../../../models/ICustomField";
import { Loading } from "../../../../../components/TailwindControls/Loading/Loading";
import { PieChartGraphWrapper } from "./GraphComponents/PieChartGraph/PieChartGraphWrapper";
import { LineBarChartGraphWrapper } from "./GraphComponents/LineBarChartGraph/LineBarChartGraphWrapper";
import {
  ValueAgainstFieldListType,
  ValueFieldListType,
} from "./ConnectedWidgetDashbaord";
import _ from "lodash";
import { SampleData } from "./GraphComponents/Utils/sampleDatForGraphs";
import { GeneralStoreContext } from "../../../../../stores/RootStore/GeneralStore/GeneralStore";
import { IGenericModel } from "../../../../../stores/RootStore/GeneralStore/GenericModelStore";

export const GraphNameMapper = {
  pieChartGraph: "Pie Chart :",
  lineGraph: "Line Graph :",
  barGraph: "Bar Graph :",
};

export type WidgetFormFieldsProps = {
  appName: string;
  editMode: boolean;
  saveLoading: boolean;
  widgets?: IWidget[];
  currentWidget?: IWidget | null;
  modules: { value: string; label: string }[];
  valueAgainstFieldList: ValueAgainstFieldListType[];
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  setValueAgainstFieldList: (values: ValueAgainstFieldListType[]) => void;
  valueFieldList: ValueFieldListType[];
  setValueFieldList: (values: ValueFieldListType[]) => void;
  onCancel: () => void;
  handleSave: () => void;
};

export const WidgetFormFields = ({
  appName,
  editMode,
  modules,
  widgets,
  currentWidget,
  saveLoading,
  valueAgainstFieldList,
  valueFieldList,
  genericModels,
  allLayoutFetched,
  setValueFieldList,
  setValueAgainstFieldList,
  onCancel,
  handleSave,
}: WidgetFormFieldsProps) => {
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();
  const { t } = useTranslation();
  const [customViewList, setCustomViewList] = React.useState<ICustomView[]>([]);
  const [fieldsList, setFieldsList] = React.useState<ICustomField[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (
      currentWidget &&
      currentWidget?.widgetMetadata &&
      fieldsList?.length > 0
    ) {
      let updatedValueFieldList: ValueFieldListType[] = [
        ..._.get(currentWidget?.widgetMetadata?.mapping, "valueFieldList", []),
      ];
      let updatedValueAgainstFieldList: ValueAgainstFieldListType[] = [
        ..._.get(
          currentWidget?.widgetMetadata?.mapping,
          "valueAgainstFieldList",
          []
        ),
      ];

      setValueAgainstFieldList([
        ...updatedValueAgainstFieldList?.map((field) => {
          return {
            fieldName: field.fieldName,
            dataType: field.dataType,
            label: field.label,
          };
        }),
      ]);
      setValueFieldList([
        ...updatedValueFieldList.map((field) => {
          return {
            fieldName: field.fieldName,
            operationType: field.operationType,
            dataType: field.dataType,
            label: field.label,
          };
        }),
      ]);
    }
  }, [currentWidget, currentWidget?.widgetMetadata, fieldsList]);

  React.useEffect(() => {
    if (valueAgainstFieldList?.length > 0) {
      valueAgainstFieldList.forEach(
        (field: ValueAgainstFieldListType, index: number) => {
          setFieldValue(
            `graph-measure-field-name${index}`,
            values[`graph-measure-field-name${index}`]
              ? values[`graph-measure-field-name${index}`]
              : field.fieldName
          );
          setFieldValue(
            `graph-measure-field-dataType${index}`,
            values[`graph-measure-field-dataType${index}`]
              ? values[`graph-measure-field-dataType${index}`]
              : field.dataType
          );
          setFieldValue(
            `graph-measure-field-label${index}`,
            values[`graph-measure-field-label${index}`]
              ? values[`graph-measure-field-label${index}`]
              : field.label
          );
        }
      );
    }
  }, [valueAgainstFieldList, fieldsList, currentWidget]);

  React.useEffect(() => {
    if (valueFieldList?.length > 0) {
      valueFieldList.forEach((field: ValueFieldListType, index: number) => {
        setFieldValue(
          `graph-groupby-field-name${index}`,
          values[`graph-groupby-field-name${index}`]
            ? values[`graph-groupby-field-name${index}`]
            : field.fieldName
        );
        setFieldValue(
          `graph-groupby-field-OperationType${index}`,
          values[`graph-groupby-field-OperationType${index}`]
            ? values[`graph-groupby-field-OperationType${index}`]
            : field.operationType
        );
        setFieldValue(
          `graph-groupby-field-dataType${index}`,
          values[`graph-groupby-field-dataType${index}`]
            ? values[`graph-groupby-field-dataType${index}`]
            : field.dataType
        );
        setFieldValue(
          `graph-groupby-field-label${index}`,
          values[`graph-groupby-field-label${index}`]
            ? values[`graph-groupby-field-label${index}`]
            : field.label
        );
      });
    }
  }, [valueFieldList, fieldsList, currentWidget]);

  const [getCustomViewList] = useLazyQuery<FetchData<ICustomView>, FetchVars>(
    FETCH_QUERY,
    {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: appName,
        },
      },
      onCompleted: (responseOnCompletion) => {
        if (responseOnCompletion?.fetch?.data) {
          setCustomViewList(responseOnCompletion.fetch.data);
          setFieldsList(
            genericModels[values["moduleName"]]?.fieldsList?.filter(
              (field) =>
                field.addInForm &&
                ![
                  "recordImage",
                  "image",
                  "autoNumber",
                  "richText",
                  "expression",
                  "json",
                  "jsonArray",
                  "relatedTo",
                  "multiline",
                ].includes(field.dataType)
            )
          );
          setLoading(false);
        } else {
          setLoading(false);
        }
      },
      onError: (error) => {
        setLoading(false);
      },
    }
  );

  React.useEffect(() => {
    if (values["moduleName"] && appName && allLayoutFetched) {
      setLoading(true);
      getCustomViewList({
        variables: {
          modelName: "ModuleView",
          fields: [
            "id",
            "name",
            "moduleName",
            "filters",
            "moduleFields",
            "recordsPerPage",
            "orderBy",
            "isShared",
            "config",
            "fileKey",
          ],
          filters: [
            {
              operator: "eq",
              name: "moduleName",
              value: values["moduleName"],
            },
          ],
        },
      });
    }
  }, [values["moduleName"], appName, allLayoutFetched]);

  const handleRemoveGroupByField = (index: number) => {
    if (index === valueFieldList?.length - 1) {
      setFieldValue(`graph-groupby-field-name${index}`, "");
      setFieldValue(`graph-groupby-field-OperationType${index}`, null);
      setFieldValue(`graph-groupby-field-dataType${index}`, "");
      setFieldValue(`graph-groupby-field-label${index}`, "");
    } else {
      _.range(index, valueFieldList.length - 1).forEach((num) => {
        setFieldValue(
          `graph-groupby-field-name${num}`,
          values[`graph-groupby-field-name${num + 1}`] ?? ""
        );
        setFieldValue(
          `graph-groupby-field-OperationType${num}`,
          values[`graph-groupby-field-OperationType${num + 1}`] ?? null
        );
        setFieldValue(
          `graph-groupby-field-dataType${num}`,
          values[`graph-groupby-field-dataType${num + 1}`] ?? ""
        );
        setFieldValue(
          `graph-groupby-field-label${num}`,
          values[`graph-groupby-field-label${num + 1}`] ?? ""
        );
      });
    }
    setValueFieldList([
      ...valueFieldList?.filter((field, fieldIndex) => fieldIndex !== index),
    ]);
  };

  const handleRemoveMeasureField = (index: number) => {
    if (index === valueAgainstFieldList?.length - 1) {
      setFieldValue(`graph-measure-field-name${index}`, "");
      setFieldValue(`graph-measure-field-dataType${index}`, null);
      setFieldValue(`graph-measure-field-label${index}`, "");
    } else {
      _.range(index, valueAgainstFieldList.length - 1).forEach((num) => {
        setFieldValue(
          `graph-measure-field-name${num}`,
          values[`graph-measure-field-name${num + 1}`] ?? ""
        );
        setFieldValue(
          `graph-measure-field-dataType${num}`,
          values[`graph-measure-field-dataType${num + 1}`] ?? ""
        );
        setFieldValue(
          `graph-measure-field-label${num}`,
          values[`graph-measure-field-label${num + 1}`] ?? ""
        );
      });
    }
    setValueAgainstFieldList([
      ...valueAgainstFieldList?.filter(
        (field, fieldIndex) => fieldIndex !== index
      ),
    ]);
  };

  if (
    editMode &&
    !loading &&
    customViewList?.length > 0 &&
    customViewList?.filter(
      (customView) => customView.id === values[`moduleViewId`]
    )?.length <= 0
  ) {
    return (
      <div className="w-full flex items-center justify-center my-10">
        <p>Widget no longer accessible</p>
      </div>
    );
  }

  if (
    editMode &&
    values["moduleName"] &&
    modules?.filter((module) => module.value === values[`moduleName`])
      ?.length <= 0 &&
    !loading
  ) {
    return (
      <div className="w-full flex items-center justify-center my-10 text-sm">
        <p>Widget no longer accessible</p>
      </div>
    );
  }

  return (
    <div className="w-full sm:grid sm:grid-cols-2 sm:gap-x-4">
      <div
        className={`w-full col-span-2 sm:grid sm:grid-cols-2 sm:gap-x-4 sm:gap-y-2 max-h-[55vh] overflow-y-auto pr-1.5 card-scroll mt-4`}
      >
        <FormInputBox
          required={true}
          name={`name`}
          label={`Widget Name`}
          externalError={
            widgets?.findIndex(
              (widget) =>
                widget?.name?.toLocaleLowerCase() ===
                  values["name"]?.toLocaleLowerCase() &&
                currentWidget?.name?.toLocaleLowerCase() !==
                  values["name"]?.toLocaleLowerCase()
            ) === -1
              ? ""
              : "Widget name already exists."
          }
        />
        <FormDropdown
          required={true}
          name="moduleName"
          label={"Module Name"}
          options={modules}
          onChange={async (selectedOption) => {
            setFieldValue("moduleViewId", null);
            setFieldValue("moduleName", selectedOption.currentTarget.value);
            setFieldValue("moduleViewId", null);
            setFieldValue("widgetType", "table");
            valueFieldList?.forEach((field, index) => {
              setFieldValue(`graph-groupby-field-name${index}`, null);
              setFieldValue(`graph-groupby-field-OperationType${index}`, null);
              setFieldValue(`graph-groupby-field-dataType${index}`, null);
              setFieldValue(`graph-groupby-field-label${index}`, null);
            });
            valueAgainstFieldList?.forEach((field, index) => {
              setFieldValue(`graph-measure-field-name${index}`, null);
              setFieldValue(`graph-measure-field-dataType${index}`, null);
              setFieldValue(`graph-measure-field-label${index}`, null);
            });
          }}
          disabled={editMode || !values["widgetType"]}
        />
        <FormDropdown
          required={true}
          name="moduleViewId"
          disabled={editMode}
          label="Custom View"
          options={customViewList.map((view) => {
            return { label: view.name, value: view.id };
          })}
          onChange={(selectedOption) => {
            setFieldValue("moduleViewId", selectedOption.currentTarget.value);
            setFieldValue(
              "moduleViewFileKey",
              customViewList?.filter(
                (view) => view?.id === selectedOption.currentTarget.value
              )?.length > 0
                ? customViewList?.filter(
                    (view) => view?.id === selectedOption.currentTarget.value
                  )[0]?.fileKey
                : null
            );
            setFieldValue("widgetType", "table");
            valueFieldList?.forEach((field, index) => {
              setFieldValue(`graph-groupby-field-name${index}`, null);
              setFieldValue(`graph-groupby-field-OperationType${index}`, null);
              setFieldValue(`graph-groupby-field-dataType${index}`, null);
              setFieldValue(`graph-groupby-field-label${index}`, null);
            });
            valueAgainstFieldList?.forEach((field, index) => {
              setFieldValue(`graph-measure-field-name${index}`, null);
              setFieldValue(`graph-measure-field-dataType${index}`, null);
              setFieldValue(`graph-measure-field-label${index}`, null);
            });
          }}
        />
        <FormDropdown
          required={true}
          name="widgetType"
          label={"Graph type"}
          options={[
            { label: "Table", value: "table" },
            { label: "Pie Chart", value: "pieChartGraph" },
            { label: "Line Graph", value: "lineGraph" },
            { label: "Bar Graph", value: "barGraph" },
          ]}
          onChange={(selectedOption) => {
            setFieldValue("widgetType", selectedOption.currentTarget.value);
            if (selectedOption.currentTarget.value === "pieChartGraph") {
              setValueFieldList([
                { fieldName: "", operationType: "", label: "", dataType: null },
              ]);
            } else if (
              ["lineGraph", "barGraph"].includes(
                selectedOption.currentTarget.value
              )
            ) {
              setValueAgainstFieldList([
                { fieldName: "", label: "", dataType: null },
              ]);
              setValueFieldList([
                { fieldName: "", operationType: "", label: "", dataType: null },
              ]);
            } else {
              setFieldValue("operationType", null);
            }
            valueFieldList?.forEach((field, index) => {
              setFieldValue(`graph-groupby-field-name${index}`, null);
              setFieldValue(`graph-groupby-field-OperationType${index}`, null);
              setFieldValue(`graph-groupby-field-dataType${index}`, null);
              setFieldValue(`graph-groupby-field-label${index}`, null);
            });
            valueAgainstFieldList?.forEach((field, index) => {
              setFieldValue(`graph-measure-field-name${index}`, null);
              setFieldValue(`graph-measure-field-dataType${index}`, null);
              setFieldValue(`graph-measure-field-label${index}`, null);
            });
          }}
          disabled={editMode}
        />
        {loading ||
        (values["moduleName"] && fieldsList?.length <= 0 && !loading) ? (
          <div className="col-span-2 w-full flex items-center justify-center py-4">
            <Loading color="Blue" />
          </div>
        ) : null}
        {fieldsList?.length <= 0 ? null : values["widgetType"] ===
          "pieChartGraph" ? (
          <PieChartGraphWrapper
            chartName={GraphNameMapper[values["widgetType"]]}
            fieldsList={fieldsList}
            customViewList={customViewList}
            moduleData={[
              ..._.range(1, 100).map((num: number) => {
                let dataObject: Record<string, any> = {};
                fieldsList?.forEach(
                  (field) =>
                    (dataObject[field.name] = SampleData(
                      field.dataType as SupportedDataTypes,
                      num
                    ))
                );
                return dataObject;
              }),
            ]}
            valueOfModuleViewId={values["moduleViewId"]}
            valueFieldList={valueFieldList}
          />
        ) : values["widgetType"] === "barGraph" ||
          values["widgetType"] === "lineGraph" ? (
          <LineBarChartGraphWrapper
            chartName={GraphNameMapper[values["widgetType"]]}
            fieldsList={fieldsList}
            customViewList={customViewList}
            modules={modules}
            moduleData={[
              ..._.range(1, 101).map((num: number) => {
                let dataObject: Record<string, any> = {};
                fieldsList?.forEach(
                  (field) =>
                    (dataObject[field.name] = SampleData(
                      field.dataType as SupportedDataTypes,
                      num
                    ))
                );
                return dataObject;
              }),
            ]}
            valueOfModuleViewId={values["moduleViewId"]}
            valueFieldList={valueFieldList}
            valueAgainstFieldList={valueAgainstFieldList}
            handleAddGroupByField={() =>
              setValueFieldList([
                ...valueFieldList,
                {
                  fieldName: "",
                  dataType: null,
                  operationType: null,
                  label: "",
                },
              ])
            }
            handleAddMeasureField={() =>
              setValueAgainstFieldList([
                ...valueAgainstFieldList,
                { fieldName: "", dataType: null, label: "" },
              ])
            }
            handleRemoveGroupByField={(index) =>
              handleRemoveGroupByField(index)
            }
            handleRemoveMeasureField={(index) =>
              handleRemoveMeasureField(index)
            }
          />
        ) : null}
      </div>
      <div className="col-span-2 grid grid-cols-2 w-full gap-x-4 mt-6.5">
        <Button
          id="cancel-form"
          onClick={() => onCancel()}
          kind="back"
          disabled={saveLoading || loading}
          userEventName="widget-save:cancel-click"
        >
          {t("common:cancel")}
        </Button>
        <Button
          id="save-form"
          onClick={() => handleSave()}
          kind="primary"
          loading={saveLoading}
          disabled={
            saveLoading ||
            loading ||
            !values["moduleViewId"] ||
            !values["name"] ||
            !(
              values["widgetType"] === "table" ||
              (values["widgetType"] === "pieChartGraph" &&
                valueFieldList
                  ?.map((field, index) =>
                    values[`graph-groupby-field-name${index}`] &&
                    values[`graph-groupby-field-name${index}`] !== ""
                      ? values[`graph-groupby-field-name${index}`]
                      : null
                  )
                  ?.filter((field) => field)?.length > 0) ||
              ((values["widgetType"] === "lineGraph" ||
                values["widgetType"] === "barGraph") &&
                valueAgainstFieldList
                  ?.map((field, index) =>
                    values[`graph-measure-field-name${index}`] &&
                    values[`graph-measure-field-name${index}`] !== ""
                      ? values[`graph-measure-field-name${index}`]
                      : null
                  )
                  ?.filter((field) => field)?.length > 0 &&
                valueFieldList
                  ?.map((field, index) =>
                    values[`graph-groupby-field-name${index}`] &&
                    values[`graph-groupby-field-name${index}`] !== ""
                      ? values[`graph-groupby-field-name${index}`]
                      : null
                  )
                  ?.filter((field) => field)?.length > 0)
            ) ||
            (widgets?.findIndex(
              (widget) =>
                widget?.name?.toLocaleLowerCase() ===
                  values["name"]?.toLocaleLowerCase() &&
                currentWidget?.name?.toLocaleLowerCase() !==
                  values["name"]?.toLocaleLowerCase()
            ) === -1
              ? false
              : true)
          }
          userEventName="widget-save:submit-click"
        >
          {t("common:Save")}
        </Button>
      </div>
    </div>
  );
};
