import { get } from "lodash";
import { appsUrlGenerator } from "./appsUrlGenerator";
import { paramCase } from "param-case";
import {
  SupportedApps,
  SupportedDashboardViews,
} from "../../../../../models/shared";
import { AllowedViews } from "../../../../../models/allowedViews";
import { INavigation } from "../../../../../models/INavigation";

export function getNavigationList(
  navigation: INavigation[],
  currentDashboardViewPerModulePerInstancePerUser?: any,
  instanceId?: string,
  cookieUserId?: string
) {
  let currentDashboardView =
    currentDashboardViewPerModulePerInstancePerUser ?? {};

  let updatedcurrentDashboardView =
    currentDashboardView && Object.keys(currentDashboardView)?.length > 0
      ? {
          ...JSON.parse(currentDashboardView.toString()),
        }
      : {};
  updatedcurrentDashboardView[cookieUserId as string] = {
    ...updatedcurrentDashboardView[cookieUserId as string],
  };
  updatedcurrentDashboardView[cookieUserId as string][instanceId as string] = {
    ...updatedcurrentDashboardView[cookieUserId as string][
      instanceId as string
    ],
  };

  let newNavigation = [
    {
      order: -1,
      name: "home",
      label: "Home",
      key: "Home",
      moduleName: "Home",
      link: {
        pathname: appsUrlGenerator(
          SupportedApps.crm,
          "home",
          AllowedViews.dashboard
        ),
      },
    },
  ];

  navigation.map((item: INavigation) => {
    const modelName = paramCase(get(item.navTypeMetadata, "moduleName", ""));
    const relative_url = get(item.navTypeMetadata, "relativeUrl", "");
    newNavigation.push({
      order: item.order,
      label: item.label["en"],
      name: modelName,
      key: item.uniqueName,
      moduleName: get(item.navTypeMetadata, "moduleName", ""),
      link: {
        pathname: relative_url
          ? relative_url
          : appsUrlGenerator(
              SupportedApps.crm,
              modelName,
              AllowedViews.view,
              updatedcurrentDashboardView[cookieUserId as string][
                instanceId as string
              ][get(item.navTypeMetadata, "moduleName", "")]
                ? updatedcurrentDashboardView[cookieUserId as string][
                    instanceId as string
                  ][
                    get(item.navTypeMetadata, "moduleName", "")
                  ].toLocaleLowerCase()
                : SupportedDashboardViews.Card.toLocaleLowerCase()
            ),
      },
    });
  });
  return newNavigation
    .slice()
    .sort((first, second) => first.order - second.order);
}
