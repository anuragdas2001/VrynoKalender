import React from "react";
import { Formik, FormikValues } from "formik";
import { toast } from "react-toastify";
import GenericHeaderCardContainer from "../../../../../components/TailwindControls/Cards/GenericHeaderCardContainer";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { ICustomField } from "../../../../../models/ICustomField";
import { IUserPreference, SupportedApps } from "../../../../../models/shared";
import FormFieldList from "../../shared/components/Form/FormFieldList";
import getValidationSchema from "../../shared/utils/validations/getValidationSchema";
import { isAfter } from "date-fns";
import { getCountryCodeFromPreference } from "../../shared/components/Form/FormFields/FormFieldPhoneNumber";
import { IGenericModel } from "../../../../../stores/RootStore/GeneralStore/GenericModelStore";

export const MassUpdateFieldsContainer = ({
  appName,
  modelName,
  fieldsList,
  handleMassUpdate,
  massUpdateProcess,
  userPreferences,
  genericModels,
  allLayoutFetched,
  allModulesFetched,
}: {
  appName: SupportedApps;
  modelName: string;
  fieldsList: ICustomField[];
  handleMassUpdate: (values: FormikValues) => void;
  massUpdateProcess: boolean;
  userPreferences: IUserPreference[];
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  allModulesFetched: boolean;
}) => {
  const [countryCodeInUserPreference, setCountryCodeInUserPreference] =
    React.useState<string>(
      userPreferences ? getCountryCodeFromPreference(userPreferences) : ""
    );

  React.useEffect(() => {
    setCountryCodeInUserPreference(
      getCountryCodeFromPreference(userPreferences)
    );
  }, [userPreferences]);
  return (
    <>
      <GenericHeaderCardContainer
        cardHeading={"Mass Update"}
        extended={true}
        childPadding={false}
      >
        <Formik
          initialValues={{}}
          validationSchema={getValidationSchema(fieldsList)}
          enableReinitialize
          onSubmit={(values) => {}}
        >
          {({ values, errors }) => (
            <div className={`w-full h-full overflow-scroll`}>
              {fieldsList && (
                <FormFieldList
                  fieldList={fieldsList}
                  editMode={false}
                  isSample={false}
                  appName={appName}
                  includeCardContainer={false}
                  rejectRequired={true}
                  addClear={true}
                  disabled={massUpdateProcess}
                  moduleName={modelName}
                  editData={{}}
                  countryCodeInUserPreference={countryCodeInUserPreference}
                  setDefaultCurrency={false}
                  setDefaultStageAndPipeline={false}
                  genericModels={genericModels}
                  allLayoutFetched={allLayoutFetched}
                  allModulesFetched={allModulesFetched}
                  disableAutoSelectOfSystemDefinedValues={true}
                />
              )}
              <div className="w-full flex justify-between px-8 pb-9">
                <div className="flex items-center">
                  <span className="inline-block w-5 mr-1">
                    <img src={"/info-icon.svg"} alt="Info icon" />
                  </span>
                  <p className="text-xs sm:text-sm">
                    Please note selecting &quot;(clear)&quot; will reset the
                    field to null.
                  </p>
                </div>
                <div className="w-20 sm:w-2/12">
                  <Button
                    id="open-card"
                    onClick={() => {
                      let pass = true;
                      const errorObj: any = { ...errors };
                      for (const key in errorObj) {
                        if (
                          typeof errorObj[key] === "string" &&
                          !errorObj[key].includes("required")
                        ) {
                          pass = false;
                        } else if (Object.keys(errorObj[key]).length) {
                          for (const keyInner in errorObj[key]) {
                            if (
                              typeof errorObj[keyInner] === "string" &&
                              !errorObj[keyInner].includes("required")
                            ) {
                              pass = false;
                            }
                          }
                        }
                      }
                      if (!pass) return;
                      const formValues: FormikValues = { ...values };
                      if (formValues["startedAt"] && !formValues["endedAt"]) {
                        toast.error(
                          `Please select ${
                            fieldsList.filter(
                              (val) => val.name === "endedAt"
                            )[0].label.en || "Ended At"
                          }`
                        );
                        return;
                      }
                      if (formValues["endedAt"]) {
                        if (!formValues["startedAt"]) {
                          toast.error(
                            `Please select ${
                              fieldsList.filter(
                                (val) => val.name === "startedAt"
                              )[0].label.en || "Started At"
                            }`
                          );
                          return;
                        }
                        if (
                          formValues["startedAt"] &&
                          formValues["endedAt"] &&
                          isAfter(
                            formValues["startedAt"],
                            formValues["endedAt"]
                          )
                        ) {
                          toast.error(
                            `${
                              fieldsList.filter(
                                (val) => val.name === "startedAt"
                              )[0].label.en || "Started At"
                            } cannot be greater than ${
                              fieldsList.filter(
                                (val) => val.name === "endedAt"
                              )[0].label.en || "Ended At"
                            }`
                          );
                          return;
                        }
                      }
                      for (const key in formValues) {
                        if (formValues[key] === "(clear)") {
                          formValues[key] = null;
                        }
                      }
                      handleMassUpdate(formValues);
                    }}
                    disabled={massUpdateProcess}
                    userEventName="massUpdate-save:submit-click"
                  >
                    <span>Update</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Formik>
      </GenericHeaderCardContainer>
    </>
  );
};
