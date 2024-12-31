import moment from "moment";

const dateValueMapper: Record<string, string[]> = {
  d_t: ["${todayBegin}", "${todayEnd}"],
  d_yd: ["${yesterdayBegin}", "${yesterdatEnd}"],
  d_tw: ["${thisWeekBegin}", "${thisWeekEnd}"],
  d_lw: ["${lastWeekBegin}", "${lastWeekEnd}"],
  d_tm: ["${thisMonthBegin}", "${thisMonthEnd}"],
  d_lm: ["${lastMonthBegin}", "${lastMonthEnd}"],
  d_ty: ["${thisYearBegin}", "${thisYearEnd}"],
  d_ly: ["${lastYearBegin}", "${lastYearEnd}"],
};

export const generalValueHandler = (
  valueFieldData: Date,
  operatorValue: string,
  datatype: string
) => {
  if (operatorValue === "any") return null;
  if (!valueFieldData) return;
  if (
    ["date", "datetime"].includes(datatype) &&
    ["d_t", "d_yd", "d_tw", "d_lw", "d_tm", "d_lm", "d_ty", "d_ly"].includes(
      operatorValue
    )
  ) {
    return dateValueMapper[operatorValue];
  } else if (datatype === "date")
    return moment(valueFieldData).format("YYYY-MM-DD");
  else if (datatype === "datetime") return moment(valueFieldData).toISOString();
  else return valueFieldData;
};
