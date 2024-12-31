import React from "react";
import { toast } from "react-toastify";
import { FormikValues, useFormikContext } from "formik";
import { ISubFormDataDict } from "../../../../../../models/shared";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import { evaluateDisplayExpression } from "../../../shared/utils/getFieldsFromDisplayExpression";
import FormSearchBox from "../../../../../../components/TailwindControls/Form/SearchBox/FormSearchBox";
import { convertDataFromUniquenameToName } from "../../GenericModelView/SendEmailForm/convertDataFromUniquenameToName";
import GenericFormModalContainer from "../../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";

export const SubFormSearchModal = ({
  subFormData,
  setShowSearchScreen,
  appName,
  handleAddSubFormItem,
  subFormFormikValues,
  updateSubFormItem,
}: {
  subFormData: ISubFormDataDict;
  setShowSearchScreen: (value: boolean) => void;
  appName: string | undefined;
  handleAddSubFormItem: (index: number, data: FormikValues) => void;
  subFormFormikValues: Record<string, FormikValues>;
  updateSubFormItem: (index: number, data: FormikValues) => void;
}) => {
  const name = `${subFormData.fieldsMetaData.fieldName}SubFormSearchValue`;
  const { setFieldValue } = useFormikContext<Record<string, string>>();

  const handleItemSelect = (item: Record<string, any>[]) => {
    if (!item?.[0]?.values) {
      setFieldValue(name, null);
      return;
    }
    let recordExist = false;
    for (const key in subFormFormikValues) {
      if (subFormFormikValues[key]?.id === item[0].rowId) {
        recordExist = true;
        break;
      }
    }
    if (recordExist) {
      toast.error("Record already exists in the list");
      setFieldValue(name, null);
      return;
    }
    const convertedItemsSearchedData = convertDataFromUniquenameToName(
      subFormData.visibleFieldsList,
      [item?.[0].values]
    );
    // setShowSearchScreen(false);
    setFieldValue(name, null);
    if (
      // Object.keys(subFormFormikValues).length === 1 &&
      Object.keys(
        subFormFormikValues[`${subFormData.fieldsMetaData.fieldName}.0`]
      )?.length === 0
    ) {
      updateSubFormItem(0, convertedItemsSearchedData?.[0] || {});
    } else {
      handleAddSubFormItem(0, convertedItemsSearchedData?.[0] || {});
    }
  };

  return (
    <>
      <GenericFormModalContainer
        topIconType="Close"
        formHeading={`Search ${subFormData.fieldsMetaData.modelName}`}
        onCancel={() => {
          setShowSearchScreen(false);
        }}
        onOutsideClick={() => {
          setShowSearchScreen(false);
        }}
      >
        <div className="h-48">
          <FormSearchBox
            name={name}
            appName={appName || "crm"}
            label="Search"
            modelName={subFormData.fieldsMetaData.modelName}
            searchBy={
              evaluateDisplayExpression(
                subFormData.fieldsMetaData.displayExpression || ["name"],
                subFormData?.fieldsList || []
              ) || ["name"]
            }
            fieldDisplayExpression={
              subFormData.fieldsMetaData.displayExpression || ["name"]
            }
            editMode={false}
            multiple={false}
            handleItemSelect={(item) => handleItemSelect(item)}
          />
        </div>
      </GenericFormModalContainer>
      <Backdrop
        onClick={() => {
          setShowSearchScreen(false);
        }}
      />
    </>
  );
};

// const handleItemSelect = (item: Record<string, any>[]) => {
//   if (!item?.[0]?.values) {
//     setFieldValue(name, null);
//     return;
//   }
//   if (subFormData.data.findIndex((data) => data?.id == item[0].rowId) !== -1) {
//     toast.error("Record already exists in the list");
//     // setFieldValue(name, null);
//     return;
//   }
//   const convertedItemsSearchedData = convertDataFromUniquenameToName(
//     subFormData.visibleFieldsList,
//     [item?.[0].values]
//   );
//   const updatedSubFormData = subFormDataDict?.map((d) => {
//     if (d.fieldNameToSearchWith === subFormData.fieldNameToSearchWith) {
//       const updatedSubFormData = { ...subFormData };
//       updatedSubFormData["data"] = subFormData.data?.length
//         ? [...convertedItemsSearchedData, ...subFormData.data]
//         : convertedItemsSearchedData;
//       return updatedSubFormData;
//     }
//     return d;
//   });
//   setShowSearchScreen(false);
//   setFieldValue(name, null);
//   setSubFormDataDict(updatedSubFormData);
// };
