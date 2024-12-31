import { IModuleMetadata } from "../../../../../models/IModuleMetadata";

export const getModuleLabel = (
  modelName: string,
  modules: IModuleMetadata[]
) => {
  const findModuleIndex = modules.findIndex(
    (module) => module.name === modelName
  );
  if (findModuleIndex === -1) return modelName;
  return modules[findModuleIndex].label.en;
};
