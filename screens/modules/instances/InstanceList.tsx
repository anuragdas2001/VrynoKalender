import GenericList, {
  GenericListHeaderType,
} from "../../../components/TailwindControls/Lists/GenericList";
import { IDeleteModalState } from "../crm/generic/GenericModelView/exportGenericModelDashboardTypes";
import { IInstance } from "../../../models/Accounts";
import { Config } from "../../../shared/constants";
import { useRouter } from "next/router";

export type InstanceListType = {
  tableHeaders: Array<GenericListHeaderType>;
  data: Array<IInstance>;
  filterValue?: string;
  setDeleteModal: (deleteModal: IDeleteModalState) => void;
  setEditModal?: (ediModal: IDeleteModalState) => void;
  setRemoveSampleDataModal?: (sampleDataRemove: {
    visible: boolean;
    item: IInstance;
  }) => void;
};

export default function InstanceList({
  tableHeaders,
  data,
  filterValue,
}: InstanceListType) {
  const router = useRouter();
  const { locale } = router;
  return (
    <GenericList
      data={data}
      tableHeaders={tableHeaders}
      filterValue={filterValue}
      listSelector={false}
      rowUrlGenerator={(item) =>
        `${Config.publicRootUrl({
          appHostName: `${Config.appSubDomain}.${Config.appHostName}`,
          appSubDomain: item?.subdomain,
        })}${locale}/${Config.crmApplicationPath}`
      }
    />
  );
}
