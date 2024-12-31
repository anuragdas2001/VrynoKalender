import React from "react";
import GenericHeaderCardContainer from "../../../../../../components/TailwindControls/Cards/GenericHeaderCardContainer";
import ItemsLoader from "../../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import { INote } from "../../../../../../models/INote";
import { NotesDeleteModal } from "./NotesDeleteModal";
import { NotesImageModal } from "./NotesImageModal";
import { NotesLeftPanel } from "./NotesLeftPanel";
import { NotesList } from "./NotesList";
import { IDeleteModalState } from "../ActivityRelatedTo/activityRelatedToHelper";
import GenericFormModalContainer from "../../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import { IUserPreference } from "../../../../../../models/shared";
import { ICustomField } from "../../../../../../models/ICustomField";
import { NotesQuickAddForm } from "./NotesQuickAddForm";

export const NotesContainer = ({
  id,
  selectedNote,
  clearFiles,
  handleEditNote,
  setClearFiles,
  resetClearFiles,
  noteSuggestions,
  setSelected,
  modelName,
  recordId,
  notesCount,
  setNotesCount,
  setNotesList,
  notes,
  setQuickCreateNoteModal,
  userPreferences,
  handleOpenCollapseCardContainer,
  notesDataLoading,
  fieldsList,
  attachmentName,
  appName,
  getFileDetails,
  handleNotesLoadMoreClicked,
  quickCreateNoteModal,
}: {
  id: string;
  selectedNote: INote | null;
  clearFiles: boolean;
  handleEditNote: (value: INote | null) => void;
  setClearFiles: React.Dispatch<React.SetStateAction<boolean>>;
  resetClearFiles: (value: boolean) => void;
  noteSuggestions: {
    items: ({ query }: { query: any }) => Promise<any>;
    render: () => {
      onStart: (props: any) => void;
      onUpdate(props: any): void;
      onKeyDown(props: any): any;
      onExit(): void;
    };
  };
  setSelected: (value: INote | null) => void;
  modelName: string;
  recordId: string;
  notesCount: number;
  setNotesCount: (count: number) => void;
  setNotesList: React.Dispatch<React.SetStateAction<INote[]>>;
  notes: INote[];
  setQuickCreateNoteModal: React.Dispatch<React.SetStateAction<boolean>>;
  userPreferences: IUserPreference[];
  handleOpenCollapseCardContainer: (
    id: string | undefined,
    showDetails: boolean
  ) => void;
  notesDataLoading: boolean;
  fieldsList: ICustomField[];
  attachmentName: Record<string, string>;
  appName: string;
  getFileDetails: (attachmentId: string) => void;
  handleNotesLoadMoreClicked: () => void;
  quickCreateNoteModal: boolean;
}) => {
  const [editMode, setEditMode] = React.useState(false);
  const [imageModal, setImageModal] = React.useState({
    visible: false,
    url: "",
    alt: "",
  });
  const [noteDeleteLoading, setNoteDeleteLoading] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState<IDeleteModalState>({
    visible: false,
    item: { modelName: "", id: "" },
  });

  return (
    <>
      <GenericHeaderCardContainer
        cardHeading={`Notes`}
        extended={true}
        id={id}
        modelName={modelName}
        userPreferences={userPreferences}
        handleOpenCollapseCardContainer={(id, showDetails) =>
          handleOpenCollapseCardContainer(id, showDetails)
        }
      >
        <div
          className={`grid ${
            userPreferences?.[0]?.defaultPreferences?.[modelName]
              ?.selectedSizeView === "noLimit"
              ? ""
              : "lg:grid-cols-2 gap-x-8"
          }`}
        >
          {/* Left Panel Start */}
          <NotesLeftPanel
            selectedNote={selectedNote}
            setEditMode={(value) => setEditMode(value)}
            editMode={editMode}
            clearFiles={clearFiles}
            setClearFiles={(
              value: boolean | ((prevState: boolean) => boolean)
            ) => setClearFiles(value)}
            resetClearFiles={resetClearFiles}
            noteSuggestions={noteSuggestions}
            noteDeleteLoading={noteDeleteLoading}
            setSelected={setSelected}
            modelName={modelName}
            recordId={recordId}
            notesCount={notesCount}
            setNotesCount={setNotesCount}
            setNotesList={setNotesList}
            notes={notes}
            setQuickCreateNoteModal={setQuickCreateNoteModal}
            showLabel={true}
          />
          {/* Left Panel End */}
          {/* Right Panel Start */}
          {notesDataLoading ? (
            <ItemsLoader currentView={"List"} listTypeMarginTop={"mt-0"} />
          ) : (
            <NotesList
              notes={notes}
              noteSuggestions={noteSuggestions}
              fieldsList={fieldsList}
              attachmentName={attachmentName}
              appName={appName}
              setImageModal={setImageModal}
              getFileDetails={getFileDetails}
              handleEditNote={handleEditNote}
              setEditMode={setEditMode}
              setDeleteModal={setDeleteModal}
              userPreferences={userPreferences}
              modelName={modelName}
              notesCount={notesCount}
              handleNotesLoadMoreClicked={handleNotesLoadMoreClicked}
              notesDataLoading={notesDataLoading}
            />
          )}
          <NotesDeleteModal
            deleteModal={deleteModal}
            setDeleteModal={setDeleteModal}
            setNoteDeleteLoading={setNoteDeleteLoading}
            noteDeleteLoading={noteDeleteLoading}
            setNotesList={setNotesList}
            notes={notes}
            appName={appName}
            setNotesCount={setNotesCount}
            notesCount={notesCount}
            selectedNote={selectedNote}
            setClearFiles={setClearFiles}
            setSelected={setSelected}
          />
          <NotesImageModal
            imageModal={imageModal}
            setImageModal={setImageModal}
          />
          {/* Right Panel end */}
        </div>
      </GenericHeaderCardContainer>
      {quickCreateNoteModal ? (
        <>
          <GenericFormModalContainer
            formHeading={"Add Note"}
            // onOutsideClick={() => setQuickCreateNoteModal(false)}
            limitWidth={true}
            onCancel={() => setQuickCreateNoteModal(false)}
          >
            <NotesQuickAddForm
              selectedNote={selectedNote}
              setEditMode={(value) => setEditMode(value)}
              editMode={editMode}
              clearFiles={clearFiles}
              handleEditNote={handleEditNote}
              setClearFiles={(
                value: boolean | ((prevState: boolean) => boolean)
              ) => setClearFiles(value)}
              resetClearFiles={resetClearFiles}
              noteSuggestions={noteSuggestions}
              noteDeleteLoading={noteDeleteLoading}
              setSelected={setSelected}
              modelName={modelName}
              recordId={recordId}
              notesCount={notesCount}
              setNotesCount={setNotesCount}
              setNotesList={setNotesList}
              notes={notes}
              setQuickCreateNoteModal={setQuickCreateNoteModal}
              showLabel={false}
            />
          </GenericFormModalContainer>
          <Backdrop onClick={() => setQuickCreateNoteModal(false)} />
        </>
      ) : (
        <></>
      )}
    </>
  );
};
