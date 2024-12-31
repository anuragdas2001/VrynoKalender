import { FormikValues, useFormikContext } from "formik";
import { useLazyQuery } from "@apollo/client";
import { ShowResultsBox } from "./ShowResultsBox";
import { ILayout } from "../../../../models/ILayout";
import {
  SearchBoxContainer,
  removeDuplicateObjectFromArray,
} from "./SearchBoxContainer";
import { AccountModels } from "../../../../models/Accounts";
import React, { useContext, useRef, useState } from "react";
import { ICustomField } from "../../../../models/ICustomField";
import { useContainerDimensions } from "./useContainerDimension";
import { BasicLookupType, SearchBoxProps } from "./SearchBoxProps";
import {
  SEARCH_MODULE_QUERY,
  SEARCH_QUERY,
} from "../../../../graphql/queries/searchQuery";
import { SearchScreen } from "../../../../screens/Shared/SearchScreen";
import { SupportedLabelLocations } from "../../SupportedLabelLocations";
import { userFieldsList } from "../ModuleSearchBox/ModuleSearchDataResultContainerPerModule";
import { sliderWindowType } from "../../../../screens/modules/crm/shared/components/SliderWindow";
import { getNavigationLabel } from "../../../../screens/modules/crm/shared/utils/getNavigationLabel";
import { NavigationStoreContext } from "../../../../stores/RootStore/NavigationStore/NavigationStore";
import { getSortedFieldList } from "../../../../screens/modules/crm/shared/utils/getOrderedFieldsList";
import {
  FetchData,
  FetchVars,
  FETCH_QUERY,
} from "../../../../graphql/queries/fetchQuery";
import { getDataObject } from "../../../../screens/modules/crm/shared/utils/getDataObject";
import { get } from "lodash";
import { BaseGenericObjectType } from "../../../../models/shared";
import { ISearchQuestData } from "../../../../screens/modules/search/ConnectedViewAllSearchResultsScreen";
import { GeneralStoreContext } from "../../../../stores/RootStore/GeneralStore/GeneralStore";

function SearchBoxContent<T extends BasicLookupType>({
  placeholder = "",
  label,
  leftIcon,
  rightIcon,
  rightIconClick = () => {},
  onBlur = () => {},
  onChange = () => {},
  autoFocus = false,
  handleItemSelect = () => {},
  name,
  isValid = true,
  labelLocation = SupportedLabelLocations.OnTop,
  value = "",
  error = undefined,
  editMode = false,
  disabled = false,
  required = false,
  appName,
  modelName,
  searchBy,
  fieldDisplayExpression,
  field,
  multiple = false,
  usedInForm = true,
  allowMargin = true,
  offsetValue = 3,
  pageSize = 50,
  onDataLoadButtonComponent,
  defaultOnSearchIconClick,
  setSearchedValue = () => {},
  externalExpressionToCalculateValue,
  formResetted,
  useNewAddedRecordInForm = true,
  handleNewAddedRecord = () => {},
  showModelNameInSearch = false,
  rejectRequired,
  addClear,
  retainDefaultValues,
  parentModelName,
  fieldIndex,
  overflow,
  setValuesForFields,
  additionalFieldName = "",
  autoOpenSearchScreenContainer = false,
  paddingInPixelForInputBox,
  helpText,
  setCurrentFormLayer = () => {},
  stopRecordLookupAutoReset = false,
  handleSetValuesForFields = () => {},
  disableGlobalSearchIcon = false,
  dataTestId,
  hideValidationMessages,
  resetComponentLoadIndex = false,
  setResetComponentLoadIndex = () => {},
  ...props
}: SearchBoxProps<T>) {
  const { navigations } = useContext(NavigationStoreContext);
  const [formDisabled, setFormDisabled] = React.useState(disabled);
  const { generalModelStore } = useContext(GeneralStoreContext);
  const { genericModels, allLayoutFetched, allModulesFetched } =
    generalModelStore;
  const [valueResetted, setValueResetted] = React.useState(false);
  const hiddenInputName = `hiddenSearchLookup-${appName}-${modelName}-${name}-${label}-${fieldIndex}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const lookupRef = useRef<HTMLDivElement>(null);
  const { values, setFieldValue } = useFormikContext<FormikValues>();
  const [searchProcessing, setSearchProcessing] = useState<boolean>(true);
  const [lastSearchedValue, setLastSearchedValue] = useState<string>();
  const [selectedValues, setSelectedValues] = useState<Array<ISearchQuestData>>(
    []
  );
  const [editModeValues, setEditModeValues] = useState<Array<any>>([]);
  const [searchResults, setSearchResults] = useState<Array<ISearchQuestData>>(
    []
  );
  const [demoSearchResults, setDemoSearchResults] = useState<Array<any>>([]);
  const [mappedDemoSearchResults, setMappedDemoSearchResults] = useState<
    Array<any>
  >([]);
  const [isPanelBelowVisible, setPanelBelowVisible] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const { width: inputWidth, height: inputHeight } = useContainerDimensions(
    inputRef,
    lookupRef,
    setPanelBelowVisible
  );
  const [fieldsList, setFieldsList] = React.useState<ICustomField[]>([]);
  const [editModeDataLoading, setEditModeDataLoading] =
    React.useState<boolean>(true);
  const [updatedSearchBy, setUpdatedSearchBy] = React.useState<string[]>([]);
  const currentModuleLabel = getNavigationLabel({
    navigations: navigations,
    currentModuleName: modelName,
    currentModuleLabel: modelName,
    defaultLabel: modelName,
  });
  const [localSearchModel, setLocalSearchModal] =
    React.useState<sliderWindowType>("-translate-y-full");
  const [searchFormClosed, setSearchFormClosed] =
    React.useState<boolean>(false);
  const [disableSearchButton, setDisableSearchButton] =
    React.useState<boolean>(true);
  const divFlexCol =
    labelLocation === SupportedLabelLocations.OnTop
      ? "flex-col"
      : "items-center";
  const [searchDataFound, setSearchDataFound] = React.useState<
    "permission" | "noData" | null
  >(null);
  const [isDemoDataNull, setIsDemoDataNull] = React.useState<boolean>(false);

  const uniqueNameSearchBy = searchBy.map((name) => {
    name = name.includes("fields.") ? name.split(".")[1] : name;
    const field = fieldsList?.filter((val) => val.name === name);
    if (field.length > 0 && !field[0].systemDefined) {
      return field[0].uniqueName;
    } else if (field.length > 0 && field[0].uniqueName.split(".").length >= 3) {
      return field[0].uniqueName.split(".")[2];
    }
    return name;
  });

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
    onError: (error) => {
      setSearchProcessing(false);
    },
  });

  const [getDemoResults] = useLazyQuery(SEARCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "search",
      },
    },
    onCompleted: (response) => {
      if (response?.quest?.data) {
        const updatedData: any[] = [];
        response.quest.data?.forEach((resp: any) => {
          updatedData.push({
            ...resp,
            values: getDataObject(resp.values),
          });
        });
        setDemoSearchResults(updatedData);
      }
    },
  });

  const [getEditModeValues] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });

  const resetFormValues = () => {
    setFieldValue(hiddenInputName, "");
    setFieldValue(name, multiple ? [] : addClear ? undefined : null);
  };

  const handleClear = () => {
    if (!valueResetted) {
      setValueResetted(true);
    }
    setEditModeValues([]);
    setSelectedValues([]);
    setFieldValue(name, null);
    setFieldValue(hiddenInputName, "");
  };

  const handleOnChange = (value: string) => {
    if (autoOpenSearchScreenContainer) {
      setSearchedValue(value);
      setLastSearchedValue(value);
      setLocalSearchModal("");
      return;
    }
    setPanelBelowVisible(true);
    if (lastSearchedValue === value) {
      getSearchResults({
        variables: {
          serviceName: appName,
          modelName: modelName,
          text: value,
        },
      }).then((response) => {
        setSearchProcessing(false);
        setPanelBelowVisible(true);
        if (response?.data?.quest?.data) {
          setSearchResults(response.data.quest.data);
        }
      });
      return;
    } else {
      setSearchedValue(value);
      setLastSearchedValue(value);
      getSearchResults({
        variables: {
          serviceName: appName,
          modelName: modelName,
          text: value,
        },
      }).then((response) => {
        setSearchProcessing(false);
        setPanelBelowVisible(true);
        if (response?.data?.quest?.data) {
          const updatedData: ISearchQuestData[] = [];
          response.data.quest.data?.forEach((resp: any) => {
            updatedData.push({
              ...resp,
              values:
                resp?.moduleUniqueName === "accounts.user"
                  ? getDataObject(resp.values)
                  : getDataObject(resp.values),
            });
          });
          setSearchResults(updatedData);
        }
      });
    }
  };

  const editModeFilterValues = removeDuplicateObjectFromArray(
    editModeValues,
    "id"
  )
    ?.filter((emValue) => {
      if (
        selectedValues.filter((sValue) => sValue.rowId === emValue.id)
          ?.length === 0
      )
        return emValue;
    })
    ?.filter((emValue) => {
      if (multiple) {
        const findIndex = values[name]?.length
          ? (values[name] as any)?.findIndex(
              (value: string) => value === (emValue?.id || emValue?.rowId)
            )
          : -1;
        if (findIndex !== -1) return emValue;
      } else {
        if ((emValue?.id || emValue?.rowId) === values[name]) return emValue;
      }
    });

  const selectedFilterValues = selectedValues?.filter((emValue) => {
    if (multiple) {
      const findIndex = values[name]?.length
        ? (values[name] as any)?.findIndex(
            (value: string) => value === (emValue?.id || emValue?.rowId)
          )
        : -1;
      if (findIndex !== -1) return emValue;
    } else {
      if ((emValue?.id || emValue?.rowId) === values[name]) return emValue;
    }
  });

  const handleSelectedItem = (item: ISearchQuestData) => {
    setFieldValue(hiddenInputName, null);
    setFieldValue(hiddenInputName, "");
    if (multiple) {
      if (
        !selectedValues.includes(item) &&
        editModeValues?.filter((value) => value.id === item.rowId)?.length === 0
      ) {
        if (values[name]) {
          if (values[name].includes(item.rowId)) return;
        }
        setSelectedValues([...selectedValues, item]);
        handleItemSelect([...selectedValues, ...editModeValues, item]);
        let deletedItems: string[] = [];
        if (values[name]) {
          deletedItems = values[name]
            .filter((value: string) =>
              editModeValues.findIndex(
                (editModeValue) => editModeValue.id === value
              ) === -1
                ? value
                : null
            )
            ?.filter((value: string) => value);
        }
        let updatedValues = [
          ...editModeValues?.map((value) => value.id),
          ...[...selectedValues, item].map((value) => value.rowId),
          ...deletedItems,
        ];
        setFieldValue(
          name,
          updatedValues.filter(
            (value, index) => updatedValues.indexOf(value) === index
          )
        );
      }
    } else {
      setSelectedValues([item]);
      setFieldValue(name, item.rowId);
      handleItemSelect([item]);
    }
    if (!valueResetted) {
      setValueResetted(true);
    }
    setLocalSearchModal("-translate-y-full");
    setSearchFormClosed(true);
  };

  const handleUnselectedItem = (item: any) => {
    let remainingValues = selectedValues.filter(
      (value) => value.rowId !== item.rowId
    );
    let remainingEditModeValues = editModeValues.filter(
      (value) => value.id !== item.rowId
    );
    setSelectedValues(remainingValues);
    setEditModeValues(remainingEditModeValues);
    handleItemSelect([...remainingValues, ...remainingEditModeValues]);
    let updatedValues = [
      ...remainingValues.map((value) => value.rowId),
      ...remainingEditModeValues?.map((value) => value.id),
    ];
    setFieldValue(
      name,
      multiple
        ? updatedValues.filter(
            (value, index) => updatedValues.indexOf(value) === index
          )
        : null
    );
  };

  const handleUnselectEditModeItem = (item: any) => {
    let remainingEditModeValues = editModeValues.filter(
      (value) => value.id !== item.id
    );
    let remainingValues = selectedValues.filter(
      (value) => value.rowId !== item.id
    );
    setEditModeValues(remainingEditModeValues);
    setSelectedValues(remainingValues);
    handleItemSelect([...remainingValues, ...remainingEditModeValues]);
    let updatedValues = [
      ...remainingValues.map((value) => value.rowId),
      ...remainingEditModeValues?.map((value) => value.id),
    ];
    setFieldValue(
      name,
      multiple
        ? updatedValues.filter(
            (value, index) => updatedValues.indexOf(value) === index
          )
        : null
    );
  };

  React.useEffect(() => {
    if (resetComponentLoadIndex) {
      setPageLoaded(false);
      setResetComponentLoadIndex(false);
    }
  }, [resetComponentLoadIndex]);

  React.useEffect(() => {
    if (!editMode) {
      setEditModeDataLoading(false);
    }
  }, [editMode]);

  React.useEffect(() => {
    if (
      !values[name] &&
      (selectedValues?.length > 0 || editModeValues?.length > 0)
    ) {
      handleClear();
    }
    // stopRecordLookupAutoReset -> (to stop auto update of formik context - on bulkImportMassUpdate)
    if (!values[name] && !formDisabled) {
      resetFormValues();
    }
  }, [values[name]]);

  React.useEffect(() => {
    if (values[name] !== undefined && rejectRequired && !valueResetted) {
      setFieldValue(name, "");
      setValueResetted(true);
      return;
    }

    const getValuesFromServer = async () => {
      if (pageLoaded && !retainDefaultValues)
        if (
          modelName !== "organization" &&
          name !== "organizationId" &&
          modelName !== "contact" &&
          name !== "contactId"
        )
          return;
      if (multiple ? values[name]?.length : values[name]) {
        let i = 0;
        let selectedEditModeValues: any[] = [];
        setEditModeDataLoading(true);
        while (i < values[name].length + 1) {
          await getEditModeValues({
            variables: {
              modelName: modelName,
              fields: [...searchBy, "id"],
              filters: [
                {
                  operator: "in",
                  name: "id",
                  value: values[name].slice(
                    i,
                    values[name].length < i + pageSize
                      ? values[name].length
                      : i + pageSize
                  ),
                },
              ],
            },
          }).then((response) => {
            setPageLoaded(true);
            if (response?.data?.fetch?.messageKey.includes("success")) {
              if (!response?.data?.fetch?.data?.length) {
                setSearchDataFound("noData");
              }
              selectedEditModeValues = [
                ...response.data.fetch.data,
                ...selectedEditModeValues,
              ];
            }
            if (response?.data?.fetch?.messageKey.includes("requires-view")) {
              setSearchDataFound("permission");
            }
          });
          i = i + pageSize;
        }

        let updatedWithOrderEditModeValues: Array<any> = [];
        if (
          values[name] &&
          multiple &&
          Array.isArray(values[name]) &&
          values[name]?.length > 0
        ) {
          values[name].forEach((value: string) => {
            let findIndexInEditMode = selectedEditModeValues.findIndex(
              (editModeValue) => editModeValue.id === value
            );
            if (findIndexInEditMode !== -1)
              updatedWithOrderEditModeValues = [
                ...updatedWithOrderEditModeValues,
                selectedEditModeValues[findIndexInEditMode],
              ];
          });
        }
        setEditModeValues(
          updatedWithOrderEditModeValues?.length > 0
            ? updatedWithOrderEditModeValues
            : selectedEditModeValues
        );
        setEditModeDataLoading(false);
      }
    };
    if (!appName && !modelName) return;
    getValuesFromServer();
  }, [values[name], pageLoaded, appName, modelName]);

  React.useEffect(() => {
    if (formResetted) {
      resetFormValues();
    }
  }, [formResetted]);

  React.useEffect(() => {
    getDemoResults({
      variables: {
        serviceName: appName,
        modelName: modelName,
        text: "",
      },
    });
  }, [modelName]);

  React.useEffect(() => {
    if (modelName && modelName === AccountModels.User) {
      setFieldsList(userFieldsList);
    }
    if (
      modelName &&
      modelName !== AccountModels.User &&
      allLayoutFetched &&
      appName
    ) {
      let fieldsListFromStore = genericModels[modelName]?.fieldsList ?? [];
      if (fieldsListFromStore?.length > 0) {
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
                value: [modelName],
              },
            ],
          },
        }).then();
      }
    }
  }, [modelName, allLayoutFetched, appName]);

  React.useEffect(() => {
    if (formDisabled === disabled) return;
    setFormDisabled(disabled);
  }, [disabled]);

  const handleAddedRecord = (data: BaseGenericObjectType) => {
    if (useNewAddedRecordInForm)
      handleSelectedItem({
        modelName: modelName,
        rowId: data.id,
        values: data,
        addedByQuickCreate: true,
        moduleUniqueName: "",
      });
    handleNewAddedRecord(data);
  };

  React.useEffect(() => {
    if (fieldsList.length > 0 && fieldDisplayExpression.length > 0) {
      let updatedSearchBy = [];
      for (let index = 0; index < fieldDisplayExpression.length; index++) {
        const field = fieldsList?.filter(
          (field) => field.name === fieldDisplayExpression[index]
        );
        if (field.length > 0 && !field[0].systemDefined) {
          updatedSearchBy.push(field[0].uniqueName);
        } else if (
          field.length > 0 &&
          field[0].uniqueName.split(".").length >= 3
        ) {
          updatedSearchBy.push(field[0].uniqueName.split(".")[2]);
        }
      }
      setUpdatedSearchBy(updatedSearchBy);
    }
  }, [fieldsList, fieldDisplayExpression]);

  // Auto Mapping Search - start
  const [getModuleSearchResults] = useLazyQuery(SEARCH_MODULE_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "search",
      },
    },
  });

  const [searchFieldDataForFilter, setSearchFieldDataForFilter] =
    React.useState<{
      fieldId: string;
      fieldName: string;
    } | null>(null);

  //NOTE: Below code is for specifying one customer specific serial number for each organization requirement
  const [fetchOrganization] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });

  const [fetchCustomerSpecificSerialNumberRecords] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });

  const subDomain = window.location.hostname.split(".")[0];
  const sparkletecFieldName = field?.name?.replace(/\d+$/, "");
  disableGlobalSearchIcon =
    subDomain === "sparkletec" &&
    sparkletecFieldName === "customSerialNoSubForm" &&
    values["organizationId"]
      ? true
      : false || disableGlobalSearchIcon;

  React.useEffect(() => {
    if (sparkletecFieldName === "customSerialNoSubForm") {
      const customSerialNoSubForm = JSON.parse(
        sessionStorage.getItem("sparkletec-customSerialNo") || "{}"
      );
      if (
        customSerialNoSubForm &&
        Object.keys(customSerialNoSubForm)?.length &&
        customSerialNoSubForm[values["organizationId"]]
      ) {
        setMappedDemoSearchResults(
          customSerialNoSubForm[values["organizationId"]]
        );
      }
      return;
    }
  }, [sessionStorage.getItem("sparkletec-customSerialNo")]);

  // sessionStorage.removeItem("sparkletec-customSerialNo");
  React.useEffect(() => {
    if (
      subDomain === "sparkletec" &&
      sparkletecFieldName === "customSerialNoSubForm" &&
      field?.moduleName === "quotedItem" &&
      !values["organizationId"]
    ) {
      // sessionStorage.removeItem("sparkletec-customSerialNo");
      setMappedDemoSearchResults([]);
      setIsDemoDataNull(false);
      // setFormDisabled(values["organizationId"] ? true : false);
    }
    if (
      subDomain === "sparkletec" &&
      values["organizationId"] &&
      field?.name === "customSerialNoSubForm0" &&
      field?.moduleName === "quotedItem" &&
      appName
    ) {
      fetchOrganization({
        variables: {
          modelName: "organization",
          fields: ["id", "name", "fields.customSerialNo"],
          filters: [
            { name: "id", operator: "eq", value: [values["organizationId"]] },
          ],
        },
      }).then((response) => {
        if (response?.data?.fetch?.data?.length) {
          const recordIds =
            response?.data?.fetch?.data[0]["fields.customSerialNo"];
          if (recordIds?.length) {
            fetchCustomerSpecificSerialNumberRecords({
              variables: {
                modelName: "customSerialNo",
                fields: ["id", "name"],
                filters: [{ name: "id", operator: "in", value: recordIds }],
              },
            }).then((response) => {
              if (response?.data?.fetch?.data?.length) {
                const modifiedData = response?.data?.fetch?.data.map(
                  (data: any) => {
                    return {
                      modelName: "customSerialNo",
                      moduleUniqueName: "", //copy this from production
                      rowId: data.id,
                      values: data,
                    };
                  }
                );
                setMappedDemoSearchResults(modifiedData);
                const sessionData = JSON.parse(
                  sessionStorage.getItem("sparkletec-customSerialNo") || "{}"
                );
                sessionStorage.setItem(
                  "sparkletec-customSerialNo",
                  JSON.stringify({
                    ...sessionData,
                    [values["organizationId"]]: modifiedData,
                  })
                );
              }
            });
          } else {
            setMappedDemoSearchResults([]);
            setIsDemoDataNull(true);
          }
        }
      });
      return;
    }
    if (
      field &&
      [
        "deal",
        "contact",
        "quote",
        "salesOrder",
        "invoice",
        "purchaseOrder",
      ].includes(field.moduleName) &&
      values["organizationId"] &&
      ["contactId", "reportingToId", "parentContactId"].includes(field.name)
    ) {
      getModuleSearchResults({
        variables: {
          serviceName: appName,
          modelName: "contact",
          text: "",
          filters: [
            {
              fieldName: "organizationId",
              value: values["organizationId"],
              exact: true,
            },
          ],
        },
      }).then((response) => {
        if (response?.data?.quest?.data) {
          const data = response?.data?.quest?.data;
          const updatedData: any[] = [];
          data?.forEach((resp: any) => {
            updatedData.push({
              ...resp,
              values: getDataObject(resp.values),
            });
          });
          setMappedDemoSearchResults(updatedData);
        }
      });
      setSearchFieldDataForFilter({
        fieldId: values["organizationId"],
        fieldName: "organizationId",
      });
    }
    if (!values["organizationId"]) {
      setMappedDemoSearchResults([]);
      setSearchFieldDataForFilter(null);
    }
  }, [values?.["organizationId"], appName]);
  // Auto Mapping Search - end

  return (
    <div
      ref={lookupRef}
      className={`flex ${divFlexCol} ${allowMargin && "my-2"} `}
      data-control-type="input-box"
    >
      <SearchBoxContainer
        appName={appName}
        modelName={modelName}
        defaultOnSearchIconClick={defaultOnSearchIconClick}
        labelLocation={labelLocation}
        isValid={isValid}
        rejectRequired={rejectRequired}
        label={label}
        name={name}
        addClear={addClear}
        required={required}
        formDisabled={formDisabled}
        disableSearchButton={disableSearchButton}
        inputRef={inputRef}
        multiple={multiple}
        selectedValues={selectedValues}
        editModeValues={editModeValues}
        searchBy={searchBy}
        hiddenInputName={hiddenInputName}
        autoFocus={autoFocus}
        placeholder={placeholder}
        error={error}
        editMode={editMode}
        fieldsList={fieldsList}
        editModeDataLoading={editModeDataLoading}
        additionalFieldName={additionalFieldName}
        setFormDisabled={setFormDisabled}
        setValuesForFields={setValuesForFields}
        paddingInPixelForInputBox={paddingInPixelForInputBox}
        handleUnselectEditModeItem={handleUnselectEditModeItem}
        handleUnselectedItem={handleUnselectedItem}
        onChange={onChange}
        setSearchProcessing={setSearchProcessing}
        onBlur={onBlur}
        handleOnChange={handleOnChange}
        setPanelBelowVisible={setPanelBelowVisible}
        setSearchModal={(value) => {
          setLocalSearchModal(value);
          setSearchFormClosed(false);
        }}
        helpText={helpText}
        handleClear={handleClear}
        handleSetValuesForFields={handleSetValuesForFields}
        searchDataFound={searchDataFound}
        uniqueNameSearchBy={uniqueNameSearchBy}
        editModeFilterValues={editModeFilterValues}
        selectedFilterValues={selectedFilterValues}
        disableGlobalSearchIcon={disableGlobalSearchIcon}
        dataTestId={dataTestId}
        hideValidationMessages={hideValidationMessages}
      />
      <ShowResultsBox
        appName={appName}
        modelName={modelName}
        fieldLabel={label}
        searchedValue={values[hiddenInputName]}
        inputHeight={inputHeight}
        inputWidth={inputWidth}
        lookupRef={lookupRef}
        overflow={overflow}
        searchProcessing={
          searchProcessing ||
          (modelName !== AccountModels.User && updatedSearchBy.length === 0)
        }
        isPanelBelowVisible={isPanelBelowVisible}
        searchResults={searchResults?.filter(
          (result) =>
            ![...editModeFilterValues, ...selectedFilterValues]
              ?.map((value) => get(value, "id", get(value, "rowId", "")))
              .includes(get(result, "id", get(result, "rowId", "")))
        )}
        demoSearchResults={
          isDemoDataNull
            ? []
            : demoSearchResults?.filter(
                (result) =>
                  ![...editModeFilterValues, ...selectedFilterValues]
                    ?.map((value) => get(value, "id", get(value, "rowId", "")))
                    .includes(get(result, "id", get(result, "rowId", "")))
              )
        }
        mappedDemoSearchResults={
          isDemoDataNull
            ? []
            : mappedDemoSearchResults?.filter(
                (result) =>
                  ![...editModeFilterValues, ...selectedFilterValues]
                    ?.map((value) => get(value, "id", get(value, "rowId", "")))
                    .includes(get(result, "id", get(result, "rowId", "")))
              )
        }
        searchBy={modelName === AccountModels.User ? searchBy : updatedSearchBy}
        fieldsList={fieldsList}
        onDataLoadButtonComponent={onDataLoadButtonComponent}
        setPanelBelowVisible={(value) => setPanelBelowVisible(value)}
        handleSelectedItem={(item) => handleSelectedItem(item)}
        handleAddedRecord={(data) => {
          handleAddedRecord(data);
          setPanelBelowVisible(false);
        }}
        setFieldsList={(fields) => setFieldsList(fields)}
        showModelNameInSearch={showModelNameInSearch}
        setCurrentFormLayer={(value) => setCurrentFormLayer(value)}
      />
      <SearchScreen
        appName={appName}
        modelName={modelName}
        currentModuleLabel={currentModuleLabel}
        searchModel={localSearchModel}
        disableModuleSelector={true}
        formClosed={searchFormClosed}
        showViewAllScreen={false}
        externalSearchValue={lastSearchedValue}
        allReadySelectedValues={[
          ...editModeFilterValues,
          ...selectedFilterValues,
        ]?.map((value) => get(value, "id", get(value, "rowId", "")))}
        searchBy={modelName === AccountModels.User ? searchBy : updatedSearchBy}
        setDisableSearchButton={(value) => setDisableSearchButton(value)}
        setSearchModal={(value) => setLocalSearchModal(value)}
        handleSearchedSelectedItem={(items) => {
          handleSelectedItem(items);
        }}
        setFormClosed={(value) => {
          setSearchFormClosed(value);
        }}
        useModuleExpression={false}
        addUserModel={true}
        hiddenDropdownLookup={`${name}-${label ?? ""}-${
          parentModelName ?? ""
        }HiddenDropdownLookup`}
        hiddenSearchLookup={`${name}-${label ?? ""}-${
          parentModelName ?? ""
        }HiddenSearchLookup`}
        searchFieldDataForFilter={searchFieldDataForFilter}
        allowFilters={true}
        generateLink={false}
      />
    </div>
  );
}
export default SearchBoxContent;
