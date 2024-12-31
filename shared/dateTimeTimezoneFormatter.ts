import moment from "moment";

export const getCorrectTimezone = (
  value: string | null | undefined,
  timezone: string
) => {
  if (!value) return null;
  const systemTimezone = moment(value).format("yyyy/MM/DDTHH:mm:ssZ");
  const expectedTimezone = moment(value)
    .tz(timezone)
    .format("yyyy/MM/DDTHH:mm:ssZ");
  const currentTime =
    systemTimezone.indexOf("-") !== -1
      ? systemTimezone.split("-")[0]
      : systemTimezone.indexOf("+") !== -1
      ? systemTimezone.split("+")[0]
      : systemTimezone.split("Z")[0];
  const currentTimezone =
    expectedTimezone.indexOf("-") !== -1
      ? `-${expectedTimezone.split("-")[1]}`
      : expectedTimezone.indexOf("+") !== -1
      ? `+${expectedTimezone.split("+")[1]}`
      : `+${expectedTimezone.split("Z")[1]}`;
  return `${currentTime}${currentTimezone}`.replaceAll("/", "-");
};
