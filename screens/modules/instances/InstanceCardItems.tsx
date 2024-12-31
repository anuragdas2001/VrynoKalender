import { IInstance } from "../../../models/Accounts";
import { NextRouter } from "next/router";
import { IDeleteModalState } from "../crm/generic/GenericModelView/exportGenericModelDashboardTypes";
import InstanceCard from "./InstanceCard";
import { SupportedDataTypes } from "../../../models/ICustomField";
import { Config } from "../../../shared/constants";
import EditBoxIcon from "remixicon-react/EditBoxLineIcon";
import ClipboardIcon from "remixicon-react/ClipboardLineIcon";
import DeleteBinIcon from "remixicon-react/DeleteBin5LineIcon";
import BuildingIcon from "remixicon-react/BuildingLineIcon";
import React from "react";
import { SampleModalType } from "./InstanceDashboard";

interface IInstanceCardItemsProps {
  locale: string;
  instances: IInstance[];
  router: NextRouter;
  setInstanceLightbox: (deleteModal: IDeleteModalState) => void;
  setDeleteModal: (deleteModal: IDeleteModalState) => void;
  setRemoveSampleDataModal: (removeModal: SampleModalType) => void;
  modelName: string;
}

export const InstanceCardItems = ({
  locale,
  instances,
  router,
  setInstanceLightbox,
  setDeleteModal,
  setRemoveSampleDataModal,
  modelName,
}: IInstanceCardItemsProps) => {
  if (!instances || instances.length === 0) {
    return null;
  }
  return (
    <>
      {instances.map((instance, index) => (
        <InstanceCard
          key={index}
          modelName={modelName}
          visibleHeaders={[
            {
              label: "",
              columnName: "logo",
              dataType: SupportedDataTypes.recordImage,
            },
            {
              label: "Sub Domain",
              columnName: "subdomain",
              dataType: SupportedDataTypes.singleline,
            },
            {
              label: "Instance Admins",
              columnName: "instanceAdmins",
              dataType: SupportedDataTypes.singleline,
            },
            {
              label: "Description",
              columnName: "description",
              dataType: SupportedDataTypes.singleline,
              colSpan: 2,
            },
          ]}
          hideShowHeaders={[]}
          data={instance}
          launchUrl={`${Config.publicRootUrl({
            appHostName: `${Config.appSubDomain}.${Config.appHostName}`,
            appSubDomain: instance?.subdomain,
          })}${locale}/${Config.crmApplicationPath}`}
          handleOwnerClick={() =>
            setInstanceLightbox({ visible: true, id: instance.id })
          }
          launchMenuArray={[
            {
              icon: (
                <EditBoxIcon
                  size={16}
                  className="mr-2 text-vryno-dropdown-icon"
                />
              ),
              label: `Edit`,
              id: "m-menu-edit",
              onClick: () => router.push(`/instances/edit?id=${instance.id}`),
              labelClasses: "sm:hidden",
            },
            {
              icon: (
                <EditBoxIcon
                  size={16}
                  className="mr-2 text-vryno-dropdown-icon"
                />
              ),
              label: `Edit`,
              id: "d-menu-edit",
              onClick: () => {
                setInstanceLightbox({ visible: true, id: instance.id });
                router.push(`/instances?id=${instance.id}`);
              },
              labelClasses: "hidden sm:flex",
            },
            {
              icon: (
                <BuildingIcon
                  size={16}
                  className="mr-2 text-vryno-dropdown-icon"
                />
              ),
              label: "Company",
              id: "company",
              onClick: () =>
                router.push(
                  `${Config.publicRootUrl({
                    appHostName: `${Config.appSubDomain}.${Config.appHostName}`,
                    appSubDomain: instance?.subdomain,
                  })}/company-details/${instance.id}`
                ),
            },
            {
              icon: (
                <ClipboardIcon
                  size={16}
                  className="mr-2 text-vryno-dropdown-icon"
                />
              ),
              label: `Delete Sample Data`,
              id: "delete-sample-data",
              onClick: () =>
                setRemoveSampleDataModal({ visible: true, item: instance }),
              labelClasses: `${instance.isSample ? "flex" : "hidden"}`,
            },
            {
              icon: (
                <DeleteBinIcon
                  size={16}
                  className="mr-2 text-vryno-dropdown-icon"
                />
              ),
              label: `Delete`,
              id: "delete",
              onClick: () => setDeleteModal({ visible: true, id: instance.id }),
            },
          ]}
        />
      ))}
    </>
  );
};
