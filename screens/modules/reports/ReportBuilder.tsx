import React, { useContext, useState } from "react";
import { IModuleMetadata } from "../../../models/IModuleMetadata";
import { ILayout } from "../../../models/ILayout";
import { useCrmFetchLazyQuery } from "../crm/shared/utils/operations";
import { dataUploadHandler } from "../crm/shared/utils/dataUploadHandler";
import { useMutation } from "@apollo/client";
import { SAVE_MUTATION } from "../../../graphql/mutations/saveMutation";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Config } from "../../../shared/constants";
import { fetchGatewayFile } from "../../../components/TailwindControls/Extras/fetchGatewayFile";
import { IReport } from "../../../models/IReport";
import { ReportStoreContext } from "../../../stores/ReportStore";
import { ReportDesigner } from "./Designer/ReportDesigner";
import { observer } from "mobx-react-lite";
import { GeneralStoreContext } from "../../../stores/RootStore/GeneralStore/GeneralStore";

const useLayoutData = () => {
  const { generalModelStore } = useContext(GeneralStoreContext);
  const { genericModels, allLayoutFetched, allModulesFetched } =
    generalModelStore;
  const [loading, setLoading] = useState(true);
  const [layouts, setLayouts] = useState<(ILayout | undefined)[]>([]);
  const getAllData = async () => {
    let moduleInfoFromStore: IModuleMetadata[] = [
      ...Object.keys(genericModels)
        ?.map((model) => {
          if (genericModels[model]?.moduleInfo?.customizationAllowed === true)
            return genericModels[model]?.moduleInfo;
        })
        ?.filter((model) => model !== undefined),
    ];
    let layouts = moduleInfoFromStore
      .map((moduleInfo) => {
        const data = genericModels[moduleInfo?.name]?.layouts[0] ?? undefined;
        const fields = genericModels[moduleInfo?.name]?.fieldsList.filter(
          (field) =>
            field.dataType !== "json" && (field.visible || field.name === "id")
        );
        return data
          ? fields
            ? { ...data, config: { ...data.config, fields: fields } }
            : data
          : undefined;
      })
      ?.filter((data) => !!data);
    setLayouts(layouts);
    setLoading(false);
  };

  React.useEffect(() => {
    if (allModulesFetched && allLayoutFetched) {
      getAllData().then();
    }
  }, [allModulesFetched, allLayoutFetched]);
  return [loading, layouts];
};

function ReportBuilder() {
  const { t } = useTranslation();
  const router = useRouter();
  const counter = React.useRef(0);
  const [loading, layouts] = useLayoutData();
  const [reportLoading, setReportLoading] = React.useState(false);
  const [reportFile, setReportFile] = React.useState<any>(null);
  const {
    id,
    name: newReportName,
    description: newReportDescription,
  } = router.query;
  const { getById } = useContext(ReportStoreContext);

  // Core.setLicenseKey(Config.activeReportJSKey);
  const [reportStorage, setReportStorage] = React.useState(new Map());
  const [saveProcessing, setSaveProcessing] = React.useState(false);
  const [reportRecord, setReportRecord] = React.useState<
    IReport | null | undefined
  >(null);

  const fetchFile = async (reportToBeFetched: IReport) => {
    const reportFile = await fetchGatewayFile(
      `${Config.metaPrivateUploadUrl()}crm/report/${reportToBeFetched?.fileKey}`
    );
    if (reportRecord == null) {
      setReportRecord(reportToBeFetched);
    }
    setReportFile(reportFile);
  };

  const [saveReport] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "crm",
      },
    },
    onCompleted: (data) => {
      if (
        data.save.data &&
        data.save.data.id &&
        data.save.messageKey.includes("-success")
      ) {
        toast.success("Report saved successfully");
        setSaveProcessing(false);
        router.push("/reports/crm/");
        return;
      }
      setSaveProcessing(false);
      if (data.save.messageKey) {
        toast.error(data.save.message);
        return;
      }
      toast.error(t("common:unknown-message"));
    },
  });
  const [getReportById] = useCrmFetchLazyQuery<IReport>({
    fetchPolicy: "no-cache",
  });
  const getReport = async () => {
    setReportLoading(true);
    const report = await getReportById({
      variables: {
        modelName: "report",
        fields: ["id", "name", "fileKey"],
        filters: [{ name: "id", operator: "eq", value: [id as string] }],
      },
    });
    if (report?.data?.fetch?.data?.length) {
      setReportRecord(report?.data?.fetch?.data[0]);
      fetchFile(report?.data?.fetch?.data[0] as IReport).then();
      setReportLoading(false);
      return;
    }
    setReportFile(null);
  };

  React.useEffect(() => {
    const report = getById(id as string);
    if (!report) {
      getReport().then();
    }
    if (report) {
      fetchFile(report).then();
    }
  }, []);

  const handleSaveReport = async (values: Record<string, string>) => {
    const fileKey = await dataUploadHandler(
      values,
      null,
      "report",
      "crm",
      "application/json"
    );
    setSaveProcessing(true);
    try {
      await saveReport({
        variables: {
          id: id || null,
          modelName: "report",
          saveInput: {
            name: newReportName,
            description: newReportDescription,
            fileKey: fileKey,
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  };
  const generateDataSet = (layouts: any) => {
    return layouts.map((obj: any) => {
      return {
        id: obj.moduleName,
        title: obj.moduleName,
        template: {
          Name: obj.moduleName,
          Query: {
            DataSourceName: "crm",
            // CommandText: `uri=/${obj.moduleName};jpath=$.[*]`,
          },
          Fields: obj.config.fields.map((field: any) => {
            return {
              Name: field.label.en,
              DataField: field.systemDefined
                ? field.name
                : `fields.${field.name}`,
            };
          }),
        },
        canEdit: false,
      };
    });
  };

  const parseDataSource = (layouts: any) => {
    const serviceMap = ["crm"];
    return serviceMap.map((obj) => {
      return {
        id: obj,
        title: obj,
        template: {
          Name: obj,
          ConnectionProperties: {
            DataProvider: "JSONEMBED",
            ConnectString: "",
          },
        },
        canEdit: true,
        shouldEdit: true,
        datasets: generateDataSet(layouts),
      };
    });
  };

  const onSave = function (info: any) {
    const reportId = info.id || `report${counter.current++}`;
    setReportStorage(new Map(reportStorage.set(reportId, info.definition)));
    handleSaveReport(info.definition).then();
    return Promise.resolve({ displayName: reportRecord?.name });
  };

  const onSaveAs = function (info: any) {
    const reportId = info.id || `report${counter.current++}`;
    setReportStorage(new Map(reportStorage.set(reportId, info.definition)));
    handleSaveReport(info.definition).then();
    return Promise.resolve({
      id: reportRecord?.fileKey || reportId,
      displayName: reportRecord?.name || reportId,
    });
  };
  if (id && reportRecord != null && reportFile != null) {
    return (
      <>
        <ReportDesigner
          report={{
            id: reportRecord.id,
            displayName: reportRecord.name,
            definition: reportFile,
          }}
          dataSources={parseDataSource(layouts)}
          onSave={onSave}
          onSaveAs={onSaveAs}
        />
      </>
    );
  }
  return (
    <>
      <ReportDesigner
        dataSources={parseDataSource(layouts)}
        onSave={onSave}
        onSaveAs={onSaveAs}
      />
    </>
  );
}
export default observer(ReportBuilder);
