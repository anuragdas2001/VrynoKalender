let resultedData: any = {};
export default function getValuesAtSameLevelFromDeepLevel(data: any) {
  if (!data) return data;
  for (let keys of Object.keys(data)) {
    if (typeof data[keys] === "object") {
      getValuesAtSameLevelFromDeepLevel(data[keys]);
    } else {
      resultedData[keys] = data[keys];
    }
  }
  return resultedData;
}
