import { format, parseISO } from "date-fns";
import { get } from "lodash";
import { User } from "../../models/Accounts";

export function getDifferenceInDays(date: string) {
  const today = new Date();
  const createdDate = new Date(date);
  let diffInMs = today.getTime() - createdDate.getTime();
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}

export function convertTZ(date: string, tzString: string) {
  if (tzString?.trim()) {
    return new Date(
      (typeof date === "string" ? new Date(date) : date).toLocaleString(
        "en-US",
        {
          timeZone: tzString,
        }
      )
    );
  } else return parseISO(date);
}

export function getParsedTime(date: string) {
  if (date) {
    let parseDate = parseISO(date);
    if (String(parseDate) === "Invalid Date") return date;
    return format(parseDate, "h:mm a");
  } else return "-";
}

export function getDate(date: string, user?: User, formatType = "dd/MM/yyyy") {
  if (date) {
    const timeZonePreference = get(user, "timezone", "");
    const dateFormatPreference = get(user, "dateFormat", "")
      ?.replaceAll("D", "d")
      ?.replaceAll("Y", "y");
    if (timeZonePreference) {
      let parseDate = parseISO(date);
      if (String(parseDate) === "Invalid Date") return date;
      return format(
        parseDate,
        `${dateFormatPreference ? dateFormatPreference : formatType}`
      );
    } else {
      let parseDate = parseISO(date);
      if (String(parseDate) === "Invalid Date") return date;
      return format(
        parseDate,
        `${dateFormatPreference ? dateFormatPreference : formatType}`
      );
    }
  } else return "-";
}

export function getDateAndTime(
  date: string,
  user?: User,
  dateformatType = "dd/MM/yyyy"
) {
  if (date) {
    const timeZonePreference = get(user, "timezone", "");
    const timeFormatPreference = get(user, "timeFormat", "");
    const dateFormatPreference = get(user, "dateFormat", "")
      ?.replaceAll("D", "d")
      ?.replaceAll("Y", "y");
    if (timeZonePreference) {
      let parseDate = parseISO(date);
      if (
        String(parseDate) === "Invalid Date" ||
        String(parseDate) === "Invalid time"
      )
        return date;
      return format(
        convertTZ(date, timeZonePreference),
        `${dateFormatPreference ? dateFormatPreference : dateformatType} ${
          timeFormatPreference === "24" ? "H:mm" : "h:mm a"
        }`
      );
    } else {
      let parseDate = parseISO(date);
      if (String(parseDate) === "Invalid Date") return date;
      return format(
        parseDate,
        `${dateFormatPreference ? dateFormatPreference : dateformatType} ${
          timeFormatPreference === "24" ? "H:mm" : "h:mm a"
        }`
      );
    }
  } else return "-";
}
