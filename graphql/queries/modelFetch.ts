import { gql } from "@apollo/client";
import { SupportedMutationNames } from "../helpers/graphQLShared";
import { mutationNameGenerator } from "../helpers/mutationNameGenerator";

export const fetchModelDataWithinQueryGenerator = (
  queryName: string,
  fields: string[],
  additionalParam?: Record<string, string>
) => {
  if (!fields?.length) return "";
  if (additionalParam) {
    return `${queryName}(${
      additionalParam
        ? Object.keys(additionalParam || {})
            .map((key: string) => `pageNumber: $${key}`)
            .toString()
        : ""
    }
    options: $options) {
      status
      data { ${fields.join(" ")} }
      code
      count
      message
      messageKey
    }`;
  }
  return `${queryName}(options: $options) {
      status
      data { ${fields.join(" ")} }
      code
      count
      message
      messageKey
  }`;
};

export const fetchModelDataQueryGenerator = (
  queryName: string,
  fields: string[],
  additionalParam?: Record<string, string>
) => {
  return `${queryName}(
    $filters: [FetchFilter!]
    $orderBy: [FetchOrderBy]
    $customViewId: String
    $pageNumber: Int
    $expression: String
    $options: Options
    ${
      additionalParam
        ? Object.keys(additionalParam || {})
            .map((key: string) => `$${key}: ${additionalParam?.[key]}`)
            .toString()
        : ""
    }
  ) {
    ${queryName}(
      filters: $filters
      orderBy: $orderBy
      customViewId: $customViewId
      pageNumber: $pageNumber
      expression: $expression
      options: $options
    ) {
      status
      data { ${fields.join(" ")} }
      code
      count
      message
      messageKey
    }
  }`;
};

export const fetchModelData = (
  modelName: string,
  fields: string[],
  additionalParam?: Record<string, string>
) => {
  if (!modelName)
    throw new Error("moduleBulkUpdateMutation: Module name is required");

  const queryName = mutationNameGenerator(
    SupportedMutationNames.fetch,
    modelName
  );

  const fetchQuery = `
    query ${fetchModelDataQueryGenerator(queryName, fields, additionalParam)}
  `;
  return gql(fetchQuery);
};

// import { gql } from "@apollo/client";
// import { SupportedMutationNames } from "../helpers/graphQLShared";
// import { mutationNameGenerator } from "../helpers/mutationNameGenerator";

// export const fetchModelDataWithinQueryGenerator = (
//   queryName: string,
//   fields: string[],
//   additionalParam?: Record<string, string>
// ) => {
//   if (!fields?.length) return "";
//   if (additionalParam) {
//     return `${queryName}(${
//       additionalParam
//         ? Object.keys(additionalParam || {})
//             .map((key: string) => {
//               return key === "recordStatusFilter"
//                 ? `filters: $recordStatusFilter`
//                 : `pageNumber: $${key}`;
//             })
//             .toString()
//         : ""
//     }
//     options: $options) {
//       status
//       data { ${fields.join(" ")} }
//       code
//       count
//       message
//       messageKey
//     }`;
//   }
//   return `${queryName}(
//     recordStatusFilter: $recordStatusFilter
//     options: $options
//   ) {
//       status
//       data { ${fields.join(" ")} }
//       code
//       count
//       message
//       messageKey
//   }`;
// };

// export const fetchModelDataQueryGenerator = (
//   queryName: string,
//   fields: string[],
//   additionalParam?: Record<string, string>
// ) => {
//   return `${queryName}(
//     $filters: [FetchFilter!]
//     $orderBy: [FetchOrderBy]
//     $customViewId: String
//     $pageNumber: Int
//     $expression: String
//     $options: Options
//     ${
//       additionalParam
//         ? Object.keys(additionalParam || {})
//             .map((key: string) => {
//               return key === "recordStatusFilter"
//                 ? `$recordStatusFilter: [FetchFilter]`
//                 : `$${key}: ${additionalParam?.[key]}`;
//             })
//             .toString()
//         : ""
//     }
//   ) {
//     ${queryName}(
//       filters: $filters
//       orderBy: $orderBy
//       customViewId: $customViewId
//       pageNumber: $pageNumber
//       expression: $expression
//       options: $options
//     ) {
//       status
//       data { ${fields.join(" ")} }
//       code
//       count
//       message
//       messageKey
//     }
//   }`;
// };

// export const fetchModelData = (
//   modelName: string,
//   fields: string[],
//   additionalParam?: Record<string, string>
// ) => {
//   if (!modelName)
//     throw new Error("moduleBulkUpdateMutation: Module name is required");

//   const queryName = mutationNameGenerator(
//     SupportedMutationNames.fetch,
//     modelName
//   );

//   const fetchQuery = `
//     query ${fetchModelDataQueryGenerator(queryName, fields, additionalParam)}
//   `;
//   return gql(fetchQuery);
// };

// // const fetchQuery = `
// // query ${queryName}(
// //   $modelName: String!
// //   $filters: [FetchFilter!]
// //   $orderBy: [FetchOrderBy]
// //   $customViewId: String
// //   $pageNumber: Int
// //   $options: GenericData
// //   $expression: String
// // ) {
// //   fetch(
// //     modelName: $modelName
// //     filters: $filters
// //     orderBy: $orderBy
// //     customViewId: $customViewId
// //     pageNumber: $pageNumber
// //     options: $options
// //     expression: $expression
// //   ) {
// //     status
// //     data { ${fields.join(" ")} }
// //     code
// //     count
// //     message
// //     messageKey
// //   }
// // }
// // `;
