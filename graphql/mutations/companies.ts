import { gql } from "@apollo/client";
import { GenericMutationResponse, ICompany } from "../../models/shared";

export interface CreateCompanyVars {
  company: Partial<ICompany>;
}

export interface CreateCompanyData {
  createCompany: GenericMutationResponse<ICompany>;
}

export const CREATE_COMPANY_MUTATION = gql`
  mutation CreateCompany($company: CompanyInput!) {
    createCompany(company: $company) {
      status
      data {
        id
        name
        countryIdCode
        phoneNumber
        email
        address
        cityId
        stateId
        countryId
        zipcode
        taxNumber
        website
        contactPerson
        instanceId
        createdBy
      }
      code
      message
      messageKey
    }
  }
`;

export interface UpdateCompanyVars extends CreateCompanyVars {
  id: string;
}

export interface UpdateCompanyData {
  updateCompany: GenericMutationResponse<ICompany>;
}

export const UPDATE_COMPANY_MUTATION = gql`
  mutation UpdateCompany($id: String!, $company: CompanyInput!) {
    updateCompany(id: $id, company: $company) {
      status
      message
      messageKey
      data {
        id
        name
        countryIdCode
        phoneNumber
        email
        address
        cityId
        stateId
        countryId
        zipcode
        taxNumber
        website
        contactPerson
        instanceId
        createdBy
      }
    }
  }
`;

export interface DeleteCompanyVars {
  id: string;
}

export interface DeleteCompanyData {
  deleteCompany: GenericMutationResponse<{ id: string }>;
}

export const DELETE_COMPANY_MUTATION = gql`
  mutation DeleteCompany($id: String!) {
    deleteCompany(id: $id) {
      status
      code
      message
      messageKey
      data {
        id
      }
    }
  }
`;
