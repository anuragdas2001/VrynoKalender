import _ from "lodash";
import { IUserPreference } from "../../../../../models/shared";
import { ActivitiesModule } from "../../../../../shared/constants";
import { ICustomField } from "../../../../../models/ICustomField";

export const getDetailCardContainerOrderFromPreference = (
  userPreferences: IUserPreference[],
  modelName: string
) => {
  let detailCardContainerOrder: {
    id: string;
    name: string;
    type: string;
    label: string;
    order: number;
    value: string;
  }[] = [];
  if (!userPreferences || userPreferences?.length <= 0) {
    return detailCardContainerOrder;
  }
  if (
    userPreferences[0]?.defaultPreferences &&
    _.get(userPreferences[0]?.defaultPreferences, modelName, null) &&
    _.get(
      userPreferences[0]?.defaultPreferences[modelName],
      "detailCardContainerOrder",
      null
    )
  ) {
    return _.get(
      userPreferences[0]?.defaultPreferences[modelName],
      "detailCardContainerOrder",
      []
    );
  }
  return detailCardContainerOrder;
};

export const getDetailCardContainerOrder = (
  cardContainerOrder: {
    id: string;
    label: string;
    name: string;
    type: string;
    order: number;
    value: string;
  }[],
  modelName: string,
  fieldsList: ICustomField[]
) => {
  let updatedCarContainerOrder = [...cardContainerOrder];
  if (modelName in ActivitiesModule) {
    updatedCarContainerOrder = [
      ...updatedCarContainerOrder?.filter(
        (container) => container.type !== "activity"
      ),
    ];
  }
  return [
    ...updatedCarContainerOrder
      ?.filter((container) =>
        fieldsList?.filter(
          (field) => field.visible && field.dataType === "email"
        )?.length > 0
          ? container.type === "email"
            ? container
            : container
          : container.type === "email"
          ? null
          : container
      )
      ?.map((container) => container),
  ];
};
