import {
  defaultQueryInputTypes,
  generateSearchQuery,
  variableReducer,
} from "../../../../../graphql/queries/fetchQueryGenerator";

type AliasType = { alias: string }[];

export const generalLookupQuery = (
  queryAliases: AliasType,
  queryInputTypes = defaultQueryInputTypes
) => generateSearchQuery(queryAliases, queryInputTypes);

const defaultVariable = (alias: string) => ({
  modelName: "Lookup",
  filters: [{ operator: "eq", name: "type", value: alias }],
  fields: ["id", "defaultLabel", "key"],
});

export const lookupVariables = (queryAliases: AliasType) => {
  return variableReducer(
    queryAliases.map((oneAlias) => defaultVariable(oneAlias.alias))
  );
};
