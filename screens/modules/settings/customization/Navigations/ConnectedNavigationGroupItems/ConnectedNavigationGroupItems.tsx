import { get } from "lodash";
import React, { useContext, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { INavigation } from "../../../../../../models/INavigation";
import { NavigationGroupItemsContent } from "./NavigationGroupItemsContent";
import { Toast } from "../../../../../../components/TailwindControls/Toast";
import { SAVE_MUTATION } from "../../../../../../graphql/mutations/saveMutation";
import {
  checkOrder,
  updateorder,
} from "../../../../crm/shared/utils/checkOrderAndUpdateOrder";
import {
  SaveData,
  SaveVars,
} from "../../../../../../graphql/mutations/executeConversion";
import {
  FetchData,
  FetchVars,
  FETCH_QUERY,
} from "../../../../../../graphql/queries/fetchQuery";
import { observer } from "mobx-react-lite";
import { GeneralStoreContext } from "../../../../../../stores/RootStore/GeneralStore/GeneralStore";
import { NavigationStoreContext } from "../../../../../../stores/RootStore/NavigationStore/NavigationStore";

type ConnectedNavigationGroupItemsProps = {
  navigationGroupKey: string;
};

const navigationFields = [
  "label",
  "groupKey",
  "uniqueName",
  "navType",
  "name",
  "order",
  "visible",
  "systemDefined",
  "parentNavigation",
  "navTypeMetadata",
];

export const ConnectedNavigationGroupItems = observer(
  ({ navigationGroupKey }: ConnectedNavigationGroupItemsProps) => {
    const [navigationItems, setNavigationItems] = useState<INavigation[]>([]);
    const [navigationFetchLoading, setNavigationFetchLoading] =
      useState<boolean>(false);
    const { updateNavigations, removeNavigationByUniqueName } =
      React.useContext(NavigationStoreContext);
    const [itemsCount, setItemsCount] = React.useState<number>(0);
    const { generalModelStore } = useContext(GeneralStoreContext);
    const { genericModels, allModulesFetched } = generalModelStore;

    const [fetchNavigations] = useLazyQuery<FetchData<INavigation>, FetchVars>(
      FETCH_QUERY,
      {
        fetchPolicy: "no-cache",
        context: {
          headers: {
            vrynopath: "crm",
          },
        },
        onCompleted: (responseOnCompletion) => {
          if (responseOnCompletion?.fetch?.messageKey.includes("-success")) {
            setNavigationItems(responseOnCompletion.fetch.data);
            setNavigationFetchLoading(false);
            setItemsCount(responseOnCompletion.fetch.count);
            return;
          } else if (responseOnCompletion?.fetch?.messageKey) {
            Toast.error(responseOnCompletion?.fetch?.message);
            setNavigationFetchLoading(false);
            return;
          }
          Toast.error("Unknown Error");
          setNavigationFetchLoading(false);
          return;
        },
      }
    );

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

    React.useEffect(() => {
      setNavigationFetchLoading(true);
      fetchNavigations({
        variables: {
          modelName: "NavigationItem",
          fields: [
            "label",
            "groupKey",
            "uniqueName",
            "navType",
            "name",
            "order",
            "visible",
            "systemDefined",
            "parentNavigation",
            "navTypeMetadata",
          ],
          filters: [
            { operator: "eq", name: "groupKey", value: [navigationGroupKey] },
          ],
        },
      });
    }, [navigationGroupKey]);

    React.useEffect(() => {
      if (navigationItems?.length > 0 && checkOrder(navigationItems)) {
        setNavigationFetchLoading(true);
        const handlePromises = async () => {
          updateorder(navigationItems);
          const fetchPromise = navigationItems?.map(
            async (navigationItem, index) => {
              const response = await updateNavigation({
                variables: {
                  id: get(navigationItem, "id", null),
                  modelName: "NavigationItem",
                  saveInput: {
                    groupKey: get(navigationItem, "groupKey"),
                    uniqueName: get(navigationItem, "uniqueName"),
                    label: get(navigationItem, "label"),
                    navType: get(navigationItem, "navType"),
                    navTypeMetadata: get(navigationItem, "navTypeMetadata"),
                    mandatory: get(navigationItem, "mandatory"),
                    order: index ?? undefined,
                    name: get(navigationItem, "name", ""),
                    visible: get(navigationItem, "visible"),
                  },
                },
              });
              return response.data?.save;
            }
          );
          await Promise.all(fetchPromise);
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
            },
          });
        };
        handlePromises();
      }
    }, [navigationItems]);

    return (
      <NavigationGroupItemsContent
        navigationItems={navigationItems}
        setNavigationItems={(value: INavigation[]) => setNavigationItems(value)}
        navigationGroupKey={navigationGroupKey}
        navigationFetchLoading={navigationFetchLoading}
        fetchNavigations={fetchNavigations}
        itemsCount={itemsCount}
        navigationFields={navigationFields}
        genericModels={genericModels}
        allModulesFetched={allModulesFetched}
        updateNavigations={updateNavigations}
        removeNavigationByUniqueName={removeNavigationByUniqueName}
      />
    );
  }
);
