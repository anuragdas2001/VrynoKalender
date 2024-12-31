export type ActionType = {
  label: string;
  value: string;
  moduleName?: string;
  groupBy?: string;
  onClick?: (item: any) => void;
};

export const activitiesName = [
  {
    label: "Add Task",
    value: "add-task",
    moduleName: "task",
    groupBy: "Activities",
  },
  {
    label: "Add Meeting",
    value: "add-meeting",
    moduleName: "meeting",
    groupBy: "Activities",
  },
  {
    label: "Schedule a Call",
    value: "schedule-call",
    moduleName: "callLog",
    groupBy: "Activities",
  },
];

export const actionTypes: ActionType[] = [
  { label: "Emails", value: "email" },
  { label: "Web hook", value: "webhook" },
  { label: "Assign Owner", value: "assign-owner" },
].concat(activitiesName);
