import React, { useContext } from "react";
import { IModuleMetadata } from "../../../../../../../models/IModuleMetadata";
import { getAppPathParts } from "../../../../../crm/shared/utils/getAppPathParts";
import { useCrmFetchQuery } from "../../../../../crm/shared/utils/operations";
import { ConnectedLeadConversionMapping } from "./ConnectedLeadConversionMapping";
import { observer } from "mobx-react-lite";
import { GeneralStoreContext } from "../../../../../../../stores/RootStore/GeneralStore/GeneralStore";

export interface IMappingLabels {
  contact: string;
  organization: string;
  lead: string;
  deal: string;
}

export type LeadConversionDataType = Record<
  string,
  {
    id: string | null;
    organization: string | null;
    organizationUniqueName: string | null;
    contact: string | null;
    contactUniqueName: string | null;
    deal: string | null;
    dealUniqueName: string | null;
  }
>;

export const LeadConversionMappingScreen = observer(() => {
  const { appName } = getAppPathParts();
  const { generalModelStore } = useContext(GeneralStoreContext);
  const { genericModels, allModulesFetched } = generalModelStore;
  const [leadConversionData, setLeadConversionData] =
    React.useState<LeadConversionDataType>({});

  const [rootPermissionData, setRootPermissionData] = React.useState<
    Record<string, string | null>[]
  >([]);

  const [moduleLoading, setModuleLoading] = React.useState(true);
  const [labelData, setLabelData] = React.useState<IMappingLabels>({
    contact: "Contact",
    organization: "Organization",
    lead: "Lead",
    deal: "Deal",
  });

  React.useEffect(() => {
    if (allModulesFetched) {
      let nameObject: IMappingLabels = {
        contact: "",
        organization: "",
        lead: "",
        deal: "",
      };
      let moduleInfoFromStore: IModuleMetadata[] = [
        ...Object.keys(genericModels)
          ?.map((model) => {
            if (genericModels[model]?.moduleInfo?.customizationAllowed === true)
              return genericModels[model]?.moduleInfo;
          })
          ?.filter((model) => model !== undefined),
      ];
      moduleInfoFromStore?.forEach((module) => {
        if (module.uniqueName === "crm.contact") {
          nameObject = { ...nameObject, contact: module.label.en };
        }
        if (module.uniqueName === "crm.organization") {
          nameObject = { ...nameObject, organization: module.label.en };
        }
        if (module.uniqueName === "crm.deal") {
          nameObject = { ...nameObject, deal: module.label.en };
        }
        if (module.uniqueName === "crm.lead") {
          nameObject = { ...nameObject, lead: module.label.en };
        }
      });
      setLabelData(nameObject);
      setModuleLoading(false);
    }
  }, [allModulesFetched]);

  useCrmFetchQuery<Record<string, string | null>>({
    variables: {
      modelName: "LeadConversionMapping",
      fields: [
        "name",
        "label",
        "uniqueKey",
        "sourceLeadFieldUniqueName",
        "destinationContactFieldUniqueName",
        "destinationOrganizationFieldUniqueName",
        "destinationDealFieldUniqueName",
      ],
      filters: [],
    },
    onDataRecd: (data) => {
      if (data) {
        setRootPermissionData(data);
        const resultDict: LeadConversionDataType = {};
        for (const val of data) {
          const name = val.sourceLeadFieldUniqueName?.split(".").pop() || "";
          resultDict[name] = {
            id: val.id,
            organization:
              (val.destinationOrganizationFieldUniqueName &&
                val.destinationOrganizationFieldUniqueName?.split(".").pop()) ||
              null,
            organizationUniqueName: val.destinationOrganizationFieldUniqueName,
            contact:
              (val.destinationContactFieldUniqueName &&
                val.destinationContactFieldUniqueName?.split(".").pop()) ||
              null,
            contactUniqueName: val.destinationContactFieldUniqueName,
            deal:
              (val.destinationDealFieldUniqueName &&
                val.destinationDealFieldUniqueName?.split(".").pop()) ||
              null,
            dealUniqueName: val.destinationDealFieldUniqueName,
          };
        }
        setLeadConversionData(resultDict);
      }
    },
  });

  return (
    <ConnectedLeadConversionMapping
      leadConversionData={leadConversionData}
      labelData={labelData}
      appName={appName}
      rootPermissionData={rootPermissionData}
      setLeadConversionData={(value: LeadConversionDataType) =>
        setLeadConversionData(value)
      }
      setRootPermissionData={(value: Record<string, string | null>[]) =>
        setRootPermissionData(value)
      }
      moduleLoading={moduleLoading}
    />
  );
});
