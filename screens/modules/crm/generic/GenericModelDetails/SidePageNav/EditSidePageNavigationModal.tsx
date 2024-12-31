import React from "react";
import GenericFormModalContainer from "../../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import { getCardContainerOrderSideNavMapper } from "./getCardContainerOrderSideNavMapper";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import ArrowUpIcon from "remixicon-react/ArrowDropUpLineIcon";
import ArrowDownIcon from "remixicon-react/ArrowDropDownLineIcon";
import { useTranslation } from "react-i18next";
import { IUserPreference } from "../../../../../../models/shared";
import { SectionDetailsType } from "../../GenericForms/Shared/genericFormProps";

type EditSidePageNavigationModalProps = {
  modelName: string;
  formHeading?: string;
  sections: SectionDetailsType[];
  userPreferences?: IUserPreference[];
  cardContainerOrder: {
    id: string;
    label: string;
    name: string;
    type: string;
    order: number;
  }[];
  openActivityCount: number;
  closeActivityCount: number;
  notesCount: number;
  attachmentsCount: number;
  emailCount: number;
  savingProcess: boolean;
  reverseRecordLookupsCount?: { label: string; value: string; count: number }[];
  subFormsCount?: {
    id: string;
    label: string;
    value: string;
    count: number;
  }[];
  onCancel: () => void;
  handleUpdateUserPreferences: () => void;
  handleUpdateSideNavigationOrder: (
    values: {
      id: string;
      label: string;
      value: string;
      name: string;
      type: string;
      order: number;
      count?: number | undefined;
    }[]
  ) => void;
};

export const EditSidePageNavigationModal = ({
  modelName,
  formHeading,
  sections,
  userPreferences,
  cardContainerOrder,
  openActivityCount,
  closeActivityCount,
  savingProcess,
  notesCount,
  attachmentsCount,
  emailCount,
  reverseRecordLookupsCount,
  subFormsCount,
  onCancel,
  handleUpdateUserPreferences,
  handleUpdateSideNavigationOrder,
}: EditSidePageNavigationModalProps) => {
  const { t } = useTranslation(["common"]);
  const [updatedCardContainerOrder, setUpdatedCardContainerOrder] =
    React.useState<
      {
        id: string;
        label: string;
        value: string;
        name: string;
        type: string;
        order: number;
        count?: number | undefined;
        metadata?: Record<string, any>;
      }[]
    >([]);

  React.useEffect(() => {
    if (cardContainerOrder && cardContainerOrder?.length > 0) {
      setUpdatedCardContainerOrder([
        ...getCardContainerOrderSideNavMapper(
          cardContainerOrder,
          sections,
          openActivityCount,
          closeActivityCount,
          notesCount,
          attachmentsCount,
          emailCount,
          reverseRecordLookupsCount,
          subFormsCount
        ),
      ]);
    }
  }, []);

  const handleUpOrder = (cardContainer: {
    id: string;
    label: string;
    value: string;
    name: string;
    type: string;
    order: number;
    count?: number | undefined;
  }) => {
    let cardContainerOrderUpdated = [...updatedCardContainerOrder];
    let currentSelectedContainerIndex = cardContainerOrderUpdated?.findIndex(
      (container) => JSON.stringify(container) === JSON.stringify(cardContainer)
    );
    let currentSelectedContainerOrder =
      cardContainerOrderUpdated[currentSelectedContainerIndex]?.order;
    let aboveContainerOrder =
      cardContainerOrderUpdated[currentSelectedContainerIndex - 1]?.order;
    cardContainerOrderUpdated[currentSelectedContainerIndex] = {
      ...cardContainerOrderUpdated[currentSelectedContainerIndex],
      order: aboveContainerOrder,
    };
    cardContainerOrderUpdated[currentSelectedContainerIndex - 1] = {
      ...cardContainerOrderUpdated[currentSelectedContainerIndex - 1],
      order: currentSelectedContainerOrder,
    };
    setUpdatedCardContainerOrder([...cardContainerOrderUpdated]);
  };

  const handleDownOrder = (cardContainer: {
    id: string;
    label: string;
    value: string;
    name: string;
    type: string;
    order: number;
    count?: number | undefined;
  }) => {
    let cardContainerOrderUpdated = [...updatedCardContainerOrder];
    let currentSelectedContainerIndex = cardContainerOrderUpdated?.findIndex(
      (container) => JSON.stringify(container) === JSON.stringify(cardContainer)
    );
    let currentSelectedContainerOrder =
      cardContainerOrderUpdated[currentSelectedContainerIndex]?.order;
    let belowContainerOrder =
      cardContainerOrderUpdated[currentSelectedContainerIndex + 1]?.order;
    cardContainerOrderUpdated[currentSelectedContainerIndex] = {
      ...cardContainerOrderUpdated[currentSelectedContainerIndex],
      order: belowContainerOrder,
    };
    cardContainerOrderUpdated[currentSelectedContainerIndex + 1] = {
      ...cardContainerOrderUpdated[currentSelectedContainerIndex + 1],
      order: currentSelectedContainerOrder,
    };
    setUpdatedCardContainerOrder([...cardContainerOrderUpdated]);
  };

  return (
    <>
      <GenericFormModalContainer
        formHeading={formHeading}
        limitWidth={true}
        onCancel={() => onCancel()}
      >
        <>
          <div className={`w-full max-h-[50vh] overflow-y-scroll mb-4`}>
            {updatedCardContainerOrder
              .sort((cardContainerOne, cardContainerTwo) =>
                cardContainerOne?.order > cardContainerTwo?.order ? 1 : -1
              )
              ?.map((cardContainer, index) => (
                <p
                  className={`text-sm rounded-md flex items-center justify-between gap-x-2 py-2 px-4 hover:bg-gray-100 break-all`}
                  key={index}
                >
                  <span className="w-full">{cardContainer.label}</span>
                  <div className="flex gap-x-2 items-center">
                    <Button
                      id={`detail-navigation-${cardContainer.label}-up-arrow-icon`}
                      onClick={() => {
                        handleUpOrder(cardContainer);
                      }}
                      customStyle={`cursor-pointer w-5 h-5 rounded-md flex justify-center items-center bg-gray-400 hover:bg-vryno-theme-light-blue ${
                        index === 0 ? "hidden" : "flex"
                      }`}
                      userEventName={`detail-navigation-${cardContainer.label}-up-arrow:action-click`}
                    >
                      <ArrowUpIcon size={24} className="text-white" />
                    </Button>
                    <Button
                      id={`detail-navigation-${cardContainer.label}-down-arrow-icon`}
                      onClick={() => handleDownOrder(cardContainer)}
                      customStyle={`cursor-pointer w-5 h-5 rounded-md flex justify-center items-center bg-gray-400 hover:bg-vryno-theme-light-blue ${
                        index === cardContainerOrder.length - 1
                          ? "hidden"
                          : "flex"
                      }`}
                      userEventName={`detail-navigation-${cardContainer.label}-down-arrow:action-click`}
                    >
                      <ArrowDownIcon size={24} className="text-white" />
                    </Button>
                  </div>
                </p>
              ))}
          </div>
          <Button
            id={`detail-navigation-save`}
            onClick={() => {
              handleUpdateSideNavigationOrder(
                updatedCardContainerOrder?.map((cardContainer) => {
                  return {
                    id: cardContainer.id,
                    name: cardContainer?.name,
                    label: cardContainer?.label,
                    value: cardContainer?.value,
                    type: cardContainer?.type,
                    order: cardContainer?.order,
                    metadata: cardContainer?.metadata,
                  };
                })
              );
            }}
            kind="next"
            disabled={savingProcess}
            loading={savingProcess}
            userEventName={`detail-navigation-save`}
          >
            Save
          </Button>
        </>
      </GenericFormModalContainer>
      <Backdrop onClick={() => onCancel()} renderFullPage />
    </>
  );
};
