import React from "react";
import { ICustomField } from "../../../../models/ICustomField";
import { DetailFieldValuePerDatatype } from "../../../../screens/modules/crm/shared/components/ReadOnly/DetailFieldValuePerDatatype";
import { getDataObject } from "../../../../screens/modules/crm/shared/utils/getDataObject";
import Button from "../Button/Button";
import { ISearchQuestData } from "../../../../screens/modules/search/ConnectedViewAllSearchResultsScreen";

export type GetAllMandatoryKeyValuesOtherThanSearchByOptionsProps = {
  searchResult: ISearchQuestData;
  fieldsList?: ICustomField[];
  modelName: string;
  smallResolution?: boolean;
  showMoreData?: boolean;
  displayType: string;
};

export const GetAllMandatoryKeyValuesOtherThanSearchByOptions = ({
  searchResult,
  fieldsList,
  modelName,
  smallResolution = false,
  showMoreData = true,
  displayType = "inline-block",
}: GetAllMandatoryKeyValuesOtherThanSearchByOptionsProps) => {
  const [moreDataVisible, setMoreDataVisible] = React.useState<boolean>(false);

  const mandatoryFieldList = moreDataVisible
    ? fieldsList?.filter(
        (field) =>
          !["recordImage", "image", "relatedTo"].includes(field.dataType) &&
          !["record_status", "layout_id"].includes(field.name)
      )
    : fieldsList?.filter(
        (field) =>
          field.visible &&
          field.mandatory &&
          !["recordImage", "image", "relatedTo"].includes(field.dataType) &&
          !["record_status", "layout_id"].includes(field.name)
      );

  return (
    <div className={`w-full flex items-center justify-between flex-wrap`}>
      <span
        className={`sm:gap-x-2 overflow-hidden ${
          moreDataVisible || !showMoreData
            ? "col-span-12 break-words "
            : `${
                smallResolution
                  ? "col-span-12 sm:col-span-9"
                  : "col-span-12 sm:col-span-10"
              }`
        }`}
      >
        {mandatoryFieldList?.map((field, index) => (
          <span key={index} className="">
            {searchResult &&
              getDataObject(searchResult.values) &&
              getDataObject(searchResult.values)[field.name] && (
                <span className={`pr-2 inline-block`}>
                  <span>{`${field.label.en} : `}</span>
                  <DetailFieldValuePerDatatype
                    field={{
                      label: field.label.en,
                      value: field.name,
                      dataType: field.dataType,
                      field: field,
                    }}
                    data={getDataObject(searchResult.values)}
                    headerVisible={false}
                    fontSize={{
                      header: "text-sm",
                      value: "text-moreInfoHeading",
                    }}
                    truncateData={false}
                    showIcons={false}
                    onDetail={false}
                    modelName={modelName}
                    isSample={false}
                    fontColor={"text-black"}
                    includeBaseUrl={false}
                    includeFlagInPhoneNumber={true}
                    onSearch={true}
                    displayType={displayType}
                    fieldsList={fieldsList}
                  />
                  <span
                    className={`${
                      index === mandatoryFieldList.length - 1 ? "hidden" : ""
                    }`}
                  >{`, `}</span>
                </span>
              )}
          </span>
        ))}
        {showMoreData && moreDataVisible && (
          <Button
            id={`get-all-field-hide-${modelName}-details`}
            customStyle={`text-vryno-theme-blue underline border border-transparent focus:border focus:border-blue-300 ${
              showMoreData ? "col-span-2" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMoreDataVisible(false);
            }}
            customFontSize={"text-moreInfoHeading"}
            userEventName={`get-all-field-hide-${modelName}-details-click`}
          >
            {`Hide ${modelName} Details`}
          </Button>
        )}
      </span>
      {showMoreData && !moreDataVisible && (
        <div
          className={`flex sm:justify-end px-1 pt-1 ${
            smallResolution ? "col-span-3" : "col-span-2"
          }`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMoreDataVisible(true);
          }}
        >
          <Button
            id={`get-all-field-view-${modelName}-details-click`}
            customStyle="text-vryno-theme-blue underline border border-transparent focus:border focus:border-blue-300"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMoreDataVisible(true);
            }}
            customFontSize={"text-moreInfoHeading"}
            userEventName={`get-all-field-view-${modelName}-details-click`}
            renderChildrenOnly={true}
          >
            {`View ${modelName} Details`}
          </Button>
        </div>
      )}
    </div>
  );
};
