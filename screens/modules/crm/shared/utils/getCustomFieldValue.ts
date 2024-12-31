import moment from "moment";
import { getCorrectTimezone } from "../../../../../shared/dateTimeTimezoneFormatter";

const handleValue = (dataType: string, value: any) => {
  switch (dataType) {
    case "recordLookup":
      if (value === "") return null;
      else return value;
    case "boolean":
      switch (value) {
        case null:
          return null;
        default:
          return Boolean(value);
      }
    case "datetime":
      switch (value) {
        case null:
          return null;
        default:
          return value;
      }
    case "date":
      switch (value) {
        case null:
          return null;
        default:
          return moment(value).format("YYYY-MM-DD");
      }
    case "number":
      switch (value) {
        case "0":
          return 0;
        default:
          return value ? Number(value) : value;
      }
    default:
      return value;
  }
};

export const getCustomFieldValue = (dataType: string, value: any) => {
  return handleValue(dataType, value);
};
export default getCustomFieldValue;
