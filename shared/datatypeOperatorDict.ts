export const datatypeExpressionsList: string[] = [
  "d_tyd",
  "d_yd",
  "d_t",
  "d_tmw",
  "d_sttmw",
  "d_lw",
  "d_tw",
  "d_nw",
  "d_lm",
  "d_tm",
  "d_nm",
  "d_ly",
  "d_ty",
  "d_ny",
  "is_empty",
  // "pt_eq",
  // "pt_lt",
  // "pt_lte",
  // "pt_gt",
  // "pt_gte",
  // "ft_eq",
  // "ft_lt",
  // "ft_lte",
  // "ft_gt",
  // "ft_gte",
  "any_value",
];

export const datatypeOperatorSymbolDict: Record<string, string> = {
  eq: "=",
  in: "in",
  ilike: "contains",
  stwth: "starts with",
  endwth: "ends with",
  lt: "<",
  lte: "< =",
  gt: ">",
  gte: "> =",
  any: "matches any",
  all: "matches all",
  any_value: "any value",
  between: "between",
  d_tyd: "till yesterday",
  d_yd: "yesterday",
  d_t: "today",
  d_tmw: "tomorrow",
  d_sttmw: "starting tomorrow",
  d_lw: "last week",
  d_tw: "this week",
  d_nw: "next week",
  d_lm: "last month",
  d_tm: "this month",
  d_nm: "next month",
  d_ly: "last year",
  d_ty: "this year",
  d_ny: "next year",
  is_empty: "empty",
  pt_eq: "past equal to",
  pt_lt: "past less than",
  pt_lte: "past less than equal to",
  pt_gt: "past greater than",
  pt_gte: "past greater than equal to",
  ft_eq: "due equal to",
  ft_lt: "due less than",
  ft_lte: "due less than equal to",
  ft_gt: "due greater than",
  ft_gte: "due greater than equal to",
};

export const datatypeOperatorDict: Record<
  string,
  { value: string; label: string }[]
> = {
  expression: [
    { value: "eq", label: "is" },
    { value: "lt", label: "less than" },
    { value: "lte", label: "less than equal to" },
    { value: "gt", label: "greater than" },
    { value: "gte", label: "greater than equal to" },
    { value: "between", label: "between" },
    { value: "is_empty", label: "empty" },
  ],
  lookup: [
    { value: "eq", label: "is" },
    { value: "ilike", label: "contains" },
    { value: "stwth", label: "starts with" },
    { value: "endwth", label: "ends with" },
    { value: "is_empty", label: "empty" },
  ],
  multiSelectLookup: [
    { value: "eq", label: "is" },
    { value: "ilike", label: "contains" },
    { value: "stwth", label: "starts with" },
    { value: "endwth", label: "ends with" },
    { value: "any", label: "matches any" },
    { value: "all", label: "matches all" },
    { value: "is_empty", label: "empty" },
  ],
  boolean: [
    { value: "eq", label: "is" },
    { value: "is_empty", label: "empty" },
  ],
  recordLookup: [
    { value: "eq", label: "is" },
    { value: "is_empty", label: "empty" },
  ],
  multiSelectRecordLookup: [
    { value: "eq", label: "is" },
    { value: "any", label: "matches any" },
    { value: "all", label: "matches all" },
    { value: "is_empty", label: "empty" },
  ],
  stringLookup: [
    { value: "eq", label: "is" },
    { value: "is_empty", label: "empty" },
  ],
  multiline: [
    { value: "eq", label: "is" },
    { value: "ilike", label: "contains" },
    { value: "stwth", label: "starts with" },
    { value: "endwth", label: "ends with" },
    { value: "is_empty", label: "empty" },
  ],
  singleline: [
    { value: "eq", label: "is" },
    { value: "ilike", label: "contains" },
    { value: "stwth", label: "starts with" },
    { value: "endwth", label: "ends with" },
    { value: "is_empty", label: "empty" },
  ],
  email: [
    { value: "eq", label: "is" },
    { value: "ilike", label: "contains" },
    { value: "stwth", label: "starts with" },
    { value: "endwth", label: "ends with" },
    { value: "is_empty", label: "empty" },
  ],
  url: [
    { value: "eq", label: "is" },
    { value: "ilike", label: "contains" },
    { value: "is_empty", label: "empty" },
  ],
  number: [
    { value: "eq", label: "is" },
    { value: "lt", label: "less than" },
    { value: "lte", label: "less than equal to" },
    { value: "gt", label: "greater than" },
    { value: "gte", label: "greater than equal to" },
    { value: "between", label: "between" },
    { value: "is_empty", label: "empty" },
  ],
  phoneNumber: [
    { value: "eq", label: "is" },
    { value: "ilike", label: "contains" },
    { value: "stwth", label: "starts with" },
    { value: "endwth", label: "ends with" },
    { value: "is_empty", label: "empty" },
  ],
  datetime: [
    { value: "eq", label: "is" },
    { value: "lt", label: "less than" },
    { value: "lte", label: "less than equal to" },
    { value: "gt", label: "greater than" },
    { value: "gte", label: "greater than equal to" },
    { value: "between", label: "between" },
    { value: "d_tyd", label: "till yesterday" },
    { value: "d_yd", label: "yesterday" },
    { value: "d_t", label: "today" },
    { value: "d_tmw", label: "tomorrow" },
    { value: "d_sttmw", label: "starting tomorrow" },
    { value: "d_lw", label: "last week" },
    { value: "d_tw", label: "this week" },
    { value: "d_nw", label: "next week" },
    { value: "d_lm", label: "last month" },
    { value: "d_tm", label: "this month" },
    { value: "d_nm", label: "next month" },
    { value: "d_ly", label: "last year" },
    { value: "d_ty", label: "this year" },
    { value: "d_ny", label: "next year" },
    { value: "is_empty", label: "empty" },
    { value: "pt_eq", label: "past equal to" },
    { value: "pt_lt", label: "past less than" },
    { value: "pt_lte", label: "past less than equal to" },
    { value: "pt_gt", label: "past greater than" },
    { value: "pt_gte", label: "past greater than equal to" },
    { value: "ft_eq", label: "due equal to" },
    { value: "ft_lt", label: "due less than" },
    { value: "ft_lte", label: "due less than equal to" },
    { value: "ft_gt", label: "due greater than" },
    { value: "ft_gte", label: "due greater than equal to" },
  ],
  date: [
    { value: "eq", label: "is" },
    { value: "lt", label: "less than" },
    { value: "lte", label: "less than equal to" },
    { value: "gt", label: "greater than" },
    { value: "gte", label: "greater than equal to" },
    { value: "between", label: "between" },
    { value: "d_tyd", label: "till yesterday" },
    { value: "d_yd", label: "yesterday" },
    { value: "d_t", label: "today" },
    { value: "d_tmw", label: "tomorrow" },
    { value: "d_sttmw", label: "starting tomorrow" },
    { value: "d_lw", label: "last week" },
    { value: "d_tw", label: "this week" },
    { value: "d_nw", label: "next week" },
    { value: "d_lm", label: "last month" },
    { value: "d_tm", label: "this month" },
    { value: "d_nm", label: "next month" },
    { value: "d_ly", label: "last year" },
    { value: "d_ty", label: "this year" },
    { value: "d_ny", label: "next year" },
    { value: "is_empty", label: "empty" },
    { value: "pt_eq", label: "past equal to" },
    { value: "pt_lt", label: "past less than" },
    { value: "pt_lte", label: "past less than equal to" },
    { value: "pt_gt", label: "past greater than" },
    { value: "pt_gte", label: "past greater than equal to" },
    { value: "ft_eq", label: "due equal to" },
    { value: "ft_lt", label: "due less than" },
    { value: "ft_lte", label: "due less than equal to" },
    { value: "ft_gt", label: "due greater than" },
    { value: "ft_gte", label: "due greater than equal to" },
  ],
  autoNumber: [
    { value: "eq", label: "is" },
    { value: "ilike", label: "contains" },
  ],
  uuidArray: [
    { value: "eq", label: "is" },
    { value: "any", label: "matches any" },
    { value: "all", label: "matches all" },
  ],
};

export const datatypeOperatorDictUpdated: Record<string, any> = {
  expression: [
    { value: "any_value", label: "Any Value" },
    ...datatypeOperatorDict.expression,
  ],
  lookup: [
    { value: "any_value", label: "Any Value" },
    ...datatypeOperatorDict.lookup,
  ],
  multiSelectLookup: [
    { value: "any_value", label: "Any Value" },
    ...datatypeOperatorDict.multiSelectLookup,
  ],
  boolean: [
    { value: "any_value", label: "Any Value" },
    ...datatypeOperatorDict.boolean,
  ],
  recordLookup: [
    { value: "any_value", label: "Any Value" },
    ...datatypeOperatorDict.recordLookup,
  ],
  multiSelectRecordLookup: [
    { value: "any_value", label: "Any Value" },
    ...datatypeOperatorDict.multiSelectRecordLookup,
  ],
  stringLookup: [
    { value: "any_value", label: "Any Value" },
    ...datatypeOperatorDict.stringLookup,
  ],
  multiline: [
    { value: "any_value", label: "Any Value" },
    ...datatypeOperatorDict.multiline,
  ],
  singleline: [
    { value: "any_value", label: "Any Value" },
    ...datatypeOperatorDict.singleline,
  ],
  email: [
    { value: "any_value", label: "Any Value" },
    ...datatypeOperatorDict.email,
  ],
  url: [
    { value: "any_value", label: "Any Value" },
    ...datatypeOperatorDict.url,
  ],
  number: [
    { value: "any_value", label: "Any Value" },
    ...datatypeOperatorDict.number,
  ],
  phoneNumber: [
    { value: "any_value", label: "Any Value" },
    ...datatypeOperatorDict.phoneNumber,
  ],
  datetime: [
    { value: "any_value", label: "Any Value" },
    ...datatypeOperatorDict.datetime,
  ],
  date: [
    { value: "any_value", label: "Any Value" },
    ...datatypeOperatorDict.date,
  ],
};
