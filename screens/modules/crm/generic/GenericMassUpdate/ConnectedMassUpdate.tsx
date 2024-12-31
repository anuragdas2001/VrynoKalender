import { useMutation } from "@apollo/client";
import { FormikValues } from "formik";
import router from "next/router";
import React, { useContext } from "react";
import { toast } from "react-toastify";
import { AllowedViews } from "../../../../../models/allowedViews";
import { ICustomField } from "../../../../../models/ICustomField";
import {
  BaseGenericObjectType,
  ICriteriaFilterRow,
  SupportedApps,
  SupportedDashboardViews,
} from "../../../../../models/shared";
import { appsUrlGenerator } from "../../shared/utils/appsUrlGenerator";
import { MassUpdateContainerHolder } from "./MassUpdateContainerHolder";
import { cookieUserStore } from "../../../../../shared/CookieUserStore";
import { InstanceStoreContext } from "../../../../../stores/InstanceStore";
import { geCurrentViewPerModulePerInstancePerUser } from "../../shared/utils/getCurrentViewPerModulePerInstancePerUser";
import { mutationNameGenerator } from "../../../../../graphql/helpers/mutationNameGenerator";
import { SupportedMutationNames } from "../../../../../graphql/helpers/graphQLShared";
import { generateBulkUpdateMutation } from "../../../../../graphql/mutations/moduleBulkUpdateMutation";
import { UserStoreContext } from "../../../../../stores/UserStore";
import { getCorrectTimezone } from "../../../../../shared/dateTimeTimezoneFormatter";
import moment from "moment";
import { observer } from "mobx-react-lite";
import GeneralScreenLoader from "../../shared/components/GeneralScreenLoader";
import { GeneralStoreContext } from "../../../../../stores/RootStore/GeneralStore/GeneralStore";

export const ConnectedMassUpdate = observer(
  ({
    appName,
    modelName,
    fieldsList,
  }: {
    appName: SupportedApps;
    modelName: string;
    fieldsList: ICustomField[];
  }) => {
    const userContext = useContext(UserStoreContext);
    const { user } = userContext;
    const { generalModelStore } = useContext(GeneralStoreContext);
    const {
      genericModels,
      allLayoutFetched,
      allModulesFetched,
      userPreferences,
    } = generalModelStore;
    const cookieUser = cookieUserStore.getUserDetails();
    const { instances } = React.useContext(InstanceStoreContext);
    const subDomain = window.location.hostname.split(".")[0];
    const findInstanceIndex = instances?.findIndex(
      (instance) => instance?.subdomain === subDomain
    );
    const [conditionList, setConditionList] = React.useState<
      ICriteriaFilterRow[]
    >([{ fieldName: "", value: "" }]);
    const [selectedItems, setSelectedItems] = React.useState<
      BaseGenericObjectType[]
    >([]);
    const [currentPageNumber, setCurrentPageNumber] = React.useState<number>(1);
    const [massUpdate, setMassUpdate] = React.useState<{
      visible: boolean;
    }>({ visible: false });
    const [massUpdateProcess, setMassUpdateProcess] = React.useState(false);
    const [refetchData, setRefetchData] = React.useState<boolean>(false);
    const [overlayMessage, setOverlayMessage] = React.useState({});

    const handleItemSelect = (item: BaseGenericObjectType) => {
      if (selectedItems.filter((sItem) => sItem.id === item.id).length === 0) {
        setSelectedItems([...selectedItems, item]);
      } else {
        setSelectedItems(selectedItems.filter((sItem) => sItem.id !== item.id));
      }
    };

    const [bulkUpdate] = useMutation(generateBulkUpdateMutation(modelName), {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: appName,
        },
      },
    });

    const handleMassUpdate = async (formikValues: FormikValues) => {
      const handleFailedStatus = () => {
        setMassUpdate({ visible: false });
        setMassUpdateProcess(false);
        setRefetchData(true);
        setOverlayMessage({});
      };
      setMassUpdateProcess(true);
      const filteredValues: FormikValues = {};
      for (const key in formikValues) {
        if (
          formikValues[key] &&
          Array.isArray(formikValues[key]) &&
          formikValues[key]?.length === 0
        )
          continue;
        const fieldIndex = fieldsList.findIndex((field) => field.name === key);
        if (fieldIndex !== -1) {
          if (fieldsList[fieldIndex].dataType === "datetime") {
            filteredValues[key] = user?.timezone
              ? getCorrectTimezone(formikValues[key], user?.timezone)
              : moment(formikValues[key]).toISOString();
          } else if (fieldsList[fieldIndex].dataType === "relatedTo") {
            if (formikValues[key]) filteredValues[key] = formikValues[key];
          } else {
            filteredValues[key] = formikValues[key];
          }
        }
      }
      if (!Object.keys(filteredValues).length) {
        toast.error("Values not selected.");
        setMassUpdateProcess(false);
        return;
      }
      bulkUpdate({
        variables: {
          ids: selectedItems.map((val) => val.id),
          input: filteredValues,
        },
      })
        .then((response) => {
          if (
            response?.data?.[
              mutationNameGenerator(
                SupportedMutationNames.bulkUpdate,
                modelName
              )
            ]?.messageKey.includes("start-success")
          ) {
            toast.success(
              response?.data?.[
                mutationNameGenerator(
                  SupportedMutationNames.bulkUpdate,
                  modelName
                )
              ]?.message
            );
            if (findInstanceIndex === -1 || !cookieUser?.id || !modelName) {
              router.push(
                appsUrlGenerator(
                  appName,
                  modelName,
                  AllowedViews.view,
                  SupportedDashboardViews.Card.toLocaleLowerCase()
                )
              );
            } else {
              const updatedCurrentDashboardView =
                geCurrentViewPerModulePerInstancePerUser(
                  cookieUser.id,
                  instances[findInstanceIndex].id
                );
              const currentView =
                updatedCurrentDashboardView[cookieUser?.id as string][
                  instances[findInstanceIndex].id as string
                ][modelName];
              router.push(
                appsUrlGenerator(
                  appName,
                  modelName,
                  AllowedViews.view,
                  currentView
                    ? currentView.toLocaleLowerCase()
                    : SupportedDashboardViews.Card.toLocaleLowerCase()
                )
              );
            }
          } else {
            toast.error(
              response?.data?.[
                mutationNameGenerator(
                  SupportedMutationNames.bulkUpdate,
                  modelName
                )
              ]?.message || "Error in mass update"
            );
            handleFailedStatus();
          }
        })
        .catch((error) => {
          toast.error(`Error in mass update: ${error}`);
          console.error(error);
          handleFailedStatus();
        });
    };

    if (fieldsList.length <= 0) {
      return <GeneralScreenLoader modelName={"..."} />;
    }

    return (
      <MassUpdateContainerHolder
        conditionList={conditionList}
        fieldsList={fieldsList.filter(
          (field) =>
            field.visible === true &&
            !["recordImage", "json"].includes(field.dataType)
        )}
        appName={appName}
        modelName={modelName}
        setConditionList={(value: ICriteriaFilterRow[]) =>
          setConditionList(value)
        }
        user={user}
        massUpdate={massUpdate}
        selectedItems={selectedItems}
        handleItemSelect={handleItemSelect}
        setSelectedItems={(value: BaseGenericObjectType[]) =>
          setSelectedItems(value)
        }
        setCurrentPageNumber={(value: number) => setCurrentPageNumber(value)}
        currentPageNumber={currentPageNumber}
        setMassUpdate={(value: { visible: boolean }) => setMassUpdate(value)}
        handleMassUpdate={handleMassUpdate}
        massUpdateProcess={massUpdateProcess}
        filteredFieldOrder={fieldsList}
        setRefetchData={(value: boolean) => setRefetchData(value)}
        refetchData={refetchData}
        overlayMessage={overlayMessage}
        genericModels={genericModels}
        allLayoutFetched={allLayoutFetched}
        allModulesFetched={allModulesFetched}
        userPreferences={userPreferences}
      />
    );
  }
);
