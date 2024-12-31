import getCountryCode from "country-codes-list";
import { Timezone } from "countries-and-timezones";
import { IUserPreference } from "../../../../../../models/shared";
import { getCountryCodeFromPreference } from "../Form/FormFields/FormFieldPhoneNumber";

export const getPhoneNumberValue = (
  dataValue: string,
  getFieldValue: string,
  userPreferences: IUserPreference[],
  timeZone: Timezone | null
) => {
  return dataValue.toString().includes("+")
    ? dataValue.toString()
    : getFieldValue.toString().includes("+")
    ? getFieldValue.toString()
    : `+${
        getCountryCode
          .all()
          .filter(
            (countryName) =>
              countryName.countryCode.toLowerCase() ===
              (getCountryCodeFromPreference(userPreferences) &&
              getCountryCodeFromPreference(userPreferences) !== ""
                ? getCountryCodeFromPreference(userPreferences)
                : timeZone && timeZone?.countries?.length > 0
                ? timeZone?.countries[0]
                : "in"
              ).toLowerCase()
          )[0]?.countryCallingCode
      }${dataValue.toString() || getFieldValue.toString()}`.trim();
};
