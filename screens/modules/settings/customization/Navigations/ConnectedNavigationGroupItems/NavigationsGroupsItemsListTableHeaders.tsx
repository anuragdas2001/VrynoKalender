import { Formik } from "formik";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import { SupportedDataTypes } from "../../../../../../models/ICustomField";
import { INavigation } from "../../../../../../models/INavigation";
import EditBoxIcon from "remixicon-react/EditBoxLineIcon";
import ArrowUpIcon from "remixicon-react/ArrowUpLineIcon";
import ArrowDownIcon from "remixicon-react/ArrowDownLineIcon";
import { MixpanelActions } from "../../../../../Shared/MixPanel";
import DeleteBinLineIcon from "remixicon-react/DeleteBinLineIcon";
import { ActionWrapper } from "../../../../crm/shared/components/ActionWrapper";
import SwitchToggle from "../../../../../../components/TailwindControls/Form/SwitchToggle/SwitchToggle";
import _ from "lodash";

export const navigationsTableHeaders = (
  onNavigationFieldEdit: (item: INavigation) => void,
  deleteNavigationItem: (id: string) => void,
  handleOrderUpdate: (itemOne: INavigation, itemTwo: INavigation) => void,
  navigationsToShow: INavigation[],
  savingProcess: boolean,
  handleVisibilityUpdate: (item: INavigation) => void
) => [
  {
    label: "",
    columnName: "",
    dataType: SupportedDataTypes.boolean,
    render: (item: INavigation, index: number) => {
      return (
        <div className="flex gap-x-2 items-center">
          <Button
            id={`navigation-item-order-down-${item.navTypeMetadata.moduleName}`}
            onClick={() =>
              handleOrderUpdate(
                {
                  ...navigationsToShow[index],
                  order: navigationsToShow[index + 1].order,
                },
                {
                  ...navigationsToShow[index + 1],
                  order: navigationsToShow[index].order,
                }
              )
            }
            disabled={savingProcess}
            customStyle={`cursor-pointer ${
              index === navigationsToShow.length - 1 ? "hidden" : "flex"
            } w-7 h-7 rounded-md flex justify-center items-center ${
              savingProcess
                ? "bg-vryno-theme-blue-disable"
                : "bg-vryno-theme-light-blue"
            }`}
            userEventName={`navigationItem-${item.navTypeMetadata.moduleName}-orderDown:action-click`}
          >
            <ArrowDownIcon size={18} className="text-white" />
          </Button>
          <Button
            id={`navigation-item-order-up-${item.navTypeMetadata.moduleName}`}
            onClick={() =>
              handleOrderUpdate(
                {
                  ...navigationsToShow[index],
                  order: navigationsToShow[index - 1].order,
                },
                {
                  ...navigationsToShow[index - 1],
                  order: navigationsToShow[index].order,
                }
              )
            }
            disabled={savingProcess}
            customStyle={`cursor-pointer ${
              index === 0 ? "invisible" : "flex"
            } w-7 h-7 rounded-md justify-center items-center  ${
              savingProcess
                ? "bg-vryno-theme-blue-disable"
                : "bg-vryno-theme-light-blue"
            }`}
            userEventName={`navigationItem-${item.navTypeMetadata.moduleName}-orderUp:action-click`}
          >
            <ArrowUpIcon size={18} className="text-white" />
          </Button>
        </div>
      );
    },
  },
  {
    label: "Displayed As",
    columnName: "label.en",
    dataType: SupportedDataTypes.singleline,
  },
  {
    label: "Module",
    columnName: "navTypeMetadata.moduleName",
    dataType: SupportedDataTypes.singleline,
  },
  {
    label: "System Defined",
    columnName: "systemDefined",
    dataType: SupportedDataTypes.boolean,
  },
  {
    label: "Visible",
    columnName: "visible",
    dataType: SupportedDataTypes.boolean,
    render: (item: INavigation, index: number) => {
      return (
        <form onSubmit={(e) => e.preventDefault()} className="w-full py-2">
          <Formik
            initialValues={{
              [`visible${index}`]: item.visible,
            }}
            enableReinitialize
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            {() => (
              <SwitchToggle
                name={`visible${index}`}
                dataTestId={`visible ${_.get(item?.label, "en", "")}`}
                onChange={() => {
                  item.visible === true
                    ? handleVisibilityUpdate({
                        ...navigationsToShow[index],
                        visible: false,
                      })
                    : handleVisibilityUpdate({
                        ...navigationsToShow[index],
                        visible: true,
                      });
                  MixpanelActions.track(
                    `switch-navigation-item-${navigationsToShow[index]?.name}-visible:toggle-click`,
                    {
                      type: "switch",
                    }
                  );
                }}
                value={navigationsToShow[index]?.visible?.toString()}
                disabled={savingProcess}
              />
            )}
          </Formik>
        </form>
      );
    },
  },
  {
    label: "Actions",
    columnName: "actions",
    dataType: SupportedDataTypes.singleline,
    render: (item: INavigation, index: number) => (
      <ActionWrapper
        index={index}
        content={
          <div className="flex gap-x-4">
            <Button
              id={`edit-navigation-${_.get(item?.label, "en", "")}`}
              onClick={
                item.systemDefined && item.uniqueName === "report"
                  ? () => {}
                  : () => {
                      onNavigationFieldEdit(item);
                    }
              }
              disabled={savingProcess}
              customStyle=""
              userEventName="navigation-item-edit:action-click"
            >
              <EditBoxIcon
                size={20}
                className={` ${
                  (item.systemDefined && item.uniqueName === "report") ||
                  savingProcess
                    ? "text-vryno-theme-blue-disable"
                    : "text-vryno-theme-light-blue cursor-pointer"
                }`}
              />
            </Button>
            <Button
              id={`delete-navigation-${_.get(item?.label, "en", "")}`}
              onClick={() => deleteNavigationItem(item.id)}
              customStyle=""
              disabled={savingProcess}
              userEventName="navigation-item-delete:action-click"
            >
              <DeleteBinLineIcon
                size={20}
                className={`mr-2 text-vryno-theme-light-blue cursor-pointer ${
                  item.systemDefined ? "hidden" : ""
                }`}
              />
            </Button>
          </div>
        }
      />
    ),
  },
];
