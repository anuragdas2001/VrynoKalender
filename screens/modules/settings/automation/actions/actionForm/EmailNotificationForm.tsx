import React from "react";
import FormDropdown from "../../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import FormMultipleValuesDropdown from "../../../../../../components/TailwindControls/Form/MultipleValuesDropdown/FormMultipleValuesDropdown";
import { useFormikContext } from "formik";
import { useLazyQuery } from "@apollo/client";
import {
  FetchData,
  FetchVars,
  FETCH_QUERY,
} from "../../../../../../graphql/queries/fetchQuery";
import { ICustomField } from "../../../../../../models/ICustomField";
import { getSortedFieldList } from "../../../../crm/shared/utils/getOrderedFieldsList";
import FormSearchBox from "../../../../../../components/TailwindControls/Form/SearchBox/FormSearchBox";
import { MultipleEmailInputBox } from "../../../../../../components/TailwindControls/Form/MultipleEmailInputBox/MultipleEmailInputBox";
import { AccountModels } from "../../../../../../models/Accounts";
import { IEmailTemplate } from "../../../../../../models/shared";
import { camelCase } from "change-case";
import { useRouter } from "next/router";
import { EmailNotificationFormProps } from "./ActionFormFields";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";

export const EmailNotificationForm = ({
  editMode,
  appName,
  modules,
  handleExternalEmailsAdd,
  externalUserEmailsError,
  externalUserEmails,
  genericModels,
  allLayoutFetched,
}: EmailNotificationFormProps) => {
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();
  const [emailTemplates, setEmailTemplates] = React.useState<IEmailTemplate[]>(
    []
  );
  const [fieldsList, setFieldsList] = React.useState<{
    loading: boolean;
    data: ICustomField[];
  }>({ loading: true, data: [] });
  const router = useRouter();
  const [emailTemplateFetch] = useLazyQuery<
    FetchData<IEmailTemplate>,
    FetchVars
  >(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "notify",
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.data?.length) {
        setEmailTemplates(responseOnCompletion.fetch.data);
      }
    },
  });

  React.useEffect(() => {
    if (!editMode || !values["moduleName"]) return;
    emailTemplateFetch({
      variables: {
        modelName: "emailTemplate",
        fields: [
          "id",
          "name",
          "subject",
          "templateServiceName",
          "templateModuleName",
          "fileKey",
          "createdAt",
          "createdBy",
          "updatedAt",
          "updatedBy",
        ],
        filters: [
          {
            name: "templateModuleName",
            operator: "eq",
            value: [camelCase(values["moduleName"])],
          },
          {
            operator: "is_empty",
            name: "templateType",
            value: ["${empty}"],
          },
        ],
      },
    });
  }, [editMode, values["moduleName"]]);

  React.useEffect(() => {
    if (!editMode || !values["moduleName"] || !allLayoutFetched) return;
    let fieldsListFromStore = genericModels[values["moduleName"]]?.fieldsList;
    setFieldsList({
      loading: false,
      data: getSortedFieldList(
        fieldsListFromStore?.length > 0 ? fieldsListFromStore : []
      ),
    });
  }, [editMode, values["moduleName"], allLayoutFetched]);

  const emailFieldsList = fieldsList?.data
    ?.filter(
      (field) =>
        field.dataType === "email" ||
        (field.dataType === "recordLookup" &&
          field?.dataTypeMetadata?.allLookups &&
          field?.dataTypeMetadata?.allLookups.length > 0 &&
          field?.dataTypeMetadata?.allLookups[0]?.moduleName.split(".")[0] ===
            "accounts" &&
          field?.dataTypeMetadata?.allLookups[0]?.moduleName.split(".")[1] ===
            "user")
    )
    ?.map((field) => {
      return { value: field.name, label: field.label.en };
    });

  return (
    <>
      <FormDropdown
        required={true}
        name={`moduleName`}
        label={`Select Module`}
        options={modules?.map((module) => {
          return { label: module.label.en, value: module.name };
        })}
        disabled={editMode || values["fields"]?.length > 0}
        onChange={(selectedOption) => {
          setFieldValue("moduleName", selectedOption.currentTarget.value);
          setFieldsList({ loading: true, data: [] });
          setFieldValue("fields", null);
          setFieldValue("templateId", null);
          emailTemplateFetch({
            variables: {
              modelName: "emailTemplate",
              fields: [
                "id",
                "name",
                "subject",
                "templateServiceName",
                "templateModuleName",
                "fileKey",
                "createdAt",
                "createdBy",
                "updatedAt",
                "updatedBy",
              ],
              filters: [
                {
                  name: "templateModuleName",
                  operator: "eq",
                  value: [camelCase(selectedOption.currentTarget.value)],
                },
                {
                  operator: "is_empty",
                  name: "templateType",
                  value: ["${empty}"],
                },
              ],
            },
          });
          if (!allLayoutFetched) return;
          let fieldsListFromStore =
            genericModels[selectedOption.currentTarget.value]?.fieldsList;
          setFieldsList({
            loading: false,
            data: getSortedFieldList(
              fieldsListFromStore?.length > 0 ? fieldsListFromStore : []
            ),
          });
        }}
      />
      {values["moduleName"] &&
      emailTemplates?.filter(
        (template) =>
          camelCase(template.templateModuleName) ===
          camelCase(values["moduleName"])
      ).length === 0 ? (
        <div className="w-full col-span-full text-xsm flex items-center justify-center p-2 bg-gray-100">
          <span>
            {`You have no email templates for ${
              modules?.filter(
                (module) => module.name === values["moduleName"]
              )[0]?.label?.en
            }.`}
            <Button
              id="add-template"
              customStyle="px-2 text-vryno-theme-light-blue"
              onClick={() =>
                router.push(`${appName}/templates/email-template/add`)
              }
              userEventName="open-add-template-from-email-notification-click"
            >
              <p className="text-sl">Add Template</p>
            </Button>
          </span>
        </div>
      ) : (
        values["moduleName"] && (
          <>
            <FormDropdown
              required={true}
              name="templateId"
              label={"Select Template"}
              options={emailTemplates
                ?.filter(
                  (template) =>
                    camelCase(template.templateModuleName) ===
                    camelCase(values["moduleName"])
                )
                ?.map((template) => {
                  return {
                    label: template.name,
                    value: template.id,
                  };
                })}
              disabled={
                emailTemplates?.filter(
                  (template) =>
                    camelCase(template.templateModuleName) ===
                    camelCase(values["moduleName"])
                ).length === 0
              }
              onChange={(selectedOption) => {
                setFieldValue("templateId", selectedOption.currentTarget.value);
              }}
            />
            <div className="col-span-2">
              <FormMultipleValuesDropdown
                name="fields"
                label={"Select Fields"}
                editMode={editMode}
                options={emailFieldsList}
                disabled={emailFieldsList.length === 0}
              />
              <FormSearchBox
                name={"emailRecievingUsers"}
                label={"Add System User's"}
                appName={"accounts"}
                modelName={AccountModels.User}
                searchBy={["first_name", "last_name"]}
                fieldDisplayExpression={["first_name", "last_name"]}
                editMode={editMode}
                multiple={true}
                placeholder={`Please enter here to search`}
              />
              <MultipleEmailInputBox
                name="externalUsers"
                label={"External Emails"}
                items={externalUserEmails}
                handleAdd={handleExternalEmailsAdd}
                handleDelete={handleExternalEmailsAdd}
                disabled={false}
                adminsError={externalUserEmailsError}
              />
            </div>
          </>
        )
      )}
    </>
  );
};
