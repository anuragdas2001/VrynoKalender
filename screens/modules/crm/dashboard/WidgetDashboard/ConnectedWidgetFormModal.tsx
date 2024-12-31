import { FormikValues } from "formik";
import React from "react";
import { WidgetForm } from "./WidgetForm";
import { useLazyQuery } from "@apollo/client";
import { IWidget } from "../../../../../models/Dashboard";
import { AppModels } from "../../../../../models/AppModels";
import { IWorkflowAction } from "../../../../../models/shared";
import { IModuleMetadata } from "../../../../../models/IModuleMetadata";
import { Backdrop } from "../../../../../components/TailwindControls/Backdrop";
import { Loading } from "../../../../../components/TailwindControls/Loading/Loading";
import { WidgetNoFieldPermission } from "../../../../../components/Widgets/WidgetNoFieldPermission";
import { getSortedModuleByNavigation } from "../../shared/utils/getSortedModuleListAccordingToNavigation";
import GenericFormModalContainer from "../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import { FETCH_QUERY } from "../../../../../graphql/queries/fetchQuery";
import {
  ValueAgainstFieldListType,
  ValueFieldListType,
} from "./ConnectedWidgetDashbaord";
import { IGenericModel } from "../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { INavigation } from "../../../../../models/INavigation";

export type ConnectedWidgetFormModalProps = {
  appName: string;
  widget: IWidget | null;
  widgets?: IWidget[];
  editMode: boolean;
  saveLoading: boolean;
  valueAgainstFieldList: ValueAgainstFieldListType[];
  genericModels: IGenericModel;
  allModulesFetched: boolean;
  allLayoutFetched: boolean;
  navigations: INavigation[];
  setValueAgainstFieldList: (values: ValueAgainstFieldListType[]) => void;
  valueFieldList: ValueFieldListType[];
  setValueFieldList: (values: ValueFieldListType[]) => void;
  onCancel: (values: {
    visible: boolean;
    item: IWorkflowAction | null;
    editMode: boolean;
  }) => void;
  handleSave: (T: FormikValues) => void;
};

export const ConnectedWidgetFormModal = ({
  appName,
  widget,
  widgets,
  editMode,
  saveLoading,
  valueAgainstFieldList,
  valueFieldList,
  genericModels,
  navigations,
  allModulesFetched,
  allLayoutFetched,
  setValueFieldList,
  setValueAgainstFieldList,
  onCancel,
  handleSave,
}: ConnectedWidgetFormModalProps) => {
  const [modulesFetched, setModulesFetched] = React.useState<{
    loading: boolean;
    data: IModuleMetadata[];
  }>({ loading: true, data: [] });

  const [currentWidget, setCurrentWidget] = React.useState<IWidget>();
  const [widgetDataLoading, setWidgetDataLoading] =
    React.useState<boolean>(false);
  const [fieldPermissionMessage, setFieldPermissionMessage] = React.useState<
    string | null
  >(null);

  React.useEffect(() => {
    if (allModulesFetched) {
      let responseData = [
        ...Object.keys(genericModels)
          ?.map((model) => {
            if (genericModels[model]?.moduleInfo?.customizationAllowed === true)
              return genericModels[model]?.moduleInfo;
          })
          ?.filter((model) => model !== undefined)
          ?.filter(
            (moduleItem: IModuleMetadata) =>
              moduleItem.name !== "quotedItem" &&
              moduleItem.name !== "orderedItem" &&
              moduleItem.name !== "invoicedItem" &&
              moduleItem?.name !== "purchaseItem"
          ),
      ];
      setModulesFetched({
        loading: false,
        data: responseData,
      });
    }
  }, [allModulesFetched]);

  const [fetchWidgetData] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data?.length) {
        setCurrentWidget(responseOnCompletion?.fetch?.data[0]);
        setWidgetDataLoading(false);
        return;
      }
      if (
        responseOnCompletion?.fetch?.messageKey === "field-permission-required"
      ) {
        setFieldPermissionMessage(responseOnCompletion?.fetch?.message);
        setWidgetDataLoading(false);
        return;
      }
      setWidgetDataLoading(false);
    },
    onError: (error) => {
      setWidgetDataLoading(false);
    },
  });

  React.useEffect(() => {
    if (!editMode && !widget && !appName) return;
    setWidgetDataLoading(true);
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
        filters: [{ name: "id", operator: "eq", value: widget?.id }],
        options: {
          processedData: widget?.widgetType === "table" ? true : false,
        },
      },
    });
  }, [editMode, widget, widgets, appName]);

  return (
    <>
      <GenericFormModalContainer
        formHeading={editMode ? "Edit Widget" : "Create Widget"}
        onCancel={() =>
          onCancel({ visible: false, item: null, editMode: false })
        }
      >
        {modulesFetched.loading || widgetDataLoading ? (
          <div className="w-full flex items-center justify-center my-10">
            <Loading color="Blue" />
          </div>
        ) : editMode && !widgetDataLoading && !currentWidget ? (
          <div className="w-full flex items-center justify-center my-10 text-sm">
            <p>Widget no longer accessible</p>
          </div>
        ) : !fieldPermissionMessage ? (
          <WidgetForm
            appName={appName}
            widget={editMode ? currentWidget : widget}
            modules={getSortedModuleByNavigation(
              navigations,
              modulesFetched.data
            )}
            widgets={widgets}
            editMode={editMode}
            saveLoading={saveLoading}
            valueFieldList={valueFieldList}
            setValueFieldList={setValueFieldList}
            valueAgainstFieldList={valueAgainstFieldList}
            setValueAgainstFieldList={setValueAgainstFieldList}
            onCancel={() =>
              onCancel({ visible: false, item: null, editMode: false })
            }
            genericModels={genericModels}
            allLayoutFetched={allLayoutFetched}
            handleSave={(values) => handleSave(values)}
          />
        ) : (
          <WidgetNoFieldPermission
            message={fieldPermissionMessage}
            displayIcon={false}
          />
        )}
      </GenericFormModalContainer>
      <Backdrop />
    </>
  );
};
