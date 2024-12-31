export interface IProfileData {
  id: string;
  recordStatus: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  name: string;
  parentId: string;
  sharedPeers: boolean;
  instanceId: string;
  description: string;
  profileStats: string;
}

export interface IModuleDataSharingRuleData {
  id: string;
  recordStatus: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  moduleUniqueName: string;
  moduleName: string;
  serviceName: string;
  modulePermission: "private" | "read" | "read/modify" | "read/modify/remove";
  instanceId: string;
  description: string;
}

export interface I {}
