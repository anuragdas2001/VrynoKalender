import React from "react";
import { ConnectedDashboardScreen } from "../modules/crm/dashboard/view/ConnectedDashboardScreen";
import { ConnectedCustomView } from "../modules/crm/generic/GenericAddCustomView/ConnectedCustomView";
import { GenericModelDetailsScreen } from "../modules/crm/generic/GenericModelDetails/GenericModelDetailsScreen";
import { GenericModelScreen } from "../modules/crm/generic/GenericModelView/GenericModelScreen";
import GenericAddCustomView from "../modules/crm/generic/GenericAddCustomView/GenericAddCustomView";
import { ILayout } from "../../models/ILayout";
import { ICustomField } from "../../models/ICustomField";
import { IModuleMetadata } from "../../models/IModuleMetadata";
import { ConnectedGenericEmail } from "../modules/crm/generic/GenericEmailView/ConnectedGenericEmail";
import { ConnectedEmailSentDetails } from "../modules/crm/generic/GenericEmailView/EmailSendDetails/ConnectedEmailSentDetails";
import { GenericLeadConversionMappingScreen } from "../modules/crm/generic/GenericLeadConversion/GenericLeadConversionMappingScreen";
import { EditDashboard } from "../modules/crm/dashboard/AddEditDashboards/EditDashboard";
import { AddDashboard } from "../modules/crm/dashboard/AddEditDashboards/AddDashboard";
import { ConnectedDashboards } from "../modules/crm/dashboard/Dashboards/ConnectedDashboards";
import { VrynoHead } from "./VrynoHead";
import { ConnectedMassUpdate } from "../modules/crm/generic/GenericMassUpdate/ConnectedMassUpdate";
import { ConnectedWidgetDashboard } from "../modules/crm/dashboard/WidgetDashboard/ConnectedWidgetDashbaord";
import { GenericLeadConvertedScreen } from "../modules/crm/generic/GenericLeadConversion/GenericLeadConvertedScreen";
import { ConnectedAddBulkImportScreen } from "../modules/crm/generic/GenericBulkImport/ConnectedAddBulkImportScreen";
import { GenericAddAndEditWrapper } from "../modules/crm/generic/GenericForms/GenericAddAndEditWrapper";
import {
  DetailViewView,
  SupportedApps,
  SupportedDashboardViews,
  SupportedViewType,
} from "../../models/shared";
import { observer } from "mobx-react-lite";

export const updateFieldsListDataTypeForFilters = (
  fieldsList: ICustomField[]
) => {
  return fieldsList
    ?.map((field) => {
      return {
        ...field,
        dataTypeMetadata: {
          ...field.dataTypeMetadata,
          type:
            field.dataType === "multiSelectLookup"
              ? "multiLookup"
              : field.dataType === "multiSelectRecordLookup"
              ? "multiRecord"
              : field?.dataTypeMetadata?.type,
        },
      };
    })
    ?.map((field) => {
      return {
        ...field,
        dataType:
          field.dataType === "lookup"
            ? "multiSelectLookup"
            : field.dataType === "recordLookup"
            ? "multiSelectRecordLookup"
            : field.dataType === "stringLookup"
            ? "multiSelectLookup"
            : field.dataType,
      };
    });
};

interface GenericComponentPropType {
  appName: SupportedApps;
  modelName: string;
  fieldsList: ICustomField[];
  currentLayout?: ILayout;
  id?: string;
  relatedFilter?: string;
  relatedFilterId?: string;
  currentModule?: IModuleMetadata;
  backgroundProcessRunning?: boolean;
  setBackgroundProcessRunning?: (value: boolean) => void;
}

const GenericAddComponent = ({
  appName,
  modelName,
  currentLayout,
  currentModule,
  backgroundProcessRunning,
  setBackgroundProcessRunning = () => {},
}: GenericComponentPropType) => (
  <GenericAddAndEditWrapper
    appName={appName}
    modelName={modelName}
    currentModule={currentModule}
    backgroundProcessRunning={backgroundProcessRunning}
    setBackgroundProcessRunning={(value) => setBackgroundProcessRunning(value)}
    type={"add"}
  />
);
const GenericEditComponent = ({
  appName,
  modelName,
  currentLayout,
  currentModule,
  id,
  backgroundProcessRunning,
  setBackgroundProcessRunning = () => {},
}: GenericComponentPropType) => (
  <GenericAddAndEditWrapper
    appName={appName}
    modelName={modelName}
    id={id}
    currentModule={currentModule}
    backgroundProcessRunning={backgroundProcessRunning}
    setBackgroundProcessRunning={(value) => setBackgroundProcessRunning(value)}
    type={"edit"}
  />
);
const GenericViewComponent = ({
  id,
  appName,
  modelName,
  fieldsList,
  currentModule,
  backgroundProcessRunning,
  setBackgroundProcessRunning = () => {},
}: GenericComponentPropType) => (
  <GenericModelScreen
    appName={appName}
    modelName={modelName}
    dashboardView={id as SupportedDashboardViews}
    currentModule={currentModule}
    backgroundProcessRunning={backgroundProcessRunning}
    setBackgroundProcessRunning={(value) => setBackgroundProcessRunning(value)}
  />
);
const GenericEmailViewComponent = ({
  appName,
  modelName,
  fieldsList,
  currentModule,
  id,
}: GenericComponentPropType) => (
  <ConnectedGenericEmail
    appName={appName}
    modelName={modelName}
    id={id}
    fieldsList={fieldsList}
    currentModule={currentModule}
  />
);
const GenericEmailDetailComponent = ({
  appName,
  modelName,
  fieldsList,
  currentModule,
  id,
}: GenericComponentPropType) => (
  <ConnectedEmailSentDetails
    appName={appName}
    modelName={modelName}
    id={id}
    fieldsList={fieldsList}
    currentModule={currentModule}
  />
);
const GenericDetailComponent = ({
  appName,
  modelName,
  fieldsList,
  id,
  relatedFilter,
  relatedFilterId,
  currentModule,
  backgroundProcessRunning,
  setBackgroundProcessRunning = () => {},
}: GenericComponentPropType) => (
  <GenericModelDetailsScreen
    appName={appName}
    modelName={modelName}
    relatedFilter={relatedFilter}
    relatedFilterId={relatedFilterId}
    id={id || ""}
    currentModule={currentModule}
    backgroundProcessRunning={backgroundProcessRunning}
    setBackgroundProcessRunning={(value) => setBackgroundProcessRunning(value)}
  />
);

const GenericCustomViewComponent = ({
  appName,
  modelName,
  fieldsList,
  currentModule,
  currentLayout,
}: GenericComponentPropType) => (
  <GenericAddCustomView
    appName={appName}
    modelName={modelName}
    fieldsList={updateFieldsListDataTypeForFilters(fieldsList)}
    uniqueCustomName={""}
  />
);

const GenericBulkImport = ({
  appName,
  modelName,
  fieldsList,
  currentLayout,
  currentModule,
  backgroundProcessRunning,
  setBackgroundProcessRunning = () => {},
}: GenericComponentPropType) => <ConnectedAddBulkImportScreen />;

export const GenericViewComponentMap: Record<
  SupportedViewType,
  React.FunctionComponent<GenericComponentPropType>
> = {
  add: GenericAddComponent,
  edit: GenericEditComponent,
  view: GenericViewComponent,
  detail: GenericDetailComponent,
  customview: GenericCustomViewComponent,
  emailview: GenericEmailViewComponent,
  emaildetail: GenericEmailDetailComponent,
  bulkimport: GenericBulkImport,
  dashboard: () => (
    <>
      <VrynoHead title={`Home`} />
      <ConnectedDashboardScreen />
    </>
  ),
  adddashboard: () => (
    <>
      <VrynoHead title={`Add Dashboard`} />
      <AddDashboard />
    </>
  ),
  editdashboard: () => (
    <>
      <VrynoHead title={`Add Dashboard`} />
      <EditDashboard />
    </>
  ),
  viewdashboard: () => (
    <>
      <VrynoHead title={`All Dashboards`} />
      <ConnectedDashboards />
    </>
  ),
  customviewedit: () => <ConnectedCustomView />,
  viewwidgets: () => <></>,
  conversion: () => <GenericLeadConversionMappingScreen />,
  converted: () => <GenericLeadConvertedScreen />,
  massupdate: ({ appName, modelName, fieldsList }) => (
    <ConnectedMassUpdate
      appName={appName}
      modelName={modelName}
      fieldsList={fieldsList}
    />
  ),
  emailtemplate: () => <></>,
  moduletemplate: () => <></>,
};

export const DashboardComponentMapper = {
  [DetailViewView.Dashboard.toLowerCase()]: (
    <>
      <VrynoHead title={`Home`} />
      <ConnectedDashboardScreen />
    </>
  ),
  [DetailViewView.ViewDashboard.toLowerCase()]: (
    <>
      <VrynoHead title={`All Dashboards`} />
      <ConnectedDashboards />
    </>
  ),
  [DetailViewView.AddDashboard.toLowerCase()]: (
    <>
      <VrynoHead title={`Add Dashboard`} />
      <AddDashboard />
    </>
  ),
  [DetailViewView.EditDashboard.toLowerCase()]: (
    <>
      <VrynoHead title={`Add Dashboard`} />
      <EditDashboard />
    </>
  ),
  [DetailViewView.ViewWidgets.toLowerCase()]: (
    <>
      <VrynoHead title={`Widgets Dashboard`} />
      <ConnectedWidgetDashboard />
    </>
  ),
};
