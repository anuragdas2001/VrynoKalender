import { BaseEntity } from "./BaseEntity";
import { BaseGenericObjectType } from "./shared";

export enum WidgetsView {
  DealPipeline = "deal-pipeline",
  RevenueViaClosedDeal = "revenue-via-closed-deals",
  LeadBySource = "lead-by-source",
  DealForecast = "deal-forecast",
  MyTasks = "my-tasks",
  MyMeetings = "my-meetings",
  MyNotes = "my-notes",
  MyCallLogs = "my-call-logs",
  MyLeads = "my-leads",
  MyDeals = "my-deals",
  MyContacts = "my-contacts",
  MyOrganization = "my-organization",
}

export interface IWidget extends BaseEntity {
  fieldPermissionMessage: string | null;
  name: string;
  key: WidgetsView | string | null;
  widgetType: string;
  widgetMetadata: BaseGenericObjectType | null;
  moduleViewId: string[];
  customView: BaseGenericObjectType[];
  // customView: Array<{
  //   customViewData?: Record<string, string>[];
  //   graphData?: Record<string, string>[];
  //   moduleFields?: any;
  //   moduleName: string;
  // }>;
}

export interface IDashboardDetails extends BaseEntity {
  name: string;
  instanceId: string;
  widgetDetails: IWidget[];
  widgets: string[];
  url?:string;
}
