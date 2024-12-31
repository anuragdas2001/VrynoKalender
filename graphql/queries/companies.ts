import { gql } from "@apollo/client";
import { GenericQueryResponse, ICompany } from "../../models/shared";

export const COMPANY_DETAIL_QUERY = gql`
  query company($id: String!) {
    company(id: $id) {
      status
      code
      message
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

export interface CompanyListData {
  companies: GenericQueryResponse<ICompany>;
}

export const COMPANY_LIST_QUERY = gql`
  query companies {
    companies {
      status
      code
      message
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
