import moment from "moment";

export const dateTimePerModule = (
  modelName: string,
  incrementBy: number = 0
) => {
  if (modelName !== "callLog") return null;
  // const date = moment(new Date()).add(incrementBy, "m").toDate();
  // const utcMoment = moment.utc(date);
  // const utcDate = new Date(utcMoment.format());
  return moment().add(incrementBy, "m").toDate();
};
