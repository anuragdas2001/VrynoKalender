import { useRouter } from "next/router";
import React, { ChangeEvent } from "react";
import { Formik, FormikValues } from "formik";
import { useTranslation } from "next-i18next";
import { ICustomField } from "../../../../../models/ICustomField";
import { AllowedViews } from "../../../../../models/allowedViews";
import { appsUrlGenerator } from "../../shared/utils/appsUrlGenerator";
import GenericAddCustomViewFilters from "./GenericAddCustomViewFilters";
import GenericBackHeader from "../../shared/components/GenericBackHeader";
import GenericAddCustomViewFieldForm from "./GenericAddCustomViewFieldForm";
import { ISimplifiedCustomField } from "../../shared/utils/getOrderedFieldsList";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import {
  ICriteriaFilterRow,
  ICustomView,
  ISharingRuleData,
  IUserPreference,
  SupportedApps,
  SupportedDashboardViews,
} from "../../../../../models/shared";

export type GenericAddCustomViewProps = {
  fieldInitialValues: {
    id: string;
    customViewName: string;
  };
  id: string;
  appName: SupportedApps;
  modelName: string;
  loading: boolean;
  fieldsList: Array<ICustomField>;
  conditionList: ICriteriaFilterRow[];
  orderByList: Record<string, string>[];
  selectedFieldsList: ISimplifiedCustomField[];
  selectedThresholdFieldsList: ISimplifiedCustomField[];
  availableFieldsList: ISimplifiedCustomField[];
  availableThresholdFieldsList: ISimplifiedCustomField[];
  currentModuleDashboardView: string;
  handleSubmit: (values: FormikValues) => void;
  handleAvailableFieldSelection: (field: ISimplifiedCustomField) => void;
  handleSelectedFieldSelection: (field: ISimplifiedCustomField) => void;
  setSelectedThresholdFieldsList: (fields: ISimplifiedCustomField[]) => void;
  setAvailableThresholdFieldsList: (fields: ISimplifiedCustomField[]) => void;
  handleAvailableFields: () => void;
  handleSelectedFields: () => void;
  handleOrderByAddClick: () => void;
  handleOrderByRemoveClick: (index: number) => void;
  handleOrderByChange: (
    e: ChangeEvent<HTMLSelectElement>,
    index: number
  ) => void;
  resetOrderBy: () => void;
  editMode: boolean;
  setConditionList: (value: ICriteriaFilterRow[]) => void;
  relatedFilter: string;
  relatedFilterId: string;
  uniqueCustomName: string;
  moduleViewData: ICustomView | null;
  moduleViewSharingData: ISharingRuleData | null;
  userPreferences: IUserPreference[];
};

const GenericAddCustomViewForm = ({
  fieldInitialValues,
  id,
  appName,
  modelName,
  fieldsList,
  loading,
  conditionList,
  orderByList,
  selectedFieldsList,
  selectedThresholdFieldsList,
  availableFieldsList,
  availableThresholdFieldsList,
  currentModuleDashboardView,
  handleSubmit,
  handleAvailableFieldSelection,
  handleSelectedFieldSelection,
  setSelectedThresholdFieldsList,
  setAvailableThresholdFieldsList,
  handleAvailableFields,
  handleSelectedFields,
  handleOrderByAddClick,
  handleOrderByRemoveClick,
  handleOrderByChange,
  resetOrderBy,
  editMode,
  setConditionList,
  relatedFilter,
  relatedFilterId,
  uniqueCustomName,
  moduleViewData,
  moduleViewSharingData,
  userPreferences,
}: GenericAddCustomViewProps) => {
  const router = useRouter();
  const { t } = useTranslation(["common"]);

  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full h-full">
      <Formik
        initialValues={{
          recordsPerPage: 30,
          expression: "",
          ...fieldInitialValues,
        }}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit }) => (
          <>
            <GenericBackHeader
              heading={id ? `Edit Custom View` : `Create Custom View`}
              addButtonInFlexCol={true}
            >
              <div className="grid grid-cols-6 sm:grid-cols-4 gap-x-4 mt-5 sm:mt-0 w-full sm:w-1/2 sm:max-w-xs">
                <div className="col-span-3 sm:col-span-2">
                  <Button
                    id="cancel-form"
                    onClick={() => {
                      router.push(
                        relatedFilter == "reports"
                          ? `/reports/crm/view/${relatedFilterId}`
                          : appsUrlGenerator(
                              appName,
                              modelName,
                              AllowedViews.view,
                              currentModuleDashboardView
                                ? currentModuleDashboardView.toLocaleLowerCase()
                                : SupportedDashboardViews.Card.toLocaleLowerCase()
                            )
                      );
                    }}
                    buttonType="thin"
                    kind="back"
                    userEventName="customView-save:cancel-click"
                  >
                    {t("common:cancel")}
                  </Button>
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <Button
                    id="save-form"
                    loading={loading}
                    disabled={loading}
                    onClick={() => {
                      handleSubmit();
                    }}
                    buttonType="thin"
                    kind="primary"
                    userEventName="customView-save:submit-click"
                  >
                    {t("common:save")}
                  </Button>
                </div>
              </div>
            </GenericBackHeader>
            <div className="grid lg:grid-cols-2 gap-6 p-6">
              <GenericAddCustomViewFieldForm
                availableFieldsList={availableFieldsList}
                availableThresholdFieldsList={availableThresholdFieldsList}
                selectedFieldsList={selectedFieldsList}
                selectedThresholdFieldsList={selectedThresholdFieldsList}
                handleAvailableFieldSelection={handleAvailableFieldSelection}
                setSelectedThresholdFieldsList={setSelectedThresholdFieldsList}
                handleSelectedFieldSelection={handleSelectedFieldSelection}
                setAvailableThresholdFieldsList={
                  setAvailableThresholdFieldsList
                }
                handleAvailableFields={handleAvailableFields}
                handleSelectedFields={handleSelectedFields}
              />
              <GenericAddCustomViewFilters
                conditionList={conditionList}
                orderByList={orderByList}
                fieldsList={fieldsList}
                handleOrderByChange={handleOrderByChange}
                handleOrderByAddClick={handleOrderByAddClick}
                handleOrderByRemoveClick={handleOrderByRemoveClick}
                resetOrderBy={resetOrderBy}
                modelName={modelName}
                editMode={editMode}
                setConditionList={setConditionList}
                uniqueCustomName={uniqueCustomName}
                moduleViewData={moduleViewData}
                moduleViewSharingData={moduleViewSharingData}
                id={id}
                userPreferences={userPreferences}
              />
            </div>
          </>
        )}
      </Formik>
    </form>
  );
};

export default GenericAddCustomViewForm;
