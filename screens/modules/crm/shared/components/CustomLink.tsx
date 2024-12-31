import React, { useContext } from "react";
import Link from "next/link";
import { useAccountsFetchQuery } from "../utils/operations";
import { UserStoreContext } from "../../../../../stores/UserStore";
import { IRole } from "../../../../../models/shared";

export type CustomLinkProps = {
  serviceName?: string;
  linkDetails: Partial<{
    label: string;
    style: string;
    onClick: (T?: any) => void;
  }>;
};

export const CustomLink = ({
  serviceName,
  linkDetails = { style: "" },
}: CustomLinkProps) => {
  const { user: currentUser } = useContext(UserStoreContext);
  const [rolesList, setRolesList] = React.useState<IRole[]>([]);

  useAccountsFetchQuery<IRole>({
    variables: {
      modelName: "Role",
      fields: ["id", "role", "key", "createdBy", "createdAt"],
      filters: [
        {
          operator: "in",
          name: "id",
          value: currentUser?.roleIds?.length ? currentUser.roleIds : "",
        },
      ],
    },
    onDataRecd: (data) => {
      setRolesList(data);
    },
  });

  return (
    <Link href="" legacyBehavior>
      <a
        onClick={(e) => {
          e.preventDefault();
          linkDetails.onClick;
        }}
        className={linkDetails.style}
      >
        {linkDetails.label}
      </a>
    </Link>
  );
};

export default CustomLink;
