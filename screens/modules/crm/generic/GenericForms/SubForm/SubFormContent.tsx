import React from "react";
import { toast } from "react-toastify";
import { SubFormForm } from "./SubFormForm";
import { useLazyQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import SearchIcon from "remixicon-react/SearchLineIcon";
import AddIcon from "remixicon-react/AddCircleFillIcon";
import { SubFormSearchModal } from "./SubFormSearchModal";
import DeleteIcon from "remixicon-react/SubtractLineIcon";
import { BaseUser } from "../../../../../../models/Accounts";
import { Formik, FormikValues, useFormikContext } from "formik";
import { ISubFormDataDict } from "../../../../../../models/shared";
import { getDataObject } from "../../../shared/utils/getDataObject";
import { ICustomField } from "../../../../../../models/ICustomField";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import getValidationSchema from "../../../shared/utils/validations/getValidationSchema";
import { SupportedMutationNames } from "../../../../../../graphql/helpers/graphQLShared";
import { FormFieldPerDataType } from "../../../shared/components/Form/FormFieldPerDataType";
import { mutationNameGenerator } from "../../../../../../graphql/helpers/mutationNameGenerator";
import ItemsLoader from "../../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import GenericHeaderCardContainer from "../../../../../../components/TailwindControls/Cards/GenericHeaderCardContainer";
import GenericFormModalContainer from "../../../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import {
  fetchModelData,
  fetchModelDataWithinQueryGenerator,
} from "../../../../../../graphql/queries/modelFetch";
import { get, range } from "lodash";

export const SubFormContent = ({
  appName,
  modelName,
  subFormIndex,
  subFormData,
  updatedFieldsList,
  editMode,
  formDetails,
  countryCodeInUserPreference,
  isSample,
  subFormRefs,
  data,
  subFormFieldsListDict,
  subFormDataDict,
  setSubFormDataDict,
  id,
  cookieUser,
  subFormClear,
  setSubFormValidationErrors,
  subFormValidationErrors,
}: {
  appName: string | undefined;
  modelName: string | undefined;
  subFormIndex: number;
  subFormData: ISubFormDataDict;
  updatedFieldsList: ICustomField[];
  editMode: boolean;
  formDetails: {
    type: string;
    modelName: string;
    appName: string;
  };
  countryCodeInUserPreference: string;
  isSample: boolean;
  subFormRefs: any;
  data: any;
  subFormFieldsListDict: Record<
    string,
    {
      fieldsList: ICustomField[];
      fieldsName: string[];
      modelName: string;
    }
  >;
  subFormDataDict: ISubFormDataDict[];
  setSubFormDataDict: (value: ISubFormDataDict[]) => void;
  cookieUser: BaseUser | null;
  id: string | undefined;
  subFormClear: boolean;
  setSubFormValidationErrors: (value: Record<string, boolean>) => void;
  subFormValidationErrors: Record<string, boolean>;
}) => {
  const { t } = useTranslation(["settings", "common"]);
  const { setFieldValue } = useFormikContext<Record<string, string>>();

  const [subFormItems, setSubFormItems] = React.useState<
    Record<string, FormikValues>[]
  >([{ [`${subFormData.fieldsMetaData.fieldName}.0`]: {} }]);
  const [subFormFormikValues, setSubFormFormikValues] = React.useState<
    Record<string, FormikValues>
  >({});
  const [formikDataSetLoading, setFormikDataSetLoading] = React.useState(true);
  const [formikDataSetFetchLoading, setFormikDataSetFetchLoading] =
    React.useState(true);

  const [showSearchScreen, setShowSearchScreen] = React.useState(false);
  const [subFormAllFieldsModal, setSubFormAllFieldsModal] = React.useState<{
    visible: boolean;
    subFormData: Record<string, any> | null;
    subFormMetaData: Record<string, any> | null;
    subFormItemIndex: number;
  }>({
    visible: false,
    subFormData: null,
    subFormMetaData: null,
    subFormItemIndex: -1,
  });

  const handleAddSubFormItem = (index: number, data: FormikValues) => {
    if (index < 0 || index > subFormItems.length) {
      toast.error("Index out of range");
      return;
    }
    if (index + 1 < subFormItems.length) {
      const updatedSubFormFormikValues: Record<string, FormikValues> = {
        ...subFormFormikValues,
      };
      const updatedSubFormItems: Record<string, any>[] = [...subFormItems];

      const totalSubFormCount = updatedSubFormItems?.length;
      range(totalSubFormCount ?? 1, index + 1)?.forEach((value) => {
        updatedSubFormFormikValues[
          `${subFormData.fieldsMetaData.fieldName}.${value}`
        ] =
          updatedSubFormFormikValues[
            `${subFormData.fieldsMetaData.fieldName}.${value - 1}`
          ];
        updatedSubFormItems[value] = {
          [`${subFormData.fieldsMetaData.fieldName}.${value}`]: get(
            updatedSubFormItems[value - 1],
            `${subFormData.fieldsMetaData.fieldName}.${value - 1}`,
            {}
          ),
        };
      });
      updatedSubFormFormikValues[
        `${subFormData.fieldsMetaData.fieldName}.${index + 1}`
      ] = data;
      updatedSubFormItems[index + 1] = {
        [`${subFormData.fieldsMetaData.fieldName}.${index + 1}`]: {},
      };
      setSubFormItems(updatedSubFormItems);
      setSubFormFormikValues(updatedSubFormFormikValues);
    } else {
      setSubFormItems([
        ...subFormItems,
        { [`${subFormData.fieldsMetaData.fieldName}.${index + 1}`]: {} },
      ]);
      setSubFormFormikValues({
        ...subFormFormikValues,
        [`${subFormData.fieldsMetaData.fieldName}.${index + 1}`]: data,
      });
      return;
    }
  };

  const handleSubtractSubForm = (index: number) => {
    if (
      subFormItems?.length > 1 &&
      index >= 0 &&
      index < subFormItems?.length
    ) {
      const updatedSubFormFormikValues: Record<string, FormikValues> = {};
      for (const key in subFormFormikValues) {
        const keyName = key.split(".")[0];
        const keyIndex = parseInt(key.split(".")[1]);
        if (keyIndex > index) {
          updatedSubFormFormikValues[`${keyName}.${keyIndex - 1}`] =
            subFormFormikValues[key];
        } else if (keyIndex < index) {
          updatedSubFormFormikValues[key] = subFormFormikValues[key];
        }
      }
      const updatedSubFormItems: Record<string, any>[] = [];
      subFormItems.forEach((subFormItem, subFormItemIndex) => {
        if (subFormItemIndex !== index) {
          if (subFormItemIndex > index) {
            updatedSubFormItems[subFormItemIndex - 1] = {
              [`${subFormData.fieldsMetaData.fieldName}.${
                subFormItemIndex - 1
              }`]:
                subFormItems[subFormItemIndex][
                  `${subFormData.fieldsMetaData.fieldName}.${subFormItemIndex}`
                ],
            };
          } else {
            updatedSubFormItems[subFormItemIndex] =
              subFormItems[subFormItemIndex];
          }
        }
      });
      setSubFormFormikValues(updatedSubFormFormikValues);
      setSubFormItems(updatedSubFormItems);
    }
  };

  const updateSubFormItem = (index: number, data: FormikValues) => {
    if (index < 0 || index >= subFormItems.length) {
      toast.error("Index out of range");
      return;
    }
    const updatedSubFormFormikValues: Record<string, FormikValues> = {
      ...subFormFormikValues,
    };
    updatedSubFormFormikValues[
      `${subFormData.fieldsMetaData.fieldName}.${index}`
    ] = data;
    if (subFormAllFieldsModal.visible)
      setSubFormAllFieldsModal({
        visible: false,
        subFormData: null,
        subFormMetaData: null,
        subFormItemIndex: -1,
      });
    setSubFormFormikValues(updatedSubFormFormikValues);
  };

  // SubForm custom query - start
  const withFieldsData = `${fetchModelDataWithinQueryGenerator(
    subFormData.fieldNameToSearchWith,
    subFormFieldsListDict?.[subFormData.fieldNameToSearchWith]?.fieldsName || [
      "id",
      "name",
      "ownerId",
    ],
    {
      [`${subFormData.fieldNameToSearchWith}PageNumber`]: "Int",
    }
  )}`;

  const getDataByIdQuery = fetchModelData(
    modelName || "",
    withFieldsData?.length
      ? ["id", "name", `with { ${withFieldsData} }`]
      : ["id", "name"],
    {
      [`${subFormData.fieldNameToSearchWith}PageNumber`]: "Int",
    }
  );

  const [getSubFormData] = useLazyQuery(getDataByIdQuery, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });
  // SubForm custom query - end

  const fetchSubFormDataInRecursion = async (
    pageNumber: number,
    fetchedSubformData: any[]
  ) => {
    await getSubFormData({
      variables: {
        [`${subFormData.fieldNameToSearchWith}PageNumber`]: pageNumber,
        filters: [
          { operator: "eq", name: "id", value: id?.toString() || "" },
          { operator: "in", name: "recordStatus", value: ["a", "i"] },
        ],
        orderBy: [{ name: "updatedAt", order: ["ASC"] }],
      },
    }).then(async (response) => {
      if (
        response?.data?.[
          `${mutationNameGenerator(
            SupportedMutationNames.fetch,
            modelName || ""
          )}`
        ]?.messageKey.includes("-success") &&
        response?.data?.[
          `${mutationNameGenerator(
            SupportedMutationNames.fetch,
            modelName || ""
          )}`
        ]?.data?.length
      ) {
        const responseData =
          response?.data?.[
            `${mutationNameGenerator(
              SupportedMutationNames.fetch,
              modelName || ""
            )}`
          ]?.data?.[0]?.with?.[subFormData.fieldNameToSearchWith]?.[0]?.data;
        responseData?.forEach((data: any) => {
          fetchedSubformData.push(getDataObject(data));
        });
        if (responseData?.length === 50) {
          await fetchSubFormDataInRecursion(++pageNumber, fetchedSubformData);
        }
      }
    });
    return { fetchedSubformData };
  };

  React.useEffect(() => {
    if (!appName) return;
    (async () => {
      if (data?.[subFormData.fieldsMetaData.fieldName]?.length <= 50 || !id) {
        setFormikDataSetFetchLoading(false);
        return;
      }
      setFormikDataSetLoading(true);
      const { fetchedSubformData } = await fetchSubFormDataInRecursion(2, [
        // ...subFormData.data,
      ]);
      const updatedSubFormDataDict = [...subFormDataDict];
      updatedSubFormDataDict[subFormIndex].data = [
        ...updatedSubFormDataDict[subFormIndex].data,
        ...fetchedSubformData,
      ];

      setSubFormDataDict(updatedSubFormDataDict);
      setFormikDataSetLoading(true);
      setFormikDataSetFetchLoading(false);
    })();
  }, [appName]);

  React.useEffect(() => {
    if (!data?.[subFormData.fieldsMetaData.fieldName]?.length) {
      setFormikDataSetLoading(false);
      return;
    }
    // const fieldData: string[] =
    //   data?.with?.[subFormData.fieldsMetaData.fieldName];
    if (subFormData.data?.length) {
      const updatedSubFormFormikValues: Record<string, FormikValues> = {};
      subFormData.data.forEach(
        (dataItem: Record<string, any>, subFormDataIndex) => {
          updatedSubFormFormikValues[
            `${subFormData.fieldsMetaData.fieldName}.${subFormDataIndex}`
          ] = getDataObject(dataItem);
        }
      );
      setSubFormFormikValues(updatedSubFormFormikValues);
      setSubFormItems(
        Object.keys(updatedSubFormFormikValues).map((val, index) => {
          return { [`${subFormData.fieldsMetaData.fieldName}.${index}`]: {} };
        })
      );
      setFormikDataSetLoading(false);
    }
    if (!subFormData.data?.length) setFormikDataSetLoading(false);
  }, [subFormData?.data]);

  React.useEffect(() => {
    const updatedData = [];
    for (const key in subFormFormikValues) {
      if (
        Object.keys(subFormFormikValues[key])?.length &&
        subFormFormikValues[key].name &&
        subFormFormikValues[key].ownerId
      ) {
        updatedData.push(subFormFormikValues[key]);
      }
    }
    if (updatedData?.length)
      setFieldValue(subFormData.fieldsMetaData.fieldName, updatedData);
  }, [subFormFormikValues]);

  React.useEffect(() => {
    if (subFormClear) {
      setSubFormItems([{ [`${subFormData.fieldsMetaData.fieldName}.0`]: {} }]);
      setSubFormFormikValues({});
    }
  }, [subFormClear]);

  return (
    <>
      <GenericHeaderCardContainer
        cardHeading={subFormData.fieldsMetaData.label}
        extended={true}
        headerButton={
          <div className={`h-9 flex items-center gap-x-4`}>
            <Button
              id={`${subFormData.fieldsMetaData.label}-subform-header-search-button`}
              onClick={() => setShowSearchScreen(true)}
              customStyle={`rounded-full flex items-center justify-center w-[24px] h-[24px] hover:cursor-pointer`}
              userEventName={`${subFormData.fieldsMetaData.label}-subform-header-search:button:click`}
              data-testid={`${subFormData.fieldsMetaData.label}-subForm-header:search-button`}
            >
              <SearchIcon size={20} className="text-gray-500 cursor-pointer" />
            </Button>
          </div>
        }
      >
        {formikDataSetLoading || formikDataSetFetchLoading ? (
          <ItemsLoader currentView={"List"} loadingItemCount={1} />
        ) : (
          <div className={`flex flex-col gap-y-4`}>
            {subFormItems.map((subFormItem, subFormItemIndex) => {
              return (
                <div
                  key={subFormItemIndex}
                  className={`w-full grid grid-cols-12 pb-4 border-b-[2px] border-dotted border-gray-300`}
                >
                  <div
                    className={`w-full h-full flex flex-col gap-2 items-center justify-center`}
                  >
                    <span className="border rounded-md px-2 text-lg bg-gray-100">
                      {subFormItemIndex + 1}
                    </span>
                  </div>
                  <SubFormForm
                    subFormIndex={subFormIndex}
                    subFormFormikValues={subFormFormikValues}
                    subFormItem={subFormItem}
                    updatedFieldsList={updatedFieldsList}
                    modelName={formDetails.modelName}
                    isSample={isSample}
                    editMode={editMode}
                    countryCodeInUserPreference={countryCodeInUserPreference}
                    setSubFormFormikValues={(
                      values: Record<string, FormikValues>
                    ) => setSubFormFormikValues(values)}
                    subFormRefs={subFormRefs[subFormIndex]}
                    subFormData={subFormData}
                    setSubFormAllFieldsModal={(value: {
                      visible: boolean;
                      subFormData: Record<string, any> | null;
                      subFormMetaData: Record<string, any> | null;
                      subFormItemIndex: number;
                    }) => setSubFormAllFieldsModal(value)}
                    subFormItemIndex={subFormItemIndex}
                    cookieUser={cookieUser}
                    subFormClear={subFormClear}
                    setSubFormValidationErrors={setSubFormValidationErrors}
                    subFormValidationErrors={subFormValidationErrors}
                  />
                  <div className="col-span-1 flex flex-col gap-y-3 items-center justify-center">
                    <Button
                      id={`${subFormData.fieldsMetaData.label}-subform-delete`}
                      customStyle={`border h-10 w-10 rounded-md flex items-center justify-center cursor-pointer bg-gray-100 ${
                        subFormItems?.length == 1 ? "hidden" : ""
                      }`}
                      onClick={() => handleSubtractSubForm(subFormItemIndex)}
                      userEventName="conditions-form-delete"
                      renderChildrenOnly={true}
                    >
                      <DeleteIcon
                        size={24}
                        className="text-vryno-delete-icon"
                      />
                    </Button>
                    <Button
                      id={`${subFormData.fieldsMetaData.label}-subform-add`}
                      customStyle={`border h-10 w-10 rounded-md flex items-center justify-center cursor-pointer bg-gray-100`}
                      onClick={() => handleAddSubFormItem(subFormItemIndex, {})}
                      userEventName="conditions-form-add:action-click"
                      renderChildrenOnly={true}
                    >
                      <AddIcon
                        size={24}
                        className="text-vryno-theme-light-blue"
                      />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </GenericHeaderCardContainer>
      {showSearchScreen ? (
        <SubFormSearchModal
          subFormData={subFormData}
          setShowSearchScreen={(value: boolean) => setShowSearchScreen(value)}
          appName={appName}
          handleAddSubFormItem={handleAddSubFormItem}
          subFormFormikValues={subFormFormikValues}
          updateSubFormItem={updateSubFormItem}
        />
      ) : (
        <></>
      )}
      {subFormAllFieldsModal.visible ? (
        <>
          <GenericFormModalContainer
            extendedWidth
            formHeading={"Add Record"}
            onOutsideClick={() =>
              setSubFormAllFieldsModal({
                visible: false,
                subFormData: null,
                subFormMetaData: null,
                subFormItemIndex: -1,
              })
            }
            onCancel={() =>
              setSubFormAllFieldsModal({
                visible: false,
                subFormData: null,
                subFormMetaData: null,
                subFormItemIndex: -1,
              })
            }
          >
            <Formik
              initialValues={subFormAllFieldsModal.subFormData || {}}
              validationSchema={getValidationSchema(
                subFormData.fieldsList,
                subFormAllFieldsModal?.subFormMetaData?.modelName || ""
              )}
              enableReinitialize
              onSubmit={(values) => {
                // handleAddSubFormItem(0, values);
                updateSubFormItem(
                  subFormAllFieldsModal.subFormItemIndex,
                  values
                );
              }}
            >
              {({ handleSubmit, values, setFieldValue }) => (
                <>
                  <div className="h-full grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 w-full gap-x-6 gap-y-6">
                    {subFormData.visibleFieldsList.map((field, index) => (
                      <FormFieldPerDataType
                        key={index}
                        field={field}
                        isSample={isSample}
                        setFieldValue={setFieldValue}
                        modelName={
                          subFormAllFieldsModal?.subFormMetaData?.modelName ||
                          ""
                        }
                        editMode={editMode}
                        values={values}
                        countryCodeInUserPreference={
                          countryCodeInUserPreference
                        }
                        enableRichTextReinitialize={true}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 mt-4">
                    <div>
                      <Button
                        buttonType="thin"
                        id="save-form"
                        onClick={() =>
                          setSubFormAllFieldsModal({
                            visible: false,
                            subFormData: null,
                            subFormMetaData: null,
                            subFormItemIndex: -1,
                          })
                        }
                        kind="back"
                        loading={false}
                        userEventName="sub-form-all-fields-modal-cancel:button-click"
                      >
                        {t("common:cancel")}
                      </Button>
                    </div>
                    <div>
                      <Button
                        buttonType="thin"
                        id="save-form"
                        onClick={() => {
                          handleSubmit();
                        }}
                        kind="next"
                        userEventName="sub-form-all-fields-modal-save:submit-click"
                      >
                        {t("common:save")}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Formik>
          </GenericFormModalContainer>
          <Backdrop
            onClick={() =>
              setSubFormAllFieldsModal({
                visible: false,
                subFormData: null,
                subFormMetaData: null,
                subFormItemIndex: -1,
              })
            }
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};
