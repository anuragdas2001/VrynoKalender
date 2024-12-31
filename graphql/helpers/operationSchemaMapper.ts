import { DocumentNode } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";
import { OperationVariables } from "@apollo/client";
import { useLazyQuery } from "@apollo/client";
import { QUERY_FETCH_MAIL_SYNCHING_JOB } from "../queries/LinkAccountQuery";
import { QUERY_FETCH_LINKED_ACCOUNTS } from "../queries/LinkAccountQuery";
import { QUERY_GET_AUTH_PROVIDER_DATA } from "../queries/LinkAccountQuery";
import { QUERY_FETCH_MAIL } from "../queries/LinkAccountQuery";
import { QUERY_GET_MAIL } from "../queries/LinkAccountQuery";

import { MUTATION_CREATE_MAIL_SYNCHING_JOB } from "../mutations/LinkAccountMutation";
import { MUTATION_UPDATE_MAIL_SYNCHING_JOB } from "../mutations/LinkAccountMutation";
import { DELETE_MAIL_SYNCHING_JOB } from "../mutations/deleteLinkedAccount";

type mutation = typeof useMutation;
type query = typeof useQuery;
type lazy = typeof useLazyQuery;

const OPERATION_SCHEMA_NAME_MAP: Record<string, DocumentNode> = {
  fetchMailSynchronizationJob: QUERY_FETCH_MAIL_SYNCHING_JOB,
  fetchLinkedAccount: QUERY_FETCH_LINKED_ACCOUNTS,
  getAuthProviderData: QUERY_GET_AUTH_PROVIDER_DATA,
  createMailSynchronizationJob: MUTATION_CREATE_MAIL_SYNCHING_JOB,
  updateMailSynchronizationJob: MUTATION_UPDATE_MAIL_SYNCHING_JOB,
  fetchMail: QUERY_FETCH_MAIL,
  getMail: QUERY_GET_MAIL,
  deleteMailSynchronizationJob: DELETE_MAIL_SYNCHING_JOB,
};

export const getGQLOperationParams = ({
  topic,
  operation,
  onCompleted,
  onError,
}: {
  topic: string;
  operation: string;
  onCompleted: ({}) => void;
  onError: ({}) => void;
}): [DocumentNode, OperationVariables] => {
  return [
    OPERATION_SCHEMA_NAME_MAP[operation],
    {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: topic,
        },
      },
      onCompleted: onCompleted,
      onError: onError,
    },
  ];
};
