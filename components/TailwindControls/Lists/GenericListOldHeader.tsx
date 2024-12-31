import React from "react";
import { GenericListHeaderType } from "./GenericList";
import { paramCase } from "change-case";
import ASCIcon from "remixicon-react/ArrowDownLineIcon";
import DESCIcon from "remixicon-react/ArrowUpLineIcon";

type GenericOldListHeaderProps = {
  index: number;
  tableHeaders: GenericListHeaderType[];
  header: any;
  alignText?: "text-center" | "text-left" | "text-right";
  addSorting?: boolean;
  containsActionHeader: boolean;
  listSelector?: boolean;
  sortingFieldList?: { name: string; order: "ASC" | "DESC" | "None" }[];
  handleSorting?: (value: {
    name: string;
    order: "ASC" | "DESC" | "None";
  }) => void;
  columnFixedWidth?: string;
};

export const GenericOldListHeader = ({
  index,
  tableHeaders,
  header,
  alignText,
  addSorting = false,
  containsActionHeader,
  listSelector,
  sortingFieldList = [],
  handleSorting = () => {},
  columnFixedWidth,
}: GenericOldListHeaderProps) => {
  const [showOrder, setShowOrder] = React.useState<boolean>(true);
  const [sortOrderField, setSortOrderField] = React.useState<{
    name: string;
    order: "ASC" | "DESC" | "None";
  }>({
    name: header.systemDefined
      ? header.columnName
      : `fields.${header.columnName}`,
    order: "None",
  });

  React.useEffect(() => {
    if (addSorting) {
      const findFieldIndex = sortingFieldList?.findIndex(
        (field) =>
          field.name ===
          (header.systemDefined
            ? header.columnName
            : `fields.${header.columnName}`)
      );
      if (findFieldIndex !== -1) {
        setSortOrderField({
          name: header.systemDefined
            ? header.columnName
            : `fields.${header.columnName}`,
          order: sortingFieldList[findFieldIndex].order,
        });
      } else {
        setSortOrderField({
          name: header.systemDefined
            ? header.columnName
            : `fields.${header.columnName}`,
          order: "None",
        });
      }
    }
  }, [sortingFieldList]);

  return (
    <th
      id={`table-header-${header.label}`}
      scope="col"
      className={`px-6 py-3 whitespace-nowrap text-black font-medium ${
        !listSelector && index === 0 ? "rounded-l-md" : ""
      } ${
        !containsActionHeader && index === tableHeaders.length - 1
          ? "rounded-r-md"
          : ""
      } ${
        !["recordImage", "image"].includes(header.dataType) && addSorting
          ? "cursor-pointer hover:text-vryno-theme-blue-secondary hover:rounded-md"
          : ""
      } ${alignText}`}
    >
      <span
        className={`flex ${
          alignText === "text-center"
            ? "justify-center"
            : alignText === "text-right"
            ? "justify-end"
            : ""
        } gap-x-1 ${columnFixedWidth ?? ""}`}
        data-testid={paramCase(header.columnName)}
        onClick={
          !["recordImage", "image"].includes(header.dataType) && addSorting
            ? () =>
                handleSorting({
                  name: header.systemDefined
                    ? header.columnName
                    : `fields.${header.columnName}`,
                  order:
                    sortOrderField?.order === "ASC"
                      ? "DESC"
                      : sortOrderField?.order === "DESC"
                      ? "ASC"
                      : "ASC",
                })
            : () => {}
        }
        onMouseEnter={
          !["recordImage", "image"].includes(header.dataType) && addSorting
            ? () => setShowOrder(false)
            : () => {}
        }
        onMouseLeave={
          !["recordImage", "image"].includes(header.dataType) && addSorting
            ? () => setShowOrder(true)
            : () => {}
        }
      >
        {header.label}
        <span className="">
          {!["recordImage", "image"].includes(header.dataType) && !showOrder ? (
            sortOrderField?.order === "ASC" ? (
              <DESCIcon size={18} />
            ) : sortOrderField?.order === "DESC" ? (
              <ASCIcon size={18} />
            ) : (
              <ASCIcon size={18} />
            )
          ) : (
            <>
              {sortOrderField?.order === "ASC" ? (
                <span className="text-gray-500">
                  <ASCIcon size={18} className="text-gray-500" />
                </span>
              ) : sortOrderField?.order === "DESC" ? (
                <span className="text-gray-500">
                  <DESCIcon size={18} className="text-gray-500" />
                </span>
              ) : (
                <span className="text-gray-500 invisible">
                  <ASCIcon size={18} />
                </span>
              )}
            </>
          )}
        </span>
      </span>
    </th>
  );
};
