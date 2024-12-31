import { BaseEntity } from "./BaseEntity";
import { ICommon } from "./ICommon";

export interface IOrganisation extends ICommon {
  organisationName: string;
  contactOwner: string;
  website: string;
  linkedin: string;
  taxNumber: string;
  registrationNumber: string;
  employeeDetails: string;
  fax: string;
  parentContact: string;
  contactType: string;
  status: string;
  industry: string;
}

export interface ILead extends ICommon {
  leadOwner: string;
  leadAssignee: string;
  firstName: string;
  lastName: string;
  source: string;
  status: Boolean;
  stageId: string;
  score: Number;
  internalNotes: string;
  countryIdCode: string;
  website: string;
  opportunity: string;
}

export interface IContact extends ICommon {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  contactOwner: string;
  relationshipType: string;
  parentContact: string;
  internalNotes: string;
  contactType: string;
  industry: string;
  organisationName: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ICallLog extends BaseEntity {
  comment: string;
  contactNumber: string;
  contactPersonName: string;
  moduleName: string;
  recordId: string;
  statusId: string;
  companyId: string;
  createdAt: string;
  deleted: boolean;
  recordStatus: string;
}

export interface IDeal extends ICommon {
  name: string;
  dealOwnerName: string;
  contactId: string;
  dealSource: string;
  expectedRevenue: number;
  dealTypeId: string;
  dealPipelineId: string;
  dealStageId: string;
  probability: number;
  recordStatus: string;
}
