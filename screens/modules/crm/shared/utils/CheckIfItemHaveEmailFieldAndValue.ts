import { ICustomField } from "../../../../../models/ICustomField";

export const checkIfItemHaveEmailFieldAndValue = (
  items: any[],
  emailFields: ICustomField[]
) => {
  let recordsWithNoEmailValue: any[] = [];
  for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
    let flag = false;
    for (let fieldIndex = 0; fieldIndex < emailFields.length; fieldIndex++) {
      if (items[itemIndex][emailFields[fieldIndex].name]) {
        flag = true;
        break;
      }
    }
    if (!flag) {
      recordsWithNoEmailValue = recordsWithNoEmailValue.concat([
        items[itemIndex],
      ]);
    }
  }
  return recordsWithNoEmailValue;
};
