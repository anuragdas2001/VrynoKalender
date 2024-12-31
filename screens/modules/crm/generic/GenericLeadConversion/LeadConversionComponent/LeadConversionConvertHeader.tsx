import router from "next/router";
import GenericBackHeader from "../../../shared/components/GenericBackHeader";
import { appsUrlGenerator } from "../../../shared/utils/appsUrlGenerator";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import { cookieUserStore } from "../../../../../../shared/CookieUserStore";
import { AllowedViews } from "../../../../../../models/allowedViews";
import { FormikValues, useFormikContext } from "formik";
import { useTranslation } from "next-i18next";
import { ICustomField } from "../../../../../../models/ICustomField";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import {
  ILeadContactOrganization,
  ILeadDeal,
} from "../utils/genericLeadConversionInterfaces";

const initialConversionValues = {
  "deal-name": "",
  "deal-currency": "",
  "deal-amount": "",
  "deal-dealPipelineId": "",
  "deal-dealStageId": "",
};

export const LeadConversionConvertHeader = ({
  navLeadName,
  appName,
  modelName,
  activePipeline,
  resetValues,
  handleResetValues,
  formReset,
  setFormReset,
  leadContactOrganizationState,
  contactFieldList,
  dealFieldList,
  companyAvailable,
  organizationFieldList,
  leadDeal,
  handleFormSave,
}: {
  navLeadName: string;
  appName: string;
  modelName: string;
  activePipeline: IModuleMetadata | null;
  resetValues: {
    contact: ILeadContactOrganization;
    organization: ILeadContactOrganization;
  };
  handleResetValues: () => void;
  formReset: boolean;
  setFormReset: React.Dispatch<React.SetStateAction<boolean>>;
  leadContactOrganizationState: {
    contact: ILeadContactOrganization;
    organization: ILeadContactOrganization;
  };
  contactFieldList: ICustomField[];
  dealFieldList: ICustomField[];
  companyAvailable: boolean | null;
  organizationFieldList: ICustomField[];
  leadDeal: ILeadDeal;
  handleFormSave: (values: FormikValues) => void;
}) => {
  const { t } = useTranslation(["common"]);
  const { values, resetForm, setFieldTouched } =
    useFormikContext<FormikValues>();

  return (
    <GenericBackHeader
      heading={`${navLeadName} Conversion Mapping`}
      onClick={() => {
        router?.replace(
          appsUrlGenerator(appName, modelName, AllowedViews.view)
        );
      }}
      addButtonInFlexCol={true}
    >
      <div className="flex gap-x-6 justify-between mt-2 sm:mt-0">
        <Button
          id="cancel-form"
          kind="back"
          onClick={() => {
            let resetFormValues: FormikValues = {
              ...initialConversionValues,
              ownerId: cookieUserStore.getUserId() || null,
              "deal-dealPipelineId": activePipeline ? activePipeline.id : "",
              "deal-dealStageId": activePipeline?.stages?.length
                ? activePipeline.stages[0]
                : "",
            };
            if (values["add-create-contact"])
              resetFormValues = {
                ...resetFormValues,
                ["add-create-contact"]: resetValues.contact.available
                  ? "add-contact"
                  : values["add-create-contact"],
              };
            if (values["add-create-organization"])
              resetFormValues = {
                ...resetFormValues,
                ["add-create-organization"]: resetValues.organization.available
                  ? "add-organization"
                  : values["add-create-organization"],
              };
            handleResetValues();
            resetForm({
              values: {
                ...resetFormValues,
              },
            });
            setFormReset(!formReset);
          }}
          buttonType="thin"
          userEventName="leadConversion-convert-form:reset-click"
        >
          {t("Reset")}
        </Button>
        <Button
          id="save-form"
          kind="primary"
          onClick={async () => {
            // @ts-ignore - setFieldTouched return void but in actual it isn't so, as it returns a promise
            let validation = [];
            let passCount = 0;
            let fieldsArray = leadContactOrganizationState.contact.createNew
              ? [
                  ...contactFieldList,
                  dealFieldList.filter((field) => field.name === "ownerId")[0],
                ]
              : [dealFieldList.filter((field) => field.name === "ownerId")[0]];
            if (
              companyAvailable &&
              leadContactOrganizationState.organization.createNew
            )
              fieldsArray = [...fieldsArray, ...organizationFieldList];
            if (leadDeal.checked) {
              fieldsArray = [...fieldsArray, ...dealFieldList];
            }
            fieldsArray.forEach((field) => {
              validation[0] = setFieldTouched(field.name, true, true);
            });
            //@ts-ignore
            await Promise.all(validation).then((response) => {
              for (const key in response[0]) {
                if (
                  key === "ownerId" ||
                  (key.includes("contact-") &&
                    !leadContactOrganizationState.contact.selectedId) ||
                  (key.includes("organization-") &&
                    !leadContactOrganizationState.organization.selectedId) ||
                  (key.includes("deal-") && leadDeal.checked)
                ) {
                  passCount++;
                }
              }
            });
            if (passCount === 0) handleFormSave(values);
          }}
          buttonType="thin"
          disabled={
            !leadContactOrganizationState.contact.checked ||
            (!leadContactOrganizationState.organization.checked &&
              companyAvailable === true)
          }
          userEventName="leadConversion-convert-form:submit-click"
        >
          {t("Convert")}
        </Button>
      </div>
    </GenericBackHeader>
  );
};
