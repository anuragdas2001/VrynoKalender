import { get } from "lodash";
import { BaseGenericObjectType } from "../../../../../models/shared";

export function getSortedArray(pipelineObject: BaseGenericObjectType) {
  const pipelineArray: Record<string, string | number>[] = [];
  Object.keys(pipelineObject).forEach((key: string) => {
    if (key !== "name" && key !== "default") {
      pipelineArray.push({ ...pipelineObject[key], name: key });
    }
  });

  return pipelineArray
    ?.slice()
    .sort((item1, item2) =>
      get(item1, "order", "") > get(item2, "order", "") ? 1 : -1
    );
}
