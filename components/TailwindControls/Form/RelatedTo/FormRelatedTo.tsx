import { FormikValues, useFormikContext } from "formik";
import React, { useContext } from "react";
import { useContainerDimensions } from "../Shared/userContainerDimensions";
import { IModuleMetadata } from "../../../../models/IModuleMetadata";
import { getAppPathParts } from "../../../../screens/modules/crm/shared/utils/getAppPathParts";
import { RelatedToContentContainer } from "./RelatedToContentContainer";
import { sliderWindowType } from "../../../../screens/modules/crm/shared/components/SliderWindow";
import { IGenericFormDetails } from "../../../../screens/modules/crm/generic/GenericModelDetails/IGenericFormDetails";
import { getFieldsFromDisplayExpression } from "../../../../screens/modules/crm/shared/utils/getFieldsFromDisplayExpression";
import { getDateAndTime } from "../../DayCalculator";
import { UserStoreContext } from "../../../../stores/UserStore";
import { ISearchQuestData } from "../../../../screens/modules/search/ConnectedViewAllSearchResultsScreen";
import { IGenericModel } from "../../../../stores/RootStore/GeneralStore/GenericModelStore";

export enum SupportedLabelLocations {
  OnTop = "onTop",
  OnLeftSide = "onLeftSide",
}

export const relatedLookupMapper = (item: {
  name: string;
  label: string;
  searchBy: Array<string>;
}) => ({
  value: item.name,
  label: item.label,
  additionalValues: item.searchBy,
});

export type FormRelatedToProps = {
  name: string;
  label?: string;
  labelLocation?: SupportedLabelLocations;
  required?: boolean;
  editMode?: boolean;
  multiple?: boolean;
  onChange?: (e: React.ChangeEvent<any>) => void;
  externalExpressionToCalculateValue?: string;
  formResetted?: boolean;
  rejectRequired?: boolean;
  disabled?: boolean;
  formDetails?: IGenericFormDetails;
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  allModulesFetched: boolean;
  setCurrentFormLayer?: (value: boolean) => void;
};

const FormRelatedTo = ({
  name,
  label,
  labelLocation = SupportedLabelLocations.OnTop,
  required = false,
  formResetted,
  editMode,
  rejectRequired,
  disabled,
  formDetails,
  genericModels,
  allLayoutFetched,
  allModulesFetched,
  setCurrentFormLayer = () => {},
}: FormRelatedToProps) => {
  const { appName } = getAppPathParts();
  const { values, setFieldValue } = useFormikContext<FormikValues>();
  const [relatedToFields, setRelatedToFields] = React.useState<
    { moduleName: string; recordId: string }[]
  >([]);
  const userContext = React.useContext(UserStoreContext);
  const { user } = userContext;
  const [isPanelBelowVisible, setPanelBelowVisible] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<Array<any>>([]);
  const [modulesFetched, setModulesFetched] = React.useState<
    {
      value: string;
      label: string;
      additionalValues: Array<string>;
    }[]
  >([]);
  const [moduleLoading, setModuleLoading] = React.useState(true);
  const [relatedListData, setRelatedListData] = React.useState<any>([]);
  const [searchFormClosed, setSearchFormClosed] =
    React.useState<boolean>(false);
  const [disableSearchButton, setDisableSearchButton] =
    React.useState<boolean>(true);
  const [localSearchModel, setLocalSearchModal] =
    React.useState<sliderWindowType>("-translate-y-full");
  const [showSearchScreen, setShowSearchScreen] =
    React.useState<boolean>(false);
  const lookupRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const inputBox = React.useRef<HTMLInputElement>(null);
  const { width: inputWidth, height: inputHeight } = useContainerDimensions(
    inputRef,
    lookupRef,
    setPanelBelowVisible
  );

  React.useEffect(() => {
    if (allModulesFetched) {
      let modulesInfoFromStore: IModuleMetadata[] = [
        ...Object.keys(genericModels)
          ?.map((model) => {
            if (genericModels[model]?.moduleInfo?.customizationAllowed === true)
              return genericModels[model]?.moduleInfo;
          })
          ?.filter((model) => model !== undefined)
          ?.filter((model) => model),
      ];
      setModulesFetched(
        modulesInfoFromStore
          .map((module) => {
            return {
              name: module.name,
              label: module.label.en,
              searchBy: getFieldsFromDisplayExpression(
                module?.displayExpression ?? "${name}"
              ),
            };
          })
          .map(relatedLookupMapper)
      );
      setModuleLoading(false);
    }
  }, [allModulesFetched]);

  const handleSelectedItem = (selectedItem: ISearchQuestData) => {
    let flag = false;
    if (values[name] && values[name].length > 0) {
      for (let i = 0; i < values[name].length; i++) {
        if (
          JSON.stringify({
            moduleName: values[name][i]["moduleName"],
            recordId: values[name][i]["recordId"],
          }) ===
          JSON.stringify({
            moduleName: values["relatedToDropdown"],
            recordId: selectedItem.rowId,
          })
        ) {
          flag = true;
          break;
        }
      }
    }
    setFieldValue(
      name,
      values[name]
        ? flag === true
          ? [...values[name]]
          : [
              ...values[name],
              {
                moduleName: values["relatedToDropdown"],
                recordId: selectedItem.rowId,
              },
            ]
        : [
            {
              moduleName: values["relatedToDropdown"],
              recordId: selectedItem.rowId,
            },
          ]
    );
    if (!flag) {
      setRelatedListData([
        ...relatedListData,
        {
          relatedToModule: values["relatedToDropdown"],
          relatedToName: selectedItem.rowId,
        },
      ]);
      setRelatedToFields([
        ...relatedToFields,
        {
          moduleName: values["relatedToDropdown"],
          recordId: selectedItem.rowId,
        },
      ]);
    }
    setFieldValue("relatedToDropdown", "");
    setFieldValue("relatedToLookup", "");
    setSearchResults([]);
    if (inputBox !== null && inputBox.current) {
      inputBox.current.value = "";
    }
  };

  const handleResultShow = () => {
    setPanelBelowVisible(true);
  };

  React.useEffect(() => {
    if (values?.[name] && values[name].length > 0 && !relatedListData.length) {
      let initialRelatedToFields = [];
      let relatedListDataArray = [];
      for (let i = 0; i < values[name].length; i++) {
        relatedListDataArray.push({
          relatedToModule: values[name][i]?.moduleName || "",
          relatedToName: values[name][i]?.recordId || "",
          createdAt: values[name][i]?.createdAt
            ? getDateAndTime(values[name][i]?.createdAt, user ?? undefined)
            : "",
        });
        if (editMode) {
          initialRelatedToFields.push({
            moduleName: values[name][i]?.moduleName || "",
            recordId: values[name][i]?.recordId || "",
            createdAt: values[name][i]?.createdAt
              ? getDateAndTime(values[name][i]?.createdAt, user ?? undefined)
              : "",
          });
        }
      }
      setRelatedListData(relatedListDataArray);
      setRelatedToFields(initialRelatedToFields);
      setFieldValue("relatedToDropdown", "");
      setFieldValue("relatedToLookup", "");
    }
    if (!values?.[name]?.length) setFieldValue(name, null);
  }, [values?.[name]]);

  React.useEffect(() => {
    setFieldValue("relatedToDropdown", "");
    setFieldValue("relatedToLookup", "");
  }, []);

  React.useEffect(() => {
    if (formResetted) {
      setFieldValue(name, null);
      setRelatedListData([]);
      setRelatedToFields([]);
    }
  }, [formResetted]);

  return (
    <RelatedToContentContainer
      labelLocation={labelLocation}
      label={label}
      required={required}
      inputRef={inputRef}
      modulesFetched={modulesFetched}
      inputBox={inputBox}
      inputHeight={inputHeight}
      inputWidth={inputWidth}
      lookupRef={lookupRef}
      isPanelBelowVisible={isPanelBelowVisible}
      searchResults={searchResults}
      appName={appName ?? "crm"}
      relatedListData={relatedListData}
      name={name}
      disabled={disabled}
      relatedToFields={relatedToFields}
      rejectRequired={rejectRequired}
      disableSearchButton={disableSearchButton}
      localSearchModel={localSearchModel}
      searchFormClosed={searchFormClosed}
      showSearchScreen={showSearchScreen}
      setDisableSearchButton={(value) => setDisableSearchButton(value)}
      setLocalSearchModal={(value) => setLocalSearchModal(value)}
      setSearchFormClosed={(value) => setSearchFormClosed(value)}
      setRelatedToFields={setRelatedToFields}
      setRelatedListData={setRelatedListData}
      handleResultShow={handleResultShow}
      setPanelBelowVisible={setPanelBelowVisible}
      handleSelectedItem={handleSelectedItem}
      setShowSearchScreen={setShowSearchScreen}
      setCurrentFormLayer={(value) => setCurrentFormLayer(value)}
      setSearchResults={setSearchResults}
      moduleLoading={moduleLoading}
      genericModels={genericModels}
      allLayoutFetched={allLayoutFetched}
    />
  );
};
export default FormRelatedTo;
