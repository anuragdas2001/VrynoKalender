import PhoneIcon from "remixicon-react/PhoneLineIcon";
import TaskIcon from "remixicon-react/TaskLineIcon";
import MeetingIcon from "remixicon-react/CalendarLineIcon";
import DeleteBinIcon from "remixicon-react/DeleteBin5LineIcon";
import FileLineIcon from "remixicon-react/FileLineIcon";
import MailLineIcon from "remixicon-react/MailLineIcon";
import FilePDFIcon from "remixicon-react/FilePdfFillIcon";
import FileCopyIcon from "remixicon-react/FileCopyLineIcon";
import { AllowedViews } from "../../../../../models/allowedViews";
import { appsUrlGenerator } from "../../shared/utils/appsUrlGenerator";
import {
  IGenericConversionFormData,
  SupportedApps,
} from "../../../../../models/shared";
import { IGenericActivityLabel } from "./TypesGenericModelDetails";
import {
  GeneralVisibilityProps,
  IFormModalObject,
} from "./IGenericFormDetails";
import { NextRouter } from "next/router";
import {
  modelNameMapperForParamURLGenerator,
  modelNameValuesWithSystemSubForm,
} from "../../shared/utils/modelNameMapperForParamUrlGenerator";

export const EditDropdownListGenerator = ({
  id,
  modelName,
  currentModuleLabel,
  appName,
  navActivityModuleLabels,
  setSendEmailModal,
  setFormModal,
  setExportPdfModal,
  setDeleteModal,
  router,
  salesOrderModuleLabel,
  invoiceModuleLabel,
  setDisplayConversionModal,
  quoteConverted,
  salesOrderConverted,
}: {
  id: string;
  modelName: string;
  currentModuleLabel: any;
  appName: SupportedApps;
  navActivityModuleLabels: IGenericActivityLabel;
  setSendEmailModal: React.Dispatch<React.SetStateAction<boolean>>;
  setFormModal: React.Dispatch<React.SetStateAction<IFormModalObject>>;
  setExportPdfModal: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteModal: React.Dispatch<React.SetStateAction<GeneralVisibilityProps>>;
  router: NextRouter;
  salesOrderModuleLabel: string;
  invoiceModuleLabel: string;
  setDisplayConversionModal: (value: IGenericConversionFormData) => void;
  quoteConverted: boolean | null;
  salesOrderConverted: boolean | null;
}) => {
  const editDropdownList = [
    {
      icon: (
        <MailLineIcon size={16} className="mr-2 text-vryno-dropdown-icon" />
      ),
      label: "Send Email",
      onClick: () => {
        setSendEmailModal(true);
      },
      labelClasses: "",
    },
  ];
  if (navActivityModuleLabels.callLog)
    editDropdownList.push({
      icon: <PhoneIcon size={16} className="mr-2 text-vryno-dropdown-icon" />,
      label: `Create ${navActivityModuleLabels.callLog}`,
      onClick: () =>
        setFormModal({
          visible: true,
          formDetails: {
            type: "Add",
            parentId: id,
            parentModelName: modelName,
            id: null,
            modelName: "callLog",
            aliasName: "Call Log",
            appName: appName,
          },
        }),
      labelClasses: "",
    });
  if (navActivityModuleLabels.task)
    editDropdownList.push({
      icon: <TaskIcon size={16} className="mr-2 text-vryno-dropdown-icon" />,
      label: `Create ${navActivityModuleLabels.task}`,
      onClick: () =>
        setFormModal({
          visible: true,
          formDetails: {
            type: "Add",
            parentId: id,
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
    editDropdownList.push({
      icon: <MeetingIcon size={16} className="mr-2 text-vryno-dropdown-icon" />,
      label: `Schedule ${navActivityModuleLabels.meeting}`,
      onClick: () =>
        setFormModal({
          visible: true,
          formDetails: {
            type: "Add",
            parentId: id,
            parentModelName: modelName,
            id: null,
            modelName: "meeting",
            aliasName: "Meeting",
            appName: appName,
          },
        }),
      labelClasses: "",
    });

  editDropdownList.push(
    {
      icon: (
        <FileCopyIcon size={16} className="mr-2 text-vryno-dropdown-icon" />
      ),
      label: `Clone ${currentModuleLabel}`,
      onClick: () => {
        router?.replace(
          appsUrlGenerator(
            appName,
            modelName,
            AllowedViews.add,
            undefined,
            modelNameValuesWithSystemSubForm.includes(modelName)
              ? [
                  `?cloneId=${id}&&subform=${
                    modelNameMapperForParamURLGenerator(modelName)?.subForm
                  }&&dependingModule=product&&subformfield=${
                    modelNameMapperForParamURLGenerator(modelName)
                      ?.subFormFieldLinked
                  }`,
                ]
              : [`?cloneId=${id}`]
          )
        );
      },
      labelClasses: "",
    },
    {
      icon: <FilePDFIcon size={16} className="mr-2 text-vryno-dropdown-icon" />,
      label: `Export PDF`,
      onClick: () => {
        setExportPdfModal(true);
      },
      labelClasses: "",
    },
    {
      icon: (
        <DeleteBinIcon size={16} className="mr-2 text-vryno-dropdown-icon" />
      ),
      label: `Delete ${currentModuleLabel}`,
      onClick: () => setDeleteModal({ visible: true, id: id }),
      labelClasses: "",
    }
  );
  if (modelName === "lead") {
    const poppedData: any = editDropdownList.pop();
    editDropdownList.push(
      {
        icon: (
          <FileLineIcon size={16} className="mr-2 text-vryno-dropdown-icon" />
        ),
        label: `Convert`,
        onClick: () => {
          router?.replace(
            appsUrlGenerator(appName, modelName, AllowedViews.conversion, id)
          );
        },
        labelClasses: "",
      },
      poppedData
    );
  }
  if (modelName === "quote" && !quoteConverted) {
    const poppedData: any = editDropdownList.pop();
    editDropdownList.push(
      ...[
        {
          icon: (
            <FileLineIcon size={16} className="mr-2 text-vryno-dropdown-icon" />
          ),
          label: `Convert to ${salesOrderModuleLabel}`,
          onClick: () =>
            setDisplayConversionModal({
              data: {
                convertToModuleLabel: salesOrderModuleLabel,
                id: id,
                modelName: "quoteToSalesOrder",
              },
              visible: true,
            }),
          labelClasses: "",
        },
        {
          icon: (
            <FileLineIcon size={16} className="mr-2 text-vryno-dropdown-icon" />
          ),
          label: `Convert to ${invoiceModuleLabel}`,
          onClick: () =>
            setDisplayConversionModal({
              data: {
                convertToModuleLabel: invoiceModuleLabel,
                id: id,
                modelName: "quoteToInvoice",
              },
              visible: true,
            }),
          labelClasses: "",
        },
        poppedData,
      ]
    );
  }
  if (modelName === "salesOrder" && !salesOrderConverted) {
    const poppedData: any = editDropdownList.pop();
    editDropdownList.push(
      ...[
        {
          icon: (
            <FileLineIcon size={16} className="mr-2 text-vryno-dropdown-icon" />
          ),
          label: `Convert to ${invoiceModuleLabel}`,
          onClick: () =>
            setDisplayConversionModal({
              data: {
                convertToModuleLabel: invoiceModuleLabel,
                id: id,
                modelName: "salesOrderToInvoice",
              },
              visible: true,
            }),
          labelClasses: "",
        },
        poppedData,
      ]
    );
  }
  return editDropdownList;
};
