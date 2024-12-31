import { INote } from "../../../../../../models/INote";
import { ICustomField } from "../../../../../../models/ICustomField";
import ViewRichTextEditor from "../../../../../../components/TailwindControls/Form/RichTextEditor/ViewRichTextEditor";
import TimeIcon from "remixicon-react/TimeLineIcon";
import { getDateAndTime } from "../../../../../../components/TailwindControls/DayCalculator";
import UserIcon from "remixicon-react/UserLineIcon";
import { GenericField } from "../GenericField";
import { Config } from "../../../../../../shared/constants";
import { cookieUserStore } from "../../../../../../shared/CookieUserStore";
import { downloadFile } from "../../../shared/utils/downloadFile";
import EditIcon from "remixicon-react/EditBoxLineIcon";
import DeleteIcon from "remixicon-react/DeleteBinLineIcon";
import React, { useContext } from "react";
import { GetUserProfileInitials } from "../../../../../Shared/GetUserProfileInitials";
import { UserStoreContext } from "../../../../../../stores/UserStore";
import { IDeleteModalState } from "../ActivityRelatedTo/activityRelatedToHelper";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import { get } from "lodash";
import {
  IUserPreference,
  SupportedApps,
} from "../../../../../../models/shared";
import { LoadMoreDataComponent } from "../../../../../../components/TailwindControls/LoadMoreDataComponent";
import { useLazyQuery } from "@apollo/client";
import { FETCH_QUERY } from "../../../../../../graphql/queries/fetchQuery";
import { AccountModels } from "../../../../../../models/Accounts";
import { DetailRecordImageControl } from "../../../shared/components/ReadOnly/DetailRecordImageControl";

const getInitials = (firstName: string | null, lastName: string) => {
  return `${firstName ? firstName[0] : ""}${
    lastName ? lastName[0] : ""
  }`.toUpperCase();
};

export const uploadFileToModule = "note";
export type NotesListProps = {
  notes: INote[];
  noteSuggestions: {
    items: ({ query }: { query: any }) => any;
    render: () => {
      onKeyDown(props: any): boolean | any;
      onStart: (props: any) => void;
      onExit(): void;
      onUpdate(props: any): void;
    };
  };
  fieldsList: ICustomField[];
  attachmentName: Record<string, string>;
  appName: string;
  setImageModal: (
    value:
      | ((prevState: { visible: boolean; alt: string; url: string }) => {
          visible: boolean;
          alt: string;
          url: string;
        })
      | { visible: boolean; alt: string; url: string }
  ) => void;
  getFileDetails: (attachmentId: string) => void;
  handleEditNote: (value: INote | null) => void;
  setEditMode: (value: ((prevState: boolean) => boolean) | boolean) => void;
  setDeleteModal: (
    value:
      | ((prevState: IDeleteModalState) => IDeleteModalState)
      | IDeleteModalState
  ) => void;
  userPreferences: IUserPreference[];
  modelName: string;
  notesCount: number;
  handleNotesLoadMoreClicked: () => void;
  notesDataLoading: boolean;
};
export function NotesList({
  notes,
  noteSuggestions,
  fieldsList,
  attachmentName,
  appName,
  setImageModal,
  getFileDetails,
  handleEditNote,
  setEditMode,
  setDeleteModal,
  userPreferences,
  modelName,
  notesCount,
  handleNotesLoadMoreClicked,
  notesDataLoading,
}: NotesListProps) {
  const userContext = useContext(UserStoreContext);
  const { user } = userContext;

  const [userImageIdsDict, setUserImageIdsDict] = React.useState<
    Record<
      string,
      {
        recordImage: string | null;
        firstName: string | null;
        middleName: string | null;
        lastName: string;
      }
    >
  >({});

  const [getUserRecordImages] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "cache-first",
    nextFetchPolicy: "standby",
    context: {
      headers: {
        vrynopath: "accounts",
      },
    },
  });

  React.useEffect(() => {
    if (notes?.length) {
      const updatedUserImageIdsDict = { ...userImageIdsDict };
      const requestIds: Set<string> = new Set([]);
      notes.forEach((note) => {
        if (!updatedUserImageIdsDict[note.createdBy]) {
          requestIds.add(note.createdBy);
        }
      });
      if (Array.from(requestIds)?.length) {
        const responseArray = Array.from(requestIds).map(async (id) => {
          const result = await getUserRecordImages({
            variables: {
              modelName: AccountModels.User,
              fields: [
                "firstName",
                "lastName",
                "middleName",
                "id",
                "recordImage",
              ],
              filters: [{ operator: "eq", name: "id", value: [id] }],
            },
          });
          return result;
        });
        Promise.all(responseArray).then((response) => {
          response.forEach((res) => {
            if (res?.data?.fetch?.data?.length) {
              const data = res?.data?.fetch?.data[0];
              updatedUserImageIdsDict[data.id] = {
                recordImage: data.recordImage,
                firstName: data.firstName,
                middleName: data.middleName,
                lastName: data.lastName,
              };
            }
          });
          setUserImageIdsDict(updatedUserImageIdsDict);
        });
      }
    }
  }, [notes]);

  return !notes?.length ? (
    <div className="w-full flex items-center justify-center">
      <span className="text-sm text-gray-600">No Notes Found</span>
    </div>
  ) : (
    <div
      className={`w-full my-2 ${
        userPreferences?.[0]?.defaultPreferences?.[modelName]
          ?.selectedSizeView === "noLimit"
          ? ""
          : "max-h-80 overflow-y-scroll"
      }`}
    >
      {notes.map((noteData: any, index) => (
        <div
          key={`Notes_item_${index}`}
          className={`flex gap-x-3 ${index === 0 ? "px-3 pb-3" : "p-3"}`}
          id={`note-${noteData.id || index}`}
        >
          <div className="w-10 h-10 sm:w-10 sm:h-9 text-xs sm:text-xsm flex flex-row cursor-pointer justify-center items-center rounded-full bg-vryno-theme-blue-secondary text-white">
            {Object.keys(userImageIdsDict)?.length ? (
              userImageIdsDict[noteData.createdBy] ? (
                userImageIdsDict[noteData.createdBy].recordImage ? (
                  <DetailRecordImageControl
                    onDetail={false}
                    data={{
                      recordImage:
                        userImageIdsDict[noteData.createdBy].recordImage,
                    }}
                    field={{
                      label: "Profile Picture",
                      value: "recordImage",
                      dataType: "recordImage",
                      field: undefined,
                    }}
                    isSample={false}
                    modelName={"user"}
                    imageSize={"w-10 h-10"}
                    imageServiceName={SupportedApps.accounts}
                    // customOpacity={customOpacity}
                  />
                ) : (
                  getInitials(
                    userImageIdsDict[noteData.createdBy].firstName,
                    userImageIdsDict[noteData.createdBy].lastName
                  )
                )
              ) : (
                <span>N/A</span>
              )
            ) : (
              <></>
            )}
          </div>
          {/* <GetUserProfileInitials value={get(noteData, "createdBy", "")} /> */}

          <div className="w-full flex justify-between">
            <div className="sm:pl-2 md:pl-0 text-xs text-gray-400 flex flex-col justify-center pr-3">
              <div className="text-black">
                <ViewRichTextEditor
                  data={noteData.note}
                  richTextOverflowScroll={false}
                  supportMentions={true}
                  mentionSuggestions={noteSuggestions}
                  editable={false}
                  fontSize={{ header: "text-xsm", value: "text-xsm" }}
                />
              </div>
              <div className="flex items-center">
                <TimeIcon size={14} className="mr-1" />
                <p>{getDateAndTime(noteData.createdAt, user ?? undefined)}</p>
              </div>
              <div className="flex items-center">
                <UserIcon size={14} className="mr-1" />
                <GenericField
                  data={noteData}
                  fieldsList={fieldsList}
                  fieldName={"createdBy"}
                  headerVisible={false}
                  fontSize={{
                    header: "text-xs",
                    value: "text-xs",
                  }}
                  fontColor={"text-gray-400"}
                />
              </div>
              {noteData.attachment && (
                <div>
                  <Button
                    key={index}
                    id={`attachment_${index}`}
                    customStyle="grid grid-cols-1 w-auto max-w-[112px] rounded-md px-2 py-0.5 mt-1 mb-2 cursor-pointer bg-gray-200 text-gray-800"
                    title={attachmentName[noteData.attachment]}
                    onClick={async (e) => {
                      e.preventDefault();
                      fetch(
                        `${Config.metaPrivateUploadUrl()}${appName}/${uploadFileToModule}/${
                          noteData.attachment
                        }.json`,
                        {
                          method: "GET",
                          headers: {
                            Authorization: `Bearer ${cookieUserStore.getAccessToken()}`,
                          },
                        }
                      )
                        .then((response) => response.json())
                        .then((data) => {
                          if (data?.fileInfo.contentType.includes("image")) {
                            setImageModal({
                              visible: true,
                              url: `${Config.metaPrivateUploadUrl()}${appName}/${uploadFileToModule}/${
                                noteData.attachment
                              }`,
                              alt: attachmentName[noteData.attachment],
                            });
                          } else {
                            downloadFile(
                              `${Config.metaPrivateUploadUrl()}${appName}/${uploadFileToModule}/${
                                noteData.attachment
                              }`,
                              attachmentName[noteData.attachment] ||
                                noteData.attachment
                            );
                          }
                        });
                    }}
                    truncateText={true}
                    userEventName="download-note-attachment-click"
                  >
                    <span className="text-xs">
                      {noteData?.attachment &&
                      attachmentName[noteData.attachment] ? (
                        attachmentName[noteData.attachment]
                      ) : (
                        <>{getFileDetails(noteData.attachment)}</>
                      )}
                    </span>
                  </Button>
                </div>
              )}
            </div>
            <div className="flex sm:justify-between gap-x-2 mt-1 sm:mt-0 items-start">
              <Button
                id={`edit-note-${index}`}
                onClick={() => {
                  handleEditNote(noteData);
                  setEditMode(true);
                }}
                customStyle=""
                userEventName="note-edit:action-click"
              >
                <EditIcon
                  className="text-vryno-theme-light-blue cursor-pointer"
                  size={18}
                />
              </Button>
              <Button
                id={`delete-note-${index}`}
                onClick={() =>
                  setDeleteModal({
                    visible: true,
                    item: { modelName: "Note", id: noteData.id },
                  })
                }
                customStyle=""
                userEventName="note-delete:action-click"
              >
                <DeleteIcon
                  className="text-vryno-theme-light-blue cursor-pointer"
                  size={18}
                />
              </Button>
            </div>
          </div>
        </div>
      ))}
      <LoadMoreDataComponent
        itemsCount={notesCount}
        currentDataCount={notes?.length ?? 0}
        loading={notesDataLoading}
        handleLoadMoreClicked={handleNotesLoadMoreClicked}
      />
    </div>
  );
}
