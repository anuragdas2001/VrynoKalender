import { gql } from "@apollo/client";
import { SupportedMutationNames } from "../helpers/graphQLShared";
import { mutationNameGenerator } from "../helpers/mutationNameGenerator";

export const generateBulkUpdateMutation = (modelName: string) => {
  if (!modelName)
    throw new Error("moduleBulkUpdateMutation: Module name is required");
  const mutationName = mutationNameGenerator(
    SupportedMutationNames.bulkUpdate,
    modelName
  );
  const mutationQuery = `
    mutation ${mutationName}($ids: [String!]!, $input: Update${
    modelName?.charAt(0).toUpperCase() + modelName?.slice(1)
  }Input, $recordStatus: String){
      ${mutationName}(ids: $ids, input: $input, recordStatus: $recordStatus ) {
        id
        status
        code
        message
        messageKey
      }
    }
  `;
  return gql(mutationQuery);
};
