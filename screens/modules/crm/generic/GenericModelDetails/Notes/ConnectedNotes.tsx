import React from "react";
import { FETCH_QUERY } from "../../../../../../graphql/queries/fetchQuery";
import { Config } from "../../../../../../shared/constants";
import { useLazyQuery } from "@apollo/client";
import { INote } from "../../../../../../models/INote";
import { cookieUserStore } from "../../../../../../shared/CookieUserStore";
import { NoViewPermission } from "../../../shared/components/NoViewPermission";
import getNoteSuggestions from "./NoteSuggestions";
import { SEARCH_QUERY } from "../../../../../../graphql/queries/searchQuery";
import { ConnectedNotesProps } from "./notesHelper";
import { toast } from "react-toastify";
import { NotesContainer } from "./NotesContainer";
import { uploadFileToModule } from "./NotesList";

export const ConnectedNotes = ({
  appName,
  modelName,
  fieldsList,
  id,
  notesCount = 0,
  userPreferences,
  setNotesCount = () => {},
  recordId,
  handleOpenCollapseCardContainer = () => {},
  quickCreateNoteModal,
  setQuickCreateNoteModal,
}: ConnectedNotesProps) => {
  const [viewPermission, setViewPermission] = React.useState(true);
  const [selectedNote, setSelected] = React.useState<INote | null>(null);
  const [notes, setNotesList] = React.useState<INote[]>([]);
  const [clearFiles, setClearFiles] = React.useState(false);
  const [notesActivePageNumber, setNotesActivePageNumber] =
    React.useState<number>(1);
  const [attachmentName, setAttachmentName] = React.useState<
    Record<string, string>
  >({});
  const [notesDataLoading, setNotesDataLoading] = React.useState(true);

  const [getNotes] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });

  const [getSearchResults] = useLazyQuery(SEARCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "search",
      },
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const noteSuggestions = getNoteSuggestions(getSearchResults);

  const resetClearFiles = (value: boolean) => {
    setClearFiles(value);
  };

  const getFileDetails = (attachmentId: string) => {
    const url = `${Config.metaPrivateUploadUrl()}${appName}/${uploadFileToModule}/${attachmentId}.json`;
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookieUserStore.getAccessToken()}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.fileInfo?.fileName) {
          if (!(attachmentName[attachmentId] === data?.fileInfo?.fileName)) {
            setAttachmentName({
              ...attachmentName,
              [attachmentId]: data?.fileInfo?.fileName,
            });
          }
        }
        return data;
      });
  };

  const handleFetchNotes = (pageNumber: number) => {
    getNotes({
      variables: {
        modelName: "Note",
        fields: [
          "id",
          "note",
          "attachment",
          "createdBy",
          "createdAt",
          "updatedAt",
        ],
        filters: [
          {
            name: "recordId",
            operator: "eq",
            value: [recordId],
          },
        ],
        pageNumber: pageNumber,
      },
    }).then(async (noteData) => {
      if (noteData?.data?.fetch?.messageKey.includes("-success")) {
        if (!noteData?.data?.fetch?.data?.length) {
          setViewPermission(true);
          setNotesDataLoading(false);
          return;
        }
        let attachmentNameData = {};
        const attachmentData = noteData.data.fetch.data.filter(
          (note: { attachment: string }) => note.attachment
        );
        const attachmentPromise = attachmentData.map(
          async (note: { attachment: string }) => {
            const url = `${Config.metaPrivateUploadUrl()}${appName}/${uploadFileToModule}/${
              note.attachment
            }.json`;
            const data = await fetch(url, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${cookieUserStore.getAccessToken()}`,
              },
            });
            return data.json();
          }
        );
        await Promise.all(attachmentPromise).then((response) => {
          for (const att of attachmentData) {
            for (const res of response) {
              if (att.attachment === res?.fileInfo?.id) {
                attachmentNameData = {
                  ...attachmentNameData,
                  [att.attachment]: res?.fileInfo?.fileName,
                };
              }
            }
          }
          // setAttachmentName(attachmentNameData);
          setAttachmentName({
            ...attachmentName,
            ...attachmentNameData,
          });
        });
        if (!notesCount) setNotesCount(noteData.data.fetch.count);
        setNotesList([...notes, ...noteData.data.fetch.data]);
        setViewPermission(true);
        setNotesDataLoading(false);
      } else if (noteData?.data?.fetch?.messageKey.includes("requires-view")) {
        setViewPermission(false);
        setNotesDataLoading(false);
      } else {
        toast.error("Something unexpected happened while fetching notes");
        setViewPermission(true);
        setNotesDataLoading(false);
      }
    });
  };

  React.useEffect(() => {
    if (!appName) return;
    handleFetchNotes(1);
  }, [recordId, appName]);

  const handleNotesLoadMoreClicked = () => {
    const pageNumber = notesActivePageNumber + 1;
    setNotesDataLoading(true);
    setNotesActivePageNumber(pageNumber);
    handleFetchNotes(pageNumber);
  };

  return viewPermission ? (
    <NotesContainer
      id={id}
      selectedNote={selectedNote}
      clearFiles={clearFiles}
      handleEditNote={(value: INote | null) => setSelected(value)}
      setClearFiles={setClearFiles}
      resetClearFiles={resetClearFiles}
      noteSuggestions={noteSuggestions}
      setSelected={(value: INote | null) => setSelected(value)}
      modelName={modelName}
      recordId={recordId}
      notesCount={notesCount}
      setNotesCount={setNotesCount}
      setNotesList={setNotesList}
      notes={notes}
      setQuickCreateNoteModal={setQuickCreateNoteModal}
      userPreferences={userPreferences}
      handleOpenCollapseCardContainer={handleOpenCollapseCardContainer}
      notesDataLoading={notesDataLoading}
      fieldsList={fieldsList}
      attachmentName={attachmentName}
      appName={appName}
      getFileDetails={getFileDetails}
      handleNotesLoadMoreClicked={handleNotesLoadMoreClicked}
      quickCreateNoteModal={quickCreateNoteModal}
    />
  ) : (
    <NoViewPermission addPadding={false} modelName={"Notes"} />
  );
};
