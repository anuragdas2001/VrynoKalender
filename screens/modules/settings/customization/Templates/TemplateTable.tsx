import { useRouter } from "next/router";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { SupportedDataTypes } from "../../../../../models/ICustomField";
import { IEmailTemplate } from "../../../../../models/shared";
import { ActionWrapper } from "../../../crm/shared/components/ActionWrapper";
import ItemsLoader from "../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import { NoViewPermission } from "../../../crm/shared/components/NoViewPermission";
import { TemplateList } from "./TemplateList";
import NoDataFoundContainer from "../../../crm/shared/components/NoDataFoundContainer";
import EditBoxIcon from "remixicon-react/EditBoxLineIcon";
import DeleteBinIcon from "remixicon-react/DeleteBin5LineIcon";

const emailTemplateTableHeader = (
  editEmailTemplate: any,
  deleteEmailTemplate: any
) => [
  {
    label: "Template Name",
    columnName: "name",
    dataType: SupportedDataTypes.singleline,
  },
  {
    label: "Template Subject",
    columnName: "subject",
    dataType: SupportedDataTypes.singleline,
  },
  {
    label: "Module Name",
    columnName: "templateModuleName",
    dataType: SupportedDataTypes.singleline,
  },
  {
    label: "Last Modified",
    columnName: "updatedAt",
    dataType: SupportedDataTypes.date,
  },
  {
    label: "Actions",
    columnName: "actions",
    dataType: SupportedDataTypes.singleline,
    render: (item: IEmailTemplate, index: number) => {
      return (
        <ActionWrapper
          index={index}
          content={
            <div className="flex flex-row gap-x-2 items-center">
              <Button
                id={`edit-template-${item.name}`}
                onClick={() => editEmailTemplate(item)}
                customStyle=""
                userEventName="template-edit:action-click"
              >
                <EditBoxIcon
                  size={20}
                  className="text-vryno-theme-light-blue cursor-pointer"
                />
              </Button>
              <Button
                id={`delete-template-${item.name}`}
                onClick={() => deleteEmailTemplate(item)}
                customStyle=""
                userEventName="template-delete:action-click"
              >
                <DeleteBinIcon
                  size={20}
                  className="text-vryno-theme-light-blue cursor-pointer"
                />
              </Button>
            </div>
          }
        />
      );
    },
  },
];

export const TemplateTable = ({
  dataFetchProcessing,
  currentTemplateType,
  emailTemplateViewPermission,
  moduleTemplateViewPermission,
  emailTemplates,
  moduleTemplates,
  filterValue,
  deleteEmailTemplate,
}: {
  dataFetchProcessing: boolean;
  currentTemplateType: "email-template" | "module-template";
  emailTemplateViewPermission: boolean;
  moduleTemplateViewPermission: boolean;
  emailTemplates: IEmailTemplate[];
  moduleTemplates: IEmailTemplate[];
  filterValue: string;
  deleteEmailTemplate: (item: IEmailTemplate) => void;
}) => {
  const router = useRouter();
  const viewPermission =
    currentTemplateType === "email-template"
      ? emailTemplateViewPermission
      : currentTemplateType === "module-template"
      ? moduleTemplateViewPermission
      : false;
  let data =
    currentTemplateType === "email-template"
      ? emailTemplates
      : currentTemplateType === "module-template"
      ? moduleTemplates
      : [];

  return (
    <>
      {dataFetchProcessing ? (
        ItemsLoader({ currentView: "List", loadingItemCount: 4 })
      ) : !viewPermission ? (
        <NoViewPermission
          modelName={`${
            currentTemplateType === "email-template"
              ? "Email Template"
              : "Module Template"
          }`}
          addPadding={false}
          marginTop={"mt-8"}
        />
      ) : data.length > 0 ? (
        <div className="bg-white h-full pt-4 pb-1 px-4 rounded-xl mt-2">
          <TemplateList
            data={data}
            tableHeaders={emailTemplateTableHeader(
              (item: IEmailTemplate) =>
                router.push(
                  `/settings/crm/templates/${currentTemplateType}/edit/${item.id}`
                ),
              (item: IEmailTemplate) => deleteEmailTemplate(item)
            )}
            modelName="emailTemplate"
            filterValue={filterValue}
          />
        </div>
      ) : (
        <NoDataFoundContainer
          modelName={`${
            currentTemplateType === "email-template"
              ? "Email Template"
              : "Module Template"
          }`}
          onClick={() =>
            router.push(`/settings/crm/templates/${currentTemplateType}/add`)
          }
        />
      )}
    </>
  );
};
