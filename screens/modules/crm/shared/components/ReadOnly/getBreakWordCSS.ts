export const getBreakWordCSS = (
  viewType?: "Card" | "List",
  truncateData?: boolean,
  value?: any
) => {
  return `${
    viewType === "List" || truncateData
      ? "truncate"
      : /\s/g.test(value)
      ? "whitespace-normal break-all"
      : "break-words whitespace-pre-line"
  }`;
};
