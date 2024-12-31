import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import { ICustomField } from "../../../../../../models/ICustomField";
import { SEARCH_MODULE_QUERY } from "../../../../../../graphql/queries/searchQuery";
import { FormikErrors, FormikValues } from "formik";
import { IGenericFormDetails } from "../../../generic/GenericModelDetails/IGenericFormDetails";

export function useModuleDataAutoMapping(
  appName: string,
  modelName: string,
  values: FormikValues,
  formFieldsList: ICustomField[],
  formDetails: IGenericFormDetails | undefined,
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void | FormikErrors<Record<string, string>>>
) {
  const [getModuleSearchResults] = useLazyQuery(SEARCH_MODULE_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "search",
      },
    },
  });

  const updateOrganization = (formFieldsList: ICustomField[]) => {
    if (values["organizationId"]) return;
    const isOrgVisible = formFieldsList?.find(
      (field) => field.name === "organizationId"
    );
    if (isOrgVisible)
      getModuleSearchResults({
        variables: {
          serviceName: appName,
          modelName: "contact",
          text: "",
          filters: [
            { fieldName: "id", value: values["contactId"], exact: true },
          ],
        },
      }).then((response) => {
        if (response?.data?.quest?.data) {
          const data = response?.data?.quest?.data;
          if (data?.[0]?.values.organization_id) {
            setFieldValue("organizationId", data?.[0]?.values.organization_id);
          }
        }
      });
  };

  useEffect(() => {
    if (formDetails || (!formDetails && modelName)) {
      const formModelName = formDetails?.modelName || modelName;
      if (formModelName === "deal" && values["contactId"]) {
        updateOrganization(formFieldsList);
      }
      if (
        ["quote", "salesOrder", "invoice", "purchaseOrder"].includes(
          formModelName
        )
      ) {
        if (values["contactId"] && !values["dealId"]) {
          updateOrganization(formFieldsList);
        }
      }
    }
  }, [values?.["contactId"]]);

  useEffect(() => {
    const formModelName = formDetails?.modelName || modelName;
    if (
      values["dealId"] &&
      ["quote", "salesOrder", "invoice", "purchaseOrder"].includes(
        formModelName
      )
    ) {
      if (values["contactId"] && values["organizationId"]) return;
      const isContactVisible = formFieldsList?.find(
        (field) => field.name === "contactId"
      );
      const isOrgVisible = formFieldsList?.find(
        (field) => field.name === "organizationId"
      );
      if (isContactVisible || isOrgVisible)
        getModuleSearchResults({
          variables: {
            serviceName: appName,
            modelName: "deal",
            text: "",
            filters: [
              { fieldName: "id", value: values["dealId"], exact: true },
            ],
          },
        }).then((response) => {
          if (response?.data?.quest?.data) {
            const data = response?.data?.quest?.data;
            if (
              isContactVisible &&
              data?.[0]?.values.contact_id &&
              !values["contactId"]
            ) {
              setFieldValue("contactId", data?.[0]?.values.contact_id);
            }
            if (
              isOrgVisible &&
              data?.[0]?.values.organization_id &&
              !values["organizationId"]
            ) {
              setFieldValue(
                "organizationId",
                data?.[0]?.values.organization_id
              );
            }
          }
        });
    }
  }, [values["dealId"]]);
}
