import { FormikValues } from "formik";
import React, { useContext } from "react";
import { AppModels } from "../../../../../models/AppModels";
import { useLazyQuery, useMutation } from "@apollo/client";
import { SAVE_MUTATION } from "../../../../../graphql/mutations/saveMutation";
import { SupportedApps } from "../../../../../models/shared";
import { useAppFetchQuery } from "../../shared/utils/useAppFetchQuery";
import { FETCH_QUERY } from "../../../../../graphql/queries/fetchQuery";
import {
  INSTANCE_DETAIL_BY_SUBDOMAIN_QUERY,
  InstanceSubdomainData,
} from "../../../../../graphql/queries/instances";
import { ILayout } from "../../../../../models/ILayout";
import { IInstance } from "../../../../../models/Accounts";
import { ICustomField } from "../../../../../models/ICustomField";
import { getSortedFieldList } from "../../shared/utils/getOrderedFieldsList";
import { toast } from "react-toastify";
import { GeneralStoreContext } from "../../../../../stores/RootStore/GeneralStore/GeneralStore";
import { getCountryCodeFromPreference } from "../../shared/components/Form/FormFields/FormFieldPhoneNumber";
import { ICompanyDetailsData, companyFields } from "./companyHelper";
import { ConnectedCompany } from "./ConnectedCompany";
import { observer } from "mobx-react-lite";

export const CompanyScreen = observer(
  ({ instanceId, modelName }: { instanceId: string; modelName: string }) => {
    const { generalModelStore } = useContext(GeneralStoreContext);
    const { userPreferences } = generalModelStore;
    const [companyDetailsData, setCompanyDetailsData] =
      React.useState<ICompanyDetailsData | null>(null);
    const [instanceData, setInstanceData] = React.useState<IInstance | null>(
      null
    );
    const [fieldsListDict, setFieldsListDict] = React.useState<{
      details: ICustomField[];
      accessUrl: ICustomField[];
      localInformation: ICustomField[];
      instanceInformation: ICustomField[];
    }>({
      details: [],
      accessUrl: [],
      localInformation: [],
      instanceInformation: [],
    });

    const [countryCodeInUserPreference, setCountryCodeInUserPreference] =
      React.useState<string>(
        userPreferences ? getCountryCodeFromPreference(userPreferences) : ""
      );
    const [layoutLoading, setLayoutLoading] = React.useState(true);
    const [companyDataLoading, setCompanyDataLoading] = React.useState(true);
    const [companyDataSaving, setCompanyDataSaving] = React.useState(false);

    useAppFetchQuery<ILayout>({
      appPath: SupportedApps.accounts,
      variables: {
        modelName: "Layout",
        fields: ["id", "name", "moduleName", "layout", "config", "type"],
        filters: [
          {
            name: "moduleName",
            operator: "eq",
            value: [AppModels.Instance],
          },
        ],
      },
      onDataRecd: (data) => {
        if (data?.length) {
          const instanceFields = data[0].config.fields.find(
            (field) => field.name === "mfaEnabled"
          );
          if (instanceFields) {
            setFieldsListDict((fieldsListDict) => ({
              ...fieldsListDict,
              instanceInformation: getSortedFieldList([instanceFields]),
            }));
          }
        }
      },
    });

    useAppFetchQuery<ILayout>({
      appPath: SupportedApps.accounts,
      variables: {
        modelName: "Layout",
        fields: ["id", "name", "moduleName", "layout", "config", "type"],
        filters: [
          {
            name: "moduleName",
            operator: "eq",
            value: [modelName],
          },
        ],
      },
      onDataRecd: (data) => {
        if (data?.length) {
          const fieldsList = data[0].config.fields.filter(
            (field) =>
              ![
                "id",
                "createdBy",
                "createdAt",
                "recordStatus",
                "updatedBy",
                "updatedAt",
                "branding",
                "timezone",
              ].includes(field.name)
          );
          const details: ICustomField[] = [],
            accessUrl: ICustomField[] = [],
            localeInfo: ICustomField[] = [];
          for (const field of fieldsList) {
            if (field.name === "website") {
              accessUrl.push(field);
            } else if (["currency"].includes(field.name)) {
              localeInfo.push(field);
            } else {
              details.push(field);
            }
          }

          setFieldsListDict((fieldsListDict) => ({
            ...fieldsListDict,
            details: getSortedFieldList(details),
            accessUrl: getSortedFieldList(accessUrl),
            localInformation: getSortedFieldList(localeInfo),
          }));
          setLayoutLoading(false);
        }
      },
    });

    const [getInstanceViaSubdomain] = useLazyQuery<InstanceSubdomainData>(
      INSTANCE_DETAIL_BY_SUBDOMAIN_QUERY,
      {
        fetchPolicy: "cache-first",
        nextFetchPolicy: "standby",
        context: {
          headers: {
            vrynopath: SupportedApps.accounts,
          },
        },
        onCompleted: (responseOnCompletion) => {
          if (responseOnCompletion) {
            if (
              responseOnCompletion?.getSubdomainInstance?.messageKey?.includes(
                "success"
              ) &&
              responseOnCompletion?.getSubdomainInstance?.data
            ) {
              const instance = responseOnCompletion?.getSubdomainInstance?.data;
              setInstanceData(instance);
              if (!instance?.companyId) {
                setCompanyDetailsData({
                  id: null,
                  name: instance.name,
                  description: instance.description,
                  instanceAdmins: instance?.instanceAdmins || [],
                });
                setCompanyDataLoading(false);
              }
            } else {
              toast.error("CompanyScreen: No instance found");
              setCompanyDataLoading(false);
            }
          }
        },
      }
    );

    const [getCompanyDetails] = useLazyQuery(FETCH_QUERY, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: SupportedApps.accounts,
        },
      },
    });

    const [saveCompanyDetails] = useMutation(SAVE_MUTATION, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: SupportedApps.accounts,
        },
      },
    });

    const [saveMfaDetails] = useMutation(SAVE_MUTATION, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: SupportedApps.accounts,
        },
      },
    });

    const handleCompanySave = (values: FormikValues) => {
      setCompanyDataSaving(true);
      let updatedValues = {};
      for (const key in values) {
        if (key !== "id" && key !== "instanceAdmins" && key !== "mfaEnabled") {
          updatedValues = { ...updatedValues, [key]: values[key] };
        }
      }

      if (instanceData?.id) {
        saveMfaDetails({
          variables: {
            id: instanceData?.id,
            modelName: AppModels.Instance,
            saveInput: {
              mfaEnabled: values.mfaEnabled,
            },
          },
        }).then((response) => {
          if (response?.data?.save?.messageKey?.includes("-success")) {
            setInstanceData({ ...instanceData, ...response?.data?.save?.data });
          } else {
            toast.error(response?.data?.save?.message);
          }
          setCompanyDataSaving(false);
        });
      }

      saveCompanyDetails({
        variables: {
          id: values.id,
          modelName: modelName,
          saveInput: {
            ...updatedValues,
            phoneNumber: values?.phoneNumber?.includes("undefined")
              ? null
              : values?.phoneNumber,
            mobileNumber: values?.mobileNumber?.includes("undefined")
              ? null
              : values?.mobileNumber,
          },
        },
      }).then((response) => {
        if (response?.data?.save?.messageKey?.includes("-success")) {
          let updatedData = {};
          for (const key in response?.data?.save?.data) {
            if (
              ![
                "createdBy",
                "createdAt",
                "recordStatus",
                "updatedBy",
                "updatedAt",
                "isSample",
                "branding",
                "shippingAddress",
                "shippingCity",
                "shippingState",
                "shippingCountry",
                "shippingZipcode",
              ].includes(key)
            ) {
              updatedData = {
                ...updatedData,
                [key]: response?.data?.save?.data[key],
              };
            }
          }
          setCompanyDetailsData({
            ...updatedData,
            id: values.id,
            instanceAdmins: instanceData?.instanceAdmins || [],
          });
          toast.success(
            response?.data?.save?.message.replace("updation", "updated")
          );
        } else {
          toast.error(response?.data?.save?.message);
        }
        setCompanyDataSaving(false);
      });
    };

    React.useEffect(() => {
      getInstanceViaSubdomain({
        variables: { subdomain: window.location.hostname.split(".")[0] },
      });
    }, []);

    React.useEffect(() => {
      setCountryCodeInUserPreference(
        getCountryCodeFromPreference(userPreferences)
      );
    }, [userPreferences]);

    React.useEffect(() => {
      if (instanceData?.companyId) {
        getCompanyDetails({
          variables: {
            modelName: modelName,
            fields: companyFields,
            filters: [
              {
                name: "id",
                operator: "eq",
                value: instanceData.companyId,
              },
            ],
          },
        }).then((response) => {
          if (
            response?.data?.fetch?.messageKey.includes("-success") &&
            response?.data?.fetch?.data
          ) {
            setCompanyDetailsData({
              ...response?.data?.fetch?.data[0],
              phoneNumber: response?.data?.fetch?.data[0]?.phoneNumber
                ? String(response?.data?.fetch?.data[0]?.phoneNumber)
                : String(""),
              mobileNumber: response?.data?.fetch?.data[0]?.mobileNumber
                ? String(response?.data?.fetch?.data[0]?.mobileNumber)
                : String(""),
              instanceAdmins: instanceData?.instanceAdmins || [],
            });
          }
          setCompanyDataLoading(false);
        });
      }
    }, [instanceData]);

    return (
      <ConnectedCompany
        layoutLoading={layoutLoading}
        companyDetailsData={companyDetailsData}
        fieldsListDict={fieldsListDict}
        handleCompanySave={handleCompanySave}
        companyDataSaving={companyDataSaving}
        companyDataLoading={companyDataLoading}
        modelName={modelName}
        instanceId={instanceId}
        countryCodeInUserPreference={countryCodeInUserPreference}
        instanceData={instanceData}
      />
    );
  }
);
