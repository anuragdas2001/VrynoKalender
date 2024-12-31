export const domainRecordGeneratorHelper = (
  key: string,
  domainDataKey: string,
  dataRecord: any,
  domainRecords: any
) => {
  let data: any = {};
  if (key === "status") {
    data = {
      ...dataRecord,
      [key]: Object.keys(domainRecords.records[key][domainDataKey])[0],
      statusData: domainRecords.records[key][domainDataKey],
    };
  } else {
    data = {
      ...dataRecord,
      [key]: domainRecords.records[key][domainDataKey],
    };
  }
  return data;
};
