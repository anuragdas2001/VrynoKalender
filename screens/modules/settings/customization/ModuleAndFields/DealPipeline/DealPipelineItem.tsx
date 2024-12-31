import React, { Dispatch, SetStateAction } from "react";
import { IPipelineMetadata, IStageMetadata } from "./ConnectedDealPipeline";
import { useTranslation } from "next-i18next";
import { useLazyQuery } from "@apollo/client";
import {
  FetchData,
  FetchVars,
  FETCH_QUERY,
} from "../../../../../../graphql/queries/fetchQuery";
import { useAppSaveMutation } from "../../../../crm/shared/utils/useAppSaveMutation";
import { toast } from "react-toastify";
import { FormikValues } from "formik";
import { DealPipelineItemContent } from "./DealPipelineItemContent";
import { AddStageModal } from "./AddStageModal";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";

export interface IDealPipelineLaunchStagesArray {
  label: string;
  onClick: () => void;
  labelClasses: string;
  visible: boolean;
}
[];

export const DealPipelineItem = ({
  item,
  globalStagesList,
  handlePipelineStatusToggle,
  handlePipelineStageUpdate,
  pipelineList,
  handlePipelineDefault,
  handlePipelineEdit,
  appName,
  modelName,
  setRefetchPipelineData,
  stageUpdated,
}: {
  item: IPipelineMetadata;
  globalStagesList: IStageMetadata[];
  handlePipelineStatusToggle: (pipelineItem: IPipelineMetadata) => void;
  handlePipelineStageUpdate: (
    pipelineItem: IPipelineMetadata,
    stagesIdArray: string[],
    updateGlobalStageList?: boolean
  ) => void;
  pipelineList: IPipelineMetadata[];
  handlePipelineDefault: (pipelineItem: IPipelineMetadata) => void;
  handlePipelineEdit: (pipelineItem: IPipelineMetadata) => void;
  appName: string;
  modelName: string;
  setRefetchPipelineData: Dispatch<SetStateAction<boolean>>;
  stageUpdated: boolean;
}) => {
  const { t } = useTranslation(["settings", "common"]);
  const [extended, setExtended] = React.useState(true);
  const [showAddStageModal, setShowAddStageModal] = React.useState({
    visible: false,
    editStageData: {},
  });
  const [launchStagesArray, setLaunchStagesArray] = React.useState<
    IDealPipelineLaunchStagesArray[]
  >([]);
  const [stagesData, setStagesData] = React.useState<IStageMetadata[]>([]);
  const [savingProcess, setSavingProcess] = React.useState(false);
  const getExtendedValue = (extendedValue: boolean) => {
    if (!extendedValue !== extended) {
      setExtended(!extendedValue);
    }
  };

  const [createStage] = useAppSaveMutation<{
    id: string;
    name: string;
    probability: string | number;
    dealCategory: string;
  }>({
    appPath: appName,
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

  const handleOrderUpdate = (record: IStageMetadata, move: string) => {
    let oldStagesData = stagesData.map((val) => val.id);
    const index = record.order;
    if (move === "forward") {
      oldStagesData.splice(index, 1);
      oldStagesData.splice(index + 1, 0, record.id);
      handlePipelineStageUpdate(item, oldStagesData);
    } else {
      oldStagesData.splice(index, 1);
      oldStagesData.splice(index - 1, 0, record.id);
      handlePipelineStageUpdate(item, oldStagesData);
    }
  };

  const handleCreateStage = (values: FormikValues) => {
    setSavingProcess(true);
    try {
      createStage({
        variables: {
          id: values?.id || "",
          modelName: "DealPipelineStage",
          saveInput: {
            name: values.stageName,
            probability: +values.probability,
            dealCategory: values.dealCategory,
          },
        },
      }).then((response) => {
        if (
          response?.data?.save.data &&
          response?.data?.save.messageKey.includes("success")
        ) {
          toast.success(response?.data?.save.message);
          if (response?.data?.save.messageKey.includes("updation")) {
            setRefetchPipelineData(true);
          } else {
            handlePipelineStageUpdate(
              item,
              item.stages !== null
                ? [
                    ...item.stages.filter(
                      (val) => val !== response?.data?.save.data.id
                    ),
                    response?.data?.save.data.id,
                  ]
                : [response?.data?.save.data.id],
              true
            );
          }
          setSavingProcess(false);
        } else if (response?.data?.save.messageKey) {
          toast.error(response?.data?.save.message);
          setSavingProcess(false);
        } else {
          toast.error(t("common:unknown-message"));
          setSavingProcess(false);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleStageToggle = (record: IStageMetadata) => {
    handlePipelineStageUpdate(
      item,
      item.stages.filter((stageId) => stageId !== record.id)
    );
  };

  const handleShowAddStageModal = (
    visible: boolean,
    stageData: IStageMetadata | null
  ) => {
    let updatedStageData = {};
    if (stageData) {
      updatedStageData = {
        id: stageData.id,
        stageName: stageData.name,
        probability: stageData.probability.toString(),
        dealCategory: stageData.dealCategory,
      };
    }
    setShowAddStageModal({ visible: visible, editStageData: updatedStageData });
  };

  React.useEffect(() => {
    if (globalStagesList.length && item.stages?.length) {
      const launchArray: IDealPipelineLaunchStagesArray[] = [];
      globalStagesList.forEach((val) => {
        if (!item.stages.includes(val.id)) {
          launchArray.push({
            label: val.name,
            onClick: () => {
              handlePipelineStageUpdate(item, [...item.stages, val.id]);
            },
            visible: true,
            labelClasses: "text-vryno-dropdown-icon bg-vryno-select",
          });
        }
      });
      setLaunchStagesArray(launchArray);
    }
    if (item.stages === null || item.stages?.length === 0) {
      setLaunchStagesArray(
        globalStagesList.map((val) => {
          return {
            label: val.name,
            onClick: () => {
              handlePipelineStageUpdate(item, [val.id]);
            },
            visible: true,
            labelClasses: "text-vryno-dropdown-icon bg-vryno-select",
          };
        })
      );
    }
  }, [globalStagesList, item.stages, pipelineList]);

  React.useEffect(() => {
    if (item.stages === null || item.stages?.length === 0) {
      setStagesData([]);
      return;
    }
    if (item.stages?.length && appName) {
      const fetchStagePromise = item.stages.map(async (id) => {
        const response = await getStage({
          variables: {
            modelName: "DealPipelineStage",
            fields: [
              "id",
              "name",
              "recordStatus",
              "probability",
              "dealCategory",
            ],
            filters: [
              { name: "id", operator: "eq", value: [id] },
              { name: "recordStatus", operator: "in", value: ["a", "i"] },
            ],
          },
        });
        if (response.data?.fetch?.data) {
          return response.data?.fetch?.data[0];
        }
        return null;
      });
      Promise.all(fetchStagePromise).then((result) => {
        const filteredResultData: IStageMetadata[] = result.filter(
          (val) => val
        ) as IStageMetadata[];
        setStagesData(
          filteredResultData.map((val) => {
            return { ...val, order: item.stages.indexOf(val.id) };
          })
        );
      });
    }
  }, [item.stages, stageUpdated, appName]);

  return (
    <>
      <DealPipelineItemContent
        item={item}
        handlePipelineStatusToggle={handlePipelineStatusToggle}
        handlePipelineDefault={handlePipelineDefault}
        handlePipelineEdit={handlePipelineEdit}
        extended={extended}
        getExtendedValue={getExtendedValue}
        launchStagesArray={launchStagesArray}
        stagesData={stagesData}
        handleOrderUpdate={handleOrderUpdate}
        handleStageToggle={handleStageToggle}
        handleShowAddStageModal={handleShowAddStageModal}
      />
      {showAddStageModal.visible && (
        <>
          <AddStageModal
            onOutsideClick={() => handleShowAddStageModal(false, null)}
            handleCreateStage={handleCreateStage}
            savingProcess={savingProcess}
            editStageData={showAddStageModal.editStageData}
          />
          <Backdrop onClick={() => handleShowAddStageModal(false, null)} />
        </>
      )}
    </>
  );
};
