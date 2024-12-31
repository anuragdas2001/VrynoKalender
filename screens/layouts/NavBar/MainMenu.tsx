import Link from "next/link";
import { camelCase } from "lodash";
import { useCallback, useContext } from "react";
import { useRouter } from "next/router";
import { INavigation } from "../../../models/INavigation";
import { getAppPathParts } from "../../modules/crm/shared/utils/getAppPathParts";
import { getNavigationList } from "../../modules/crm/shared/utils/getNavigationList";
import { InstanceStoreContext } from "../../../stores/InstanceStore";
import { cookieUserStore } from "../../../shared/CookieUserStore";

export const MainMenu = ({
  navigations,
  parentRef,
}: {
  navigations: INavigation[];
  parentRef: any;
}) => {
  const { modelName } = getAppPathParts();
  const router = useRouter();
  const { instances } = useContext(InstanceStoreContext);
  const cookieUser = cookieUserStore.getUserDetails();
  const getAllItems = useCallback(() => {
    const subDomain = window.location.hostname.split(".")[0];
    const findInstanceIndex = instances?.findIndex(
      (instance) => instance?.subdomain === subDomain
    );
    const DashBoardModelView = typeof window!=="undefined" ? window.localStorage.getItem("currentDashboardViewPerModulePerInstancePerUser") : null;
    if (findInstanceIndex === -1 || !cookieUser?.id || !modelName) {
      return getNavigationList(navigations);
    } else {
      return getNavigationList(
        navigations,
        // localStorage.getItem("currentDashboardViewPerModulePerInstancePerUser"),
        DashBoardModelView,
        instances[findInstanceIndex].id,
        cookieUser.id
      );
    }
  }, [
    navigations,
    // localStorage.getItem("currentDashboardViewPerModulePerInstancePerUser"),
  ]);

  return (
    <nav
      className="hidden md:inline-block overflow-hidden ml-6 w-full"
      ref={parentRef}
    >
      <ul className="flex grow">
        {navigations.length > 0 ? (
          getAllItems().map((item, index) => (
            <span
              id={item.key}
              key={index}
              className={`px-3 py-1 text-xsm text-center rounded-md mx-1 whitespace-nowrap ${
                (router.route.split("/")[1] === "app" &&
                  modelName === camelCase(item.name)) ||
                modelName === item.key
                  ? " text-white bg-vryno-theme-light-blue"
                  : ""
              }`}
            >
              <Link href={item.link} legacyBehavior>
                <a>{item.label}</a>
              </Link>
            </span>
          ))
        ) : (
          <div className="bg-vryno-theme-blue opacity-30 w-64 h-6 animate-pulse" />
        )}
      </ul>
    </nav>
  );
};
