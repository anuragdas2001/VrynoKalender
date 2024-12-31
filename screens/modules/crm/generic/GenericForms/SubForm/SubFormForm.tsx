import React from "react";
import { Formik, FormikValues } from "formik";
import EditIcon from "remixicon-react/PencilLineIcon";
import { SubFormFormContent } from "./SubFormFormContent";
import { BaseUser } from "../../../../../../models/Accounts";
import { ISubFormDataDict } from "../../../../../../models/shared";
import { ICustomField } from "../../../../../../models/ICustomField";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import getValidationSchema from "../../../shared/utils/validations/getValidationSchema";

export const SubFormForm = ({
  subFormIndex,
  subFormFormikValues,
  subFormItem,
  updatedFieldsList,
  modelName,
  isSample,
  editMode,
  countryCodeInUserPreference,
  setSubFormFormikValues,
  subFormRefs,
  subFormData,
  setSubFormAllFieldsModal,
  subFormItemIndex,
  cookieUser,
  subFormClear,
  setSubFormValidationErrors,
  subFormValidationErrors,
}: {
  subFormIndex: number;
  subFormFormikValues: Record<string, FormikValues>;
  subFormItem: Record<string, any>;
  updatedFieldsList: ICustomField[];
  modelName: string;
  isSample: boolean;
  editMode: boolean;
  countryCodeInUserPreference: string;
  setSubFormFormikValues: (values: Record<string, FormikValues>) => void;
  subFormRefs: any;
  subFormData: ISubFormDataDict;
  setSubFormAllFieldsModal: (value: {
    visible: boolean;
    subFormData: Record<string, any> | null;
    subFormMetaData: Record<string, any> | null;
    subFormItemIndex: number;
  }) => void;
  subFormItemIndex: number;
  cookieUser: BaseUser | null;
  subFormClear: boolean;
  setSubFormValidationErrors: (value: Record<string, boolean>) => void;
  subFormValidationErrors: Record<string, boolean>;
}) => {
  // const formikRef = React.useRef(null);
  // React.useImperativeHandle(subFormRefs, () => formikRef?.current);
  //   React.useEffect(() => {
  //     React.useImperativeHandle(subFormRefs, () => formikRef?.current);
  //   }, [formikRef]);
  return (
    <div className="flex gap-x-4 bg-vryno-light-fade-blue rounded-lg px-6 col-span-10">
      <div
        key={subFormIndex}
        className={`w-[95%] grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4w-full overflow-x-scroll`}
      >
        <Formik
          // innerRef={formikRef}
          initialValues={subFormFormikValues[Object.keys(subFormItem)[0]] || {}}
          validationSchema={getValidationSchema(updatedFieldsList, modelName)}
          enableReinitialize
          onSubmit={(values) => {}}
        >
          {({ values }) => (
            <>
              <SubFormFormContent
                subFormItem={subFormItem}
                updatedFieldsList={updatedFieldsList}
                isSample={isSample}
                modelName={modelName}
                editMode={editMode}
                countryCodeInUserPreference={countryCodeInUserPreference}
                subFormFormikValues={subFormFormikValues}
                setSubFormFormikValues={(value: Record<string, FormikValues>) =>
                  setSubFormFormikValues(value)
                }
                cookieUser={cookieUser}
                subFormClear={subFormClear}
                setSubFormValidationErrors={setSubFormValidationErrors}
                subFormValidationErrors={subFormValidationErrors}
              />
            </>
          )}
        </Formik>
      </div>
      <div className="w-[5%] mt-[38px]">
        <Button
          id={`${subFormData.fieldsMetaData.label}-${subFormItemIndex}-subform-add-all-fields`}
          customStyle={`border h-10 w-10 rounded-md flex items-center justify-center cursor-pointer bg-gray-200`}
          onClick={() =>
            setSubFormAllFieldsModal({
              visible: true,
              subFormData: subFormFormikValues[Object.keys(subFormItem)[0]],
              subFormMetaData: subFormData,
              subFormItemIndex: subFormItemIndex,
            })
          }
          userEventName="conditions-form-delete"
          renderChildrenOnly={true}
        >
          <EditIcon size={18} />
        </Button>
      </div>
    </div>
  );
};
