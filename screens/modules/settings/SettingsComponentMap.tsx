import React from "react";
import { Roles } from "./UserRoles/Roles/Roles";
import { ConnectedPersonalSettings } from "./General/PersonalSettings/ConnectedPersonalSettings";
import { UserEmailSettings } from "./General/UserEmailSettings/UserEmailSettings";
import { ConnectedUserList } from "./UserRoles/Users/ConnectedUserList";
import { AddUser } from "./UserRoles/Users/AddUser";
import { EditUser } from "./UserRoles/Users/EditUser";
import { SettingsMenuItem } from "../../../models/Settings";
import { Permissions } from "./UserRoles/Roles/Permissions";
import ConnectedTemplates from "./customization/Templates/ConnectedTemplates";
import { ConnectedDataSharing } from "./UserRoles/DataSharing/ConnectedDataSharing";
import { ConnectedActionScreens } from "./automation/actions/ConnectedActionsScreen";
import TemplateAddScreen from "./customization/Templates/Template/TemplateAddScreen";
import WorkFlowAddScreen from "./automation/workflows/WorkFlowForm/WorkFlowAddScreen";
import TemplateEditScreen from "./customization/Templates/Template/TemplateEditScreen";
import WorkFlowEditScreen from "./automation/workflows/WorkFlowForm/WorkFlowEditScreen";
import { ConnectedWorkFlowScreen } from "./automation/workflows/ConnectedWorkFlowScreen";
import { DeleteDataProfile } from "./UserRoles/DataSharing/DataProfile/DataProfileOperations/DeleteDataProfile";
import { ConnectedModules } from "./customization/ModuleAndFields/ConnectedModules/ConnectedModules";
import { ConnectedProductTaxScreen } from "./customization/ModuleAndFields/ProductTax/ConnectedProductTax";
import { ConnectedLayoutFields } from "./customization/ModuleAndFields/ConnectedFields/ConnectedLayoutFields";
import { ConnectedDealPipeline } from "./customization/ModuleAndFields/DealPipeline/ConnectedDealPipeline";
import { FieldsDependency } from "./customization/ModuleAndFields/ConnectedModules/FieldsDependency/FieldsDependency";
import { ConnectedNavigationGroups } from "./customization/Navigations/ConnectedNavigationGroups/ConnectedNavigationGroups";
import { ConnectedCreateDependency } from "./customization/ModuleAndFields/ConnectedModules/FieldsDependency/ConnectedCreateDependency";
import { ConnectedNavigationGroupItems } from "./customization/Navigations/ConnectedNavigationGroupItems/ConnectedNavigationGroupItems";
import ConnectedEmailSettings from "./General/EmailSetting/ConnectedEmailSetting";
import { TemplateViewScreen } from "./customization/Templates/TemplateViewScreen";
import { LeadConversionMappingScreen } from "./customization/ModuleAndFields/ConversionMapping/Lead/LeadConversionMappingScreen";
import { QuoteConversionMappingScreen } from "./customization/ModuleAndFields/ConversionMapping/Quote/QuoteConversionMappingScreen";
import { QuotedItemConversionMappingScreen } from "./customization/ModuleAndFields/ConversionMapping/QuotedItem/QuotedItemConversionMappingScreen";
import { SalesOrderConversionMappingScreen } from "./customization/ModuleAndFields/ConversionMapping/SalesOrder/SalesOrderConversionMappingScreen";
import { OrderedItemConversionMappingScreen } from "./customization/ModuleAndFields/ConversionMapping/OrderedItem/OrderedItemConversionMappingScreen";

export const SettingsComponentMap: Partial<
  Record<SettingsMenuItem, React.FunctionComponent<{ id: string }>>
> = {
  "personal-settings": () => <ConnectedPersonalSettings />,
  "email-settings": () => <UserEmailSettings />,
  "email-campaign": () => <ConnectedEmailSettings />,
  users: () => <ConnectedUserList />,
  "users.add": () => <AddUser editMode={false} />,
  "users.edit": ({ id }: { id: string }) => (
    <EditUser id={id} editMode={true} />
  ),
  "role-permission": () => <Roles />,
  "role-permission.permissions": ({ id }: { id: string }) => (
    <Permissions currentRoleKey={id} />
  ),
  profile: () => <ConnectedDataSharing />,
  "profile.delete": ({ id }: { id: string }) => <DeleteDataProfile id={id} />,
  navigation: () => <ConnectedNavigationGroups />,
  "navigation.navigation-group-items": ({ id }: { id: string }) => (
    <ConnectedNavigationGroupItems navigationGroupKey={id} />
  ),
  "module-fields": () => <ConnectedModules />,
  "module-fields.fields": ({ id }: { id: string }) => (
    <ConnectedLayoutFields moduleId={id} />
  ),
  "module-fields.fields-dependency": ({ id }: { id: string }) => (
    <FieldsDependency id={id} />
  ),
  "module-fields.product-tax": () => <ConnectedProductTaxScreen />,
  "module-fields.create-dependency": ({ id }: { id: string }) => (
    <ConnectedCreateDependency id={id} />
  ),
  "module-fields.deal-pipeline": () => <ConnectedDealPipeline />,
  "module-fields.lead-conversion-mapping": () => (
    <LeadConversionMappingScreen />
  ),
  "module-fields.quote-conversion-mapping": () => (
    <QuoteConversionMappingScreen />
  ),
  "module-fields.quoted-item-conversion-mapping": () => (
    <QuotedItemConversionMappingScreen />
  ),
  "module-fields.sales-order-conversion-mapping": () => (
    <SalesOrderConversionMappingScreen />
  ),
  "module-fields.ordered-item-conversion-mapping": () => (
    <OrderedItemConversionMappingScreen />
  ),
  "templates.email-template": () => (
    <ConnectedTemplates templateType={"email-template"} />
  ),
  "templates.module-template": () => (
    <ConnectedTemplates templateType={"module-template"} />
  ),
  "templates.email-template.view": ({ id }: { id: string }) => (
    <TemplateViewScreen id={id} />
  ),
  "templates.module-template.view": ({ id }: { id: string }) => (
    <TemplateViewScreen id={id} />
  ),
  "templates.email-template.add": () => <TemplateAddScreen />,
  "templates.module-template.add": () => <TemplateAddScreen />,
  "templates.email-template.edit": ({ id }: { id: string }) => (
    <TemplateEditScreen id={id} />
  ),
  "templates.module-template.edit": ({ id }: { id: string }) => (
    <TemplateEditScreen id={id} />
  ),
  workflows: () => <ConnectedWorkFlowScreen />,
  "workflows.add": () => <WorkFlowAddScreen />,
  "workflows.edit": ({ id }: { id: string }) => <WorkFlowEditScreen id={id} />,
  actions: () => <ConnectedActionScreens />,
};
