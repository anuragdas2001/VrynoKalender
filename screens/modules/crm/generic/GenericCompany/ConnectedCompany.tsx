import { CompanyFormFieldsContainer } from "./CompanyFormFeildsContainer";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import SaveIcon from "remixicon-react/SaveLineIcon";
import GenericBackHeader from "../../shared/components/GenericBackHeader";
import { PageLoader } from "../../../../../components/TailwindControls/ContentLoader/Shared/PageLoader";
import getValidationSchema from "../../shared/utils/validations/getValidationSchema";
import { Formik, FormikValues } from "formik";
import {
  ICompanyDetailsData,
  companyFieldsInitialValues,
} from "./companyHelper";
import { ICustomField } from "../../../../../models/ICustomField";
import { IInstance } from "../../../../../models/Accounts";

export const ConnectedCompany = ({
  layoutLoading,
  companyDetailsData,
  fieldsListDict,
  handleCompanySave,
  companyDataSaving,
  companyDataLoading,
  modelName,
  instanceId,
  countryCodeInUserPreference,
  instanceData,
}: {
  layoutLoading: boolean;
  companyDetailsData: ICompanyDetailsData | null;
  fieldsListDict: {
    details: ICustomField[];
    accessUrl: ICustomField[];
    localInformation: ICustomField[];
    instanceInformation: ICustomField[];
  };
  handleCompanySave: (values: FormikValues) => void;
  companyDataSaving: boolean;
  companyDataLoading: boolean;
  modelName: string;
  instanceId: string;
  countryCodeInUserPreference: string;
  instanceData: IInstance | null;
}) => {
  return layoutLoading || companyDataLoading ? (
    <div className="flex items-center justify-center h-screen text-xl">
      <PageLoader />
    </div>
  ) : (
    <div>
      <Formik
        initialValues={{
          ...companyFieldsInitialValues,
          ...{
            id: companyDetailsData?.id,
            name: companyDetailsData?.name,
            instanceAdmins: companyDetailsData?.instanceAdmins,
            phoneNumber: companyDetailsData?.phoneNumber
              ? String(companyDetailsData?.phoneNumber)
              : companyDetailsData?.phoneNumber === undefined
              ? null
              : companyDetailsData?.phoneNumber,
            billingAddress: companyDetailsData?.billingAddress,
            billingCity: companyDetailsData?.billingCity,
            billingState: companyDetailsData?.billingState,
            billingCountry: companyDetailsData?.billingCountry,
            billingZipcode: companyDetailsData?.billingZipcode,
            logo: companyDetailsData?.logo,
            country: companyDetailsData?.country,
            email: companyDetailsData?.email,
            fax: companyDetailsData?.fax,
            mobileNumber: companyDetailsData?.mobileNumber
              ? String(companyDetailsData?.mobileNumber)
              : companyDetailsData?.mobileNumber === undefined
              ? null
              : companyDetailsData?.mobileNumber,
            employeeCount: companyDetailsData?.employeeCount,
            website: companyDetailsData?.website,
            branding: companyDetailsData?.branding,
            description: companyDetailsData?.description,
            currency: companyDetailsData?.currency,
            mfaEnabled: instanceData?.mfaEnabled,
          },
        }}
        onSubmit={(values) => handleCompanySave(values)}
        validationSchema={getValidationSchema(
          [
            ...(fieldsListDict?.accessUrl || []),
            ...(fieldsListDict?.details || []),
            ...(fieldsListDict?.localInformation || []),
            ...(fieldsListDict?.instanceInformation || []),
          ]?.filter((field) => field.visible)
        )}
        enableReinitialize
      >
        {({ handleSubmit }) => (
          <>
            <GenericBackHeader
              heading="Company Details"
              headerTopCss={""}
              keepSpaceBelow={false}
            >
              <div>
                <Button
                  id="save-company-details"
                  buttonType="thin"
                  kind="primary"
                  loading={companyDataSaving}
                  disabled={companyDataSaving || companyDataLoading}
                  onClick={() => handleSubmit()}
                  userEventName="companyDetails-save:submit-click"
                >
                  <div className="flex gap-x-1">
                    <SaveIcon size={18} />
                    <p>Save</p>
                  </div>
                </Button>
              </div>
            </GenericBackHeader>
            <CompanyFormFieldsContainer
              companyDataSaving={companyDataSaving}
              fieldsListDict={fieldsListDict}
              modelName={modelName}
              instanceId={instanceId}
              companyDataLoading={companyDataLoading}
              countryCodeInUserPreference={countryCodeInUserPreference}
            />
          </>
        )}
      </Formik>
    </div>
  );
};
