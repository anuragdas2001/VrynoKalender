import React from "react";
import _ from "lodash";
import { AddEditViewType, IRole } from "../../../models/shared";
import { ActionWrapper } from "../crm/shared/components/ActionWrapper";
import { EditDropdown } from "../../../components/TailwindControls/Form/EditDropdown/EditDropdown";
import { useRouter } from "next/router";
import { User } from "../../../models/Accounts";

export interface IFormModalObject {
  visible: boolean;
  formDetails: IGenericFormDetails;
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

export const ReportListActionWrapper = ({
  index,
  record,
  recordId,
  zIndexValue,
  editMenuArray,
  user,
}: {
  zIndexValue?: number | undefined;
  index: number;
  record: any;
  recordId?: string;
  openingRecordId?: string | null;
  editMenuArray: {
    icon: React.JSX.Element;
    label: string;
    onClick: (data: any) => void;
  }[];
  user: User | null;
}) => {
  const [isDropdownUpward, setIsDropdownUpward] = React.useState<{
    id: string;
    visible: boolean;
  }>({ id: "", visible: false });
  const router = useRouter();

  return (
    <ActionWrapper
      index={index}
      zIndexValue={isDropdownUpward.id === recordId ? zIndexValue : 1}
      content={
        <EditDropdown
          editAction={(value: any) =>
            router.push(`/reports/crm/edit/${value.id}`)
          }
          isDropdownUpward={isDropdownUpward}
          setIsDropdownUpward={setIsDropdownUpward}
          editMenuArray={editMenuArray}
          data={record}
          dataTestIdValue={_.get(record, "name", "")}
          disabled={record.createdBy !== user?.id ? true : false}
        />
      }
    />
  );
};
