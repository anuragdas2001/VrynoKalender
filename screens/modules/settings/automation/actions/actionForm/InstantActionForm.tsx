import React from "react";
import FormDropdown from "../../../../../../components/TailwindControls/Form/Dropdown/FormDropdown";
import { useFormikContext } from "formik";
import {
  ICustomField,
  SupportedDataTypes,
} from "../../../../../../models/ICustomField";
import { getSortedFieldList } from "../../../../crm/shared/utils/getOrderedFieldsList";
import { ActivityActionTypeModal } from "../../workflows/WorkFlowForm/ActionTypesModal/ActivititesActionTypeModal";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import GenericList from "../../../../../../components/TailwindControls/Lists/GenericList";
import _ from "lodash";
import { DetailJSONDateTime } from "../../../../crm/shared/components/ReadOnly/DetailJSONDateTime";
import { Loading } from "../../../../../../components/TailwindControls/Loading/Loading";
import EditBoxIcon from "remixicon-react/EditBoxLineIcon";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import { ActionType } from "../../shared/actionTypes";
import { User } from "../../../../../../models/Accounts";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { IUserPreference } from "../../../../../../models/shared";

const getFieldForActivityWorkflow = (
  fieldsList: ICustomField[],
  parentFieldsList?: ICustomField[]
) => {
  return fieldsList?.map((field) => {
    if (
      (field.dataType === "datetime" &&
        field.systemDefined &&
        field.mandatory) ||
      (field.name === "dueDate" &&
        field.dataType === "datetime" &&
        field.systemDefined)
    ) {
      return {
        ...field,
        mandatory: true,
        dataType: SupportedDataTypes.jsonDateTime,
        parentFieldsList: parentFieldsList,
      };
    } else return field;
  });
};

export const InstantActionForm = ({
  editMode,
  modules,
  data,
  recordDraftData,
  user,
  genericModels,
  allLayoutFetched,
  allModulesFetched,
  userPreferences,
}: {
  editMode: boolean;
  modules: IModuleMetadata[];
  data: ActionType | undefined;
  recordDraftData?: any;
  user: User | null;
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  allModulesFetched: boolean;
  userPreferences: IUserPreference[];
}) => {
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();
  const [parentFieldsList, setParentFieldsList] = React.useState<{
    loading: boolean;
    data: ICustomField[];
  }>({ loading: false, data: [] });
  const [activityFieldsList, setActivityFieldsList] = React.useState<{
    loading: boolean;
    error: boolean;
    data: ICustomField[];
  }>({ loading: false, error: false, data: [] });
  const [fieldsForActivityModel, setFieldsForActivityModel] = React.useState<{
    loading: boolean;
    data: ICustomField[];
  }>({ loading: false, data: [] });
  const [showActivityModalForm, setShowActivityModalForm] =
    React.useState<boolean>(editMode ? false : true);
  const [activityData, setActivityData] = React.useState<{
    [fieldName: string]: {
      input: any;
      type: string;
    };
  }>();

  const fetchFields = (moduleName: string) => {
    let updatedFieldList = { ...activityFieldsList };
    setActivityFieldsList({ ...updatedFieldList, loading: true });
    let fieldsListFromStore = genericModels[moduleName]?.fieldsList ?? [];
    setActivityFieldsList({
      loading: false,
      error: false,
      data: getSortedFieldList(
        fieldsListFromStore?.length > 0 ? fieldsListFromStore : []
      ),
    });
    let activityFields = getFieldForActivityWorkflow(
      getSortedFieldList(
        fieldsListFromStore?.length > 0 ? fieldsListFromStore : []
      ),
      parentFieldsList?.data
    );
    setFieldsForActivityModel({
      loading: false,
      data: [...activityFields],
    });
  };

  const getRecordDraftData = (activityData?: {
    [fieldName: string]: {
      format?: any;
      input?: any;
      type: string;
    };
  }) => {
    let updatedRecord: Record<string, any> = {};
    if (!activityData) return updatedRecord;
    Object.keys(activityData).forEach(
      (key) =>
        (updatedRecord[key] = activityData[key]?.format
          ? {
              ...activityData[key]?.format,
              executorField: activityData[key]?.input ?? "",
            }
          : activityData[key]?.input ?? "")
    );
    return updatedRecord;
  };

  React.useEffect(() => {
    if (
      data?.moduleName &&
      parentFieldsList?.data?.length > 0 &&
      allLayoutFetched
    ) {
      setFieldsForActivityModel({ loading: true, data: [] });
      fetchFields(data?.moduleName as string);
    }
  }, [data, parentFieldsList, allLayoutFetched]);

  React.useEffect(() => {
    setActivityData(recordDraftData);
  }, [recordDraftData]);

  React.useEffect(() => {
    if (!values["moduleName"] && allLayoutFetched) {
      setParentFieldsList({ loading: false, data: [] });
      return;
    }
    const getParentModuleFields = async () => {
      let fieldsListFromStore = genericModels[values["moduleName"]]?.fieldsList;
      setParentFieldsList({
        loading: false,
        data: getSortedFieldList(
          fieldsListFromStore?.length > 0 ? fieldsListFromStore : []
        ),
      });
    };
    getParentModuleFields();
  }, [values["moduleName"], allLayoutFetched]);

  return (
    <>
      <FormDropdown
        required={true}
        name={`moduleName`}
        label={`Select Module`}
        options={modules
          ?.filter((module) => {
            if (
              ["add-task", "add-meeting", "schedule-call"].includes(
                values["actions"]
              ) &&
              ["task", "meeting", "callLog"].includes(module.name)
            ) {
              return null;
            } else {
              return module;
            }
          })
          ?.map((module) => module)
          ?.map((module) => {
            return { label: module.label.en, value: module.name };
          })}
        disabled={editMode || values["fields"]?.length > 0}
        onChange={async (selectedOption) => {
          setFieldValue("moduleName", selectedOption.currentTarget.value);
          setParentFieldsList({ loading: true, data: [] });
          setFieldValue("fields", null);
          setFieldValue("templateId", null);
          if (!allLayoutFetched) return;
          let fieldsListFromStore =
            genericModels[values[selectedOption.currentTarget.value]]
              ?.fieldsList;
          setActivityFieldsList({
            loading: false,
            error: false,
            data: getSortedFieldList(
              fieldsListFromStore?.length > 0 ? fieldsListFromStore : []
            ),
          });
          let activityFields = getFieldForActivityWorkflow(
            getSortedFieldList(
              fieldsListFromStore?.length > 0 ? fieldsListFromStore : []
            ),
            parentFieldsList?.data
          );
          setFieldsForActivityModel({
            loading: false,
            data: [...activityFields],
          });
          setShowActivityModalForm(true);
        }}
      />
      {parentFieldsList.loading || fieldsForActivityModel.loading ? (
        <div className="w-full h-[155px] flex items-center justify-center col-span-full">
          <Loading color="Blue" />
        </div>
      ) : parentFieldsList.data?.length > 0 &&
        !parentFieldsList.loading &&
        !fieldsForActivityModel.loading ? (
        showActivityModalForm ? (
          <ActivityActionTypeModal
            editMode={editMode}
            modulesFetched={modules}
            data={data}
            activityFieldsList={activityFieldsList}
            fieldsForActivityModel={fieldsForActivityModel?.data}
            parentFieldsList={parentFieldsList.data}
            activityData={activityData}
            user={user}
            userPreferences={userPreferences}
            genericModels={genericModels}
            allLayoutFetched={allLayoutFetched}
            allModulesFetched={allModulesFetched}
            setActivityData={setActivityData}
            setShowActivityModalForm={setShowActivityModalForm}
          />
        ) : (
          <div className="col-span-full ">
            <p
              data-testid={`Added ${
                modules?.find((module) => module.name === data?.moduleName)
                  ?.label?.en
              }`}
              className={`mt-2.5`}
            >{`Added ${
              modules?.find((module) => module.name === data?.moduleName)?.label
                ?.en
            }`}</p>
            <div className="w-full h-[164px] overflow-x-scroll mt-2.5">
              <GenericList
                fieldsList={fieldsForActivityModel?.data}
                data={[getRecordDraftData(activityData)]}
                listSelector={false}
                truncate={false}
                tableHeaders={fieldsForActivityModel?.data
                  ?.filter((field) => field.mandatory && field.addInForm)
                  .map((field) => {
                    if (field.dataType === SupportedDataTypes.jsonDateTime) {
                      return {
                        columnName: field.name,
                        dataType: SupportedDataTypes.jsonDateTime,
                        label: field.label.en,
                        render: (record: any, index: number) => {
                          return (
                            <DetailJSONDateTime
                              field={{
                                label: field.label.en,
                                value: field.name,
                                dataType: SupportedDataTypes.jsonDateTime,
                                field: field,
                              }}
                              data={_.get(record, field.name, {})}
                              fontSize={{
                                header: "text-sm",
                                value: "text-xsm",
                              }}
                            />
                          );
                        },
                      };
                    } else {
                      return {
                        columnName: field.name,
                        dataType: field.dataType,
                        label: field.label.en,
                      };
                    }
                  })
                  .concat([
                    {
                      columnName: "actions",
                      label: "Actions",
                      dataType: SupportedDataTypes.singleline,
                      render: (record: any, index: number) => {
                        return (
                          <div className="w-full h-full flex items-center justify-center pl-5">
                            <Button
                              id={`edit-instant-action-${record.name}`}
                              onClick={() => setShowActivityModalForm(true)}
                              customStyle=""
                              userEventName="instant-action-edit:button-click"
                            >
                              <EditBoxIcon
                                size={20}
                                className="text-vryno-theme-light-blue cursor-pointer"
                              />
                            </Button>
                          </div>
                        );
                      },
                    },
                  ])}
              />
            </div>
          </div>
        )
      ) : null}
    </>
  );
};
