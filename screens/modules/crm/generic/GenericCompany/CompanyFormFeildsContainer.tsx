import React from "react";
import { FormikValues, useFormikContext } from "formik";
import { setHeight } from "../../shared/utils/setHeight";
import { ICustomField } from "../../../../../models/ICustomField";
import { FormFieldPerDataType } from "../../shared/components/Form/FormFieldPerDataType";
import ItemsLoader from "../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import FormImagePicker from "../../../../../components/TailwindControls/Form/ImagePicker/FormImagePicker";
import GenericHeaderCardContainer from "../../../../../components/TailwindControls/Cards/GenericHeaderCardContainer";
import { MultipleEmailInputBox } from "../../../../../components/TailwindControls/Form/MultipleEmailInputBox/MultipleEmailInputBox";

export const CompanyFormFieldsContainer = ({
  companyDataSaving,
  fieldsListDict,
  modelName,
  instanceId,
  companyDataLoading,
  countryCodeInUserPreference,
}: {
  companyDataSaving: boolean;
  fieldsListDict: {
    details: ICustomField[];
    accessUrl: ICustomField[];
    localInformation: ICustomField[];
    instanceInformation: ICustomField[];
  };
  modelName: string;
  instanceId: string;
  companyDataLoading: boolean;
  countryCodeInUserPreference: string;
}) => {
  const { values, setFieldValue } = useFormikContext<FormikValues>();

  const heightRef = React.useRef(null);
  React.useEffect(() => {
    if (heightRef) {
      setHeight(heightRef, 20);
    }
  }, []);

  return (
    <div ref={heightRef} className="overflow-y-auto">
      <div className="px-6 pt-6">
        <GenericHeaderCardContainer cardHeading={"Details"} extended={true}>
          {companyDataLoading ? (
            <ItemsLoader currentView="List" loadingItemCount={3} />
          ) : (
            <>
              <div className="mt-5 grid pr-1 lg:pr-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4">
                {fieldsListDict &&
                  fieldsListDict.details.map((field, index) => {
                    return (
                      <div
                        key={`details-${index}`}
                        className={`${
                          field.dataType === "recordImage"
                            ? "sm:col-span-full"
                            : field.dataType === "json"
                            ? "sm:col-span-2"
                            : ""
                        }`}
                      >
                        {field.name === "logo" ? (
                          <FormImagePicker
                            required={false}
                            name={field.name}
                            label={"Company Logo (121px x 40px)"}
                            isSample={false}
                            modelName={modelName}
                            externalExpressionToCalculateValue={
                              field.expression
                            }
                            disabled={companyDataSaving}
                            containerWidth={"w-[121px]"}
                            containerHeight={"h-[40px]"}
                            isRounded={false}
                            showEditOption={false}
                            editPosition={"-right-[28px]"}
                            itemsCenter={true}
                          />
                        ) : (
                          <FormFieldPerDataType
                            field={field}
                            isSample={false}
                            setFieldValue={setFieldValue}
                            modelName={modelName}
                            editMode={true}
                            id={instanceId}
                            values={values}
                            countryCodeInUserPreference={
                              countryCodeInUserPreference
                            }
                            disabled={field.name == "name" || companyDataSaving}
                          />
                        )}
                      </div>
                    );
                  })}
                <MultipleEmailInputBox
                  name="instanceAdmins"
                  label="Instance Owner"
                  items={values.instanceAdmins || []}
                  handleAdd={() => {}}
                  handleDelete={() => {}}
                  disabled={true}
                  adminsError={""}
                />
              </div>
            </>
          )}
        </GenericHeaderCardContainer>

        <GenericHeaderCardContainer cardHeading={"Access URL"} extended={true}>
          {companyDataLoading ? (
            <ItemsLoader currentView="List" loadingItemCount={0} />
          ) : (
            <div className="mt-5 grid pr-1 lg:pr-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4">
              {fieldsListDict &&
                fieldsListDict.accessUrl.map((field, index) => {
                  return (
                    <FormFieldPerDataType
                      key={`accessUrl-${index}`}
                      field={field}
                      isSample={false}
                      setFieldValue={setFieldValue}
                      modelName={modelName}
                      editMode={true}
                      id={instanceId}
                      values={values}
                      countryCodeInUserPreference={countryCodeInUserPreference}
                      disabled={companyDataSaving}
                    />
                  );
                })}
            </div>
          )}
        </GenericHeaderCardContainer>

        <GenericHeaderCardContainer
          cardHeading={"Locale Information"}
          extended={true}
          marginBottom={"mb-0"}
        >
          {companyDataLoading ? (
            <ItemsLoader currentView="List" loadingItemCount={0} />
          ) : (
            <div className="mt-5 grid pr-1 lg:pr-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4">
              {fieldsListDict &&
                fieldsListDict.localInformation.map((field, index) => {
                  return (
                    <FormFieldPerDataType
                      key={`localInformation-${index}`}
                      field={field}
                      isSample={false}
                      setFieldValue={setFieldValue}
                      modelName={modelName}
                      editMode={true}
                      id={instanceId}
                      values={values}
                      disabled={companyDataSaving}
                      countryCodeInUserPreference={countryCodeInUserPreference}
                    />
                  );
                })}
            </div>
          )}
        </GenericHeaderCardContainer>

        <GenericHeaderCardContainer
          cardHeading={"Authorization"}
          extended={true}
          marginBottom={"mb-0"}
        >
          {companyDataLoading ? (
            <ItemsLoader currentView="List" loadingItemCount={0} />
          ) : (
            <div className="mt-5 grid pr-1 lg:pr-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4">
              {fieldsListDict &&
                fieldsListDict.instanceInformation.map((field, index) => {
                  return (
                    <FormFieldPerDataType
                      key={`authorization-${index}`}
                      field={field}
                      isSample={false}
                      setFieldValue={setFieldValue}
                      modelName={modelName}
                      editMode={true}
                      id={instanceId}
                      values={values}
                      disabled={companyDataSaving}
                      countryCodeInUserPreference={countryCodeInUserPreference}
                    />
                  );
                })}
            </div>
          )}
        </GenericHeaderCardContainer>
      </div>
    </div>
  );
};
