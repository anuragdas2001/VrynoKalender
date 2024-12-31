export const processModuleDataWithCustomFields = (data: any[]) => {
  return data.map((item: any) => {
    let responseObj = {};
    for (const key in item) {
      if (key.includes("fields.")) {
        responseObj = {
          ...responseObj,
          [key.slice(key.indexOf(".") + 1)]: item[key],
        };
      } else {
        responseObj = { ...responseObj, [key]: item[key] };
      }
    }
    return responseObj;
  });
};
