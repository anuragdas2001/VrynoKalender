import Link from "next/link";
import MoreItemIcon from "remixicon-react/MoreFillIcon";
import React, { useCallback, useContext, useRef, useState } from "react";
import { ClickOutsideToClose } from "../../../components/TailwindControls/shared/ClickOutsideToClose";
import { getNavigationList } from "../../modules/crm/shared/utils/getNavigationList";
import { getAppPathParts } from "../../modules/crm/shared/utils/getAppPathParts";
import { INavigation } from "../../../models/INavigation";
import { isInViewport } from "../../modules/crm/shared/utils/isInViewport";
import { navigationSizeChecker } from "../../modules/crm/shared/utils/navigationSizeChecker";
import Button from "../../../components/TailwindControls/Form/Button/Button";
import { cookieUserStore } from "../../../shared/CookieUserStore";
import { InstanceStoreContext } from "../../../stores/InstanceStore";
import { camelCase } from "change-case";

function isVisible(element: HTMLElement) {
  let getOffset = function (el: HTMLElement) {
    let _x = 0;
    let _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      _x += el.offsetLeft - el.scrollLeft;
      _y += el.offsetTop - el.scrollTop;
      el = el.offsetParent as HTMLElement;
    }
    return { y: _y, x: _x };
  };
  let _pos = getOffset(element);
  let _topElement = document.elementFromPoint(_pos.x, _pos.y);
  return _topElement == element;
}

interface navList {
  name: string;
  key: string;
  label: string;
  link: {
    pathname: string;
  };
}

export const OverflowNavMenu = ({
  navbarColor,
  navbarTextColor,
  navigations,
  parentRef,
}: {
  navbarColor?: string;
  navbarTextColor?: string;
  navigations: INavigation[];
  parentRef: any;
}) => {
  const { modelName } = getAppPathParts();
  const { instances } = useContext(InstanceStoreContext);
  const cookieUser = cookieUserStore.getUserDetails();
  const [moreNavLinksVisible, setMoreNavLinksVisible] = useState(false);
  const [moreIconVisible, setMoreIconsVisible] = useState(false);
  const [dropDownNavList, setDropDownNavList] = useState<navList[]>([]);

  const getAllHiddenNavItems = useCallback(() => {
    const subDomain = window.location.hostname.split(".")[0];
    const findInstanceIndex = instances?.findIndex(
      (instance) => instance?.subdomain === subDomain
    );
    if (parentRef) {
      let updatedNavigations =
        findInstanceIndex === -1 || !cookieUser?.id || !modelName
          ? getNavigationList(navigations)
          : getNavigationList(
              navigations,
              localStorage.getItem(
                "currentDashboardViewPerModulePerInstancePerUser"
              ),
              instances[findInstanceIndex].id,
              cookieUser.id
            );

      const DashBoardModelView =
        typeof window !== "undefined"
          ? localStorage.getItem(
              "currentDashboardViewPerModulePerInstancePerUser"
            )
          : null;
      const hiddenNavItems = updatedNavigations.filter((navItem) => {
        const element = document.getElementById(`${navItem.key}`);
        if (!element) return false;
        let result = null;
        result = isInViewport(parentRef.current, element);
        if (!result) {
          if (navigationSizeChecker(parentRef.current, element)) {
            element.style.visibility = "visible";
          } else {
            element.style.visibility = "hidden";
            parentRef.current.style.width =
              parentRef.current.getBoundingClientRect() -
              element.getBoundingClientRect().width;
          }
        } else if (element) {
          element.style.visibility = "visible";
        }
        return !result;
      });
      return hiddenNavItems;
    } else {
      return [];
    }
  }, [
    navigations,
    parentRef,
    localStorage.getItem("currentDashboardViewPerModulePerInstancePerUser"),
    
  ]);

  const checkRenderedNav = () => {
    let navList = getAllHiddenNavItems();
    setDropDownNavList(navList);
  };

  const wrapperRef = useRef(null);
  ClickOutsideToClose(wrapperRef, () => setMoreNavLinksVisible(false));

  React.useEffect(() => {
    function updateSize() {
      setMoreNavLinksVisible(false);
      setMoreIconsVisible(getAllHiddenNavItems().length > 0);
    }
    window.addEventListener("resize", updateSize);
    setMoreIconsVisible(getAllHiddenNavItems().length > 0);
    return () => window.removeEventListener("resize", updateSize);
  }, [getAllHiddenNavItems]);

  return (
    <div className="relative hidden sm:inline-block text-left" ref={wrapperRef}>
      {moreIconVisible && (
        <Button
          id="more-nav-links-menu"
          customStyle="flex items-center ml-4"
          onClick={(e) => {
            e.preventDefault();
            setMoreNavLinksVisible(!moreNavLinksVisible);
            checkRenderedNav();
          }}
          userEventName="show-more-nav-items-click"
        >
          <MoreItemIcon
            size={20}
            className="text-vryno-navbar-name-container cursor-pointer"
          />
        </Button>
      )}
      {moreNavLinksVisible && (
        <div
          className={`origin-top-right absolute left-0 mt-1 w-44 overflow-y-scroll rounded-md shadow-lg  ring-1 ring-black ring-opacity-5 focus:outline-none`}
          role="menu"
          id="nav-links"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          style={{
            maxHeight: "50vh",
            backgroundColor: navbarColor ?? "white",
            color: !navbarColor ? "black" : navbarTextColor ?? "black",
          }}
        >
          {dropDownNavList.map((item, index) => (
            <Link href={item.link} key={index} legacyBehavior>
              <a
                onClick={() => {
                  setMoreNavLinksVisible(!moreNavLinksVisible);
                }}
                className={`p-2 cursor-pointer flex flex-row items-center border-gray-100 hover:bg-vryno-theme-blue-disable ${
                  modelName === camelCase(item.name) || modelName === item.key
                    ? "text-white bg-vryno-theme-light-blue"
                    : ""
                } ${dropDownNavList.length === 1 ? "" : "border-b"}`}
              >
                <span className="text-sm max-w-[120px] truncate overflow-ellipsis overflow-hidden">
                  {item.label}
                </span>
              </a>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
