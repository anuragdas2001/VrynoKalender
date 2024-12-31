import moment from "moment";
import { ICalendarFieldsList } from "../CalendarViewScreen";

const dateTimeConvertor = (
  dateAndDateTimeFieldsList: {
    [modelName: string]: ICalendarFieldsList[];
  },
  moduleName: string,
  value: Date | null,
  fieldName: string
) => {
  let result = "";
  for (let i = 0; i < dateAndDateTimeFieldsList[moduleName]?.length; i++) {
    const field = dateAndDateTimeFieldsList[moduleName][i];
    if (field.value.split("-")[1] === fieldName) {
      result =
        field.dataType === "datetime" && value
          ? moment(value).toISOString()
          : field.dataType === "date" && value
          ? moment(value).format("YYYY-MM-DD")
          : "";
      break;
    }
  }
  return result;
};

export const fetchRequestViewExtractor = (
  dateAndDateTimeFieldsList: {
    [modelName: string]: ICalendarFieldsList[];
  },
  addRange: boolean,
  startField: string,
  endField: string,
  moduleName: string,
  currentView: string,
  startDateValue: Date | null,
  endDateValue: Date | null
) => {
  if (!addRange) {
    if (currentView === "day") {
      return [
        {
          name: startField,
          operator: "eq",
          value: [
            dateTimeConvertor(
              dateAndDateTimeFieldsList,
              moduleName,
              startDateValue,
              startField
            ),
          ],
        },
      ];
    }
    if (currentView === "week" || currentView === "month") {
      return [
        {
          name: startField,
          operator: "between",
          //   value: [startValue, endValue],
          value: [
            dateTimeConvertor(
              dateAndDateTimeFieldsList,
              moduleName,
              startDateValue,
              startField
            ),
            dateTimeConvertor(
              dateAndDateTimeFieldsList,
              moduleName,
              endDateValue,
              startField
            ),
          ],
        },
      ];
    }
  } else {
    if (currentView === "day") {
      return [
        {
          name: startField,
          operator: "eq",
          value: [
            dateTimeConvertor(
              dateAndDateTimeFieldsList,
              moduleName,
              startDateValue,
              startField
            ),
            // "2023-03-30T18:30:00+00:00",
          ],
        },
        {
          name: endField,
          operator: "eq",
          value: [
            dateTimeConvertor(
              dateAndDateTimeFieldsList,
              moduleName,
              endDateValue,
              endField
            ),
            // "2023-03-30T18:30:00+00:00",
          ],
        },
      ];
    }
    if (currentView === "week" || currentView === "month") {
      return [
        {
          name: startField,
          operator: "between",
          value: [
            dateTimeConvertor(
              dateAndDateTimeFieldsList,
              moduleName,
              startDateValue,
              startField
            ),
            dateTimeConvertor(
              dateAndDateTimeFieldsList,
              moduleName,
              endDateValue,
              startField
            ),
          ],
        },
        {
          name: endField,
          operator: "between",
          value: [
            dateTimeConvertor(
              dateAndDateTimeFieldsList,
              moduleName,
              startDateValue,
              endField
            ),
            dateTimeConvertor(
              dateAndDateTimeFieldsList,
              moduleName,
              endDateValue,
              endField
            ),
          ],
        },
      ];
    }
  }
};

export const calendarFieldValuesFilter = (
  data: any,
  dateTimeFieldsList: {
    [modelName: string]: ICalendarFieldsList[];
  },
  dateAndDateTimeFieldsList: {
    [modelName: string]: ICalendarFieldsList[];
  }
) => {
  const updatedDateTimeList = dateTimeFieldsList[data.module].filter(
    (field) => {
      const fieldValue = field.value.split("-")[1];
      if (fieldValue === data.startField || fieldValue === data.endField)
        return false;
      return true;
    }
  );
  const updatedDateAndDateTimeList = dateAndDateTimeFieldsList[
    data.module
  ].filter((field) => {
    const fieldValue = field.value.split("-")[1];
    if (fieldValue === data.startField || fieldValue === data.endField)
      return false;
    return true;
  });
  return [updatedDateTimeList, updatedDateAndDateTimeList];
};
