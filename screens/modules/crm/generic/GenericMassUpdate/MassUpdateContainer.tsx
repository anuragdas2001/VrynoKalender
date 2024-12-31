import React from "react";
import { Formik, FormikProps, FormikValues } from "formik";
import { ICustomField } from "../../../../../models/ICustomField";
import { MassUpdateDataContainer } from "./MassUpdateDataContainer";
import { getDataObjectArray } from "../../shared/utils/getDataObject";
import { MassUpdateFieldsContainer } from "./MassUpdateFieldsContainer";
import { getVisibleFieldsArray } from "../../shared/utils/getFieldsArray";
import GenericBackHeader from "../../shared/components/GenericBackHeader";
import { datatypeOperatorDict } from "../../../../../shared/datatypeOperatorDict";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { Loading } from "../../../../../components/TailwindControls/Loading/Loading";
import { CustomViewConditionsFilterContainer } from "../GenericAddCustomView/CustomViewConditionsFilterContainer";
import GenericHeaderCardContainer from "../../../../../components/TailwindControls/Cards/GenericHeaderCardContainer";
import { LazyQueryExecFunction } from "@apollo/client";
import {
  BaseGenericObjectType,
  ICriteriaFilterRow,
  IUserPreference,
  SupportedApps,
} from "../../../../../models/shared";
import { updateFieldsListDataTypeForFilters } from "../../../../layouts/GenericViewComponentMap";
import {
  FetchData,
  FetchVars,
} from "../../../../../graphql/queries/fetchQuery";
import { IGenericModel } from "../../../../../stores/RootStore/GeneralStore/GenericModelStore";

export const MassUpdateContainer = ({
  filteredData,
  setPreviousCriteriaValues,
  previousCriteriaValues,
  handleMassSearch,
  conditionList,
  fieldsList,
  appName,
  modelName,
  setConditionList,
  massSearchLoading,
  massSearchPageLoading,
  massUpdate,
  filteredFieldOrder,
  handleItemSelect,
  itemsCount,
  selectedItems,
  setSelectedItems,
  currentPageNumber,
  setCurrentPageNumber,
  getDataList,
  setMassUpdate,
  filterAndExpression,
  handleAllItemsSelectFetch,
  getAllItemsFetchLoading,
  handleMassUpdate,
  massUpdateProcess,
  userPreferences,
  genericModels,
  allLayoutFetched,
  allModulesFetched,
}: {
  filteredData: BaseGenericObjectType[];
  setPreviousCriteriaValues: any;
  previousCriteriaValues: {};
  handleMassSearch: (
    values: FormikValues,
    conditionList: ICriteriaFilterRow[]
  ) => void;
  conditionList: ICriteriaFilterRow[];
  fieldsList: ICustomField[];
  modelName: string;
  appName: SupportedApps;
  setConditionList: (value: ICriteriaFilterRow[]) => void;
  massSearchLoading: boolean;
  massSearchPageLoading: boolean;
  massUpdate: {
    visible: boolean;
  };
  filteredFieldOrder: ICustomField[];
  handleItemSelect: (item: BaseGenericObjectType) => void;
  itemsCount: number;
  selectedItems: BaseGenericObjectType[];
  setSelectedItems: (value: BaseGenericObjectType[]) => void;
  currentPageNumber: number;
  setCurrentPageNumber: (value: number) => void;
  getDataList: LazyQueryExecFunction<
    FetchData<BaseGenericObjectType>,
    FetchVars
  >;
  setMassUpdate: (value: { visible: boolean }) => void;
  filterAndExpression: {
    filters: {
      operator: string;
      name: string;
      value: string | string[];
      logicalOperator?: string | undefined;
      metadata?: string | undefined;
    }[];
    expression: string;
  };
  handleAllItemsSelectFetch: (
    totalItems: number,
    pageSize: number
  ) => Promise<void>;
  getAllItemsFetchLoading: boolean;
  handleMassUpdate: (values: FormikValues) => Promise<void>;
  massUpdateProcess: boolean;
  userPreferences: IUserPreference[];
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  allModulesFetched: boolean;
}) => {
  const criteriaRef = React.useRef<FormikProps<{}>>(null);

  React.useEffect(() => {
    if (filteredData.length && criteriaRef?.current?.values) {
      setPreviousCriteriaValues(criteriaRef?.current?.values);
    }
  }, [filteredData]);

  return (
    <>
      <GenericBackHeader heading="Mass Update" />
      <div className="px-6 py-6">
        <GenericHeaderCardContainer
          cardHeading={"Specify Criteria"}
          extended={filteredData.length ? false : true}
          getExtendedValue={(value) => {
            if (criteriaRef?.current?.values && value) {
              setPreviousCriteriaValues(criteriaRef?.current?.values);
            }
          }}
          allowOverflow={true}
        >
          <div className="sm:w-11/12 md:w-9/12 lg:w-8/12 xl:w-7/12 m-auto">
            <Formik
              innerRef={criteriaRef}
              initialValues={
                Object.keys(previousCriteriaValues).length
                  ? previousCriteriaValues
                  : {}
              }
              onSubmit={(values) => {
                handleMassSearch(values, conditionList);
              }}
            >
              {({ handleSubmit, resetForm }) => (
                <div className="w-full">
                  <CustomViewConditionsFilterContainer
                    resetForm={resetForm}
                    conditionList={conditionList}
                    setConditionList={setConditionList}
                    fieldsList={updateFieldsListDataTypeForFilters(
                      fieldsList
                    )?.filter(
                      (field) =>
                        field.visible === true &&
                        field.dataType in datatypeOperatorDict
                    )}
                    modelName={modelName}
                    editMode={true}
                    convertToBoolean={true}
                    uniqueCustomName={""}
                    datatypeOperatorDict={datatypeOperatorDict}
                    userPreferences={userPreferences}
                  />
                  <div className="w-2/12 m-auto">
                    <Button
                      id="mass-search-button"
                      onClick={() => handleSubmit()}
                      userEventName="massUpdate-search:submit-click"
                    >
                      <span>Search</span>
                    </Button>
                  </div>
                </div>
              )}
            </Formik>
          </div>
        </GenericHeaderCardContainer>
        {massSearchLoading || massSearchPageLoading ? (
          <div className="w-full h-full py-3.5 flex items-center justify-center bg-white rounded-md">
            <Loading color="Blue" />
          </div>
        ) : filteredData.length ? (
          <MassUpdateDataContainer
            extended={!massUpdate.visible}
            fieldsList={filteredFieldOrder}
            filteredData={filteredData}
            itemsCount={itemsCount || 0}
            selectedItems={selectedItems}
            onItemSelect={(value) => handleItemSelect(value)}
            handleSelectAllItems={() => {
              let updatedSelectedItems = [
                ...selectedItems,
                ...getDataObjectArray(filteredData),
              ].filter(
                (value, index, self) =>
                  index === self.findIndex((item) => item.id === value.id)
              );
              setSelectedItems([...updatedSelectedItems]);
            }}
            setSelectItemsOnAllPages={(items) => {
              setSelectedItems(items);
            }}
            appName={appName}
            modelName={modelName}
            currentPageNumber={currentPageNumber}
            onPageChange={(pageNumber: number) => {
              setCurrentPageNumber(pageNumber);
              getDataList({
                variables: {
                  modelName: modelName,
                  // fields: getFieldsArrayForModel(fieldsList, ""),
                  fields: getVisibleFieldsArray(fieldsList),
                  filters: filterAndExpression.filters,
                  expression: filterAndExpression.expression,
                  pageNumber: pageNumber,
                },
              });
            }}
            handleMassUpdate={(value) =>
              setMassUpdate({ visible: value.visible })
            }
            handleAllItemsSelectFetch={handleAllItemsSelectFetch}
            getAllItemsFetchLoading={getAllItemsFetchLoading}
          />
        ) : (
          <></>
        )}
        {massUpdate.visible && selectedItems.length ? (
          <MassUpdateFieldsContainer
            appName={appName}
            modelName={modelName}
            fieldsList={filteredFieldOrder?.filter(
              (field) => field.dataType !== "expression"
            )}
            handleMassUpdate={handleMassUpdate}
            massUpdateProcess={massUpdateProcess}
            genericModels={genericModels}
            allLayoutFetched={allLayoutFetched}
            allModulesFetched={allModulesFetched}
            userPreferences={userPreferences}
          />
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
