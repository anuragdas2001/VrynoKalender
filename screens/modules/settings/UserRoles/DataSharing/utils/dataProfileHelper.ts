import { isAfter } from "date-fns";
import { IProfileData } from "../../../../../../models/DataSharingModels";
import { TreeNodeClass } from "./TreeNodeClass";

export const createTreeInRecursion = (
  rootNode: TreeNodeClass,
  dataDict: Record<string, IProfileData[]>
) => {
  if (dataDict[rootNode.data.id]?.length) {
    for (const val of dataDict[rootNode.data.id]) {
      const node = new TreeNodeClass(val);
      rootNode.addChildNode(node);
      createTreeInRecursion(node, dataDict);
    }
  }
};

export const recursiveChildExtractor = (
  data: IProfileData,
  dataDict: Record<string, IProfileData[]>,
  toBeUpdatedProfileList: IProfileData[]
) => {
  if (dataDict[data.id]?.length)
    for (const val of dataDict[data.id]) {
      toBeUpdatedProfileList.push(val);
      recursiveChildExtractor(val, dataDict, toBeUpdatedProfileList);
    }
};

export const profileDataGenerator = (dataSharingResult: IProfileData[]) => {
  let nodesDict: Record<string, IProfileData[]> = {};
  let rootNode = null;
  const addProfileParentOptions: { value: string; label: string }[] = [];

  for (const data of dataSharingResult) {
    addProfileParentOptions.push({ value: data.id, label: data.name });
    if (!data["parentId"]) {
      rootNode = new TreeNodeClass(data);
    } else {
      nodesDict = {
        ...nodesDict,
        [data["parentId"]]: nodesDict[data["parentId"]]
          ? [...nodesDict[data["parentId"]], data]
          : [data],
      };
    }
  }
  for (const key in nodesDict) {
    nodesDict[key] = nodesDict[key].sort(
      (a: { createdAt: string }, b: { createdAt: string }) =>
        isAfter(new Date(a.createdAt), new Date(b.createdAt)) ? 1 : -1
    );
  }
  return { rootNode, nodesDict, addProfileParentOptions };
};

export const deleteProfileFetchHandler = (
  dataSharingResult: IProfileData[],
  id: string
) => {
  let parentOptions: { value: string; label: string }[] = [];
  let nodesDict: Record<string, IProfileData[]> = {};
  let currentProfileData = null;
  for (const data of dataSharingResult) {
    if (data.id === id) {
      currentProfileData = data;
    } else {
      parentOptions.push({ value: data.id, label: data.name });
    }
    nodesDict = {
      ...nodesDict,
      [data["parentId"]]: nodesDict[data["parentId"]]
        ? [...nodesDict[data["parentId"]], data]
        : [data],
    };
  }
  let toBeUpdatedProfileList: IProfileData[] = [];
  if (nodesDict[id]?.length && currentProfileData) {
    recursiveChildExtractor(
      currentProfileData,
      nodesDict,
      toBeUpdatedProfileList
    );
  }
  let updatedParentOptions = [];
  if (toBeUpdatedProfileList?.length)
    for (const option of parentOptions) {
      let flag = true;
      for (const rejectedOption of toBeUpdatedProfileList) {
        if (option.value === rejectedOption.id) {
          flag = false;
          break;
        }
      }
      if (flag) updatedParentOptions.push(option);
    }
  else updatedParentOptions = parentOptions;
  return { nodesDict, currentProfileData, updatedParentOptions };
};
