import { useTranslation } from "next-i18next";
import { useFormikContext } from "formik";
import React from "react";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import FormFieldList from "../../../../../screens/modules/crm/shared/components/Form/FormFieldList";
import getCustomFieldValue from "../../../../../screens/modules/crm/shared/utils/getCustomFieldValue";
import { ICustomField } from "../../../../../models/ICustomField";
import { IModuleMetadata } from "../../../../../models/IModuleMetadata";
import { IGenericFormDetails } from "../../../../../screens/modules/crm/generic/GenericModelDetails/IGenericFormDetails";
import { getCountryCodeFromPreference } from "../../../../../screens/modules/crm/shared/components/Form/FormFields/FormFieldPhoneNumber";
import { IUserPreference } from "../../../../../models/shared";
import { IGenericModel } from "../../../../../stores/RootStore/GeneralStore/GenericModelStore";

export type GenericModalFormFieldsProps = {
  handleSave: () => void;
  saveLoading: boolean;
  editMode: boolean;
  fieldList: Array<ICustomField>;
  onCancel: () => void;
  formDetails: IGenericFormDetails;
  customFieldsData?: Record<string, Record<string, string>>;
  currentModule?: IModuleMetadata;
  editData: Record<string, Record<string, Record<string, string>>>;
  userPreferences: IUserPreference[];
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  allModulesFetched: boolean;
};

export const GenericModalFormFields = ({
  fieldList,
  editMode,
  handleSave,
  saveLoading,
  formDetails,
  onCancel,
  customFieldsData = {},
  currentModule,
  editData,
  userPreferences,
  genericModels,
  allLayoutFetched,
  allModulesFetched,
}: GenericModalFormFieldsProps) => {
  const { t } = useTranslation(["common"]);
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();
  const [currentFormLayer, setCurrentFormLayer] = React.useState<boolean>(true);
  const [countryCodeInUserPreference, setCountryCodeInUserPreference] =
    React.useState<string>(
      userPreferences ? getCountryCodeFromPreference(userPreferences) : ""
    );

  React.useEffect(() => {
    setCountryCodeInUserPreference(
      getCountryCodeFromPreference(userPreferences)
    );
  }, [userPreferences]);

  const handleCustomFieldsSave = () => {
    let customFieldValues: Record<string, any> = {};
    const customFieldList = fieldList.filter(
      (field) => field["systemDefined"] !== true
    );
    for (let i = 0; i < customFieldList.length; i++) {
      if (customFieldList[i]["visible"]) {
        customFieldValues[customFieldList[i]["name"]] = getCustomFieldValue(
          customFieldList[i].dataType,
          values[customFieldList[i]["name"]]
        );
      }
    }
    setFieldValue("fields", customFieldValues);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleCustomFieldsSave();
        handleSave();
      }}
      onKeyPress={(e) => {
        if (e.key === "Enter" && currentFormLayer) {
          e.preventDefault();
          handleCustomFieldsSave();
          handleSave();
        }
      }}
      className="w-full"
    >
      <div className="w-full max-h-[55vh] overflow-y-auto pr-1.5 card-scroll mt-4">
        {fieldList && (
          <FormFieldList
            fieldList={fieldList}
            editMode={editMode}
            appName={formDetails.appName}
            customFieldsData={customFieldsData}
            quickCreate={formDetails.quickCreate}
            formDetails={formDetails}
            type="Modal"
            moduleName={currentModule?.name || ""}
            allowToggle={false}
            cardMarginTop={"mt-4"}
            applyBorder={true}
            currentFormLayer={currentFormLayer}
            setCurrentFormLayer={(value) => setCurrentFormLayer(value)}
            editData={editData}
            countryCodeInUserPreference={countryCodeInUserPreference}
            genericModels={genericModels}
            allLayoutFetched={allLayoutFetched}
            allModulesFetched={allModulesFetched}
          />
        )}
      </div>
      <div className="grid grid-cols-2 w-full gap-x-4 gap-y-4 sm:gap-y-0 mt-6.5">
        <Button
          id="cancel-form"
          onClick={onCancel}
          kind="back"
          userEventName="form-modal:cancel-click"
        >
          <>{t("Cancel")}</>
        </Button>
        <Button
          id="save-form"
          loading={saveLoading}
          disabled={saveLoading}
          onClick={() => {
            handleCustomFieldsSave();
            handleSave();
          }}
          kind="primary"
          userEventName="form-modal:submit-click"
        >
          <>{t("Save")}</>
        </Button>
      </div>
    </form>
  );
};
