import React from "react";
import { GenericListHeaderType } from "./GenericList";
import { paramCase } from "change-case";
import ASCIcon from "remixicon-react/ArrowDownLineIcon";
import DESCIcon from "remixicon-react/ArrowUpLineIcon";

type GenericListHeaderProps = {
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
};

export const GenericListHeader = ({
  index,
  tableHeaders,
  header,
  alignText,
  addSorting = false,
  containsActionHeader,
  listSelector,
  sortingFieldList = [],
  handleSorting = () => {},
}: GenericListHeaderProps) => {
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
    <div
      id={`table-header-${header.label}`}
      className={`px-2 whitespace-nowrap text-black font-medium ${
        !listSelector && index === 0 ? "rounded-l-md" : ""
      } ${
        !containsActionHeader && index === tableHeaders.length - 1
          ? "rounded-r-md"
          : ""
      } ${alignText}`}
      style={{ backgroundColor: showOrder ? "text-gray-300" : "" }}
    >
      <span
        className={`grid grid-cols-12 ${
          alignText === "text-center"
            ? "justify-center"
            : alignText === "text-right"
            ? "justify-end"
            : ""
        } gap-x-2 ${
          ![
            "recordImage",
            "image",
            "lookup",
            "recordLookup",
            "multiSelectLookup",
            "multiSelectRecordLookup",
          ].includes(header.dataType) && addSorting
            ? "cursor-pointer hover:text-vryno-theme-blue-secondary hover:rounded-md"
            : ""
        } `}
        data-testid={paramCase(header.columnName)}
        onClick={
          ![
            "recordImage",
            "image",
            "lookup",
            "recordLookup",
            "multiSelectLookup",
            "multiSelectRecordLookup",
          ].includes(header.dataType) && addSorting
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
          ![
            "recordImage",
            "image",
            "lookup",
            "recordLookup",
            "multiSelectLookup",
            "multiSelectRecordLookup",
          ].includes(header.dataType) && addSorting
            ? () => setShowOrder(false)
            : () => {}
        }
        onMouseLeave={
          ![
            "recordImage",
            "image",
            "lookup",
            "recordLookup",
            "multiSelectLookup",
            "multiSelectRecordLookup",
          ].includes(header.dataType) && addSorting
            ? () => setShowOrder(true)
            : () => {}
        }
      >
        <span className={`col-span-10 truncate`}>{header.label}</span>
        <span className="col-span-2 flex items-center justify-end">
          {![
            "recordImage",
            "image",
            "lookup",
            "recordLookup",
            "multiSelectLookup",
            "multiSelectRecordLookup",
          ].includes(header.dataType) && !showOrder ? (
            sortOrderField?.order === "ASC" ? (
              <DESCIcon size={16} />
            ) : sortOrderField?.order === "DESC" ? (
              <ASCIcon size={16} />
            ) : (
              <ASCIcon size={16} />
            )
          ) : (
            <>
              {sortOrderField?.order === "ASC" ? (
                <span className="text-gray-700">
                  <ASCIcon size={16} className="text-gray-700" />
                </span>
              ) : sortOrderField?.order === "DESC" ? (
                <span className="text-gray-700">
                  <DESCIcon size={16} className="text-gray-700" />
                </span>
              ) : (
                <span className="text-gray-700 invisible">
                  <ASCIcon size={16} />
                </span>
              )}
            </>
          )}
        </span>
      </span>
    </div>
  );
};
