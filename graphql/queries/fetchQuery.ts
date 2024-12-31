import { gql } from "@apollo/client";
import { GenericQueryResponse } from "../../models/shared";

export interface FetchVars {
  modelName: string;
  filters: {
    operator: string;
    name: string;
    value: string | string[];
    logicalOperator?: string;
    metadata?: string;
  }[];
  fields: string[];
  orderBy?: IOrderByClause[];
  options?: any;
  [key: string]: any;
}

export interface IOrderByClause {
  name: string;
  orderBy: string;
}

export interface FetchData<T> {
  fetch: GenericQueryResponse<T>;
}

export const FETCH_QUERY = gql`
  query fetch(
    $modelName: String!
    $filters: [FetchFilter!]
    $orderBy: [FetchOrderBy]
    $fields: [String!]
    $customViewId: String
    $pageNumber: Int
    $options: Options
    $expression: String
    $recordsPerPage: Int
  ) {
    fetch(
      modelName: $modelName
      filters: $filters
      orderBy: $orderBy
      fields: $fields
      customViewId: $customViewId
      pageNumber: $pageNumber
      options: $options
      expression: $expression
      recordsPerPage: $recordsPerPage
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

export const fetchQueryWithModel = (model: string, fields: string[]) => gql`
  query fetch${model}(
    $filters: [FetchFilter!]
    $customViewId: String
    $pageNumber: Int
    $options: GenericData
    $expression: String
  ) {
    fetch${model}(
      filters: $filters
      customViewId: $customViewId
      pageNumber: $pageNumber
      options: $options
      expression: $expression
    ) {
      status
      data { ${fields.join(" ")} }
      code
      count
      message
      messageKey
      errors
    }
  }
`;
