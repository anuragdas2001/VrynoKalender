import { Formik } from "formik";
import React, { useEffect, useRef } from "react";
import AddIcon from "remixicon-react/AddCircleFillIcon";
import ArrowUpIcon from "remixicon-react/ArrowUpLineIcon";
import ArrowDownIcon from "remixicon-react/ArrowDownLineIcon";
import GenericBackHeader from "../../../../crm/shared/components/GenericBackHeader";
import NoDataFoundContainer from "../../../../crm/shared/components/NoDataFoundContainer";
import { SupportedDataTypes } from "../../../../../../models/ICustomField";
import ItemsLoader from "../../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import EditBoxIcon from "remixicon-react/EditBoxLineIcon";
import { SideDrawer } from "../../../../crm/shared/components/SideDrawer";
import { setHeight } from "../../../../crm/shared/utils/setHeight";
import { ActionWrapper } from "../../../../crm/shared/components/ActionWrapper";
import { SettingsSideBar } from "../../../SettingsSidebar";
import Pagination from "../../../../crm/shared/components/Pagination";
import { NoViewPermission } from "../../../../crm/shared/components/NoViewPermission";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import { ProductTaxList } from "./productTaxList";
import SwitchToggle from "../../../../../../components/TailwindControls/Form/SwitchToggle/SwitchToggle";
import { MixpanelActions } from "../../../../../Shared/MixPanel";

const productTaxTableHeader = (
  productTaxes: any[],
  editProductTax: any,
  deleteProductTax: any,
  handleOrderUpdate: (itemOne: any, itemTwo: any) => void,
  handleVisibleToggle: (item: any) => void,
  saveProcessing?: boolean
) => [
  {
    label: "",
    columnName: "",
    dataType: SupportedDataTypes.boolean,
    render: (item: any, index: number) => {
      return (
        <div className="flex gap-x-2 items-center">
          <Button
            id={`product-tax-order-up-${item.id}`}
            onClick={
              saveProcessing
                ? () => {}
                : () =>
                    handleOrderUpdate(
                      {
                        ...productTaxes[index],
                        order: productTaxes[index - 1].order,
                      },
                      {
                        ...productTaxes[index - 1],
                        order: productTaxes[index].order,
                      }
                    )
            }
            customStyle={` w-7 h-7 rounded-md justify-center items-center cursor-pointer ${
              index === 0 ? "hidden" : "flex"
            } ${
              saveProcessing
                ? "bg-vryno-theme-blue-disable"
                : "bg-vryno-theme-light-blue"
            }`}
            userEventName="product-tax-order-up:action-click"
          >
            <ArrowUpIcon size={18} className="text-white" />
          </Button>
          <Button
            id={`product-tax-order-down-${item.id}`}
            onClick={
              saveProcessing
                ? () => {}
                : () =>
                    handleOrderUpdate(
                      {
                        ...productTaxes[index],
                        order: productTaxes[index + 1].order,
                      },
                      {
                        ...productTaxes[index + 1],
                        order: productTaxes[index].order,
                      }
                    )
            }
            customStyle={`w-7 h-7  rounded-md flex justify-center items-center cursor-pointer ${
              index === productTaxes.length - 1 ? "hidden" : "flex"
            }  ${
              saveProcessing
                ? "bg-vryno-theme-blue-disable"
                : "bg-vryno-theme-light-blue"
            }`}
            userEventName="product-tax-order-down:action-click"
          >
            <ArrowDownIcon size={18} className="text-white" />
          </Button>
        </div>
      );
    },
  },
  {
    label: "Tax Name",
    columnName: "name",
    dataType: SupportedDataTypes.singleline,
  },
  {
    label: "Tax Label",
    columnName: "label.en",
    dataType: SupportedDataTypes.singleline,
  },
  {
    label: "Tax Value",
    columnName: "taxValue",
    dataType: SupportedDataTypes.number,
  },
  {
    label: "Tax Type",
    columnName: "taxType",
    dataType: SupportedDataTypes.singleline,
  },
  {
    label: "Last Modified",
    columnName: "updatedAt",
    dataType: SupportedDataTypes.date,
  },
  {
    label: "Visible",
    columnName: "visible",
    dataType: SupportedDataTypes.boolean,
    render: (item: any, index: number) => {
      return (
        <form onSubmit={(e) => e.preventDefault()} className="w-full py-2">
          <Formik
            initialValues={{
              [`visible${index}`]: item.visible === "i" ? false : true,
            }}
            enableReinitialize
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            {({
              values,
              setFieldValue,
            }: {
              values: any;
              setFieldValue: any;
            }) => (
              <SwitchToggle
                name={`visible${index}`}
                onChange={() => {
                  item.visible === "a" || item.visible === null
                    ? handleVisibleToggle({
                        ...item,
                        visible: "i",
                      })
                    : handleVisibleToggle({ ...item, visible: "a" });
                  MixpanelActions.track(
                    `switch-productTax-visibility:toggle-click`,
                    {
                      type: "switch",
                    }
                  );
                }}
                value={productTaxes[index]?.visible as any}
                disabled={item.restricted || saveProcessing}
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
    render: (item: any, index: number) => {
      return (
        <ActionWrapper
          index={index}
          content={
            <div className="flex flex-row gap-x-2 items-center justify-center">
              <Button
                id={`edit-product-${item.id}`}
                onClick={() => editProductTax(item)}
                customStyle=""
                userEventName="product-tax-edit:action-click"
              >
                <EditBoxIcon
                  size={20}
                  className="text-vryno-theme-light-blue cursor-pointer"
                />
              </Button>
            </div>
          }
        />
      );
    },
  },
];

export type ProductTaxScreenProps = {
  dataFetchProcessing: boolean;
  viewPermission: boolean;
  productTaxes: any[];
  deleteProductTaxes: (item: any) => void;
  itemsCount: number;
  currentPageNumber: number;
  onPageChange: (pageNumber: number) => void;
  setAddEditProductTaxModal: (value: {
    visible: boolean;
    data: null | any;
  }) => void;
  handleOrderUpdate: (itemOne: any, itemTwo: any) => void;
  handleVisibleToggle: (item: any) => void;
  saveProcessing?: boolean;
};

export const ProductTaxScreen = ({
  dataFetchProcessing,
  viewPermission,
  productTaxes,
  deleteProductTaxes,
  itemsCount,
  currentPageNumber,
  onPageChange = () => {},
  setAddEditProductTaxModal = () => {},
  handleOrderUpdate = () => {},
  handleVisibleToggle = () => {},
  saveProcessing,
}: ProductTaxScreenProps) => {
  const [sideMenuClass, setSideMeuClass] = React.useState("-translate-x-full");
  const heightRef = useRef(null);
  useEffect(() => {
    if (heightRef) {
      setHeight(heightRef, 40);
    }
  }, [productTaxes]);
  return (
    <>
      {viewPermission && !dataFetchProcessing ? (
        <GenericBackHeader heading="Product Taxes">
          <div>
            <Button
              id="add-product-tax"
              buttonType="thin"
              onClick={() =>
                setAddEditProductTaxModal({ visible: true, data: null })
              }
              userEventName="add product tax"
            >
              <p className="flex gap-x-2 items-center">
                <AddIcon size={18} />
                <span>{`Product Tax`}</span>
              </p>
            </Button>
          </div>
        </GenericBackHeader>
      ) : (
        <GenericBackHeader heading="Product Taxes" />
      )}

      <div className="flex justify-between mt-4">
        <div className="sm:hidden w-40">
          <SideDrawer
            sideMenuClass={sideMenuClass}
            setSideMenuClass={setSideMeuClass}
            buttonType={"thin"}
          >
            <SettingsSideBar />
          </SideDrawer>
        </div>
        {productTaxes.length > 0 && (
          <div className="pr-6 w-full flex justify-end mb-3">
            <Pagination
              itemsCount={itemsCount}
              currentPageItemCount={productTaxes.length}
              pageSize={50}
              onPageChange={(pageNumber) => {
                onPageChange(pageNumber);
              }}
              currentPageNumber={currentPageNumber}
            />
          </div>
        )}
      </div>

      <div className="px-6">
        {dataFetchProcessing ? (
          ItemsLoader({ currentView: "List", loadingItemCount: 4 })
        ) : !viewPermission ? (
          <NoViewPermission
            modelName="Email Template"
            addPadding={false}
            marginTop={"mt-8"}
          />
        ) : productTaxes.length > 0 ? (
          <div className="bg-white pt-4 pb-1 px-4 rounded-xl mt-2">
            <div ref={heightRef} className="overflow-y-auto pr-1 ">
              <ProductTaxList
                data={productTaxes}
                tableHeaders={productTaxTableHeader(
                  productTaxes,
                  (item: any) =>
                    setAddEditProductTaxModal({ visible: true, data: item }),
                  (item: any) => deleteProductTaxes(item),
                  handleOrderUpdate,
                  handleVisibleToggle,
                  saveProcessing
                )}
                modelName="emailTemplate"
              />
            </div>
          </div>
        ) : (
          <NoDataFoundContainer
            modelName="productTax"
            containerMessage="No Product Tax available at the moment"
            onClick={() =>
              setAddEditProductTaxModal({ visible: true, data: null })
            }
          />
        )}
      </div>
    </>
  );
};
