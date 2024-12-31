import React from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { FETCH_QUERY } from "../../../../../../graphql/queries/fetchQuery";
import DeleteModal from "../../../../../../components/TailwindControls/Modals/DeleteModal";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import { SAVE_MUTATION } from "../../../../../../graphql/mutations/saveMutation";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import { ProductTaxScreen } from "./ProductTaxScreen";
import { ConnectedAddEditProductTaxForm } from "./AddEditProductTaxForm/ConnectedAddEditProductTaxForm";
import { FormikValues } from "formik";
import { GeneralStoreContext } from "../../../../../../stores/RootStore/GeneralStore/GeneralStore";
import { observer } from "mobx-react-lite";

const productTaxVariable = {
  modelName: "productTax",
  fields: [
    "id",
    "type",
    "name",
    "label",
    "visible",
    "order",
    "taxType",
    "taxValue",
    "createdBy",
    "createdAt",
    "updatedBy",
    "updatedAt",
  ],
  filters: [],
};

export const ConnectedProductTaxScreen = observer(() => {
  const { generalModelStore } = React.useContext(GeneralStoreContext);
  const { genericModels, importFields } = generalModelStore;
  const { t } = useTranslation();
  const [itemsCount, setItemsCount] = React.useState<number>(0);
  const [productTaxes, setProductTaxes] = React.useState<any[]>([]);
  const [currentPageNumber, setCurrentPageNumber] = React.useState<number>(1);
  const [addEditProductTaxModal, setAddEditProductTaxModal] = React.useState<{
    visible: boolean;
    data: null | any;
  }>({
    visible: false,
    data: null,
  });
  const [deleteModal, setDeleteModal] = React.useState<{
    visible: boolean;
    id: string | null;
  }>({
    visible: false,
    id: null,
  });
  const [dataFetchProcessing, setDataFetchProcessing] = React.useState(true);
  const [savingProcess, setSavingProcess] = React.useState(false);
  const [viewPermission, setViewPermission] = React.useState(true);

  const [fetchProductTax] = useLazyQuery(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "crm",
      },
    },
    onCompleted: (responseOnCompletion) => {
      setDataFetchProcessing(false);
      if (responseOnCompletion?.fetch?.data?.length) {
        setItemsCount(responseOnCompletion.fetch.count);
        setProductTaxes(responseOnCompletion.fetch.data);
      } else if (
        responseOnCompletion?.fetch.messageKey.includes("requires-view")
      ) {
        setViewPermission(false);
        toast.error(responseOnCompletion?.fetch.message);
      }
    },
  });

  const [saveProductTax] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "crm",
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.save?.messageKey.includes("-success")) {
        const findIndex = productTaxes?.findIndex(
          (productTax) => productTax.id === responseOnCompletion?.save?.data?.id
        );
        const responseData = responseOnCompletion?.save?.data;
        if (findIndex === -1) {
          setProductTaxes([responseData].concat(productTaxes));
          setItemsCount(itemsCount + 1);
        } else {
          let updatedProductTax = [...productTaxes];
          updatedProductTax.splice(findIndex, 1, responseData);
          setProductTaxes(updatedProductTax);
        }
        const productTaxField: any = genericModels?.[
          "product"
        ]?.fieldsList?.filter((field) => field.name === "productTaxIds")?.[0];
        if (productTaxField) {
          const updatedTaxField = {
            ...productTaxField,
            dataTypeMetadata: {
              ...productTaxField.dataTypeMetadata,
              lookupOptions:
                productTaxField.dataTypeMetadata?.lookupOptions.map(
                  (d: any) => {
                    if (d.id === responseData?.id) {
                      return {
                        id: responseData.id,
                        label: responseData.label,
                        recordStatus: responseData.recordStatus,
                        order: responseData.order,
                        recordMetaData: {
                          taxType: responseData.taxType,
                          taxValue: responseData.taxValue,
                        },
                        colourHex: d.colourHex,
                        defaultOption: d.defaultOption,
                      };
                    }
                    return d;
                  }
                ),
            },
          };
          importFields(
            genericModels?.["product"]?.fieldsList?.map((field) => {
              if (field.name === "productTaxIds") {
                return updatedTaxField;
              }
              return field;
            }),
            "product"
          );
        }

        toast.success(responseOnCompletion?.save?.message);
        setAddEditProductTaxModal({ visible: false, data: null });
        setSavingProcess(false);
        return;
      }
      setSavingProcess(false);
      if (responseOnCompletion.save.messageKey) {
        toast.error(responseOnCompletion.save.message);
        return;
      }
      toast.error(t("common:unknown-message"));
    },
  });

  const [deleteProductTax] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "crm",
      },
    },
    onCompleted: (responseOnCompletion) => {
      if (responseOnCompletion?.save?.messageKey.includes("-success")) {
        setProductTaxes([
          ...productTaxes.filter(
            (productTax) =>
              productTax?.id !== responseOnCompletion?.save?.data?.id
          ),
        ]);
        setItemsCount(itemsCount - 1);
        setDeleteModal({ visible: false, id: null });
        toast.success(responseOnCompletion.save.message);
        setSavingProcess(false);
        return;
      }
      setSavingProcess(false);
      if (responseOnCompletion.save.messageKey) {
        toast.error(responseOnCompletion.save.message);
        return;
      }
      toast.error(t("common:unknown-message"));
    },
  });

  React.useEffect(() => {
    fetchProductTax({
      variables: productTaxVariable,
    });
  }, []);

  const handleSave = async (values: FormikValues) => {
    setSavingProcess(true);
    try {
      await saveProductTax({
        variables: {
          id: addEditProductTaxModal?.data
            ? addEditProductTaxModal?.data?.id
            : null,
          modelName: "productTax",
          saveInput: {
            name: values?.name,
            type: "productTax",
            taxType: "ratio",
            taxValue: values?.value ?? 0,
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleOrderUpdate = async (itemOne: any, itemTwo: any) => {
    try {
      setSavingProcess(true);
      await saveProductTax({
        variables: {
          id: itemOne.id,
          modelName: "productTax",
          saveInput: {
            name: itemOne?.name,
            type: "productTax",
            taxType: itemOne?.taxType,
            taxValue: itemOne?.taxValue,
            order: itemOne?.order,
          },
        },
      });
      setSavingProcess(true);
      await saveProductTax({
        variables: {
          id: itemTwo.id,
          modelName: "productTax",
          saveInput: {
            name: itemTwo?.name,
            type: "productTax",
            taxType: itemTwo?.taxType,
            taxValue: itemTwo?.taxValue,
            order: itemTwo?.order,
          },
        },
      });
    } catch (error) {}
  };

  const handleVisibleToggle = async (item: any) => {
    try {
      setSavingProcess(true);
      await saveProductTax({
        variables: {
          id: item.id,
          modelName: "productTax",
          saveInput: {
            name: item?.name,
            type: "productTax",
            taxType: item?.taxType,
            taxValue: item?.taxValue,
            order: item?.order,
            visible: item?.visible,
          },
        },
      });
    } catch (error) {}
  };

  return (
    <>
      <ProductTaxScreen
        dataFetchProcessing={dataFetchProcessing}
        viewPermission={viewPermission}
        itemsCount={itemsCount}
        currentPageNumber={currentPageNumber}
        onPageChange={(pageNumber) => {
          setCurrentPageNumber(pageNumber);
          fetchProductTax({
            variables: { ...productTaxVariable, pageNumber: pageNumber },
          });
        }}
        productTaxes={productTaxes
          ?.slice()
          ?.sort((itemOne, itemTwo) =>
            itemOne?.order > itemTwo?.order ? -1 : 1
          )}
        setAddEditProductTaxModal={(value) => setAddEditProductTaxModal(value)}
        deleteProductTaxes={(item) =>
          setDeleteModal({ visible: true, id: item.id })
        }
        handleOrderUpdate={handleOrderUpdate}
        handleVisibleToggle={handleVisibleToggle}
        saveProcessing={savingProcess}
      />
      {addEditProductTaxModal?.visible && (
        <>
          <ConnectedAddEditProductTaxForm
            data={addEditProductTaxModal?.data}
            savingProcess={savingProcess}
            setAddEditProductTaxModal={(value) =>
              setAddEditProductTaxModal(value)
            }
            handleSave={(values) => handleSave(values)}
          />
          <Backdrop
            onClick={() =>
              setAddEditProductTaxModal({ visible: false, data: null })
            }
          />
        </>
      )}
      {deleteModal.visible && (
        <>
          <DeleteModal
            id={deleteModal.id}
            modalHeader={`Delete Product Tax`}
            modalMessage={`Are you sure you want to delete this product tax?`}
            loading={savingProcess}
            onCancel={() => setDeleteModal({ visible: false, id: null })}
            onDelete={async () => {
              setSavingProcess(true);
              await deleteProductTax({
                variables: {
                  id: deleteModal.id,
                  modelName: "productTax",
                  saveInput: {
                    recordStatus: "d",
                  },
                },
              }).then();
              setItemsCount(itemsCount - 1);
              setDeleteModal({ visible: false, id: null });
            }}
            onOutsideClick={() => setDeleteModal({ visible: false, id: null })}
          />
          <Backdrop
            onClick={() => setDeleteModal({ visible: false, id: null })}
          />
        </>
      )}
    </>
  );
});
