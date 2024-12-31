import React from "react";
import { RelatedToSideItem } from "./RelatedToSideItem";
import { ICustomField } from "../../../../../models/ICustomField";

export const RelatedToSideList = ({
  relatedToName,
  modelData,
  idChange,
  activeRelatedId,
  relatedFilterValue,
  fieldsList,
  relatedFilterId,
}: {
  relatedToName: string;
  modelData: any[];
  idChange: (id: string) => void;
  activeRelatedId: string;
  relatedFilterValue: string;
  fieldsList: ICustomField[];
  relatedFilterId: string;
}) => {
  if (relatedFilterValue && relatedFilterId) {
    modelData = modelData.filter((val) => {
      if (val.relatedTo[0]) {
        return (
          val.relatedTo[0].moduleName === relatedFilterValue &&
          val.relatedTo[0].recordId === relatedFilterId
        );
      }
    });
  }

  return (
    <div className="hover:card-scroll hover:overflow-y-auto mb-12">
      {modelData ? (
        modelData.map((val) => {
          return (
            <RelatedToSideItem
              data={val}
              key={val.id}
              idChange={idChange}
              activeRelatedId={activeRelatedId}
              fieldsList={fieldsList}
            />
          );
        })
      ) : (
        <div>{relatedToName}</div>
      )}
    </div>
  );
};
