import { useLazyQuery } from "@apollo/client";
import { Formik } from "formik";
import React, { useContext } from "react";
import { FormMultiSearchBox } from "../../components/TailwindControls/Form/ModuleSearchBox/FormModuleSearchBox";
import { Loading } from "../../components/TailwindControls/Loading/Loading";
import GenericFormModalContainer from "../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import { FETCH_QUERY } from "../../graphql/queries/fetchQuery";
import { AccountModels } from "../../models/Accounts";
import { IModuleMetadata } from "../../models/IModuleMetadata";
import { NavigationStoreContext } from "../../stores/RootStore/NavigationStore/NavigationStore";
import {
  SliderWindow,
  sliderWindowType,
} from "../modules/crm/shared/components/SliderWindow";
import { getNavigationLabel } from "../modules/crm/shared/utils/getNavigationLabel";
import { ISearchQuestData } from "../modules/search/ConnectedViewAllSearchResultsScreen";
import { observer } from "mobx-react-lite";
import { GeneralStoreContext } from "../../stores/RootStore/GeneralStore/GeneralStore";
import { PageLoader } from "../../components/TailwindControls/ContentLoader/Shared/PageLoader";
import { paramCase } from "change-case";

export type SearchScreenProps = {
  appName: string;
  modelName: string;
  searchModel: sliderWindowType;
  searchBy?: string[];
  disabled?: boolean;
  disableModuleSelector?: boolean;
  disableSearchSelector?: boolean;
  hiddenSearchLookup: string;
  hiddenDropdownLookup: string;
  formClosed: boolean;
  showViewAllScreen?: boolean;
  currentModuleLabel: string;
  addUserModel?: boolean;
  useModuleExpression?: boolean;
  externalSearchValue?: string;
  allReadySelectedValues?: string[];
  setDisableSearchButton: (value: boolean) => void;
  setFormClosed: (value: boolean) => void;
  setSearchModal: (value: sliderWindowType) => void;
  handleSearchedSelectedItem?: (item: ISearchQuestData) => void;
  searchFieldDataForFilter?: {
    fieldId: string;
    fieldName: string;
  } | null;
  allowFilters: boolean;
  generateLink?: boolean;
};

export const SearchScreen = observer(
  ({
    appName,
    modelName,
    searchModel,
    disabled = false,
    disableModuleSelector = false,
    disableSearchSelector = false,
    hiddenDropdownLookup,
    hiddenSearchLookup,
    formClosed,
    showViewAllScreen,
    currentModuleLabel,
    addUserModel = false,
    useModuleExpression = false,
    searchBy = [],
    externalSearchValue = "",
    allReadySelectedValues = [],
    setDisableSearchButton,
    setFormClosed,
    setSearchModal,
    handleSearchedSelectedItem = () => {},
    searchFieldDataForFilter,
    allowFilters,
    generateLink,
  }: SearchScreenProps) => {
    const { generalModelStore } = useContext(GeneralStoreContext);
    const { genericModels, allModulesFetched } = generalModelStore;
    const { navigations } = useContext(NavigationStoreContext);
    const [searchedValue, setSearchedValue] =
      React.useState<string>(externalSearchValue);
    const [selectedModule, setSelectedModule] = React.useState<string>();

    const [modulesFetched, setModulesFetched] = React.useState<{
      loading: boolean;
      data: IModuleMetadata[];
    }>({ loading: true, data: [] });
    const [formResetted, setFormResetted] = React.useState<boolean>(false);

    const updatedSearchModuleLabel = getNavigationLabel({
      navigations: navigations,
      currentModuleName: selectedModule,
      currentModuleLabel: selectedModule ?? "",
      defaultLabel: modelName,
    });

    React.useEffect(() => {
      if (allModulesFetched) {
        let responseData: IModuleMetadata[] = [
          ...Object.keys(genericModels)
            ?.map((model) => {
              if (
                genericModels[model]?.moduleInfo?.customizationAllowed === true
              )
                return genericModels[model]?.moduleInfo;
            })
            ?.filter((model) => model !== undefined),
        ];
        setModulesFetched({
          loading: false,
          data:
            responseData?.length > 0
              ? responseData.filter(
                  (moduleItem) => moduleItem?.customizationAllowed === true
                )
              : [],
        });
        setDisableSearchButton(false);
      }
    }, [allModulesFetched]);

    React.useEffect(() => {
      setSearchedValue("");
      setSelectedModule("");
    }, [modelName]);

    React.useEffect(() => {
      if (externalSearchValue) {
        setSearchedValue(externalSearchValue);
      }
    }, [externalSearchValue]);

    const [organizationName, setOrganizationName] = React.useState<
      null | string
    >(null);

    const [getOrganizationData] = useLazyQuery(FETCH_QUERY, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: "crm",
        },
      },
    });

    React.useEffect(() => {
      if (searchFieldDataForFilter) {
        getOrganizationData({
          variables: {
            modelName: "organization",
            fields: ["id", "name"],
            filters: [
              {
                name: "id",
                operator: "eq",
                value: [searchFieldDataForFilter.fieldId],
              },
            ],
          },
        }).then((result) => {
          if (result?.data?.fetch?.data?.length) {
            setOrganizationName(result?.data?.fetch?.data?.[0]?.name);
          }
        });
      }
    }, [searchFieldDataForFilter]);

    return (
      <SliderWindow sliderWindow={searchModel} onClose={() => {}}>
        <GenericFormModalContainer
          formHeading={`${
            updatedSearchModuleLabel === "Reports"
              ? currentModuleLabel
              : updatedSearchModuleLabel === "all"
              ? "Global"
              : updatedSearchModuleLabel === AccountModels.User
              ? "User"
              : updatedSearchModuleLabel === ""
              ? currentModuleLabel
              : updatedSearchModuleLabel === "organization-filter"
              ? organizationName !== null
                ? `Contacts related to ${organizationName}`
                : "Contacts related t Organization"
              : updatedSearchModuleLabel
          } Search`}
          onCancel={() => {
            setDisableSearchButton(false);
            setSearchModal("-translate-y-full");
            setFormClosed(true);
            setSearchedValue("");
            setSelectedModule(modelName === "" ? "all" : modelName);
          }}
          onOutsideClick={() => {
            setDisableSearchButton(false);
            setSearchModal("-translate-y-full");
            setFormClosed(true);
            setSearchedValue("");
            setSelectedModule(modelName === "" ? "all" : modelName);
          }}
          customWidth={"max-w-5xl"}
        >
          <div className="h-[380px]">
            {modulesFetched.loading ? (
              <div className="w-full flex items-center justify-center my-10">
                <PageLoader scale={1} />
              </div>
            ) : (
              <form
                onSubmit={(e) => e.preventDefault()}
                className="w-full pt-5"
              >
                <Formik
                  initialValues={{
                    search: "",
                    [hiddenDropdownLookup]: selectedModule
                      ? selectedModule
                      : modelName === ""
                      ? "all"
                      : modelName,
                    [hiddenSearchLookup]: searchedValue,
                    "search-reverse-lookup-selected-filter":
                      searchFieldDataForFilter ? "organization-filter" : null,
                  }}
                  onSubmit={(values) => {
                    console.log(values);
                  }}
                >
                  {({ resetForm }) => (
                    <>
                      <FormMultiSearchBox
                        name="search"
                        appName={appName}
                        modelName={modelName}
                        searchBy={
                          searchBy && searchBy.length > 0 ? searchBy : ["name"]
                        }
                        preSelectedValues={allReadySelectedValues}
                        searchedValue={searchedValue}
                        modulesOption={[
                          { value: "all", label: "All", visible: true },
                        ]
                          .concat(
                            addUserModel
                              ? [
                                  {
                                    value: AccountModels.User,
                                    label: "User",
                                    visible: true,
                                  },
                                ]
                              : []
                          )
                          .concat(
                            modulesFetched.data.map((module) => {
                              return {
                                value: module.name,
                                label: module.label?.en,
                                visible: true,
                              };
                            })
                          )}
                        formResetted={formResetted}
                        hiddenDropdownLookup={hiddenDropdownLookup}
                        hiddenSearchLookup={hiddenSearchLookup}
                        disabled={disabled}
                        showViewAllScreen={showViewAllScreen}
                        formClosed={formClosed}
                        disableModuleSelector={disableModuleSelector}
                        disableSearchSelector={disableSearchSelector}
                        useModuleExpression={useModuleExpression}
                        setSelectedModule={setSelectedModule}
                        setSearchedValue={setSearchedValue}
                        addUserModel={addUserModel}
                        setFormResetted={(value) => {
                          setFormResetted(value);
                          if (value) resetForm();
                        }}
                        setFormClosed={setFormClosed}
                        handleItemSelect={(item) => {
                          handleSearchedSelectedItem(item);
                          setFormClosed(true);
                          setSearchedValue("");
                          setSelectedModule(
                            modelName === "" ? "all" : modelName
                          );
                        }}
                        setDisableSearchButton={(value) =>
                          setDisableSearchButton(value)
                        }
                        closeSearchModal={(value) => {
                          if (value === true) {
                            setSearchModal("-translate-y-full");
                          } else {
                            setSearchModal("");
                          }
                        }}
                        searchFieldDataForFilter={searchFieldDataForFilter}
                        allowFilters={allowFilters}
                        generateLink={generateLink}
                        organizationName={organizationName}
                      />
                    </>
                  )}
                </Formik>
              </form>
            )}
          </div>
        </GenericFormModalContainer>
      </SliderWindow>
    );
  }
);
