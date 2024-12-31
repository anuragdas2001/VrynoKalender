import React from "react";
import { Formik, FormikValues } from "formik";
import { GenericModalFormFields } from "./GenericModalFormFields";
import getInitialValuesFromList from "../../../../../screens/modules/crm/shared/utils/getInitialValuesFromList";
import {
  handleGenericFormSave,
  handleGenericFormSaveForCustomFields,
} from "../../../../../screens/modules/crm/shared/utils/handleGenericFormSave";
import { IGenericFormDetails } from "../../../../../screens/modules/crm/generic/GenericModelDetails/IGenericFormDetails";
import getValidationSchema from "../../../../../screens/modules/crm/shared/utils/validations/getValidationSchema";
import { ICustomField } from "../../../../../models/ICustomField";
import { IModuleMetadata } from "../../../../../models/IModuleMetadata";
import { getCustomFieldData } from "../../../../../screens/modules/crm/shared/utils/getDataObject";
import { User } from "../../../../../models/Accounts";
import { IUserPreference } from "../../../../../models/shared";
import { IGenericModel } from "../../../../../stores/RootStore/GeneralStore/GenericModelStore";

export type GenericModalFormProps = {
  data: any;
  handleSave: (T: FormikValues) => void;
  saveLoading: boolean;
  editMode?: boolean;
  fieldList: Array<ICustomField>;
  formDetails: IGenericFormDetails;
  onCancel: () => void;
  currentModule?: IModuleMetadata;
  editData: Record<string, Record<string, Record<string, string>>>;
  user: User | null;
  userPreferences: IUserPreference[];
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  allModulesFetched: boolean;
};

let fieldInitialValues = {};

export const GenericModalForm = ({
  saveLoading,
  editMode = false,
  data,
  handleSave,
  fieldList,
  formDetails,
  onCancel,
  currentModule,
  editData,
  user,
  userPreferences,
  genericModels,
  allLayoutFetched,
  allModulesFetched,
}: GenericModalFormProps) => {
  fieldInitialValues = getInitialValuesFromList(fieldList);

  return (
    <Formik
      initialValues={{ ...fieldInitialValues, ...data }}
      validationSchema={getValidationSchema(
        fieldList?.filter((field) => field.visible)
      )}
      enableReinitialize
      onSubmit={(values) =>
        handleSave({
          ...handleGenericFormSave(fieldList, values, user?.timezone),
          fields: handleGenericFormSaveForCustomFields(
            fieldList,
            (values as any)["fields"],
            user?.timezone
          ),
        })
      }
    >
      {({ handleSubmit }) => (
        <GenericModalFormFields
          fieldList={fieldList}
          editMode={editMode}
          handleSave={handleSubmit}
          saveLoading={saveLoading}
          formDetails={formDetails}
          customFieldsData={editMode ? getCustomFieldData(data) : undefined}
          onCancel={onCancel}
          currentModule={currentModule}
          editData={editData}
          userPreferences={userPreferences}
          genericModels={genericModels}
          allLayoutFetched={allLayoutFetched}
          allModulesFetched={allModulesFetched}
        />
      )}
    </Formik>
  );
};
