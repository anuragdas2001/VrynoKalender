import { useLazyQuery, useMutation } from "@apollo/client";
import { FormikValues } from "formik";
import { useTranslation } from "next-i18next";
import React, { useContext } from "react";
import { Backdrop } from "../../../../../components/TailwindControls/Backdrop";
import { PageLoader } from "../../../../../components/TailwindControls/ContentLoader/Shared/PageLoader";
import DeleteModal from "../../../../../components/TailwindControls/Modals/DeleteModal";
import { Toast } from "../../../../../components/TailwindControls/Toast";
import { SAVE_MUTATION } from "../../../../../graphql/mutations/saveMutation";
import { FETCH_QUERY } from "../../../../../graphql/queries/fetchQuery";
import { AppModels } from "../../../../../models/AppModels";
import { IWidget } from "../../../../../models/Dashboard";
import { NoViewPermission } from "../../shared/components/NoViewPermission";
import { getAppPathParts } from "../../shared/utils/getAppPathParts";
import { ConnectedWidgetFormModal } from "./ConnectedWidgetFormModal";
import { WidgetDashboard } from "./WidgetDashboard";
import { checkIfValidUUID } from "../../shared/utils/getSettingsPathParts";
import { SupportedDataTypes } from "../../../../../models/ICustomField";
import _ from "lodash";
import { observer } from "mobx-react-lite";
import { GeneralStoreContext } from "../../../../../stores/RootStore/GeneralStore/GeneralStore";
import { NavigationStoreContext } from "../../../../../stores/RootStore/NavigationStore/NavigationStore";

export type ValueFieldListType = {
  fieldName: string;
  operationType: string | null;
  label: string;
  dataType: SupportedDataTypes | null;
};
export type ValueAgainstFieldListType = {
  fieldName: string;
  label: string;
  dataType: SupportedDataTypes | null;
};

export const ConnectedWidgetDashboard = observer(() => {
  const { t } = useTranslation(["common"]);
  let { appName } = getAppPathParts();
  const { generalModelStore } = useContext(GeneralStoreContext);
  const { genericModels, allModulesFetched, allLayoutFetched } =
    generalModelStore;
  const { navigations } = useContext(NavigationStoreContext);
  const [itemsCount, setItemsCount] = React.useState<number>(0);
  const [valueAgainstFieldList, setValueAgainstFieldList] = React.useState<
    ValueAgainstFieldListType[]
  >([]);
  const [valueFieldList, setValueFieldList] = React.useState<
    ValueFieldListType[]
  >([]);
  const [widgets, setWidgets] = React.useState<IWidget[]>([]);
  const [viewPermission, setViewPermission] = React.useState<boolean>(true);
  const [dataFetchLoading, setDataFetchLoading] = React.useState<boolean>(true);
  const [deleteModal, setDeleteModal] = React.useState<{
    visible: boolean;
    item: any;
  }>({ visible: false, item: null });
  const [addEditWidgetModal, setAddEditWidgetModal] = React.useState<{
    visible: boolean;
    item: IWidget | null;
    editMode: boolean;
  }>({
    visible: false,
    item: null,
    editMode: false,
  });
  const [saveProcessing, setSaveProcessing] = React.useState<boolean>(false);
  const [currentPageNumber, setCurrentPageNumber] = React.useState<number>(1);
  const [deleteProcessing, setDeleteProcessing] =
    React.useState<boolean>(false);

  const [fetchWidgetData] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data?.length) {
        setWidgets(responseOnCompletion?.fetch?.data);
        setItemsCount(responseOnCompletion.fetch.count);
        setViewPermission(true);
      } else if (
        responseOnCompletion?.fetch?.messageKey.includes("requires-view")
      ) {
        setViewPermission(false);
      }
      setDataFetchLoading(false);
    },
  });

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
        Toast.success(responseOnCompletion.save.message);
        let updatedWidgets: IWidget[] = _.cloneDeep(widgets);
        let findWidgetIndex = updatedWidgets.findIndex(
          (widget) => widget.id === responseOnCompletion.save.data.id
        );
        if (findWidgetIndex === -1) {
          updatedWidgets.splice(
            0,
            0,
            _.cloneDeep(responseOnCompletion.save.data)
          );
        } else {
          updatedWidgets[findWidgetIndex] = _.cloneDeep(
            responseOnCompletion.save.data
          );
        }
        setWidgets([...updatedWidgets]);
        setItemsCount(itemsCount + 1);
        setSaveProcessing(false);
        setAddEditWidgetModal({
          visible: false,
          item: null,
          editMode: false,
        });
        return;
      }
      if (responseOnCompletion.save.messageKey) {
        Toast.error(responseOnCompletion.save.message);
        setSaveProcessing(false);
        return;
      }
      setSaveProcessing(false);
      Toast.error(t("common:unknown-message"));
    },
  });

  const [deleteWidget] = useMutation(SAVE_MUTATION, {
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
        Toast.success(responseOnCompletion.save.message);
        setWidgets(
          widgets?.filter(
            (widget: IWidget) => widget.id !== responseOnCompletion.save.data.id
          )
        );
        setItemsCount(itemsCount - 1);
        setDeleteModal({ visible: false, item: null });
        setDeleteProcessing(false);
        return;
      }
      if (responseOnCompletion.save.messageKey) {
        Toast.error(responseOnCompletion.save.message);
        setDeleteProcessing(false);
        return;
      }
      setDeleteProcessing(false);
      Toast.error(t("common:unknown-message"));
    },
  });

  const handleWidgetSave = async (values: FormikValues) => {
    let variables = {
      id: addEditWidgetModal.item?.id ?? null,
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
                      values[`graph-measure-field-name${index}`] === "null" ||
                      values[`graph-measure-field-name${index}`] === null
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
                    values[`graph-groupby-field-name${index}`] === "null" ||
                    values[`graph-groupby-field-name${index}`] === null
                      ? ""
                      : values[`graph-groupby-field-name${index}`],
                  ["operationType"]:
                    values[`graph-groupby-field-OperationType${index}`] ===
                      "null" ||
                    values[`graph-groupby-field-OperationType${index}`] === null
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
    setSaveProcessing(true);
    try {
      await saveWidget({
        variables: variables,
      });
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    if (!appName) return;
    fetchWidgetData({
      variables: {
        modelName: AppModels.Widget,
        fields: [
          "id",
          "name",
          "key",
          "widgetType",
          "moduleViewId",
          "widgetMetadata",
          "customView",
        ],
        filters: [],
      },
    });
  }, [appName]);

  return (
    <>
      {dataFetchLoading ? (
        <div
          style={{
            height: (window.innerHeight * 4) / 6,
          }}
          className="w-full flex flex-col  items-center justify-center"
        >
          <PageLoader />
        </div>
      ) : viewPermission ? (
        <>
          <WidgetDashboard
            widgets={widgets}
            itemsCount={itemsCount}
            currentPageNumber={currentPageNumber}
            handlePageChange={(pageNumber) => {
              fetchWidgetData({
                variables: {
                  modelName: AppModels.Widget,
                  fields: [
                    "id",
                    "name",
                    "key",
                    "widgetType",
                    "moduleViewId",
                    "widgetMetadata",
                    "customView",
                  ],
                  filters: [],
                  pageNumber: pageNumber,
                },
              });
              setCurrentPageNumber(pageNumber);
            }}
            setDeleteModal={(value: { visible: boolean; item: IWidget }) =>
              setDeleteModal({ visible: value.visible, item: value.item })
            }
            setAddEditWidgetModal={(value: {
              visible: boolean;
              item: IWidget | null;
              editMode: boolean;
            }) =>
              setAddEditWidgetModal({
                visible: value.visible,
                item: value.item,
                editMode: value.editMode,
              })
            }
          />
          {deleteModal.visible && (
            <>
              <DeleteModal
                id={"delete-widget-modal"}
                modalHeader={"Delete Widget"}
                modalMessage={"Are you sure you want to delete widget?"}
                leftButton={"Cancel"}
                rightButton={"Delete"}
                loading={deleteProcessing}
                onCancel={() => setDeleteModal({ visible: false, item: null })}
                onDelete={() => {
                  setDeleteProcessing(true);
                  deleteWidget({
                    variables: {
                      id: deleteModal.item.id,
                      modelName: AppModels.Widget,
                      saveInput: {
                        recordStatus: "d",
                      },
                    },
                  });
                }}
                onOutsideClick={() =>
                  setDeleteModal({ visible: false, item: null })
                }
              />
              <Backdrop
                onClick={() => setDeleteModal({ visible: false, item: null })}
              />
            </>
          )}
        </>
      ) : (
        <NoViewPermission modelName="Widget" />
      )}
      {addEditWidgetModal.visible && (
        <ConnectedWidgetFormModal
          appName={appName}
          widgets={widgets}
          editMode={addEditWidgetModal.editMode}
          widget={addEditWidgetModal.item}
          valueFieldList={valueFieldList}
          setValueFieldList={setValueFieldList}
          valueAgainstFieldList={valueAgainstFieldList}
          setValueAgainstFieldList={setValueAgainstFieldList}
          onCancel={(values) =>
            setAddEditWidgetModal({
              visible: false,
              item: null,
              editMode: false,
            })
          }
          genericModels={genericModels}
          allModulesFetched={allModulesFetched}
          allLayoutFetched={allLayoutFetched}
          navigations={navigations}
          handleSave={(values) => handleWidgetSave(values)}
          saveLoading={saveProcessing}
        />
      )}
    </>
  );
});
