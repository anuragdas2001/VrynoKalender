import { BaseEntity } from "./BaseEntity";

export interface IInstance extends BaseEntity {
  name: string;
  subdomain: string;
  description: string;
  instanceAdmins: string[];
  region?: string;
  admins?: string[];
  isSample?: boolean;
  created_by: string;
  companyId?: string;
  logo?: string;
}

export interface BaseUser {
  id?: string;
  email: string;
  userId?: string;
  issuedAt?: Date;
  timezone?: string;
}

export interface User extends BaseUser {
  roleIds?: string[];
  roleKeys?: string[];
  phoneNumber?: string;
  mobileNumber?: string;
  isActive?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  isInstanceAdmin?: boolean;
  timeFormat?: string;
  dateFormat?: string;
  timezone?: string;
  country?: string;
  mfaEnabled?: boolean;
  recordImage?: string;
  signature?: Record<string, any> | null;
}

export const instanceAdminRoleKey = "instance-admin";

export enum AccountModels {
  Preference = "preference",
  User = "user",
}

export interface IUser extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  organization?: string;
  phoneNumber?: string;
  company?: string;
  mfaEnabled?: boolean;
}

export interface IPermission extends BaseEntity {
  key: string;
  recordStatus: string;
}

export interface IRolePermission extends BaseEntity {
  permissionId: string;
  instanceId: string;
  roleKey: string;
  permissionKey: string;
  recordStatus: string;
}
