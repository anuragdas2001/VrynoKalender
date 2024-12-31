import { BaseEntity } from "./BaseEntity";

export interface ICommon extends BaseEntity {
  phoneNumber: string;
  email: string;
  address: string;
  cityId: string;
  stateId: string;
  countryId: string;
  zipcode: string;
  description: string;
  imageId: string;
  recordStatus: string;
  updatedBy?: string;
  updatedAt?: string;
}
