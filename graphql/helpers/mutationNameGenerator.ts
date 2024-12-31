import { SupportedMutationNames } from "./graphQLShared";

export const mutationNameGenerator = (
  mutationName: SupportedMutationNames,
  modelName: string
) => {
  if (!mutationName)
    throw new Error("mutationNameGenerator: Mutation name is required");
  if (!modelName)
    throw new Error("mutationNameGenerator: Module name is required");
  return `${mutationName}${
    modelName?.charAt(0).toUpperCase() + modelName?.slice(1)
  }`;
};
