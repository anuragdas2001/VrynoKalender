import React from "react";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import Pagination from "../../../shared/components/Pagination";
import { SideDrawer } from "../../../shared/components/SideDrawer";
import { IEmailJobTopSection } from "./emailJobItemHelper";

export const EmailJobTopSection = ({
  selectedEmailItemTab,
  onEmailItemTabSelection,
  emailJobItemsLoading,
  itemsCount,
  currentPageNumber,
  onPageChange,
  emailJobItems,
}: IEmailJobTopSection) => {
  const [sideMenuClass, setSideMeuClass] = React.useState("-translate-x-full");

  const FilterTabButtons = () => {
    return (
      <>
        <div>
          <Button
            id="email_job-statistics"
            buttonType={
              selectedEmailItemTab === "statistics" ? "pointedDownBox" : "thin"
            }
            onClick={() => onEmailItemTabSelection("statistics")}
            paddingStyle="py-2 px-6"
            userEventName="massEmail-statistics:tab-click"
          >
            <p>Statistics</p>
          </Button>
        </div>
        <div>
          <Button
            id="email_job-cancelled"
            buttonType={
              selectedEmailItemTab === "cancelled" ? "pointedDownBox" : "thin"
            }
            onClick={() => onEmailItemTabSelection("cancelled")}
            paddingStyle="py-2 px-6"
            userEventName="massEmail-cancelled:tab-click"
          >
            <p>Cancelled</p>
          </Button>
        </div>
        <div>
          <Button
            id="email_job-success"
            buttonType={
              selectedEmailItemTab === "success" ? "pointedDownBox" : "thin"
            }
            onClick={() => onEmailItemTabSelection("success")}
            paddingStyle="py-2 px-6"
            userEventName="massEmail-success:tab-click"
          >
            <p>Success</p>
          </Button>
        </div>
        <div>
          <Button
            id="email_job-sent"
            buttonType={
              selectedEmailItemTab === "sent" ? "pointedDownBox" : "thin"
            }
            onClick={() => onEmailItemTabSelection("sent")}
            paddingStyle="py-2 px-6"
            userEventName="massEmail-sent:tab-click"
          >
            <p>Sent</p>
          </Button>
        </div>
        <div>
          <Button
            id="email_job-delivered"
            buttonType={
              selectedEmailItemTab === "delivered" ? "pointedDownBox" : "thin"
            }
            onClick={() => onEmailItemTabSelection("delivered")}
            paddingStyle="py-2 px-6"
            userEventName="massEmail-delivered:tab-click"
          >
            <p>Delivered</p>
          </Button>
        </div>
        <div>
          <Button
            id="email_job-failed"
            buttonType={
              selectedEmailItemTab === "failed" ? "pointedDownBox" : "thin"
            }
            onClick={() => onEmailItemTabSelection("failed")}
            paddingStyle="py-2 px-6"
            userEventName="massEmail-failed:tab-click"
          >
            <p>Failed</p>
          </Button>
        </div>
        <div>
          <Button
            id="email_job-bounced"
            buttonType={
              selectedEmailItemTab === "bounced" ? "pointedDownBox" : "thin"
            }
            onClick={() => onEmailItemTabSelection("bounced")}
            paddingStyle="py-2 px-6"
            userEventName="massEmail-bounced:tab-click"
          >
            <p>Bounced</p>
          </Button>
        </div>
        <div>
          <Button
            id="email_job-other"
            buttonType={
              selectedEmailItemTab === "other" ? "pointedDownBox" : "thin"
            }
            onClick={() => onEmailItemTabSelection("other")}
            paddingStyle="py-2 px-6"
            userEventName="massEmail-others:tab-click"
          >
            <p>Others</p>
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className="px-6 pt-6">
      <div className="flex flex-col gap-x-12">
        <div className="lg:hidden w-48">
          <SideDrawer
            sideMenuClass={sideMenuClass}
            setSideMenuClass={setSideMeuClass}
            buttonType="thin"
            childrenClasses="flex flex-col gap-y-10 mt-6"
            buttonLabel="Filter Tabs"
            screenBreakpoint="lg"
          >
            {FilterTabButtons()}
          </SideDrawer>
        </div>
        <div className="hidden lg:flex gap-x-6 md:w-1/3">
          {FilterTabButtons()}
        </div>

        {selectedEmailItemTab !== "statistics" ? (
          <div
            className={`flex mt-4 w-full mb-6 self-end justify-end ${
              emailJobItemsLoading || itemsCount === 0 ? "hidden" : ""
            }`}
          >
            <Pagination
              itemsCount={itemsCount}
              currentPageItemCount={emailJobItems?.length}
              pageSize={50}
              onPageChange={(pageNumber) => onPageChange(pageNumber)}
              currentPageNumber={currentPageNumber}
              pageInfoLocation="between"
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
