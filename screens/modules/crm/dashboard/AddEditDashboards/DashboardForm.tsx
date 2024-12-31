import { useLazyQuery, useMutation } from "@apollo/client";
import { Formik, FormikValues } from "formik";
import React from "react";
import {
  FetchData,
  FetchVars,
  FETCH_QUERY,
} from "../../../../../graphql/queries/fetchQuery";
import { IDashboardDetails, IWidget } from "../../../../../models/Dashboard";
import { getAppPathParts } from "../../shared/utils/getAppPathParts";
import { AllowedForms } from "./AddDashboard";
import { DashboardFormFields } from "./DashboardFormFields";
import * as Yup from "yup";
import { Toast } from "../../../../../components/TailwindControls/Toast";
import { PageLoader } from "../../../../../components/TailwindControls/ContentLoader/Shared/PageLoader";
import { SAVE_MUTATION } from "../../../../../graphql/mutations/saveMutation";
import { useTranslation } from "next-i18next";
import { AppModels } from "../../../../../models/AppModels";
import { ConnectedWidgetFormModal } from "../WidgetDashboard/ConnectedWidgetFormModal";
import { range } from "lodash";
import { checkIfValidUUID } from "../../shared/utils/getSettingsPathParts";
import {
  ValueAgainstFieldListType,
  ValueFieldListType,
} from "../WidgetDashboard/ConnectedWidgetDashbaord";
import { ISharingRuleData } from "../../../../../models/shared";
import { INavigation } from "../../../../../models/INavigation";
import { IGenericModel } from "../../../../../stores/RootStore/GeneralStore/GenericModelStore";

export type DashboardFormProps = {
  type: AllowedForms;
  handleSave: (T: FormikValues) => void;
  savingProcess: boolean;
  data: any;
  dataFetchLoading: boolean;
  moduleViewSharingData: ISharingRuleData | null;
  genericModels: IGenericModel;
  allModulesFetched: boolean;
  navigations: INavigation[];
  allLayoutFetched: boolean;
};

export const DashboardForm = ({
  type,
  handleSave,
  savingProcess,
  data,
  dataFetchLoading,
  moduleViewSharingData,
  genericModels,
  allModulesFetched,
  navigations,
  allLayoutFetched,
}: DashboardFormProps) => {
  const { appName } = getAppPathParts();
  const { t } = useTranslation("common");
  const [widgets, setWidgets] = React.useState<IWidget[]>([]);
  const [valueAgainstFieldList, setValueAgainstFieldList] = React.useState<
    ValueAgainstFieldListType[]
  >([]);
  const [valueFieldList, setValueFieldList] = React.useState<
    ValueFieldListType[]
  >([]);
  const [widgetsCount, setWidgetsCount] = React.useState<number>(0);
  const [widgetFetchLoading, setWidgetFetchLoading] = React.useState(true);
  const [dashboards, setDashboards] = React.useState<IDashboardDetails[]>([]);
  const [dashbaordFetchLoading, setDashboardFetchLoading] =
    React.useState<boolean>(true);
  const [addEditWidgetModal, setAddEditWidgetModal] = React.useState<{
    visible: boolean;
  }>({
    visible: false,
  });
  const [saveWidgetProcessing, setSaveWidgetProcessing] =
    React.useState<boolean>(false);

  const [fetchWidgetsCount] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (
        responseOnCompletion?.fetch?.data &&
        responseOnCompletion.fetch.messageKey.includes("-success")
      ) {
        setWidgetsCount(responseOnCompletion.fetch.count);
        setWidgetFetchLoading(false);
        return;
      } else if (
        responseOnCompletion?.fetch?.messageKey.includes("requires-view")
      ) {
        Toast.error(responseOnCompletion.fetch.message);
        setWidgetFetchLoading(false);
        return;
      }
      setWidgetFetchLoading(false);
    },
  });

  const [fetchWidgets] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });

  const [getDashboards] = useLazyQuery<FetchData<IDashboardDetails>, FetchVars>(
    FETCH_QUERY,
    {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: "crm",
        },
      },
      onCompleted: (responseOnCompletion) => {
        if (responseOnCompletion?.fetch?.messageKey.includes("-success")) {
          setDashboards(responseOnCompletion.fetch.data);
          setDashboardFetchLoading(false);
          return;
        }
        setDashboardFetchLoading(false);
        return;
      },
    }
  );

  const [saveWidget] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (
        responseOnCompletion.save.data &&
        responseOnCompletion.save.data.id &&
        responseOnCompletion.save.messageKey.includes("-success")
      ) {
        let updatedWidgets = widgets;
        updatedWidgets.splice(0, 0, responseOnCompletion.save.data);
        setWidgets(updatedWidgets);
        Toast.success(responseOnCompletion.save.message);
        setSaveWidgetProcessing(false);
        setAddEditWidgetModal({
          visible: false,
        });
        return;
      }
      if (responseOnCompletion.save.messageKey) {
        Toast.error(responseOnCompletion.save.message);
        setSaveWidgetProcessing(false);
        return;
      }
      setSaveWidgetProcessing(false);
      Toast.error(t("common:unknown-message"));
    },
  });

  React.useEffect(() => {
    if (!appName) return;
    fetchWidgetsCount({
      variables: {
        modelName: "Widget",
        fields: ["id", "name", "label", "uniqueName"],
        filters: [],
      },
    });
  }, [appName]);

  React.useEffect(() => {
    getDashboards({
      variables: {
        modelName: AppModels.Dashboard,
        fields: ["id", "name", "widgets"],
        filters: [],
      },
    });
  }, []);

  React.useEffect(() => {
    const handleWidgetsFetch = async () => {
      setWidgetFetchLoading(true);
      const pagesCount = Math.ceil(widgetsCount / 50) + 1;
      const fetchPromise = range(1, pagesCount).map(async (item) => {
        const response = await fetchWidgets({
          variables: {
            modelName: "Widget",
            fields: ["id", "name", "label", "uniqueName"],
            filters: [],
            pageNumber: item,
          },
        });
        return response.data?.fetch;
      });
      let widgets: any[] = [];
      await Promise.all(fetchPromise).then((response) => {
        for (let resp of response) {
          if (resp?.messageKey?.includes("-success")) {
            widgets = widgets.concat(resp?.data);
          }
        }
      });
      setWidgets(widgets);
      setWidgetFetchLoading(false);
    };
    if (!appName) return;
    handleWidgetsFetch();
  }, [widgetsCount, appName]);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .required(`Dashboard name is required`)
      .min(5, "Please enter atleast 5 characters")
      .max(40, "Please enter characters less than 40"),
    widgets: Yup.array()
      .nullable()
      .min(1, "Please select atleast one widget")
      .required(),
  });

  const handleWidgetSave = async (values: FormikValues) => {
    let variables = {
      id: null,
      modelName: AppModels.Widget,
      saveInput: {
        name: values.name,
        moduleViewId: checkIfValidUUID(values.moduleViewId)
          ? [values.moduleViewId]
          : [],
        widgetType: values?.widgetType !== "table" ? "graph" : "table",
        widgetMetadata: {
          moduleName: values["moduleName"],
          widgetType: values["widgetType"],
          mapping: {},
          systemModuleViewId: !checkIfValidUUID(values.moduleViewId)
            ? values.moduleViewId
            : null,
        },
      },
    };
    if (values["widgetType"] === "pieChartGraph") {
      variables = {
        ...variables,
        saveInput: {
          ...variables.saveInput,
          widgetMetadata: {
            ...variables.saveInput.widgetMetadata,
            mapping: {
              valueAgainstFieldList: [],
              valueFieldList: valueFieldList.map((field, index) => {
                return {
                  ["fieldName"]: values[`graph-groupby-field-name${index}`],
                  ["operationType"]:
                    values[`graph-groupby-field-OperationType${index}`],
                  ["dataType"]: values[`graph-groupby-field-dataType${index}`],
                  ["label"]: values[`graph-groupby-field-label${index}`],
                };
              }),
            },
          },
        },
      };
    }
    if (
      values["widgetType"] === "lineGraph" ||
      values["widgetType"] === "barGraph"
    ) {
      variables = {
        ...variables,
        saveInput: {
          ...variables.saveInput,
          widgetMetadata: {
            ...variables.saveInput.widgetMetadata,
            mapping: {
              valueAgainstFieldList: valueAgainstFieldList.map(
                (field, index) => {
                  return {
                    ["fieldName"]:
                      values[`graph-measure-field-name${index}`] === "null"
                        ? ""
                        : values[`graph-measure-field-name${index}`],
                    ["dataType"]:
                      values[`graph-measure-field-dataType${index}`] ?? "",
                    ["label"]:
                      values[`graph-measure-field-label${index}`] ?? "",
                  };
                }
              ),
              valueFieldList: valueFieldList.map((field, index) => {
                return {
                  ["fieldName"]:
                    values[`graph-groupby-field-name${index}`] === "null"
                      ? ""
                      : values[`graph-groupby-field-name${index}`],
                  ["operationType"]:
                    values[`graph-groupby-field-OperationType${index}`] ===
                    "null"
                      ? ""
                      : values[`graph-groupby-field-OperationType${index}`],
                  ["dataType"]:
                    values[`graph-groupby-field-dataType${index}`] ?? "",
                  ["label"]: values[`graph-groupby-field-label${index}`] ?? "",
                };
              }),
            },
          },
        },
      };
    }
    setSaveWidgetProcessing(true);
    try {
      await saveWidget({
        variables: variables,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (dataFetchLoading || widgetFetchLoading || dashbaordFetchLoading) {
    return (
      <div
        style={{
          height: (window.innerHeight * 4) / 6,
        }}
        className="w-full flex flex-col  items-center justify-center"
      >
        <PageLoader />
      </div>
    );
  } else {
    return (
      <>
        <form onSubmit={(e) => e.preventDefault()} className="w-full">
          <Formik
            initialValues={{
              name: data?.name,
              widgets: data?.widgets,
            }}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={(values) => {
              handleSave(values);
            }}
          >
            {({ handleSubmit, values }) => (
              <DashboardFormFields
                widgets={widgets.map((widget) => {
                  let findIndex =
                    values["widgets"] &&
                    values["widgets"].findIndex(
                      (value: string) => value === widget.id
                    );
                  if (findIndex !== -1 && type === "edit")
                    return { id: widget.id, name: widget.name, selected: true };
                  else
                    return {
                      id: widget.id,
                      name: widget.name,
                      selected: false,
                    };
                })}
                type={type}
                data={data}
                editMode={type === "edit" ? true : false}
                handleSave={() => handleSubmit()}
                savingProcess={savingProcess}
                setAddEditWidgetModal={(value) =>
                  setAddEditWidgetModal({ visible: value.visible })
                }
                dashboards={dashboards}
                moduleViewSharingData={moduleViewSharingData}
              />
            )}
          </Formik>
        </form>
        {addEditWidgetModal.visible && (
          <ConnectedWidgetFormModal
            appName={appName}
            editMode={false}
            widget={null}
            widgets={widgets}
            onCancel={(values) =>
              setAddEditWidgetModal({
                visible: false,
              })
            }
            handleSave={(values) => handleWidgetSave(values)}
            saveLoading={saveWidgetProcessing}
            valueFieldList={valueFieldList}
            genericModels={genericModels}
            allModulesFetched={allModulesFetched}
            navigations={navigations}
            allLayoutFetched={allLayoutFetched}
            setValueFieldList={setValueFieldList}
            valueAgainstFieldList={valueAgainstFieldList}
            setValueAgainstFieldList={setValueAgainstFieldList}
          />
        )}
      </>
    );
  }
};
