import React, { useContext } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  FetchData,
  FetchVars,
  FETCH_QUERY,
} from "../../../../../graphql/queries/fetchQuery";
import { SAVE_MUTATION } from "../../../../../graphql/mutations/saveMutation";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import getValuesAtSameLevelFromDeepLevel from "../../../crm/shared/utils/getValuesAtSameLevelFromDeepLevel";
import { IEmailSetting } from "../../../../../models/shared";
import { EmailSettingsContainer } from "./EmailSettingsContainer";
import { domainRecordGeneratorHelper } from "./Helper/domainRecordGeneratorHelper";
import { UserStoreContext } from "../../../../../stores/UserStore";
import { User } from "../../../../../models/Accounts";
import { getFullUserName } from "../../../../Shared/getFullUserName";

const ConnectedEmailSettings = () => {
  const { t } = useTranslation();
  const userContext = useContext(UserStoreContext);
  const { user } = userContext;
  const [emailSetting, setEmailSetting] = React.useState<IEmailSetting>();
  const [savingProcess, setSavingProcess] = React.useState(false);
  const [domainRecords, setDomainRecords] = React.useState({});
  const [domainData, setDomainData] = React.useState<any>([]);
  const [domainLoading, setDomainLoading] = React.useState(true);
  const [showDomainRecords, setShowDomainRecords] = React.useState(false);
  const [trackDomainRecords, setTrackDomainRecords] = React.useState({});
  const [trackDomainData, setTrackDomainData] = React.useState<any>([]);
  const [trackDomainLoading, setTrackDomainLoading] = React.useState(true);
  const [showTrackingDomainRecord, setShowTrackingDomainRecord] =
    React.useState(false);
  const [spfData, setSpfData] = React.useState({});
  const [dkimData, setDkimData] = React.useState({});
  const [returnPathData, setReturnPathData] = React.useState({});
  const [mxData, setMxData] = React.useState({});
  const [rootLoading, setRootLoading] = React.useState(false);
  const [viewPermission, setViewPermission] = React.useState(true);

  useQuery<FetchData<IEmailSetting>, FetchVars>(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "notify",
      },
    },
    variables: {
      modelName: "emailConfiguration",
      fields: [
        "id",
        "provider",
        "config",
        "sendFrom",
        "replyTo",
        "firstName",
        "middleName",
        "lastName",
        "dnsInfo",
        "mailingDomain",
        "trackSubdomain",
        "isDomainVerified",
      ],
      filters: [],
    },
    onCompleted: (responseOnCompletion) => {
      setRootLoading(true);
      setDomainLoading(false);
      setTrackDomainLoading(false);
      if (responseOnCompletion?.fetch?.data?.length) {
        setEmailSetting(
          getValuesAtSameLevelFromDeepLevel(responseOnCompletion.fetch.data[0])
        );
        setDomainRecords(responseOnCompletion.fetch.data[0].dnsInfo);
      } else if (
        responseOnCompletion?.fetch.messageKey.includes("requires-view")
      ) {
        setViewPermission(false);
        toast.error(responseOnCompletion?.fetch.message);
      }
    },
    onError: (error) => {
      setRootLoading(true);
      setDomainLoading(false);
      setTrackDomainLoading(false);
      toast.error("Error while fetching emailConfiguration");
    },
  });

  const processDomainRecordHelper = (domainRecords: any) => {
    let spfRecordData: any = {},
      dkimRecordData: any = {},
      returnPathRecordData: any = {},
      mxRecordData: any = {};
    for (const key in domainRecords.records) {
      for (const domainDataKey in domainRecords.records[key]) {
        if (domainDataKey.toLowerCase() === "spfrecord") {
          spfRecordData = {
            ...domainRecordGeneratorHelper(
              key,
              domainDataKey,
              spfRecordData,
              domainRecords
            ),
          };
        } else if (domainDataKey.toLowerCase() === "dkimrecord") {
          dkimRecordData = {
            ...domainRecordGeneratorHelper(
              key,
              domainDataKey,
              dkimRecordData,
              domainRecords
            ),
          };
        } else if (domainDataKey.toLowerCase() === "returnpath") {
          returnPathRecordData = {
            ...domainRecordGeneratorHelper(
              key,
              domainDataKey,
              returnPathRecordData,
              domainRecords
            ),
          };
        } else if (domainDataKey.toLowerCase() === "mxrecords") {
          mxRecordData = {
            ...domainRecordGeneratorHelper(
              key,
              domainDataKey,
              mxRecordData,
              domainRecords
            ),
          };
        }
      }
    }
    setSpfData({ ...spfRecordData, label: "SPF Record" });
    setDkimData({ ...dkimRecordData, label: "DKIM Record" });
    setReturnPathData({ ...returnPathRecordData, label: "Return Path" });
    setMxData({ ...mxRecordData, label: "MX Record" });
    if (emailSetting) {
      setDomainData([
        {
          domain: emailSetting.mailingDomain,
          spfStatus: spfRecordData.status,
          dkimStatus: dkimRecordData.status,
          returnPathStatus: returnPathRecordData.status,
          mxStatus: mxRecordData.status,
          domainVerifiedOn: emailSetting.verified,
          id: emailSetting.id,
        },
      ]);
    }
    if (emailSetting && domainRecords?.trackInfo?.length) {
      setTrackDomainRecords(domainRecords.trackInfo);
      setTrackDomainData([
        {
          trackingDomain: emailSetting.trackSubdomain,
          cnameStatus: Object.keys(domainRecords.trackInfo[0])[0],
          sslStatus: Object.keys(domainRecords.trackInfo[1])[0],
          trackDomainVerifiedOn: "",
          id: emailSetting.id,
        },
      ]);
      setShowTrackingDomainRecord(true);
    }
    setDomainLoading(false);
    setShowDomainRecords(true);
  };

  React.useEffect(() => {
    if (domainRecords && Object.keys(domainRecords).length && emailSetting) {
      processDomainRecordHelper(domainRecords);
    }
  }, [domainRecords, emailSetting]);

  const [saveData] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "notify",
      },
    },
  });

  const handleSave = async (
    values: Record<string, string | null | undefined>
  ) => {
    const fullName = getFullUserName({
      firstName: values.firstName || "",
      middleName: values.middleName || "",
      lastName: values.lastName || "",
    });
    setSavingProcess(true);
    try {
      await saveData({
        variables: {
          id: emailSetting?.id || null,
          modelName: "emailConfiguration",
          saveInput: {
            sendFrom: fullName
              ? `${fullName} <${values.sendFrom}>`
              : values.sendFrom,
            replyTo: fullName
              ? `${fullName} <${values.replyTo}>`
              : values.replyTo,
            mailingDomain: emailSetting?.mailingDomain || "",
            firstName: values.firstName,
            middleName: values.middleName,
            lastName: values.lastName,
          },
        },
      }).then((response) => {
        if (
          response.data.save.data &&
          response.data.save.data.id &&
          response.data.save.messageKey.includes("-success")
        ) {
          toast.success("Email settings saved successfully");
          setSavingProcess(false);
          setEmailSetting(
            getValuesAtSameLevelFromDeepLevel(response.data.save.data)
          );
          return;
        }
        setSavingProcess(false);
        if (response.data.save.messageKey) {
          toast.error(response.data.save.message);
          return;
        }
        toast.error(t("common:unknown-message"));
      });
    } catch (error) {
      console.error(error);
    }
  };
  const updateData = (
    response: any,
    updateDataType?: "delete-domain" | null
  ) => {
    if (
      response.data.save.data &&
      response.data.save.data.id &&
      response.data.save.messageKey.includes("-success")
    ) {
      toast.success(
        updateDataType === "delete-domain"
          ? "Domain removed successfully"
          : "Data submitted successfully"
      );
      setEmailSetting(
        getValuesAtSameLevelFromDeepLevel(response.data.save.data)
      );
      setDomainRecords(response.data.save.data.dnsInfo);
      return;
    }
    if (response.data.save.messageKey) {
      toast.error(response.data.save.message);
      return;
    }
    toast.error(t("common:unknown-message"));
  };
  const handleConfigureDomain = (domain: string) => {
    if (!domain) {
      toast.error("Please enter domain name.");
      return;
    }
    setDomainLoading(true);
    try {
      saveData({
        variables: {
          id: emailSetting?.id ? emailSetting.id : null,
          modelName: "emailConfiguration",
          saveInput: {
            mailingDomain: domain.trim(),
          },
        },
      }).then((response) => updateData(response));
    } catch (error) {
      console.error(error);
    } finally {
      setDomainLoading(false);
    }
  };
  const handleTrackDomain = (trackDomain: string) => {
    setTrackDomainLoading(true);
    try {
      saveData({
        variables: {
          id: emailSetting?.id ? emailSetting.id : null,
          modelName: "emailConfiguration",
          saveInput: {
            trackSubdomain: trackDomain.trim(),
          },
        },
      }).then((response) => updateData(response));
    } catch (error) {
      console.error(error);
    } finally {
      setTrackDomainLoading(false);
    }
  };
  const deleteDomainRecords = async (id: string, type: string) => {
    let saveInput = {};
    if (type === "Domain") {
      saveInput = {
        mailingDomain: "",
        sendFrom: "",
        replyTo: "",
        trackSubdomain: "",
      };
      setDomainLoading(true);
    } else {
      saveInput = {
        trackSubdomain: "",
      };
      setTrackDomainLoading(true);
    }
    try {
      await saveData({
        variables: {
          id: id,
          modelName: "emailConfiguration",
          saveInput: saveInput,
        },
      }).then((response) => {
        if (response.data.save.messageKey.includes("-success")) {
          if (type === "Domain") {
            setSpfData({});
            setDkimData({});
            setReturnPathData({});
            setMxData({});
            setDomainData([]);
            setShowDomainRecords(false);
            updateData(response, "delete-domain");
          } else {
            setTrackDomainRecords({});
            setTrackDomainData([]);
            setShowTrackingDomainRecord(false);
            updateData(response, "delete-domain");
          }
          return;
        }
        if (response.data.save.messageKey) {
          setDomainLoading(false);
          toast.error(response.data.save.message);
          return;
        }
        toast.error(t("common:unknown-message"));
      });
    } catch (error) {
      console.error(error);
    } finally {
      setDomainLoading(false);
      setTrackDomainLoading(false);
    }
  };

  const handleDomainCheck = (id: string, domain: string) => {
    setDomainLoading(true);
    try {
      saveData({
        variables: {
          id: id,
          modelName: "emailConfiguration",
          saveInput: {
            mailingDomain: domain,
          },
        },
      }).then((response) => updateData(response));
    } catch (error) {
      console.error(error);
    } finally {
      setDomainLoading(false);
    }
  };
  const handleTrackingDomainCheck = (id: string, trackDomain: string) => {
    setTrackDomainLoading(true);
    try {
      saveData({
        variables: {
          id: id,
          modelName: "emailConfiguration",
          saveInput: {
            trackSubdomain: trackDomain,
          },
        },
      }).then((response) => updateData(response));
    } catch (error) {
      console.error(error);
    } finally {
      setTrackDomainLoading(false);
    }
  };

  const handleShowDomainRecords = () => {
    setShowDomainRecords(!showDomainRecords);
  };
  const handleShowTrackingDomainRecord = () => {
    setShowTrackingDomainRecord(!showTrackingDomainRecord);
  };
  return (
    <EmailSettingsContainer
      handleSave={handleSave}
      emailSetting={emailSetting}
      savingProcess={savingProcess}
      handleConfigureDomain={handleConfigureDomain}
      domainRecords={domainRecords}
      spfData={spfData}
      dkimData={dkimData}
      returnPathData={returnPathData}
      mxData={mxData}
      trackDomainData={trackDomainData}
      showDomainRecords={showDomainRecords}
      domainLoading={domainLoading}
      handleShowDomainRecords={handleShowDomainRecords}
      domainData={domainData}
      deleteDomainRecords={deleteDomainRecords}
      handleDomainCheck={handleDomainCheck}
      showTrackingDomainRecord={showTrackingDomainRecord}
      trackDomainLoading={trackDomainLoading}
      handleTrackDomain={handleTrackDomain}
      handleShowTrackingDomainRecord={handleShowTrackingDomainRecord}
      handleTrackingDomainCheck={handleTrackingDomainCheck}
      trackDomainRecords={trackDomainRecords}
      rootLoading={rootLoading}
      viewPermission={viewPermission}
    />
  );
};
export default ConnectedEmailSettings;
