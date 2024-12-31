import React from "react";
import { getVisibleFieldsArray } from "../../shared/utils/getFieldsArray";
import { useCrmFetchQuery } from "../../shared/utils/operations";
import { RelatedToSideList } from "./RelatedToSideList";
import { getAppPathParts } from "../../shared/utils/getAppPathParts";
import { ICustomField } from "../../../../../models/ICustomField";
import { IModuleMetadata } from "../../../../../models/IModuleMetadata";
import { IGenericModel } from "../../../../../stores/RootStore/GeneralStore/GenericModelStore";

export const RelatedToSideNav = function ({
  idChange,
  activeRelatedId,
  relatedFilterValue,
  fieldsList,
  relatedFilterId,
  genericModels,
}: {
  idChange: (id: string) => void;
  activeRelatedId: string;
  relatedFilterValue: string;
  fieldsList: ICustomField[];
  relatedFilterId: string;
  genericModels: IGenericModel;
}) {
  const [modelData, setModelData] = React.useState<any[]>([]);
  const [relatedFilter, setRelatedFilter] = React.useState("");
  const { modelName } = getAppPathParts();
  let currentCustomView = genericModels[modelName]?.currentCustomView;

  useCrmFetchQuery<IModuleMetadata>({
    variables: {
      customViewId: currentCustomView?.id,
      modelName: modelName,
      fields: getVisibleFieldsArray(fieldsList),
      filters: [],
    },
    onDataRecd: setModelData,
  });

  React.useEffect(() => {
    if (relatedFilterValue) {
      setRelatedFilter(relatedFilterValue);
    }
  }, []);

  const activityTypeSidebar: Record<string, JSX.Element> = {
    task: (
      <RelatedToSideList
        relatedToName="Task"
        modelData={modelData}
        idChange={idChange}
        activeRelatedId={activeRelatedId}
        relatedFilterValue={relatedFilter}
        relatedFilterId={relatedFilterId}
        fieldsList={fieldsList}
      />
    ),
    meeting: (
      <RelatedToSideList
        relatedToName="Meeting"
        modelData={modelData}
        idChange={idChange}
        activeRelatedId={activeRelatedId}
        relatedFilterValue={relatedFilter}
        relatedFilterId={relatedFilterId}
        fieldsList={fieldsList}
      />
    ),
    callLog: (
      <RelatedToSideList
        relatedToName="Call Log"
        modelData={modelData}
        idChange={idChange}
        activeRelatedId={activeRelatedId}
        relatedFilterValue={relatedFilter}
        relatedFilterId={relatedFilterId}
        fieldsList={fieldsList}
      />
    ),
  };

  return activityTypeSidebar[modelName] ? activityTypeSidebar[modelName] : null;
};
