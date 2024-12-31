import moment from "moment";
import { SupportedDataTypes } from "../../../../../../../models/ICustomField";
import _ from "lodash";

export const SampleMultiMeasureDataForBarLineGraph = [
  {
    name: "Value A",
    ["A"]: 4000,
    ["B"]: 2400,
  },
  {
    name: "Value B",
    ["A"]: 3000,
    ["B"]: 1398,
  },
  {
    name: "Value C",
    ["A"]: 2000,
    ["B"]: 9800,
  },
  {
    name: "Value D",
    ["A"]: 2780,
    ["B"]: 3908,
  },
  {
    name: "Value E",
    ["A"]: 1890,
    ["B"]: 4800,
  },
  {
    name: "Value F",
    ["A"]: 2390,
    ["B"]: 3800,
  },
  {
    name: "Value G",
    ["A"]: 3490,
    ["B"]: 4300,
  },
];

export const SampelGroupingDataForBarLineGraph = [
  {
    name: "Value A",
    ["A"]: 4000,
  },
  {
    name: "Value B",
    ["A"]: 3000,
  },
  {
    name: "Value C",
    ["A"]: 2000,
  },
  {
    name: "Value D",
    ["A"]: 2780,
  },
  {
    name: "Value E",
    ["A"]: 1890,
  },
  {
    name: "Value F",
    ["A"]: 2390,
  },
  {
    name: "Value G",
    ["A"]: 3490,
  },
];

export const SampleData = (
  type: SupportedDataTypes,
  num: number,
  size: number = 100
) => {
  const sampleDataType: Record<SupportedDataTypes, any> = {
    autoNumber: num,
    boolean: num % 3 === 0 || num % 5 === 0 || num % 7 === 0 ? "No" : "Yes",
    date: moment(
      new Date(
        new Date().getTime() +
          _.toInteger(
            (
              (num % 3 === 0
                ? 3
                : num % 2 === 0
                ? 2
                : num % 5 === 0
                ? 5
                : num % 7 === 0
                ? 7
                : 1) *
              24 *
              60 *
              60 *
              1000
            ).toFixed(0)
          )
      )
    ).format("YYYY-MM-DD"),
    datetime: moment(
      new Date(
        new Date().getTime() +
          _.toInteger(
            (
              (num % 3 === 0
                ? 3
                : num % 2 === 0
                ? 2
                : num % 5 === 0
                ? 5
                : num % 7 === 0
                ? 7
                : 1) *
              24 *
              60 *
              60 *
              1000
            ).toFixed(0)
          )
      )
    ).format("YYYY-MM-DD hh:mm:ss"),
    email: `${
      num % 3 === 0 || num % 5 === 0 || num % 7 === 0 ? "A" : "B"
    }mail@email.com`,
    expression: "",
    image: "",
    json: "",
    jsonArray: "",
    lookup: `Option ${
      num % 3 === 0 || num % 5 === 0 || num % 7 === 0 ? "A" : "B"
    }`,
    multiSelectLookup: [
      ..._.range(1, _.toInteger(Math.ceil(Math.random() * 3)) + 1).map(
        (numb) =>
          `Option ${
            numb % 3 === 0 || numb % 5 === 0 || numb % 7 === 0 ? "A" : "B"
          }`
      ),
    ],
    multiSelectRecordLookup: [
      ..._.range(1, _.toInteger(Math.ceil(Math.random() * 3)) + 1).map(
        (numb) =>
          `Option ${
            numb % 3 === 0 || numb % 5 === 0 || numb % 7 === 0 ? "A" : "B"
          }`
      ),
    ],
    multiline: "Multi Line",
    number:
      num % 3 === 0
        ? 3
        : num % 2 === 0
        ? 2
        : num % 5 === 0
        ? 5
        : num % 7 === 0
        ? 7
        : 1,
    numberArray: [
      ..._.range(1, _.toInteger(Math.ceil(Math.random() * 3)) + 1).map(
        (num) => num
      ),
    ],
    phoneNumber: `+91-${_.toInteger(Math.random() * 10 ** 10)}`,
    recordImage: "",
    recordLookup: `Option ${
      num % 3 === 0 || num % 5 === 0 || num % 7 === 0 ? "A" : "B"
    }`,
    relatedTo: "",
    richText: "This is rich text",
    singleline: num % 3 === 0 || num % 5 === 0 || num % 7 === 0 ? "A" : "B",
    stringArray: [
      ..._.range(1, _.toInteger(Math.ceil(Math.random() * 3)) + 1).map(
        (numb) =>
          `Option ${
            numb % 3 === 0 || numb % 5 === 0 || numb % 7 === 0 ? "A" : "B"
          }`
      ),
    ],
    stringLookup: `Option ${
      num % 3 === 0 || num % 5 === 0 || num % 7 === 0 ? "A" : "B"
    }`,
    time: "",
    url: `https://www.vryno${
      num % 3 === 0 || num % 5 === 0 || num % 7 === 0 ? "A" : "B"
    }.com`,
    uuid: `Option ${
      num % 3 === 0 || num % 5 === 0 || num % 7 === 0 ? "A" : "B"
    }`,
    uuidArray: [
      ..._.range(1, _.toInteger(Math.ceil(Math.random() * 3)) + 1).map(
        (numb) =>
          `Option ${
            numb % 3 === 0 || numb % 5 === 0 || numb % 7 === 0 ? "A" : "B"
          }`
      ),
    ],
    jsonDateTime: {},
  };

  return sampleDataType[type];
};
