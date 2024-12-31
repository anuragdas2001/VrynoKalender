import router from "next/router";
import React, { useContext } from "react";
import { AllowedViews } from "../../../../../models/allowedViews";
import { LeadConversionAllowedValues } from "../../../../../shared/constants";
import GenericBackHeader from "../../shared/components/GenericBackHeader";
import { appsUrlGenerator } from "../../shared/utils/appsUrlGenerator";
import { getAppPathParts } from "../../shared/utils/getAppPathParts";
import ItemsLoader from "../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import { observer } from "mobx-react-lite";
import { GeneralStoreContext } from "../../../../../stores/RootStore/GeneralStore/GeneralStore";

const labelStyle = "font-semibold text-vryno-theme-light-blue cursor-pointer";

export const GenericLeadConvertedScreen = observer(() => {
  const { generalModelStore } = useContext(GeneralStoreContext);
  const { genericModels, allModulesFetched } = generalModelStore;
  const { appName, modelName, id } = getAppPathParts();
  const [contactName, setContactName] = React.useState("");
  const [companyName, setCompanyName] = React.useState("");
  const [dealName, setDealName] = React.useState("");
  const [data, setData] = React.useState([]);
  const [convertedLeadId, setConvertedLeadId] = React.useState("");
  const [navContactName, setNavContactName] = React.useState("Contact");
  const [navOrganizationName, setNavOrganizationName] =
    React.useState("Organization");
  const [navDealName, setNavDealName] = React.useState("Deal");
  const [navLeadName, setNavLeadName] = React.useState("Lead");
  const [moduleLoading, setModuleLoading] = React.useState(true);

  React.useEffect(() => {
    if (allModulesFetched) {
      Object.keys(genericModels)?.forEach((module) => {
        let moduleDataFromStore = genericModels[module]?.moduleInfo;
        if (moduleDataFromStore?.uniqueName === "crm.contact") {
          setNavContactName(moduleDataFromStore?.label.en);
        }
        if (moduleDataFromStore?.uniqueName === "crm.organization") {
          setNavOrganizationName(moduleDataFromStore?.label.en);
        }
        if (moduleDataFromStore?.uniqueName === "crm.deal") {
          setNavDealName(moduleDataFromStore?.label.en);
        }
        if (moduleDataFromStore?.uniqueName === "crm.lead") {
          setNavLeadName(moduleDataFromStore?.label.en);
        }
      });
      setModuleLoading(false);
    }
  }, [allModulesFetched]);

  React.useEffect(() => {
    const leadData = JSON.parse(
      window.localStorage.getItem("convertedLead") || "{}"
    );
    if (Object.keys(leadData).length) {
      setContactName(leadData.contactName);
      setCompanyName(leadData.companyName);
      setDealName(leadData.dealName);
      setData(leadData.data);
      setConvertedLeadId(leadData.id);
    }
  }, []);

  return !moduleLoading ? (
    <>
      <GenericBackHeader
        heading={`${navLeadName} Conversion Mapping`}
        onClick={() => {
          router?.replace(
            appsUrlGenerator(appName, modelName, AllowedViews.view)
          );
        }}
      />
      <div className="p-6 text-sm">
        <div className="bg-white p-6 rounded-xl">
          {convertedLeadId !== id ? (
            <p className="text-vryno-danger font-bold pb-3">
              Last Converted {navLeadName}
            </p>
          ) : (
            <></>
          )}
          <div>
            <p>
              The {navLeadName}{" "}
              <span className="font-semibold text-gray-500">
                {`"${contactName}"`}
              </span>{" "}
              has been successfully converted.
            </p>
          </div>

          <div className="mt-7 font-semibold">
            <p>Conversion Details</p>
          </div>
          <div className="bg-vryno-table-background mt-3 p-6 rounded-lg sm:w-1/2">
            {data.map(
              (
                val: {
                  organizationId: string;
                  contactId: string;
                  dealId: string;
                },
                index: number
              ) => {
                return (
                  <div key={index}>
                    {val.organizationId ? (
                      <div className="grid grid-cols-2 border-b pb-3 mb-3">
                        <div>{navOrganizationName}</div>
                        <a
                          className={`${labelStyle}`}
                          onClick={() => {
                            window.open(
                              `${appsUrlGenerator(
                                appName,
                                LeadConversionAllowedValues.organization,
                                AllowedViews.detail,
                                val.organizationId
                              )}`,
                              "_blank"
                            );
                          }}
                          target="_blank"
                        >
                          {companyName}
                        </a>
                      </div>
                    ) : val.contactId ? (
                      <div className="grid grid-cols-2 pb-3 mb-3">
                        <div>{navContactName}</div>
                        <a
                          className={`${labelStyle}`}
                          onClick={() => {
                            window.open(
                              `${appsUrlGenerator(
                                appName,
                                LeadConversionAllowedValues.contact,
                                AllowedViews.detail,
                                val.contactId
                              )}`,
                              "_blank"
                            );
                          }}
                          target="_blank"
                        >
                          {contactName}
                        </a>
                      </div>
                    ) : val.dealId ? (
                      <div className="grid grid-cols-2">
                        <div>{navDealName}</div>
                        <a
                          className={`${labelStyle}`}
                          onClick={() => {
                            window.open(
                              `${appsUrlGenerator(
                                appName,
                                LeadConversionAllowedValues.deal,
                                AllowedViews.detail,
                                val.dealId
                              )}`,
                              "_blank"
                            );
                          }}
                          target="_blank"
                        >
                          {dealName}
                        </a>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </>
  ) : (
    <div className="p-6">
      {ItemsLoader({ currentView: "List", loadingItemCount: 4 })}
    </div>
  );
});
