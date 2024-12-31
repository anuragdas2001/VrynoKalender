import React from "react";
import GenericBackHeader from "../../../shared/components/GenericBackHeader";
import { EmailJobTopSection } from "./EmailJobTopSection";
import { EmailJobItemTable } from "./EmailJobItemTable";
import { EmailSendDetailScreenProps } from "./emailJobItemHelper";
import NoDataFoundContainer from "../../../shared/components/NoDataFoundContainer";
import ItemsLoader from "../../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import { EmailStatsBarGraph } from "./EmailStatsBarGraph";
import GenericHeaderCardContainer from "../../../../../../components/TailwindControls/Cards/GenericHeaderCardContainer";

export const EmailSendDetailScreen = ({
  emailJob,
  emailJobItems,
  template,
  selectedEmailItemTab,
  onEmailItemTabSelection,
  emailJobItemsLoading,
  itemsCount,
  currentPageNumber,
  onPageChange,
  fieldsList,
  appName,
  modelName,
}: EmailSendDetailScreenProps) => {
  const [statusGraphData, setStatusGraphData] = React.useState<
    { name: string; value: number }[]
  >([]);

  React.useEffect(() => {
    let updatedData: Record<string, number> = { other: 0 };
    if (Object.keys(emailJob)?.length > 0 && emailJob.stats) {
      for (const key in emailJob.stats) {
        if (
          ![
            "waiting",
            "open",
            "click",
            "sent",
            "delivered",
            "bounced",
            "cancelled",
            "completed",
            "error",
            "pending",
          ].includes(key)
        ) {
          updatedData = {
            ...updatedData,
            other: updatedData["other"] + emailJob.stats[key],
          };
        } else {
          updatedData = { ...updatedData, [key]: emailJob.stats[key] };
        }
      }
      let data = Object.keys(updatedData).map((status: string) => {
        return {
          name: status,
          value: updatedData[status],
        };
      });
      setStatusGraphData(data);
    }
  }, [emailJob]);

  return (
    <>
      <GenericBackHeader heading={template?.name} />
      <EmailJobTopSection
        selectedEmailItemTab={selectedEmailItemTab}
        onEmailItemTabSelection={onEmailItemTabSelection}
        emailJobItemsLoading={emailJobItemsLoading}
        itemsCount={itemsCount}
        currentPageNumber={currentPageNumber}
        onPageChange={onPageChange}
        emailJobItems={emailJobItems}
      />
      <div className="px-6 w-full h-full">
        {emailJobItemsLoading ? (
          <div className="px-6 py-0">
            <ItemsLoader currentView={"List"} loadingItemCount={4} />
          </div>
        ) : selectedEmailItemTab === "statistics" ? (
          <div className="mt-6 px-6">
            <GenericHeaderCardContainer
              cardHeading="Email Statistics"
              extended={true}
            >
              <>
                {Object.keys(emailJob)?.length > 0 && emailJob.stats && (
                  <EmailStatsBarGraph data={statusGraphData} />
                )}
              </>
            </GenericHeaderCardContainer>
          </div>
        ) : emailJobItems?.length === 0 ? (
          <NoDataFoundContainer
            modelName="Email Job Item"
            containerMessage={`No ${selectedEmailItemTab} email job items found`}
            showButton={false}
          />
        ) : (
          <EmailJobItemTable
            data={emailJobItems}
            fieldsList={fieldsList}
            appName={appName}
            modelName={modelName}
            selectedEmailItemTab={selectedEmailItemTab}
          />
        )}
      </div>
    </>
  );
};
