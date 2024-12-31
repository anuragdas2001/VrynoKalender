import { getDate } from "../../../../components/TailwindControls/DayCalculator";
import { User } from "../../../../models/Accounts";
import { ICustomField } from "../../../../models/ICustomField";

export const reportDate = (
  updatedReportData: any[],
  field: ICustomField,
  user: User | null
) => {
  const fieldName = field.systemDefined ? field.name : `fields.${field.name}`;
  updatedReportData = updatedReportData.flatMap((data) => {
    return {
      ...data,
      // [fieldName]: getDate(data[fieldName], user ?? undefined, "yyyy-MM-dd"),
      [fieldName]: getDate(data[fieldName], user ?? undefined),
    };
  });
  return updatedReportData;
};
