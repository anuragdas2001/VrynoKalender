import React from "react";
import TaskIcon from "remixicon-react/TaskLineIcon";
import EyeOff from "remixicon-react/EyeOffLineIcon";
import EmailIcon from "remixicon-react/MailLineIcon";
import CallLogIcon from "remixicon-react/PhoneLineIcon";
import NotesIcon from "remixicon-react/FileTextLineIcon";
import DeleteIcon from "remixicon-react/DeleteBinLineIcon";
import MeetingIcon from "remixicon-react/CalendarLineIcon";
import FieldUpdateIcon from "remixicon-react/Edit2LineIcon";
import { TimelineEventType } from "./auditLogDataExtractor";
import LeadConversionIcon from "remixicon-react/FileLineIcon";
import AttachmentIcon from "remixicon-react/KeyboardLineIcon";
import RecordCreateIcon from "remixicon-react/ArticleLineIcon";
import { getAuditDataWithDates } from "./getAuditDataWithDates";
import { IUserPreference } from "../../../../../../models/shared";
import { ICustomField } from "../../../../../../models/ICustomField";
import NotificationIcon from "remixicon-react/Notification3LineIcon";
import { UserStoreContext } from "../../../../../../stores/UserStore";
import { getAllUniqueAuditLogDates } from "./getAllUniqueAuditLogDates";
import { getDateAndTime } from "../../../../../../components/TailwindControls/DayCalculator";
import { GeneralStoreContext } from "../../../../../../stores/RootStore/GeneralStore/GeneralStore";
import {
  INotesSuggestions,
  TimelineContentMessageComponent,
} from "./TimelineContentMessageComponent";
import { ILayout } from "../../../../../../models/ILayout";

const moduleDeleteArray = [
  "recordDelete",
  "activityDelete",
  "quotedItemDelete",
  "orderedItemDelete",
  "invoicedItemDelete",
  "purchaseItemDelete",
];

const moduleUpdateArray = [
  "fieldUpdate",
  "activityUpdate",
  "quotedItemUpdate",
  "orderedItemUpdate",
  "invoicedItemUpdate",
  "purchaseItemUpdate",
];

const LOGO_DICT = {
  TaskActivity: <TaskIcon size={16} className="text-white" />,
  MeetingActivity: <MeetingIcon size={16} className="text-white" />,
  CallLogActivity: <CallLogIcon size={16} className="text-white" />,
  NoteActivity: <NotesIcon size={16} className="text-white" />,
  AttachmentActivity: <AttachmentIcon size={16} className="text-white" />,
  recordCreate: <RecordCreateIcon size={16} className="text-white" />,
  quotedItemCreate: <RecordCreateIcon size={16} className="text-white" />,
  quotedItemUpdate: <FieldUpdateIcon size={16} className="text-white" />,
  quotedItemDelete: <DeleteIcon size={16} className="text-white" />,
  orderedItemCreate: <RecordCreateIcon size={16} className="text-white" />,
  orderedItemUpdate: <FieldUpdateIcon size={16} className="text-white" />,
  orderedItemDelete: <DeleteIcon size={16} className="text-white" />,
  invoicedItemCreate: <RecordCreateIcon size={16} className="text-white" />,
  invoicedItemUpdate: <FieldUpdateIcon size={16} className="text-white" />,
  invoicedItemDelete: <DeleteIcon size={16} className="text-white" />,
  purchaseItemCreate: <RecordCreateIcon size={16} className="text-white" />,
  purchaseItemUpdate: <FieldUpdateIcon size={16} className="text-white" />,
  purchaseItemDelete: <DeleteIcon size={16} className="text-white" />,
  leadConvert: <LeadConversionIcon size={16} className="text-white" />,
  fieldUpdate: <FieldUpdateIcon size={16} className="text-white" />,
  InAppNotificationWorkflow: (
    <NotificationIcon size={16} className="text-white" />
  ),
  EmailWorkflow: <EmailIcon size={16} className="text-white" />,
  WebhookWorkflow: <EmailIcon size={16} className="text-white" />,
  recordDelete: <DeleteIcon size={16} className="text-white" />,
  maskedView: <EyeOff size={16} className="text-white" />,
};

export const TimelineRecordList = ({
  filteredTimelineData,
  userPreferences,
  modelName,
  noteSuggestions,
  fieldsList,
  layouts,
}: {
  filteredTimelineData: TimelineEventType[];
  userPreferences: IUserPreference[];
  modelName: string;
  noteSuggestions: INotesSuggestions;
  fieldsList: ICustomField[];
  layouts: ILayout[];
}) => {
  const userContext = React.useContext(UserStoreContext);
  const { user } = userContext;

  const { generalModelStore } = React.useContext(GeneralStoreContext);
  const { genericModels } = generalModelStore;

  return filteredTimelineData?.length ? (
    getAllUniqueAuditLogDates(filteredTimelineData, user ?? undefined).map(
      (uniqueDate, index) => (
        <div key={index} className={`py-2`}>
          <hr
            data-testid={uniqueDate}
            className="hr-text px-4"
            data-content={`${uniqueDate}`}
          />
          {
            <div
              className={`mt-4 h-full mx-4 ${
                userPreferences?.[0]?.defaultPreferences?.[modelName]
                  ?.selectedSizeView === "noLimit"
                  ? ""
                  : "max-h-80 overflow-scroll timeline-scroll"
              }`}
            >
              {getAuditDataWithDates(filteredTimelineData, user ?? undefined)
                .filter(
                  (reminderData) => reminderData.createdAtDate === uniqueDate
                )
                ?.map((data, index) => {
                  return (
                    <div className="flex mb-4" key={index}>
                      <div
                        className={`mt-1 mr-4 w-7 max-w-[10%] lg:max-w-[6%] h-7 flex items-center justify-center rounded-[50%] ${
                          moduleDeleteArray.includes(data.type)
                            ? "bg-vryno-danger"
                            : moduleUpdateArray.includes(data.type)
                            ? "bg-vryno-green-dark"
                            : "bg-vryno-theme-blue"
                        }`}
                      >
                        {
                          // @ts-ignore
                          LOGO_DICT[
                            [
                              "activityCreate",
                              "activityUpdate",
                              "activityDelete",
                            ].includes(data.type)
                              ? // @ts-ignore
                                data.activityType?.type
                              : data.type === "workflowAction"
                              ? data.workflowType.__typename
                              : data.type
                          ] || <></>
                        }
                      </div>
                      <div
                        className="w-full max-w-[90%] lg:max-w-[94%] py-2 px-4 bg-vryno-theme-highlighter-blue rounded-md"
                        id={`audit-log-record-${index}`}
                      >
                        <div className="flex flex-col md:flex-row text-xsm">
                          {data.type !== "maskedView" ? (
                            <p className="whitespace-nowrap">
                              {moduleDeleteArray.includes(data.type) ? (
                                <span className="text-vryno-danger">
                                  Deleted
                                </span>
                              ) : moduleUpdateArray.includes(data.type) ? (
                                <span className="text-vryno-green-dark">
                                  Updated
                                </span>
                              ) : (
                                <span className="text-vryno-theme-blue">
                                  Added
                                </span>
                              )}
                            </p>
                          ) : (
                            <></>
                          )}
                          {data.type !== "maskedView" ? (
                            <span className="hidden md:block mx-1 text-center">
                              {" "}
                            </span>
                          ) : (
                            <></>
                          )}
                          <div className="w-auto">
                            {TimelineContentMessageComponent[data.type](
                              // @ts-ignore
                              data,
                              noteSuggestions,
                              fieldsList,
                              genericModels,
                              user,
                              layouts
                            )}
                          </div>
                        </div>
                        {data.type !== "maskedView" ? (
                          <div
                            className="flex items-center gap-x-2 text-xs text-gray-400"
                            id={`audit-log-date-${index}`}
                          >
                            <span>{`by ${data.createdBy} - ${getDateAndTime(
                              data.createdAt,
                              user ?? undefined
                            )}`}</span>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          }
        </div>
      )
    )
  ) : (
    <div
      className="w-full flex items-center justify-center"
      id="audit-log-no-data-found"
    >
      <span className="text-sm text-gray-600">No Data Found</span>
    </div>
  );
};
