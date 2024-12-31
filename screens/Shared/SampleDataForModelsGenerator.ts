import moment from "moment";
import { SupportedDataTypes } from "../../models/ICustomField";
import _ from "lodash";

export const SampleData = (
  type: SupportedDataTypes,
  num: number,
  size: number = 100
) => {
  const sampleDataType: Record<SupportedDataTypes, any> = {
    autoNumber: num,
    boolean: Math.random() * size > size / 2 ? "No" : "Yes",
    date: moment(
      new Date(
        new Date().getTime() +
          _.toInteger((Math.random() * size * 24 * 60 * 60 * 1000).toFixed(0))
      )
    ).format("YYYY-MM-DD"),
    datetime: moment(
      new Date(
        new Date().getTime() +
          _.toInteger((Math.random() * size * 24 * 60 * 60 * 1000).toFixed(0))
      )
    ).format("YYYY-MM-DD hh:mm:ss"),
    email: `random${_.toInteger(
      (Math.random() * size).toFixed(0)
    )}mail@email.com`,
    expression: "",
    image: "",
    json: "",
    jsonArray: "",
    lookup: `Option${_.toInteger((Math.random() * size).toFixed(0))}`,
    multiSelectLookup: [
      ..._.range(1, _.toInteger((Math.random() * 3).toFixed(0) + 1)).map(
        (num) => `Option${num}`
      ),
    ],
    multiSelectRecordLookup: [
      ..._.range(1, _.toInteger((Math.random() * 3).toFixed(0) + 1)).map(
        (num) => `Search-Item${num}`
      ),
    ],
    multiline: "Multi Line",
    number: _.toInteger((Math.random() * size).toFixed(0)),
    numberArray: [
      ..._.range(1, _.toInteger((Math.random() * 3).toFixed(0) + 1)).map(
        (num) => num
      ),
    ],
    phoneNumber: `+91-${_.toInteger(Math.random() * 10 ** 10)}`,
    recordImage: "",
    recordLookup: `Option${_.toInteger((Math.random() * size).toFixed(0))}`,
    relatedTo: "",
    richText: "This is rich text",
    singleline: num % 3 === 0 || num % 7 === 0 ? "A" : "B",
    stringArray: [
      ..._.range(1, _.toInteger((Math.random() * 3).toFixed(0) + 1)).map(
        (num) => `Option${num}`
      ),
    ],
    stringLookup: `Option${_.toInteger((Math.random() * size).toFixed(0))}`,
    time: "",
    url: `https://www.vryno${_.toInteger(
      (Math.random() * size).toFixed(0)
    )}.com`,
    uuid: `Option${_.toInteger((Math.random() * size).toFixed(0))}`,
    uuidArray: [
      ..._.range(1, _.toInteger((Math.random() * 3).toFixed(0) + 1)).map(
        (num) => `Option${num}`
      ),
    ],
    jsonDateTime: {},
  };

  return sampleDataType[type];
};
