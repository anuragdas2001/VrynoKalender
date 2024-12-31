import { FormikValues, useFormikContext } from "formik";
import { ICustomField } from "../../../../models/ICustomField";
import { SupportedLabelLocations } from "./FormRelatedTo";
import { useLazyQuery } from "@apollo/client";
import {
  FetchData,
  FetchVars,
  FETCH_QUERY,
} from "../../../../graphql/queries/fetchQuery";
import { ILayout } from "../../../../models/ILayout";
import { getSortedFieldList } from "../../../../screens/modules/crm/shared/utils/getOrderedFieldsList";
import React, { useState } from "react";
import { SearchScreen } from "../../../../screens/Shared/SearchScreen";
import { sliderWindowType } from "../../../../screens/modules/crm/shared/components/SliderWindow";
import { RelatedToContent } from "./RelatedToContent";
import { SEARCH_QUERY } from "../../../../graphql/queries/searchQuery";
import { toast } from "react-toastify";
import { ISearchQuestData } from "../../../../screens/modules/search/ConnectedViewAllSearchResultsScreen";
import { IGenericModel } from "../../../../stores/RootStore/GeneralStore/GenericModelStore";

export interface IRelatedToContent {
  label: string | undefined;
  required: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  modulesFetched: {
    value: string;
    label: string;
    additionalValues: Array<string>;
  }[];
  inputBox: React.RefObject<HTMLInputElement>;
  inputHeight: number;
  inputWidth: number;
  lookupRef: React.RefObject<HTMLDivElement>;
  isPanelBelowVisible: boolean;
  searchResults: any[];
  relatedListData: any;
  relatedToFields: {
    moduleName: string;
    recordId: string;
  }[];
  rejectRequired?: boolean;
  disableSearchButton: boolean;
  setPanelBelowVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setRelatedToFields: React.Dispatch<
    React.SetStateAction<
      {
        moduleName: string;
        recordId: string;
      }[]
    >
  >;
  setRelatedListData: React.Dispatch<any>;
  handleResultShow: () => any;
  setCurrentFormLayer?: (value: boolean) => void;
}
export interface IRelatedToContentProps extends IRelatedToContent {
  labelClasses: "" | "w-1/3 text-right pr-6";
  handleGetLayout: (selectedOption: React.ChangeEvent<any>) => void;
  setShowSearchScreen: (value: React.SetStateAction<boolean>) => void;
  setLocalSearchModal: (value: React.SetStateAction<sliderWindowType>) => void;
  appName: string;
  fieldsList: ICustomField[];
  handleSelectedItem: (selectedItem: ISearchQuestData) => void;
  name: string;
  searchLoading: boolean;
  demoSearchResults: any[];
  disabled?: boolean;
  handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  moduleLoading: boolean;
}

interface IRelatedToContentContainer extends IRelatedToContent {
  labelLocation: SupportedLabelLocations;
  appName: string;
  name: string;
  localSearchModel: sliderWindowType;
  searchFormClosed: boolean;
  showSearchScreen: boolean;
  disabled?: boolean;
  handleSelectedItem: (selectedItem: ISearchQuestData) => void;
  setDisableSearchButton: (value: React.SetStateAction<boolean>) => void;
  setLocalSearchModal: (value: React.SetStateAction<sliderWindowType>) => void;
  setSearchFormClosed: (value: React.SetStateAction<boolean>) => void;
  setShowSearchScreen: (value: React.SetStateAction<boolean>) => void;
  setSearchResults: React.Dispatch<React.SetStateAction<any[]>>;
  moduleLoading: boolean;
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
}

export const RelatedToContentContainer = ({
  label,
  required,
  inputRef,
  modulesFetched,
  inputBox,
  inputHeight,
  inputWidth,
  lookupRef,
  isPanelBelowVisible,
  searchResults,
  relatedListData,
  relatedToFields,
  rejectRequired = false,
  disableSearchButton,
  disabled,
  setPanelBelowVisible,
  setRelatedToFields,
  setRelatedListData,
  handleResultShow,
  setCurrentFormLayer = () => {},
  labelLocation,
  appName,
  name,
  localSearchModel,
  searchFormClosed,
  showSearchScreen,
  handleSelectedItem,
  setDisableSearchButton,
  setLocalSearchModal,
  setSearchFormClosed,
  setShowSearchScreen,
  setSearchResults,
  moduleLoading,
  genericModels,
  allLayoutFetched,
}: IRelatedToContentContainer) => {
  const [searchLoading, setSearchLoading] = React.useState(false);
  const { values, setFieldValue } = useFormikContext<FormikValues>();
  const [fieldsList, setFieldsList] = useState<ICustomField[]>([]);
  const [demoSearchResults, setDemoSearchResults] = React.useState<any[]>([]);
  const divFlexCol =
    labelLocation === SupportedLabelLocations.OnTop
      ? "flex-col"
      : "items-center";
  const labelClasses =
    labelLocation === SupportedLabelLocations.OnLeftSide
      ? "w-1/3 text-right pr-6"
      : "";

  const [getLayout] = useLazyQuery<FetchData<ILayout>, FetchVars>(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data?.length) {
        setFieldsList(
          getSortedFieldList(responseOnCompletion.fetch.data[0].config.fields)
        );
      }
    },
  });

  const [getSearchResults] = useLazyQuery(SEARCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "search",
      },
    },
    onCompleted: (response) => {
      if (response?.quest?.data) {
        const filteredSearchBy: any = new Set();
        response.quest.data.forEach((val: any) => {
          filteredSearchBy.add(val.matchLocation);
        });
        setSearchResults(response.quest.data);
      }
      setSearchLoading(false);
    },
    onError: (error) => {
      console.error(error);
      setSearchLoading(false);
    },
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!values["relatedToDropdown"]) {
      toast.error("Please select module");
      return;
    }
    setPanelBelowVisible(true);
    if (e.target.value.length < 3) return;
    setSearchLoading(true);
    getSearchResults({
      variables: {
        serviceName: appName ?? "crm",
        modelName: values["relatedToDropdown"],
        text: e.target.value,
      },
    }).then(() => {
      setPanelBelowVisible(true);
    });
  };

  const handleGetLayout = (selectedOption: React.ChangeEvent<any>) => {
    if (allLayoutFetched) {
      let fieldsListFromStore =
        genericModels[selectedOption.target.value].fieldsList;
      if (fieldsList?.length > 0) {
        setFieldsList(getSortedFieldList(fieldsListFromStore));
      } else {
        getLayout({
          variables: {
            modelName: "Layout",
            fields: ["id", "name", "moduleName", "layout", "config", "type"],
            filters: [
              {
                name: "moduleName",
                operator: "eq",
                value: [selectedOption.target.value],
              },
            ],
          },
        });
      }
    }
  };

  React.useEffect(() => {
    if (values["relatedToDropdown"] && showSearchScreen) {
      getSearchResults({
        variables: {
          serviceName: appName ?? "crm",
          modelName: values["relatedToDropdown"],
          text: "",
        },
      }).then((result) => {
        if (result?.data?.quest?.messageKey.includes("success")) {
          setSearchResults(result.data.quest.data);
          setDemoSearchResults(result.data.quest.data);
        }
      });
    }
  }, [values["relatedToDropdown"], showSearchScreen]);

  return (
    <div className={`flex my-2 w-full ${divFlexCol}`}>
      <RelatedToContent
        label={label}
        required={required}
        inputRef={inputRef}
        modulesFetched={modulesFetched}
        inputBox={inputBox}
        searchLoading={searchLoading}
        inputHeight={inputHeight}
        inputWidth={inputWidth}
        lookupRef={lookupRef}
        isPanelBelowVisible={isPanelBelowVisible}
        searchResults={searchResults}
        relatedListData={relatedListData}
        relatedToFields={relatedToFields}
        demoSearchResults={demoSearchResults}
        rejectRequired={rejectRequired}
        disableSearchButton={disableSearchButton}
        setPanelBelowVisible={setPanelBelowVisible}
        handleOnChange={handleOnChange}
        setRelatedToFields={setRelatedToFields}
        setRelatedListData={setRelatedListData}
        handleResultShow={handleResultShow}
        setCurrentFormLayer={setCurrentFormLayer}
        labelClasses={labelClasses}
        handleGetLayout={handleGetLayout}
        setShowSearchScreen={setShowSearchScreen}
        setLocalSearchModal={setLocalSearchModal}
        appName={appName}
        fieldsList={fieldsList}
        handleSelectedItem={handleSelectedItem}
        name={name}
        disabled={disabled}
        moduleLoading={moduleLoading}
      />
      {values["relatedToDropdown"] && showSearchScreen && (
        <SearchScreen
          appName={appName}
          modelName={values["relatedToDropdown"]}
          currentModuleLabel={values["relatedToDropdown"]}
          searchModel={localSearchModel}
          disableModuleSelector={true}
          formClosed={searchFormClosed}
          showViewAllScreen={false}
          setDisableSearchButton={(value) => setDisableSearchButton(value)}
          setSearchModal={(value) => setLocalSearchModal(value)}
          useModuleExpression={true}
          handleSearchedSelectedItem={(items) => {
            handleSelectedItem(items);
            setSearchFormClosed(false);
            setFieldValue("relatedToDropdown", "");
            setLocalSearchModal("-translate-y-full");
            setShowSearchScreen(false);
          }}
          setFormClosed={(value) => {
            setSearchFormClosed(value);
            setSearchFormClosed(false);
          }}
          hiddenDropdownLookup={`${name}HiddenDropdownLookup`}
          hiddenSearchLookup={`${name}HiddenSearchLookup`}
          allowFilters={true}
          generateLink={false}
        />
      )}
    </div>
  );
};
