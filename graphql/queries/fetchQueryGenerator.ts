import { gql } from "@apollo/client";
import { FetchVars } from "./fetchQuery";

const getVarName = (varName: string, index: number) => {
  return `${varName}${index}`;
};

const getVarPart = (varName: string, index: number) => {
  return `${varName}: $${getVarName(varName, index)}`;
};

type QueryAliases = {
  alias: string;
};

const getVarWrapperPart = (varName: string, varType: string, index: number) => {
  return `$${varName}${index}: ${varType}`;
};

export const INTERNAL_FETCH_QUERY = (
  queryAliases: QueryAliases[],
  queryInputTypes: {}
) => {
  return queryAliases.map((eachModel, index) => {
    const varStrings = getValidProps(queryInputTypes).map((attrName) => {
      return getVarPart(attrName, index);
    });
    return `${eachModel.alias} : fetch(${varStrings.join(",")}) {
        code
        status
        message
        messageKey
        data
      }`;
  });
};

const getValidProps = (singleInput: Record<string, string> | FetchVars) =>
  Object.keys(singleInput).filter((oneProp) => !["alias"].includes(oneProp));

export const FETCH_QUERY = (
  queryAliases: QueryAliases[],
  queryInputTypes: Record<string, string>
) => {
  const generatedParams = queryAliases
    .map((singleInput, index) => {
      return getValidProps(queryInputTypes).map((filteredProp) => {
        return getVarWrapperPart(
          filteredProp,
          queryInputTypes[filteredProp],
          index
        );
      });
    })
    .reduce((accumulated, newInput) => [...accumulated, ...newInput], []);
  const internalQueries = INTERNAL_FETCH_QUERY(queryAliases, queryInputTypes);
  return gql`
  query fetch (
        ${generatedParams.join("\n")}
  ) {
      ${internalQueries.join("\n")} 
    }
  `;
};

export const generateSearchQuery = (
  queryAliases: QueryAliases[],
  queryInputTypes: {} = defaultQueryInputTypes
) => {
  return FETCH_QUERY(queryAliases, queryInputTypes);
};

export const variableReducer = (searchInputs: FetchVars[]) => {
  return searchInputs
    .map((singleInput, index) => {
      return getValidProps(singleInput).reduce(
        (transformedObj: Record<string, any>, filteredProp) => {
          transformedObj[`${filteredProp}${index}`] = singleInput[filteredProp];
          return transformedObj;
        },
        {}
      );
    })
    .reduce((accumulated, newInput) => ({ ...accumulated, ...newInput }), {});
};

export const defaultQueryInputTypes = {
  modelName: "String!",
  filters: "[FetchFilter!]",
  fields: "[String!]",
};
