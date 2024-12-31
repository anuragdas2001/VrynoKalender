import { gql } from "@apollo/client";
import { GenericQueryResponse } from "../../models/shared";

export interface SearchVars {
  serviceName: string;
  modelName: string;
  text: string;
  [key: string]: any;
}

export interface SearchData<T> {
  search: GenericQueryResponse<T>;
}

export interface ISearchFilter {
  fieldName: string;
  value: string | any[];
  exact: boolean;
}

export const SEARCH_QUERY = gql`
  query quest(
    $serviceName: String!
    $modelName: String
    $text: String!
    $pageNumber: Int
  ) {
    quest(
      serviceName: $serviceName
      modelName: $modelName
      text: $text
      pageNumber: $pageNumber
    ) {
      status
      data
      code
      count
      message
      messageKey
    }
  }
`;

export const SEARCH_MODULE_QUERY = gql`
  query quest(
    $serviceName: String!
    $modelName: String
    $text: String!
    $pageNumber: Int
    $filters: [GenericData]
  ) {
    quest(
      serviceName: $serviceName
      modelName: $modelName
      text: $text
      pageNumber: $pageNumber
      filters: $filters
    ) {
      status
      data
      code
      count
      message
      messageKey
    }
  }
`;

// {
//   quest(
//     serviceName: "crm"
//     modelName: "contact"
//     text: ""
//     filters: [{fieldName: "fields.custom_0uzmqt4h", value: "3d3b14e6-970b-423a-9bb8-22032447bc1d", exact: True}, {fieldName: "organizationId", value: "353658d2-5811-4f68-b5c0-751a09e8250a", exact: True}]
//   ) {
//     code
//     count
//     status
//     message
//     messageKey
//     data
//   }
// }
