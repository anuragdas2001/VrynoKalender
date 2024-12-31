import { kebabCase } from "lodash";
import namedColors from "color-name-list";
import React, { useRef } from "react";
import QuickAddIcon from "remixicon-react/PlayListAddLineIcon";
import { IModuleMetadata } from "../../../../models/IModuleMetadata";
import Button from "../../../../components/TailwindControls/Form/Button/Button";
import { getNavigationLabel } from "../../../modules/crm/shared/utils/getNavigationLabel";
import { IFormModalObject } from "../../../modules/crm/generic/GenericModelDetails/IGenericFormDetails";
import { ClickOutsideToClose } from "../../../../components/TailwindControls/shared/ClickOutsideToClose";
import { getNavigationList } from "../../../modules/crm/shared/utils/getNavigationList";
import { INavigation } from "../../../../models/INavigation";
import { IGenericModel } from "../../../../stores/RootStore/GeneralStore/GenericModelStore";

export type QuickAddProps = {
  appName: string;
  navbarColor?: string;
  navbarTextColor: string;
  disabled: boolean;
  filteredNavigations: INavigation[];
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  allModulesFetched: boolean;
  setQuickAddModal: (value: IFormModalObject) => void;
};
export const QuickAdd = ({
  appName,
  navbarColor,
  navbarTextColor,
  filteredNavigations,
  disabled = false,
  genericModels,
  allLayoutFetched,
  allModulesFetched,
  setQuickAddModal,
}: QuickAddProps) => {
  const wrapperRef = useRef(null);
  const [dropDownListVisible, setDropDownListVisible] = React.useState(false);
  let someColor = namedColors.find((color) => color.hex === navbarColor);

  ClickOutsideToClose(wrapperRef, (value: boolean) =>
    setDropDownListVisible(value)
  );

  const [modulesFetched, setModulesFetched] = React.useState<{
    loading: boolean;
    data: IModuleMetadata[];
  }>({ loading: true, data: [] });

  React.useEffect(() => {
    if (filteredNavigations?.length && allLayoutFetched && allModulesFetched) {
      let navigationList = getNavigationList(
        filteredNavigations.filter(
          (navigation) =>
            navigation.groupKey === "default-navigation" && navigation.visible
        )
      );
      let responseData = [
        ...Object.keys(genericModels)
          ?.map((model) => {
            if (genericModels[model]?.moduleInfo?.customizationAllowed === true)
              return genericModels[model]?.moduleInfo;
          })
          ?.filter((model) => model),
      ];

      let updatedModuleData: IModuleMetadata[] = [];

      for (let navigation of navigationList) {
        for (let data of responseData) {
          if (navigation.moduleName === data?.name) {
            updatedModuleData.push(data);
          }
        }
      }
      setModulesFetched({
        loading: false,
        data: updatedModuleData,
      });
      return;
    }
  }, [filteredNavigations?.length, allLayoutFetched, allModulesFetched]);

  return (
    <div className="relative inline-block text-left" ref={wrapperRef}>
      <Button
        id="quick-add-button"
        disabled={disabled}
        kind="invisible"
        onClick={(e) => {
          e.preventDefault();
          setDropDownListVisible(!dropDownListVisible);
        }}
        userEventName="open-quick-add-dropdown:action-click"
      >
        <QuickAddIcon size={22} color={navbarTextColor} />
      </Button>
      <div
        className={`origin-top-right absolute rounded-md right-0 z-[1000] mt-2 w-[176px] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none top-9 max-h-[40vh] bg-white ${
          dropDownListVisible ? "" : "invisible"
        }`}
        role="menu"
        id="navbarMenu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        style={{
          backgroundColor: navbarColor ?? "white",
          color: !navbarColor ? "black" : navbarTextColor ?? "black",
        }}
      >
        <div className={`w-full max-h-[40vh] p-2 shadow-md`}>
          <div className="max-h-[38vh] w-full overflow-y-auto overflow-x-hidden card-scroll pr-2">
            {modulesFetched?.data?.map((module, index) => {
              const navigationLabel = getNavigationLabel({
                navigations: filteredNavigations,
                currentModuleName: module.name,
                currentModuleLabel: module.label.en ?? "",
                defaultLabel: module.label.en ?? "",
              });
              return (
                <Button
                  id={`quick-add-${kebabCase(module.name)}`}
                  key={index}
                  customStyle={`w-full p-2 px-4 cursor-pointer flex flex-row items-center border-gray-100 hover:opacity-70 ${
                    modulesFetched?.data.length === 1 ? "" : "border-b"
                  } bg-${
                    navbarColor ? someColor?.name?.toLowerCase() : "white"
                  }`}
                  onClick={(e) => {
                    setQuickAddModal({
                      visible: true,
                      formDetails: {
                        type: "Add",
                        id: null,
                        modelName: module.name,
                        appName: appName ?? "crm",
                        quickCreate: true,
                        aliasName: navigationLabel,
                      },
                    });
                    setDropDownListVisible(false);
                  }}
                  userEventName="open-quick-add-modal-click"
                  title={navigationLabel}
                >
                  <span
                    className={`text-xs flex items-center gap-x-1 text-${
                      navbarTextColor ? navbarTextColor : "gray-400"
                    }`}
                  >
                    <span
                      className={`text-${
                        navbarTextColor ? navbarTextColor : "gray-400"
                      }`}
                    >
                      +
                    </span>
                    <span
                      className={`truncate overflow-ellipsis overflow-hidden max-w-[100px] text-${
                        navbarTextColor ? navbarTextColor : "gray-400"
                      }`}
                    >
                      {navigationLabel}
                    </span>
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
