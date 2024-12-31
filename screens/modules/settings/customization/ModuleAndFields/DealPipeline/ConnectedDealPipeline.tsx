import React from "react";
import { toast } from "react-toastify";
import { useLazyQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { DealPipelineContainer } from "./DealPipelineContainer";
import { getAppPathParts } from "../../../../crm/shared/utils/getAppPathParts";
import { useAppSaveMutation } from "../../../../crm/shared/utils/useAppSaveMutation";
import {
  FetchData,
  FetchVars,
  FETCH_QUERY,
} from "../../../../../../graphql/queries/fetchQuery";

export interface IPipelineMetadata {
  id: string;
  isDefault: boolean;
  name: string;
  stages: string[];
  recordStatus: string;
}
export interface IStageMetadata {
  dealCategory: string;
  id: string;
  name: string;
  recordStatus: string;
  probability: number;
  order: number;
}
export interface ILaunchStages {
  label: string;
  onClick: (pipelineId: string, stagesList: string[], stageId: string) => void;
  labelClasses: string;
}

export const ConnectedDealPipeline = () => {
  const { appName, modelName } = getAppPathParts();
  const { t } = useTranslation(["settings", "common"]);
  const [pipelineList, setPipelineList] = React.useState<IPipelineMetadata[]>(
    []
  );
  const [globalStagesList, setGlobalStagesList] = React.useState<
    IStageMetadata[]
  >([]);
  const [defaultPipeline, setDefaultPipeline] =
    React.useState<IPipelineMetadata | null>(null);
  const [refetchPipelineData, setRefetchPipelineData] = React.useState(true);
  const [stageUpdated, setStageUpdated] = React.useState(false);

  const [fetchPipelineData] = useLazyQuery<
    FetchData<IPipelineMetadata>,
    FetchVars
  >(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });

  const [fetchGlobalStagesList] = useLazyQuery<
    FetchData<IStageMetadata>,
    FetchVars
  >(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });

  const [createPipeline] = useAppSaveMutation<IPipelineMetadata>({
    appPath: appName,
  });

  const getGlobalStagesList = () => {
    fetchGlobalStagesList({
      variables: {
        modelName: "DealPipelineStage",
        // fields: ["id", "name", "probability", "dealCategory", "recordStatus"],
        fields: ["id", "name", "probability", "recordStatus"],
        filters: [{ name: "recordStatus", operator: "in", value: ["a", "i"] }],
      },
    }).then((response) => {
      if (response.data?.fetch?.data) {
        setGlobalStagesList(response.data?.fetch?.data);
      } else {
        toast.error("Error while fetching data, please contact admin.");
      }
    });
  };

  const manipulatePipeline = (
    id: string,
    saveInput: {
      name: string;
      isDefault?: boolean;
      stages?: string[];
      recordStatus?: string;
    },
    updateGlobalStageList = false
  ) => {
    try {
      createPipeline({
        variables: {
          id: id,
          modelName: "DealPipeline",
          saveInput: saveInput,
        },
      }).then((response) => {
        if (response?.data?.save.data) {
          const responseData = response?.data?.save.data;
          const responsePipelineData: IPipelineMetadata = {
            id: responseData.id,
            isDefault: responseData.isDefault,
            name: responseData.name,
            recordStatus: responseData.recordStatus,
            stages: responseData.stages,
          };
          let isUnique = -1;
          for (let i = 0; i < pipelineList.length; i++) {
            if (pipelineList[i].id === responseData.id) {
              isUnique = i;
              break;
            }
          }
          if (isUnique === -1) {
            setPipelineList([responsePipelineData, ...pipelineList]);
            if (updateGlobalStageList) {
              getGlobalStagesList();
            }
          } else {
            const modifiedPipelineList: IPipelineMetadata[] = [];
            for (const originalData of pipelineList) {
              if (originalData.id === responsePipelineData.id) {
                modifiedPipelineList.push(responsePipelineData);
              } else {
                modifiedPipelineList.push(originalData);
              }
            }
            setPipelineList(modifiedPipelineList);
            if (updateGlobalStageList) {
              getGlobalStagesList();
            }
          }
          setStageUpdated(!stageUpdated);
          toast.success(response?.data?.save.message);
        } else if (response?.data?.save.messageKey) {
          toast.error(response?.data?.save.message);
        } else {
          toast.error(t("common:unknown-message"));
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handlePipelineDefault = (pipelineItem: IPipelineMetadata) => {
    let requestArray = [];
    if (!defaultPipeline) {
      requestArray = [pipelineItem];
    } else if (pipelineItem.id === defaultPipeline.id) {
      requestArray = [defaultPipeline];
    } else {
      requestArray = [defaultPipeline, pipelineItem];
    }
    try {
      const PipelineRequestPromise = requestArray.map(async (val) => {
        const response = await createPipeline({
          variables: {
            id: val.id,
            modelName: "DealPipeline",
            saveInput: {
              name: val.name,
              isDefault: val.isDefault === true ? false : true,
              stages: val.stages,
              recordStatus: val.recordStatus,
            },
          },
        });
        if (response?.data?.save.data) {
          return response?.data?.save.data;
        }
        return null;
      });
      Promise.all(PipelineRequestPromise).then((response) => {
        const modifiedPipelineList: IPipelineMetadata[] = [];
        let defaultRecord = null;
        let unique: boolean;
        response.forEach((responsePipeline) => {
          if (responsePipeline?.isDefault === true) {
            defaultRecord = responsePipeline;
          }
        });
        const formattedData: IPipelineMetadata[] = response.filter(
          (val) => val != null
        ) as IPipelineMetadata[];
        for (const originalData of pipelineList) {
          unique = true;
          for (const responseData of formattedData) {
            if (originalData.id === responseData.id) {
              modifiedPipelineList.push(responseData);
              unique = false;
            }
          }
          if (unique) {
            modifiedPipelineList.push(originalData);
          }
        }
        setPipelineList(modifiedPipelineList);
        setDefaultPipeline(defaultRecord);
        toast.success("Default pipeline set successfully.");
      });
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    if (!appName) return;
    getGlobalStagesList();
  }, [appName]);

  React.useEffect(() => {
    if (refetchPipelineData && appName) {
      fetchPipelineData({
        variables: {
          modelName: "DealPipeline",
          fields: ["name", "stages", "isDefault", "recordStatus"],
          filters: [
            { name: "recordStatus", operator: "in", value: ["a", "i"] },
          ],
        },
      }).then((response) => {
        if (response?.data?.fetch?.data?.length) {
          response?.data?.fetch?.data.forEach((pipeline) => {
            if (pipeline.isDefault) {
              setDefaultPipeline(pipeline);
            }
          });
          setPipelineList(response?.data?.fetch?.data);
        } else {
          toast.error("Error while fetching data, please contact admin");
        }
        setStageUpdated(!stageUpdated);
        setRefetchPipelineData(false);
      });
    }
  }, [refetchPipelineData, appName]);

  return (
    <DealPipelineContainer
      pipelineList={pipelineList}
      globalStagesList={globalStagesList}
      handlePipelineDefault={handlePipelineDefault}
      appName={appName}
      modelName={modelName}
      setRefetchPipelineData={setRefetchPipelineData}
      stageUpdated={stageUpdated}
      manipulatePipeline={manipulatePipeline}
    />
  );
};
