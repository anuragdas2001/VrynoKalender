import React from "react";
import GenericModelCard from "./GenericModelCard";
import PhoneIcon from "remixicon-react/PhoneLineIcon";
import TaskIcon from "remixicon-react/TaskLineIcon";
import MeetingIcon from "remixicon-react/CalendarLineIcon";
import DeleteBinIcon from "remixicon-react/DeleteBin5LineIcon";
import FileLineIcon from "remixicon-react/FileLineIcon";
import {
  getAllCustomViewFieldsArray,
  getAllFieldsObjectArrayForModal,
} from "../../shared/utils/getFieldsArray";
import { appsUrlGenerator } from "../../shared/utils/appsUrlGenerator";
import {
  AddEditView,
  AddEditViewType,
  IGenericConversionFormData,
  SupportedApps,
} from "../../../../../models/shared";
import { AllowedViews } from "../../../../../models/allowedViews";
import { ICustomField } from "../../../../../models/ICustomField";
import router from "next/router";
import { Draggable } from "react-beautiful-dnd";
import FileCopyIcon from "remixicon-react/FileCopyLineIcon";
import _ from "lodash";
import {
  modelNameMapperForParamURLGenerator,
  modelNameValuesWithSystemSubForm,
} from "../../shared/utils/modelNameMapperForParamUrlGenerator";

export interface IDeleteModalState {
  id: string;
  visible: boolean;
}

export interface IGenericFormDetails {
  type: AddEditViewType | null;
  parentId: string;
  parentModelName: string;
  aliasName: string;
  id: string | null;
  modelName: string;
  appName: string;
}

export interface IFormModalObject {
  visible: boolean;
  formDetails: IGenericFormDetails;
}

export type GenericModalCardItemProps = {
  customStyle?: string | null;
  isDraggable?: boolean;
  modelData: Array<Record<string, string>>;
  appName: SupportedApps;
  modelName: string;
  fieldsList: Array<ICustomField>;
  customViewFieldsList?: Array<string>;
  dataProcessed?: boolean;
  dataProcessing?: boolean;
  openingRecordId: string | null;
  setOpeningRecordId: (value: string | null) => void;
  setDeleteModal: (modal: IDeleteModalState) => void;
  setFormModal: (modal: IFormModalObject) => void;
  selectedItems: Array<any>;
  onItemSelect: (selectedItem: any) => void;
  currentModuleLabel: string;
  navActivityModuleLabels: {
    task: string | null;
    meeting: string | null;
    callLog: string | null;
  };
  salesOrderModuleLabel: string;
  invoiceModuleLabel: string;
  setDisplayConversionModal: (value: IGenericConversionFormData) => void;
};

const GenericModelCardItems = ({
  customStyle = null,
  isDraggable = false,
  modelData,
  appName,
  modelName,
  fieldsList,
  customViewFieldsList = [],
  openingRecordId,
  setOpeningRecordId,
  setDeleteModal,
  setFormModal,
  selectedItems,
  dataProcessed,
  dataProcessing,
  onItemSelect,
  currentModuleLabel,
  navActivityModuleLabels,
  salesOrderModuleLabel,
  invoiceModuleLabel,
  setDisplayConversionModal,
}: GenericModalCardItemProps) => {
  const launchMenuGenerator = (item: Record<string, string>) => {
    const menuResult = [];
    if (navActivityModuleLabels.callLog)
      menuResult.push({
        icon: <PhoneIcon size={16} className="mr-2 text-vryno-dropdown-icon" />,
        label: `Create ${navActivityModuleLabels.callLog}`,
        onClick: () =>
          setFormModal({
            visible: true,
            formDetails: {
              type: AddEditView.Add,
              parentId: item["id"],
              parentModelName: modelName,
              id: null,
              modelName: "callLog",
              aliasName: "CallLog",
              appName: appName,
            },
          }),
        labelClasses: "",
      });

    if (navActivityModuleLabels.task)
      menuResult.push({
        icon: <TaskIcon size={16} className="mr-2 text-vryno-dropdown-icon" />,
        label: `Create ${navActivityModuleLabels.task}`,
        onClick: () =>
          setFormModal({
            visible: true,
            formDetails: {
              type: AddEditView.Add,
              parentId: item["id"],
              parentModelName: modelName,
              id: null,
              modelName: "task",
              aliasName: "Task",
              appName: appName,
            },
          }),
        labelClasses: "",
      });

    if (navActivityModuleLabels.meeting)
      menuResult.push({
        icon: (
          <MeetingIcon size={16} className="mr-2 text-vryno-dropdown-icon" />
        ),
        label: `Schedule ${navActivityModuleLabels.meeting}`,
        onClick: () =>
          setFormModal({
            visible: true,
            formDetails: {
              type: AddEditView.Add,
              parentId: item["id"],
              parentModelName: modelName,
              id: null,
              modelName: "meeting",
              aliasName: "Meeting",
              appName: appName,
            },
          }),
        labelClasses: "",
      });

    return [
      ...menuResult,
      {
        icon: (
          <FileCopyIcon size={16} className="mr-2 text-vryno-dropdown-icon" />
        ),
        label: `Clone ${currentModuleLabel}`,
        onClick: () => {
          router?.push(
            appsUrlGenerator(
              appName,
              modelName,
              AllowedViews.add,
              undefined,
              modelNameValuesWithSystemSubForm.includes(modelName)
                ? [
                    `?cloneId=${item.id}&&subform=${
                      modelNameMapperForParamURLGenerator(modelName)?.subForm
                    }&&dependingModule=product&&subformfield=${
                      modelNameMapperForParamURLGenerator(modelName)
                        ?.subFormFieldLinked
                    }`,
                  ]
                : [`?cloneId=${item.id}`]
            )
          );
        },
        labelClasses: "",
      },
      {
        icon: (
          <DeleteBinIcon size={16} className="mr-2 text-vryno-dropdown-icon" />
        ),
        label: `Delete ${currentModuleLabel}`,
        onClick: () => setDeleteModal({ visible: true, id: item.id }),
      },
    ];
  };

  const deleteSessionData = JSON.parse(
    sessionStorage.getItem("bulkDeleteData") || "{}"
  );

  const CardComponent = (
    item: Record<string, string>,
    index: number,
    props: Record<string, any>
  ) => (
    <GenericModelCard
      key={index}
      deleteSessionData={deleteSessionData}
      selectedItems={selectedItems}
      onItemSelect={(value) => onItemSelect(value)}
      dataProcessed={dataProcessed}
      dataProcessing={dataProcessing}
      dataDisplayType={"gridView"}
      openingRecordId={openingRecordId}
      setOpeningRecordId={setOpeningRecordId}
      visibleHeaders={
        customViewFieldsList.length
          ? getAllCustomViewFieldsArray(
              fieldsList,
              customViewFieldsList
            ).splice(
              0,
              getAllCustomViewFieldsArray(fieldsList, customViewFieldsList)
                .splice(0, 5)
                ?.filter((field) => field.dataType === "recordImage")?.length >
                0
                ? 5
                : 4
            )
          : getAllFieldsObjectArrayForModal(fieldsList, "").splice(
              0,
              getAllFieldsObjectArrayForModal(fieldsList, "")
                .splice(0, 5)
                ?.filter((field) => field.dataType === "recordImage")?.length >
                0
                ? 5
                : 4
            )
      }
      headerLink={appsUrlGenerator(
        appName,
        modelName,
        AllowedViews.detail,
        item.id
      )}
      hideShowHeaders={
        customViewFieldsList.length
          ? getAllCustomViewFieldsArray(
              fieldsList,
              customViewFieldsList
            ).splice(
              getAllCustomViewFieldsArray(fieldsList, customViewFieldsList)
                .splice(0, 5)
                ?.filter((field) => field.dataType === "recordImage")?.length >
                0
                ? 5
                : 4
            )
          : getAllFieldsObjectArrayForModal(fieldsList, "").splice(
              getAllFieldsObjectArrayForModal(fieldsList, "")
                .splice(0, 5)
                ?.filter((field) => field.dataType === "recordImage")?.length >
                0
                ? 5
                : 4
            )
      }
      fieldsList={fieldsList}
      data={item}
      launchUrl={appsUrlGenerator(
        appName,
        modelName,
        AllowedViews.edit,
        item.id,
        modelNameValuesWithSystemSubForm.includes(modelName)
          ? [
              `?subform=${
                modelNameMapperForParamURLGenerator(modelName)?.subForm
              }&&dependingModule=product&&subformfield=${
                modelNameMapperForParamURLGenerator(modelName)
                  ?.subFormFieldLinked
              }`,
            ]
          : []
      )}
      launchMenuArray={
        modelName === "lead"
          ? [
              ...launchMenuGenerator(item),
              {
                icon: (
                  <FileLineIcon
                    size={16}
                    className="mr-2 text-vryno-dropdown-icon"
                  />
                ),
                label: `Convert`,
                onClick: () => {
                  router?.replace(
                    appsUrlGenerator(
                      appName,
                      modelName,
                      AllowedViews.conversion,
                      item.id
                    )
                  );
                },
                labelClasses: "",
              },
            ]
          : modelName === "quote" && !_.get(item, "quoteConverted", false)
          ? [
              ...launchMenuGenerator(item),
              {
                icon: (
                  <FileLineIcon
                    size={16}
                    className="mr-2 text-vryno-dropdown-icon"
                  />
                ),
                label: `Convert to ${salesOrderModuleLabel}`,
                onClick: () =>
                  setDisplayConversionModal({
                    data: {
                      convertToModuleLabel: salesOrderModuleLabel,
                      id: item.id,
                      modelName: "quoteToSalesOrder",
                    },
                    visible: true,
                  }),
                labelClasses: "",
              },
              {
                icon: (
                  <FileLineIcon
                    size={16}
                    className="mr-2 text-vryno-dropdown-icon"
                  />
                ),
                label: `Convert to ${invoiceModuleLabel}`,
                onClick: () =>
                  setDisplayConversionModal({
                    data: {
                      convertToModuleLabel: invoiceModuleLabel,
                      id: item.id,
                      modelName: "quoteToInvoice",
                    },
                    visible: true,
                  }),
                labelClasses: "",
              },
            ]
          : modelName === "salesOrder" &&
            !_.get(item, "salesOrderConverted", false)
          ? [
              ...launchMenuGenerator(item),
              {
                icon: (
                  <FileLineIcon
                    size={16}
                    className="mr-2 text-vryno-dropdown-icon"
                  />
                ),
                label: `Convert to ${invoiceModuleLabel}`,
                onClick: () =>
                  setDisplayConversionModal({
                    data: {
                      convertToModuleLabel: invoiceModuleLabel,
                      id: item.id,
                      modelName: "salesOrderToInvoice",
                    },
                    visible: true,
                  }),
                labelClasses: "",
              },
            ]
          : launchMenuGenerator(item)
      }
      {...props}
    />
  );
  return isDraggable ? (
    <>
      {modelData &&
        modelData.map((item, index) => {
          return (
            <Draggable draggableId={item.id} index={index} key={item.id}>
              {(provided, snapshot) => (
                <div
                  className={
                    customStyle
                      ? `${customStyle}`
                      : `text-gray-500 grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 5xl:grid-cols-5 6xl:grid-cols-6 w-full gap-x-6 gap-y-6`
                  }
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                >
                  {CardComponent(item, index, {
                    cardDragging: snapshot.isDragging,
                  })}
                </div>
              )}
            </Draggable>
          );
        })}
    </>
  ) : (
    <div
      className={
        customStyle
          ? customStyle
          : "text-gray-500 grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 5xl:grid-cols-5 6xl:grid-cols-6 w-full gap-x-6 gap-y-6"
      }
    >
      {modelData &&
        modelData.map((item, index) => {
          return CardComponent(item, index, {});
        })}
    </div>
  );
};

export default GenericModelCardItems;
