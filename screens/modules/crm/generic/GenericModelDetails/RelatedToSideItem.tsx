import React from "react";
import { GenericField } from "./GenericField";
import { ICustomField } from "../../../../../models/ICustomField";
import { getAppPathParts } from "../../shared/utils/getAppPathParts";

export const RelatedToSideItem = ({
  data,
  idChange,
  activeRelatedId,
  fieldsList,
}: {
  data: any;
  idChange: (id: string) => void;
  activeRelatedId: string;
  fieldsList: ICustomField[];
}) => {
  let { id } = getAppPathParts();

  return (
    <div
      key={data.id}
      id={`activity-side-nav-${data.id}`}
      className={`w-full py-3 px-2 border-b text-sm block cursor-pointer hover:bg-gray-100 ${
        data.id === id
          ? `bg-gray-100 text-vryno-theme-light-blue border-l-4 border-l-vryno-theme-light-blue`
          : `border-l-4 border-l-white hover:border-l-gray-100`
      }`}
      onClick={() => idChange(data.id)}
    >
      <div className="flex flex-col">
        <div>
          <span className="text-vryno-theme-blue-secondary font-medium text-xsm whitespace-normal break-words">
            {data.name}
          </span>
        </div>
        <div className={`grid grid-cols-2 gap-2 my-1`}>
          {["statusId", "priorityId", "ownerId", "dueDate"]?.map(
            (field, index) => {
              return (
                <GenericField
                  key={index}
                  data={data}
                  fieldsList={fieldsList}
                  fieldName={field}
                  headerVisible={true}
                  fontSize={{
                    header: "text-moreInfoDetails",
                    value: "text-xs",
                  }}
                  marginBottom="mb-0"
                />
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};
