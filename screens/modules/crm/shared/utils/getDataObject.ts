import { BaseGenericObjectType } from "../../../../../models/shared";

export const getCustomFieldData = (data: BaseGenericObjectType) => {
  let result: BaseGenericObjectType = {};
  for (const key in data) {
    const [name1, name2] = key.split(".");
    if (name1 === "fields") {
      result[name2] = data[key];
    }
  }
  return result;
};

//func
export function getDataObject(data: BaseGenericObjectType) {
  if (!data) {
    return {};
  }
  if (data?.["fields"] && Object.keys(data?.["fields"])?.length) {
    data = { ...data, ...data["fields"] };
  }
  let dataObject: BaseGenericObjectType = {};
  for (const [key, value] of Object.entries(data)) {
    const [name1, name2] = key.split(".");
    if (name1 === "fields" && name2) {
      dataObject[name2] = value;
    } else {
      if (key === "relatedTo") {
        dataObject[key] =
          value && typeof value === "object" && Object.keys(value).length === 0
            ? []
            : value;
      } else {
        dataObject[key] =
          value && typeof value === "object" && Object.keys(value).length === 0
            ? null
            : value;
      }
    }
  }
  return dataObject;
}

export function getDataObjectArray(dataArray: BaseGenericObjectType[]) {
  if (!dataArray?.length) return [];
  let dataObjectArray: BaseGenericObjectType[] = [];
  for (let i = 0; i < dataArray?.length; i++) {
    let dataObject: BaseGenericObjectType = {};
    for (const [key, value] of Object.entries(dataArray[i])) {
      const [name1, name2] = key.split(".");
      if (name1 === "fields") {
        dataObject[name2] = value;
      } else {
        dataObject[key] = value;
      }
    }
    dataObjectArray.push(dataObject);
  }
  return dataObjectArray;
}

export function getDataObjectArrayForCustomViews(
  dataArray: BaseGenericObjectType[]
) {
  let dataObjectArray: BaseGenericObjectType[] = [];
  for (let i = 0; i < dataArray.length; i++) {
    let dataObject: BaseGenericObjectType = {};
    for (const [key, value] of Object.entries(dataArray[i])) {
      const [name1, name2] = key.split(".");
      if (name1 === "fields") {
        dataObject[name2] = value;
      } else {
        dataObject[key] = value;
      }
    }
    dataObjectArray.push(dataObject);
  }
  return dataObjectArray;
}

//NOTE: Old getDataObject implementation, when we were fetching custom fields data from `field` object from record data
// export function getDataObject(data: BaseGenericObjectType) {
//   if (!data) {
//     return {};
//   }
//   let dataObject: BaseGenericObjectType = {};
//   for (const [key, value] of Object.entries(data)) {
//     if (key === "fields") {
//       if (data?.fields) {
//         for (const [key, value] of Object.entries(data?.fields)) {
//           dataObject[key] =
//             value &&
//             typeof value === "object" &&
//             Object.keys(value).length === 0
//               ? null
//               : value;
//         }
//       }
//     } else {
//       if (key === "relatedTo") {
//         dataObject[key] =
//           value && typeof value === "object" && Object.keys(value).length === 0
//             ? []
//             : value;
//       } else {
//         dataObject[key] =
//           value && typeof value === "object" && Object.keys(value).length === 0
//             ? null
//             : value;
//       }
//     }
//   }
//   return dataObject;
// }

//NOTE: Old getDataObjectArray implementation, when we were fetching custom fields data from `field` object from record data
// export function getDataObjectArray(dataArray: BaseGenericObjectType[]) {
//   let dataObjectArray: BaseGenericObjectType[] = [];
//   for (let i = 0; i < dataArray.length; i++) {
//     let dataObject: BaseGenericObjectType = {};
//     for (const [key, value] of Object.entries(dataArray[i])) {
//       if (key === "fields") {
//         if (dataArray[i]?.fields) {
//           for (const [key, value] of Object.entries(dataArray[i]["fields"])) {
//             dataObject[key] = value;
//           }
//         }
//       } else {
//         dataObject[key] = value;
//       }
//     }
//     dataObjectArray.push(dataObject);
//   }
//   return dataObjectArray;
// }

//NOTE: Old getDataObjectArrayForCustomViews implementation, when we were fetching custom fields data from `field` object from record data
// export function getDataObjectArrayForCustomViews(
//   dataArray: BaseGenericObjectType[]
// ) {
//   let dataObjectArray: BaseGenericObjectType[] = [];
//   for (let i = 0; i < dataArray.length; i++) {
//     let dataObject: BaseGenericObjectType = {};
//     for (const [key, value] of Object.entries(dataArray[i])) {
//       if (key === "fields") {
//         if (dataArray[i]?.fields) {
//           for (const [key, value] of Object.entries(dataArray[i]["fields"])) {
//             dataObject[key] = value;
//           }
//         }
//       } else {
//         dataObject[key.replace("fields.", "")] = value;
//       }
//     }
//     dataObjectArray.push(dataObject);
//   }
//   return dataObjectArray;
// }
