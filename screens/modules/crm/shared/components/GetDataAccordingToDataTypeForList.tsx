import { capitalCase } from "change-case";
import React from "react";
import { getTailwindClassesForTextEditor } from "../../../../../components/TailwindControls/GetTailwindClassesForTextEditor";
import { SecureImage } from "../../../../../components/TailwindControls/Form/SecureImage/SecureImage";
import { Config } from "../../../../../shared/constants";
import { DetailRecordLookup } from "./ReadOnly/DetailRecordLookup";
import { getDate } from "../../../../../components/TailwindControls/DayCalculator";
import TrueIcon from "remixicon-react/CheckLineIcon";
import FalseIcon from "remixicon-react/CloseLineIcon";
import generateHash from "../utils/generateHash";
import { get } from "lodash";
import SwitchToggle from "../../../../../components/TailwindControls/Form/SwitchToggle/SwitchToggle";
import { Formik } from "formik";
import { getAppPathParts } from "../utils/getAppPathParts";
import { AllowedViews } from "../../../../../models/allowedViews";
import { ICustomField } from "../../../../../models/ICustomField";
import { MixpanelActions } from "../../../../Shared/MixPanel";

export type GetDataAccordingToDataTypeListProps = {
  field: {
    label: string;
    value: string;
    dataType: string;
  };
  data: any;
  headerVisible: boolean;
  fontSize: { header: string; value: string };
  truncateData?: boolean;
  isSample?: boolean;
  fieldDetail?: ICustomField;
  showIcons?: boolean;
  showSlidersDetails?:
    | {
        name: string;
        value: string | number | readonly string[];
        disabled: boolean;
        onChange: (item: ICustomField, changedField: {}) => void;
        saveLoading: boolean;
      }
    | false;
};

export function GetDataAccordingToDataTypeList({
  field,
  data,
  headerVisible = true,
  fontSize = {
    header: "text-sm",
    value: "text-sm",
  },
  truncateData = false,
  isSample = false,
  fieldDetail,
  showIcons = false,
  showSlidersDetails,
}: GetDataAccordingToDataTypeListProps) {
  const { ui, modelName } = getAppPathParts();
  const onDetail = ui === AllowedViews.detail;

  return field.dataType === "recordImage" ? (
    data[field.value] ? (
      <div
        className={`${onDetail ? "w-36 h-36" : "w-20 h-20"} border-4
          rounded-full  text-sm tracking-wide text-vryno-label-gray cursor-pointer flex items-center justify-center overflow-hidden`}
      >
        <SecureImage
          url={`${Config.metaPrivateUploadUrl()}crm/${modelName}/${
            data[field.value]
          }/`}
          alt="profile"
          className="w-full h-full object-cover"
        />
      </div>
    ) : isSample ? (
      <div
        className={`${onDetail ? "w-36 h-36" : "w-20 h-20"} border-4
          rounded-full  text-sm tracking-wide text-vryno-label-gray cursor-pointer flex items-center justify-center overflow-hidden`}
      >
        <img
          src={`/sample/${modelName}/${generateHash(data.id)}.jpg`}
          className="w-full h-full object-cover"
        />
      </div>
    ) : (
      <div
        className={`${onDetail ? "w-36 h-36" : "w-20 h-20"} border-4 w-20 h-20
          rounded-full  text-sm tracking-wide text-vryno-label-gray cursor-pointer flex items-center justify-center overflow-hidden`}
      >
        <img
          src={`/vryno_icon.svg`}
          className="ml-[2px] mt-2 w-[60%] h-full bg-cover opacity-90"
        />
      </div>
    )
  ) : field.dataType === "image" ? (
    data[field.value] ? (
      <div
        className={`w-20 h-20 border-4
          rounded-full  text-sm tracking-wide text-vryno-label-gray cursor-pointer flex items-center justify-center overflow-hidden`}
      >
        <SecureImage
          url={`${Config.metaPrivateUploadUrl()}crm/${modelName}/${
            data[field.value]
          }/`}
          // url={`${Config.fileFetchUrl()}${data[field.value]}`}
          alt="profile"
          className="w-full h-full object-cover"
        />
      </div>
    ) : (
      <div
        className={`w-20 h-20 border-4
          rounded-full  text-sm tracking-wide text-vryno-label-gray cursor-pointer flex items-center justify-center overflow-hidden`}
      >
        <img
          src={`/vryno_icon.svg`}
          className="ml-[2px] mt-2 w-[60%] h-full bg-cover opacity-90"
        />
      </div>
    )
  ) : field.dataType === "boolean" ? (
    <span
      className={`${fontSize.value} text-vryno-card-value ${
        truncateData ? "truncate" : "break-all"
      }`}
    >
      {showIcons ? (
        showSlidersDetails ? (
          <Formik
            initialValues={{ name: showSlidersDetails.value }}
            onSubmit={(values) => {}}
          >
            {({ values, setFieldValue }) => (
              <SwitchToggle
                name="name"
                disabled={showSlidersDetails.disabled}
                onChange={() => {
                  setFieldValue("name", !values["name"]);
                  showSlidersDetails.onChange(
                    {
                      ...data,
                      [showSlidersDetails.name]: !values["name"],
                    },
                    { [showSlidersDetails.name]: !values["name"] }
                  );
                  MixpanelActions.track(
                    `switch-${field.label}-show-side-details:toggle-click`,
                    {
                      type: "switch",
                    }
                  );
                }}
                value={showSlidersDetails.value}
              />
            )}
          </Formik>
        ) : data[field.value] ? (
          <TrueIcon className="text-vryno-label-gray" />
        ) : (
          <FalseIcon className="text-vryno-label-gray" />
        )
      ) : (
        capitalCase(get(data, [field.value], "False").toString())
      )}
    </span>
  ) : field.dataType === "recordLookup" && data[field.value] ? (
    <DetailRecordLookup
      appName={
        fieldDetail?.dataTypeMetadata?.allLookups[0]?.moduleName.split(".")[0]
      }
      modelName={
        fieldDetail?.dataTypeMetadata?.allLookups[0]?.moduleName.split(".")[1]
      }
      fontSize={fontSize.value}
      truncatedData={truncateData}
      value={data[field.value]}
      searchBy={fieldDetail?.dataTypeMetadata?.allLookups[0]?.fieldName}
      fieldDisplayExpression={
        fieldDetail?.dataTypeMetadata?.allLookups[0]?.fieldName
      }
    />
  ) : field.dataType === "number" ? (
    <span
      className={`${fontSize.value} text-vryno-card-value ${
        truncateData ? "truncate" : "break-all"
      } `}
    >
      {data[field.value]}
    </span>
  ) : (field.dataType === "date" || field.dataType === "datetime") &&
    data[field.value] ? (
    <span
      className={`${fontSize.value} text-vryno-card-value ${
        truncateData ? "truncate" : "break-all"
      } `}
    >
      {getDate(data[field.value])}
    </span>
  ) : data[field.value] ? (
    <div className={`${truncateData ? "flex truncate" : ""}`}>
      {field.dataType === "json" || field.dataType === "richtext" ? (
        data[field.value].content.map((item: any, outerindex: number) =>
          item.type === "paragraph" && item.content ? (
            item.content.map((data: any, innerIndex: number) => (
              <span
                className={`${fontSize.value} text-vryno-card-value ${
                  truncateData ? "truncate" : "break-all"
                } ${getTailwindClassesForTextEditor(
                  data.marks ? data.marks : []
                )}`}
                key={innerIndex}
              >
                {data.text}
              </span>
            ))
          ) : item.type === "image" && item.attrs ? (
            <img src={item.attrs.src} className="py-1" key={outerindex} />
          ) : (
            <span key={outerindex}></span>
          )
        )
      ) : typeof data[field.value] === "object" &&
        Object.values(data[field.value]).length ? (
        Object.values(data[field.value]).map((value: any, index) => (
          <span
            key={index}
            className={`${fontSize.value} text-vryno-card-value ${
              truncateData ? "truncate" : "break-all"
            }`}
          >
            {value}
          </span>
        ))
      ) : (
        <span
          className={`${fontSize.value} text-vryno-card-value ${
            truncateData ? "truncate" : "break-all"
          } `}
        >
          {data[field.value]}
        </span>
      )}
    </div>
  ) : (
    <span className={` ${fontSize.value} text-gray-400`}>-</span>
  );
}
