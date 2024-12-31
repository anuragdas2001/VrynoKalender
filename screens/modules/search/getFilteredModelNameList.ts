import { AppModels } from "../../../models/AppModels";
import { BaseGenericObjectType } from "../../../models/shared";

export const getFilteredModelNameList = (
  searchResults: Array<BaseGenericObjectType>
) => {
  const modelNameList: string[] = searchResults
    ?.map((result) => result?.modelName)
    .filter(
      (value, index, searchResults) => searchResults.indexOf(value) === index
    )
    .filter(
      (modelName) =>
        ![
          "note",
          "dealPipelineStage",
          "dealPipeline",
          "layoutField",
          "layout",
          "field",
          "module",
          "moduleView",
          "attachment",
          "rolePermission",
          "role",
          "navigationItem",
          "bulkImportJob",
          "navigation",
          AppModels.Dashboard.toLowerCase(),
          AppModels.Widget.toLowerCase(),
        ].includes(modelName)
    );
  return modelNameList;
};
