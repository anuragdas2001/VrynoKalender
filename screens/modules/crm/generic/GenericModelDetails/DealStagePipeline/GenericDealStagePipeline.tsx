import React from "react";
import { toast } from "react-toastify";
import { useLazyQuery, useMutation } from "@apollo/client";
import { ICustomField } from "../../../../../../models/ICustomField";
import { SAVE_MUTATION } from "../../../../../../graphql/mutations/saveMutation";
import { GenericDealStagePipelineContainer } from "./GenericDealStagePipelineContainer";
import {
  FetchData,
  FetchVars,
  FETCH_QUERY,
} from "../../../../../../graphql/queries/fetchQuery";
import {
  IPipelineMetadata,
  IStageMetadata,
} from "../../../../settings/customization/ModuleAndFields/DealPipeline/ConnectedDealPipeline";

const stagesFields = [
  "id",
  "name",
  "recordStatus",
  "probability",
  "dealCategory",
];

export const GenericDealStagePipeline = ({
  modelData,
  updateModelData,
  modelName,
  appName,
  id,
  fieldsList,
}: {
  modelData: any;
  updateModelData: (value: any) => void;
  modelName: string;
  appName: string;
  id: string;
  fieldsList: ICustomField[];
}) => {
  const [stagesData, setStagesData] = React.useState<IStageMetadata[]>([]);
  const [dealStagesLoading, setDealStagesLoading] = React.useState(true);
  const [hasPipeline, setHasPipeline] = React.useState(true);
  const [activeStage, setActiveStage] = React.useState<IStageMetadata>();
  const [saveLoading, setSaveLoading] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [failedOpen, setFailedOpen] = React.useState(false);
  const [activeStageIsRemoved, setActiveStageIsRemoved] = React.useState(false);
  const [pipelineLabelDict, setPipelineLabelDict] = React.useState({
    dealName: "Deal Name",
    expectedRevenue: "Expected Revenue",
  });

  const [getStage] = useLazyQuery<FetchData<IStageMetadata>, FetchVars>(
    FETCH_QUERY,
    {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: appName,
        },
      },
    }
  );

  const [getPipeline] = useLazyQuery<FetchData<IPipelineMetadata>, FetchVars>(
    FETCH_QUERY,
    {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: appName,
        },
      },
    }
  );

  const [saveData] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (data) => {
      if (data.save.data) {
        updateModelData(data.save.data);
        toast.success("Deal updated successfully");
      } else {
        toast.error(data.save.messageKey);
      }
      setSaveLoading(false);
    },
  });

  const handleStageSave = (stageData: IStageMetadata) => {
    setSaveLoading(true);
    if (activeStageIsRemoved) {
      setStagesData(stagesData.filter((val) => val.id !== activeStage?.id));
      setActiveStageIsRemoved(false);
    }
    setActiveStage(stageData);
    try {
      saveData({
        variables: {
          id: id,
          modelName: modelName,
          saveInput: {
            dealStageId: stageData.id,
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSuccessOpen = (value: boolean) => {
    setSuccessOpen(value);
  };

  const handleFailedOpen = (value: boolean) => {
    setFailedOpen(value);
  };

  React.useEffect(() => {
    if (modelName === "deal" && fieldsList?.length) {
      const labelDict = {
        dealName: "Deal Name",
        expectedRevenue: "Expected Revenue",
      };
      fieldsList?.forEach((field) => {
        if (field.name === "expectedRevenue") {
          labelDict["expectedRevenue"] = field.label.en;
        } else if (field.name === "name") {
          labelDict["dealName"] = field.label.en;
        }
      });
      setPipelineLabelDict(labelDict);
    }
  }, [fieldsList]);

  React.useEffect(() => {
    if (modelData?.dealPipelineId && dealStagesLoading && appName) {
      getPipeline({
        variables: {
          modelName: "DealPipeline",
          fields: ["name", "stages", "isDefault", "recordStatus"],
          filters: [
            { name: "id", operator: "eq", value: [modelData.dealPipelineId] },
            { name: "recordStatus", operator: "in", value: ["a", "i"] },
          ],
        },
      }).then((response) => {
        if (response?.data?.fetch?.data?.length) {
          const stagesIdArray: string[] = response.data.fetch.data[0].stages;
          const slicedStagesIdArray = [];
          for (let i = 0; i < stagesIdArray.length; i += 50) {
            const subArray = stagesIdArray.slice(i, i + 50);
            slicedStagesIdArray.push(subArray);
          }
          const fetchStagePromise = slicedStagesIdArray?.map(
            async (idArray: string[]) => {
              const response = await getStage({
                variables: {
                  modelName: "DealPipelineStage",
                  fields: stagesFields,
                  filters: [{ name: "id", operator: "in", value: idArray }],
                },
              });
              return response.data?.fetch?.data
                ? response.data?.fetch?.data
                : [];
            }
          );
          if (!fetchStagePromise) {
            setHasPipeline(false);
            setDealStagesLoading(false);
            return;
          }
          Promise.all(fetchStagePromise).then((result) => {
            const orderedStages = [];
            const allStages = result.flat();
            for (const stageId of stagesIdArray) {
              const stage = allStages.find((stage) => stage.id === stageId);
              if (stage) {
                orderedStages.push(stage);
              }
            }
            setStagesData(orderedStages);
          });
        } else {
          setHasPipeline(false);
          setDealStagesLoading(false);
        }
      });
    }
  }, [modelData?.dealPipelineId, appName]);

  React.useEffect(() => {
    if (modelData && stagesData?.length && !activeStage) {
      const filteredActiveStage = stagesData.filter(
        (val) => val?.id === modelData.dealStageId
      );
      if (filteredActiveStage.length) {
        setActiveStage(filteredActiveStage[0]);
      } else {
        getStage({
          variables: {
            modelName: "DealPipelineStage",
            fields: stagesFields,
            filters: [
              { name: "id", operator: "in", value: [modelData.dealStageId] },
            ],
          },
        }).then((response) => {
          setActiveStageIsRemoved(true);
          if (response.data?.fetch?.data) {
            setStagesData([...stagesData, response.data?.fetch?.data[0]]);
          }
        });
      }
      setHasPipeline(true);
      setDealStagesLoading(false);
    }
  }, [stagesData]);

  return (
    <GenericDealStagePipelineContainer
      modelData={modelData}
      successOpen={successOpen}
      failedOpen={failedOpen}
      handleSuccessOpen={handleSuccessOpen}
      handleFailedOpen={handleFailedOpen}
      stagesData={stagesData}
      saveLoading={saveLoading}
      handleStageSave={handleStageSave}
      dealStagesLoading={dealStagesLoading}
      hasPipeline={hasPipeline}
      pipelineLabelDict={pipelineLabelDict}
    />
  );
};
