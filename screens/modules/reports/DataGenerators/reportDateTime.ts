import { User } from "../../../../models/Accounts";
import { ICustomField } from "../../../../models/ICustomField";
import { getDateAndTime } from "../../../../components/TailwindControls/DayCalculator";

export const reportDateTime = (
  updatedReportData: any[],
  field: ICustomField,
  user: User | null
) => {
  const fieldName = field.systemDefined ? field.name : `fields.${field.name}`;
  updatedReportData = updatedReportData.flatMap((data) => {
    return {
      ...data,
      [fieldName]: getDateAndTime(
        data[fieldName],
        user ?? undefined
        // "yyyy-MM-dd"
      ),
    };
  });
  return updatedReportData;
};
