import { gql } from "@apollo/client";

export const QUERY_GET_AUTH_PROVIDER_DATA = gql`
  query getAuthProviderData($platforms: [String!], $redirectUri: String!) {
    getAuthProviderData(platforms: $platforms, redirectUri: $redirectUri) {
      code
      status
      message
      messageKey
      data {
        platform
        authCodeRequestUri
      }
    }
  }
`;

export const QUERY_FETCH_LINKED_ACCOUNTS = gql`
  query fetchLinkedAccount(
    $filters: [FetchFilter]
    $expression: String
    $orderBy: [FetchOrderBy]
    $customViewId: String
    $pageNumber: Int
    $recordsPerPage: Int
  ) {
    fetchLinkedAccount(
      filters: $filters
      expression: $expression
      orderBy: $orderBy
      customViewId: $customViewId
      pageNumber: $pageNumber
      recordsPerPage: $recordsPerPage
    ) {
      code
      status
      message
      messageKey
      data {
        id
        isActive
        platform
        identity
        recordStatus
      }
    }
  }
`;

export const QUERY_FETCH_MAIL_SYNCHING_JOB = gql`
  query fetchMailSynchronizationJob(
    $filters: [FetchFilter]
    $expression: String
    $orderBy: [FetchOrderBy]
    $customViewId: String
    $pageNumber: Int
    $recordsPerPage: Int
  ) {
    fetchMailSynchronizationJob(
      filters: $filters
      expression: $expression
      orderBy: $orderBy
      customViewId: $customViewId
      pageNumber: $pageNumber
      recordsPerPage: $recordsPerPage
    ) {
      code
      status
      message
      messageKey
      data {
        id
        status
        mailAccount
        recordStatus
        stats
      }
    }
  }
`;

export const QUERY_FETCH_MAIL = gql`
  query fetchMail(
    $filters: [FetchFilter]
    $expression: String
    $orderBy: [FetchOrderBy]
    $customViewId: String
    $pageNumber: Int
    $recordsPerPage: Int
  ) {
    fetchMail(
      filters: $filters
      expression: $expression
      orderBy: $orderBy
      customViewId: $customViewId
      pageNumber: $pageNumber
      recordsPerPage: $recordsPerPage
    ) {
      code
      count
      status
      message
      messageKey
      data {
        id
        date
        subject
        sendFrom
        sendTo
        inReplyTo
        messageId
        references
        threadCount
      }
    }
  }
`;

export const QUERY_GET_MAIL = gql`
  query getMail($id: String!) {
    getMail(id: $id) {
      code
      status
      message
      messageKey
      data {
        id
        date
        subject
        sendFrom
        inReplyTo
        messageId
        rfc822FileKey
      }
    }
  }
`;
