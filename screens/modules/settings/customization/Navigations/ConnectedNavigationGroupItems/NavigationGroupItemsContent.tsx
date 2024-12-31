import React from "react";
import { LazyQueryExecFunction, useMutation } from "@apollo/client";
import { useTranslation } from "next-i18next";
import AddIcon from "remixicon-react/AddCircleFillIcon";
import { AddEditNavigationModal } from "./AddEditNavigationModal";
import { INavigation } from "../../../../../../models/INavigation";
import NavigationsGroupItemsList from "./NavigationsGroupItemsList";
import { Toast } from "../../../../../../components/TailwindControls/Toast";
import { CustomizationContainer } from "../../Shared/CustomizationContainer";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import { PageLoader } from "../../../../../../components/TailwindControls/ContentLoader/Shared/PageLoader";
import {
  SAVE_MUTATION,
  SaveData,
  SaveVars,
} from "../../../../../../graphql/mutations/saveMutation";
import {
  FetchData,
  FetchVars,
} from "../../../../../../graphql/queries/fetchQuery";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";

const getSaveInput = (item: INavigation) => {
  return {
    groupKey: item.groupKey,
    uniqueName: item.uniqueName,
    label: item.label,
    navType: item.navType,
    navTypeMetadata: item.navTypeMetadata,
    mandatory: item.mandatory,
    order: item.order,
    name: item.name ?? "",
    visible: item.visible,
  };
};

export const NavigationGroupItemsContent = ({
  navigationItems,
  setNavigationItems,
  navigationGroupKey,
  navigationFetchLoading,
  fetchNavigations,
  itemsCount,
  navigationFields,
  genericModels,
  allModulesFetched,
  updateNavigations,
  removeNavigationByUniqueName,
}: {
  navigationItems: INavigation[];
  setNavigationItems: (value: INavigation[]) => void;
  navigationGroupKey: string;
  navigationFetchLoading: boolean;
  fetchNavigations: LazyQueryExecFunction<FetchData<INavigation>, FetchVars>;
  itemsCount: number;
  genericModels: IGenericModel;
  allModulesFetched: boolean;
  navigationFields: string[];
  updateNavigations: (navigation: INavigation) => void;
  removeNavigationByUniqueName: (uniqueName: string) => void;
}) => {
  const { t } = useTranslation(["common"]);
  const [savingProcess, setSavingProcess] = React.useState<boolean>(false);
  const [addEditNavigationModal, setAddEditNavigationModal] = React.useState<{
    visible: boolean;
    data: INavigation | null;
  }>({
    visible: false,
    data: null,
  });
  const [currentPageNumber, setCurrentPageNumber] = React.useState<number>(1);
  const [filterValue, setFilterValue] = React.useState<string>("");

  const [updateNavigation] = useMutation<
    SaveData<INavigation>,
    SaveVars<INavigation>
  >(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "crm",
      },
    },
  });

  const handleVisibilityUpdate = async (item: INavigation) => {
    let updatedNavigations = [...navigationItems];
    setSavingProcess(true);
    await updateNavigation({
      variables: {
        id: item.id ?? null,
        modelName: "NavigationItem",
        saveInput: {
          ...getSaveInput(item),
        },
      },
    }).then((responseOnCompletionItemOne) => {
      if (
        responseOnCompletionItemOne?.data?.save?.messageKey.includes("-success")
      ) {
        updatedNavigations[
          updatedNavigations.findIndex(
            (item) =>
              item.uniqueName ===
              responseOnCompletionItemOne.data?.save.data.uniqueName
          )
        ] = responseOnCompletionItemOne.data?.save.data;
        updateNavigations(responseOnCompletionItemOne.data?.save.data);
        setNavigationItems(updatedNavigations);
        Toast.success("Navigation visibility updated successfully");
        return;
      }
      if (responseOnCompletionItemOne?.data?.save.messageKey) {
        Toast.error(responseOnCompletionItemOne?.data.save.message);
        return;
      }
      Toast.error(t("common:unknown-message"));
    });
    setSavingProcess(false);
  };

  const handleNavigationOrderUpdate = async (
    itemOne: INavigation,
    itemTwo: INavigation
  ) => {
    let updatedNavigations = [...navigationItems];
    setSavingProcess(true);
    await updateNavigation({
      variables: {
        id: itemOne.id ?? null,
        modelName: "NavigationItem",
        saveInput: {
          ...getSaveInput(itemOne),
        },
      },
    }).then((responseOnCompletionItemOne) => {
      if (
        responseOnCompletionItemOne?.data?.save?.messageKey.includes("-success")
      ) {
        updatedNavigations[
          updatedNavigations.findIndex(
            (item) =>
              item.uniqueName ===
              responseOnCompletionItemOne.data?.save.data.uniqueName
          )
        ] = responseOnCompletionItemOne.data?.save.data;
        updateNavigations(responseOnCompletionItemOne.data?.save.data);
        Toast.success("Navigation order updated successfully");
        return;
      }
      if (responseOnCompletionItemOne?.data?.save.messageKey) {
        Toast.error(responseOnCompletionItemOne?.data.save.message);
        return;
      }
      Toast.error(t("common:unknown-message"));
    });
    await updateNavigation({
      variables: {
        id: itemTwo.id ?? null,
        modelName: "NavigationItem",
        saveInput: {
          ...getSaveInput(itemTwo),
        },
      },
    }).then((responseOnCompletionItemTwo) => {
      if (
        responseOnCompletionItemTwo?.data?.save?.messageKey.includes("-success")
      ) {
        updatedNavigations[
          updatedNavigations.findIndex(
            (item) =>
              item.uniqueName ===
              responseOnCompletionItemTwo.data?.save.data.uniqueName
          )
        ] = responseOnCompletionItemTwo.data?.save.data;
        updateNavigations(responseOnCompletionItemTwo.data?.save.data);
        Toast.success("Navigation order updated successfully");
        return;
      }
      if (responseOnCompletionItemTwo?.data?.save.messageKey) {
        Toast.error(responseOnCompletionItemTwo?.data.save.message);
        return;
      }
      Toast.error(t("common:unknown-message"));
    });
    setNavigationItems(updatedNavigations);
    setSavingProcess(false);
  };

  return (
    <>
      <CustomizationContainer
        heading={"Navigations"}
        subHeading={navigationGroupKey}
        showTabBar={true}
        buttons={
          <Button
            id="add-navigation"
            buttonType="thin"
            kind="primary"
            onClick={
              navigationFetchLoading
                ? () => {}
                : () => {
                    setAddEditNavigationModal({
                      visible: true,
                      data: null,
                    });
                  }
            }
            disabled={navigationFetchLoading}
            userEventName="open-add-navigation-modal-click"
          >
            <div className="flex gap-x-1">
              <AddIcon size={18} />
              <>{`Add Navigation`}</>
            </div>
          </Button>
        }
        currentPageNumber={currentPageNumber}
        itemsCount={itemsCount}
        currentPageItemCount={navigationItems.length}
        onPageChange={(pageNumber) => {
          fetchNavigations({
            variables: {
              modelName: "NavigationItem",
              fields: [...navigationFields],
              filters: [
                {
                  operator: "eq",
                  name: "groupKey",
                  value: [navigationGroupKey],
                },
              ],
              pageNumber: pageNumber,
            },
          });
        }}
        setFilterValue={(value) => setFilterValue(value)}
        setCurrentPageNumber={(pageNumber) => setCurrentPageNumber(pageNumber)}
      >
        {navigationFetchLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <PageLoader />
          </div>
        ) : (
          <NavigationsGroupItemsList
            navigationGroupKey={navigationGroupKey}
            onNavigationFieldEdit={(item) => {
              setAddEditNavigationModal({ visible: true, data: item });
            }}
            updatedNavigations={navigationItems
              ?.slice()
              ?.sort((a, b) => (a.order > b.order ? 1 : -1))}
            savingProcess={savingProcess}
            removeNavigation={(item) => {
              let updatedNavigations = [...navigationItems];
              updatedNavigations = updatedNavigations.filter(
                (navigationItem) =>
                  navigationItem.uniqueName !== item.uniqueName
              );
              removeNavigationByUniqueName(item.uniqueName);
              setNavigationItems(updatedNavigations);
            }}
            handleOrderUpdate={(itemOne, itemTwo) =>
              handleNavigationOrderUpdate(itemOne, itemTwo)
            }
            handleVisibilityUpdate={(item) => handleVisibilityUpdate(item)}
            filterValue={filterValue}
          />
        )}
      </CustomizationContainer>
      <AddEditNavigationModal
        addNavigationModal={addEditNavigationModal}
        setAddNavigationModal={setAddEditNavigationModal}
        currentNavigationGroup={navigationGroupKey}
        navigationByGroupKey={navigationItems.filter(
          (n) => n.groupKey === navigationGroupKey
        )}
        navigationItems={navigationItems}
        genericModels={genericModels}
        allModulesFetched={allModulesFetched}
        handleNavigationAddUpdate={(item) => {
          const updatedNavigationIndex = navigationItems.findIndex(
            (navigationItem) => navigationItem.uniqueName === item.uniqueName
          );
          if (updatedNavigationIndex >= 0) {
            let updatedNavigationItems = navigationItems;
            updatedNavigationItems[updatedNavigationIndex] = item;
            setNavigationItems(updatedNavigationItems);
          } else {
            setNavigationItems([...navigationItems, item]);
          }
        }}
      />
    </>
  );
};
