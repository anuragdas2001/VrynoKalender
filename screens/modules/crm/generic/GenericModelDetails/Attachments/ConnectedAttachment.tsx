import React, { useContext } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { SAVE_MUTATION } from "../../../../../../graphql/mutations/saveMutation";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import { FormikValues } from "formik";
import { FETCH_QUERY } from "../../../../../../graphql/queries/fetchQuery";
import { ICustomField } from "../../../../../../models/ICustomField";
import { IFile } from "../../../../../../models/IFile";
import { NoViewPermission } from "../../../shared/components/NoViewPermission";
import { AttachmentContainer } from "./AttachmentContainer";
import { ConnectedAttachmentProps } from "./attachmentHelper";
import { GeneralStoreContext } from "../../../../../../stores/RootStore/GeneralStore/GeneralStore";

export const ConnectedAttachment = ({
  cardHeading,
  appName,
  recordId,
  id,
  modelName,
  attachmentsCount = 0,
  userPreferences,
  setAttachmentsCount = () => {},
  handleOpenCollapseCardContainer = () => {},
  setAddAttachmentUrlModalForm,
  setAddAttachmentModalForm,
  addAttachmentUrlModalForm,
  addAttachmentModalForm,
  genericModels,
  allLayoutFetched,
}: ConnectedAttachmentProps) => {
  const { t } = useTranslation(["common"]);
  const [savingProcess, setSavingProcess] = React.useState(false);
  const [attachments, setAttachments] = React.useState<IFile[]>([]);
  const [attachmentMenuVisible, setAttachmentMenuVisible] =
    React.useState(false);
  const [attachmentFieldList, setAttachmentFieldList] = React.useState<
    ICustomField[]
  >([]);
  const [attachmentActivePageNumber, setAttachmentActivePageNumber] =
    React.useState(1);

  const [viewPermission, setViewPermission] = React.useState(true);
  const [attachmentDataLoading, setAttachmentDataLoading] =
    React.useState(true);

  const [getAttachments] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.fetch?.messageKey.includes("-success")) {
        setAttachments([...attachments, ...responseOnCompletion.fetch.data]);
        setAttachmentsCount(responseOnCompletion.fetch.count);
        setViewPermission(true);
        setAttachmentDataLoading(false);
        return;
      } else if (
        responseOnCompletion?.fetch?.messageKey.includes("requires-view")
      ) {
        setViewPermission(false);
        setAttachmentDataLoading(false);
      }
    },
  });

  const [saveAttachment] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (data) => {
      if (
        data.save.data &&
        data.save.data.id &&
        data.save.messageKey.includes("create-success")
      ) {
        toast.success(
          data.save.data.fileType === "attachment_link"
            ? `Link created successfully`
            : `Attachment created successfully`
        );
        data.save.data.fileType === "attachment_link"
          ? setAddAttachmentUrlModalForm({ visible: false, data: {}, id: null })
          : setAddAttachmentModalForm({ visible: false, data: {}, id: null });
        setSavingProcess(false);
        setAttachmentsCount(attachmentsCount + 1);
        setAttachments([data.save.data, ...attachments]);
        return;
      }
      setSavingProcess(false);
      if (data.save.messageKey) {
        toast.error(data.save.message);
        return;
      }
      toast.error(t("common:unknown-message"));
    },
  });

  const [updateAttachment] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
    onCompleted: (data) => {
      if (data?.save?.data && data.save.data.id) {
        toast.success(
          data.save.data.fileType === "attachment_link"
            ? `Link updated successfully`
            : `Attachment updated successfully`
        );
        setAttachments(
          attachments.map((attachment: IFile) => {
            if (attachment.id === data.save.data.id) return data.save.data;
            else return attachment;
          })
        );
        setSavingProcess(false);
        data.save.data.fileType === "attachment_link"
          ? setAddAttachmentUrlModalForm({ visible: false, data: {}, id: null })
          : setAddAttachmentModalForm({ visible: false, data: {}, id: null });
        return;
      }
      setSavingProcess(false);
      if (data.save.messageKey) {
        toast.error(data.save.message);
        return;
      }
      toast.error(t("common:unknown-message"));
    },
  });

  const handleFormSave = async (values: FormikValues, id: string | null) => {
    const saveInput = {
      ...values,
      fileKey:
        values.fileType === "attachment_link"
          ? encodeURI(values["fileName"])
          : values.fileKey,
      relatedTo: [
        {
          moduleName: modelName,
          recordId: recordId,
        },
      ],
    };
    setSavingProcess(true);
    try {
      id
        ? await updateAttachment({
            variables: {
              id: id,
              modelName: "Attachment",
              saveInput: saveInput,
            },
          })
        : await saveAttachment({
            variables: {
              id: null,
              modelName: "Attachment",
              saveInput: saveInput,
            },
          });
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    if (allLayoutFetched) {
      let fieldsListFromStore = genericModels["attachment"]?.fieldsList;
      setAttachmentFieldList([...fieldsListFromStore]);
    }
  }, [allLayoutFetched]);

  const handleFetchAttachments = (pageNumber: number) => {
    getAttachments({
      variables: {
        modelName: "Attachment",
        fields: [
          "id",
          "name",
          "fileName",
          "fileType",
          "fileKey",
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
    });
  };

  React.useEffect(() => {
    if (!appName) return;
    handleFetchAttachments(1);
  }, [recordId, appName]);

  const handleAttachmentLoadMoreClicked = () => {
    const pageNumber = attachmentActivePageNumber + 1;
    setAttachmentDataLoading(true);
    handleFetchAttachments(pageNumber);
    setAttachmentActivePageNumber(pageNumber);
  };

  return viewPermission ? (
    <AttachmentContainer
      setAttachmentMenuVisible={setAttachmentMenuVisible}
      attachmentMenuVisible={attachmentMenuVisible}
      cardHeading={cardHeading}
      setAddAttachmentModalForm={setAddAttachmentModalForm}
      setAttachmentsCount={setAttachmentsCount}
      attachmentsCount={attachmentsCount}
      appName={appName}
      modelName={modelName}
      id={id}
      setAttachments={setAttachments}
      attachments={attachments}
      setAddAttachmentUrlModalForm={setAddAttachmentUrlModalForm}
      attachmentFieldList={attachmentFieldList}
      addAttachmentUrlModalForm={addAttachmentUrlModalForm}
      handleFormSave={handleFormSave}
      savingProcess={savingProcess}
      userPreferences={userPreferences}
      addAttachmentModalForm={addAttachmentModalForm}
      handleOpenCollapseCardContainer={(id, showDetails) =>
        handleOpenCollapseCardContainer(id, showDetails)
      }
      attachmentDataLoading={attachmentDataLoading}
      handleAttachmentLoadMoreClicked={handleAttachmentLoadMoreClicked}
    />
  ) : (
    <NoViewPermission addPadding={false} modelName={"Attachment"} />
  );
};
