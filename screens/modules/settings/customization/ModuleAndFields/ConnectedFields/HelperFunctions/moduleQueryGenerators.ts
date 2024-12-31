export const generateModuleContext = (serviceName: string) => {
  return {
    headers: {
      vrynopath: serviceName,
    },
  };
};

export const generateModuleVariables = (
  filters: { name: string; operator: "eq" | "in"; value: string | string[] }[]
) => {
  return {
    modelName: "Module",
    fields: ["id", "name", "label", "customizationAllowed", "order"],
    filters: [...filters],
  };
};
