import React, { Dispatch, SetStateAction, useState } from "react";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import AddIcon from "remixicon-react/AddCircleFillIcon";
import { useAppSaveMutation } from "../../../../crm/shared/utils/useAppSaveMutation";
import { Toast } from "../../../../../../components/TailwindControls/Toast";
import { getSettingsPathParts } from "../../../../crm/shared/utils/getSettingsPathParts";
import { useTranslation } from "next-i18next";
import { AddModuleModalForm, AddModuleStateType } from "./AddModuleModalForm";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import { useCrmFetchLazyQuery } from "../../../../crm/shared/utils/operations";
import { INavigation } from "../../../../../../models/INavigation";
import { FormikValues } from "formik";
import { useLazyQuery } from "@apollo/client";
import {
  FETCH_QUERY,
  FetchData,
  FetchVars,
} from "../../../../../../graphql/queries/fetchQuery";
import { ILayout } from "../../../../../../models/ILayout";
import { getSortedFieldList } from "../../../../crm/shared/utils/getOrderedFieldsList";
import { ICustomField } from "../../../../../../models/ICustomField";
import { IGenericModel } from "../../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import { SupportedApps } from "../../../../../../models/shared";

interface ConnectedAddModuleProps {
  setModulesFetched: Dispatch<SetStateAction<IModuleMetadata[]>>;
  modulesFetched: IModuleMetadata[];
  loading: boolean;
  setItemsCount: (value: number) => void;
  itemsCount: number;
  genericModels: IGenericModel;
  allLayoutFetched: boolean;
  importModuleInfo: (moduleInfo: IModuleMetadata, moduleName: string) => void;
  importModuleLayouts: (layouts: ILayout[], moduleName: string) => void;
  importFields: (fieldsList: ICustomField[], moduleName: string) => void;
  importNavigations: (
    navigations: INavigation[],
    addItemAtIndex?: number
  ) => void;
}

export const ConnectedAddModule = ({
  setModulesFetched,
  modulesFetched,
  loading,
  setItemsCount,
  itemsCount,
  genericModels,
  allLayoutFetched,
  importModuleLayouts,
  importFields,
  importModuleInfo,
  importNavigations,
}: ConnectedAddModuleProps) => {
  const { appName } = getSettingsPathParts();
  const { t } = useTranslation(["common"]);
  const [savingProcess, setSavingProcess] = React.useState(false);
  const [addModuleModal, setAddModuleModal] = useState<AddModuleStateType>({
    visible: false,
    data: {},
  });

  const [fetchNavigations] = useLazyQuery<FetchData<INavigation>, FetchVars>(
    FETCH_QUERY,
    {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: SupportedApps.crm,
        },
      },
    }
  );

  const [getLayout] = useLazyQuery<FetchData<ILayout>, FetchVars>(FETCH_QUERY, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: appName,
      },
    },
  });

  const [createCustomModule] = useAppSaveMutation<IModuleMetadata>({
    appPath: appName,
    onCompleted: async (responseOnCompletion) => {
      if (responseOnCompletion?.save?.messageKey.includes("-success")) {
        await getLayout({
          variables: {
            modelName: "Layout",
            fields: ["id", "name", "moduleName", "layout", "config", "type"],
            filters: [
              {
                name: "moduleName",
                operator: "eq",
                value: [responseOnCompletion?.save?.data?.name],
              },
            ],
          },
        })
          .then((responseOnCompletion) => {
            if (
              responseOnCompletion?.data?.fetch?.data &&
              responseOnCompletion?.data?.fetch?.data?.length > 0
            ) {
              responseOnCompletion?.data?.fetch?.data?.forEach(
                (layout: ILayout) => {
                  importModuleLayouts([layout], layout.moduleName);
                  importFields(
                    getSortedFieldList(layout.config.fields),
                    layout.moduleName
                  );
                }
              );
            }
          })
          .catch((error) => {});

        await fetchNavigations({
          variables: {
            modelName: "NavigationItem",
            fields: [
              "label",
              "groupKey",
              "uniqueName",
              "navType",
              "order",
              "visible",
              "systemDefined",
              "parentNavigation",
              "navTypeMetadata",
            ],
            filters: [],
          },
        }).then((result) => {
          if (result?.data?.fetch?.data) {
            importNavigations(result.data.fetch.data);
          }
        });
        importModuleInfo(
          responseOnCompletion?.save?.data,
          responseOnCompletion?.save?.data?.name
        );
        setItemsCount(itemsCount + 1);
        setSavingProcess(false);
        setAddModuleModal({ visible: false, data: {} });
        Toast.success(responseOnCompletion.save.message);
        if (responseOnCompletion.save.data?.customizationAllowed) {
          setModulesFetched([
            ...modulesFetched,
            responseOnCompletion.save.data,
          ]);
          setItemsCount(itemsCount + 1);
        }
        return;
      }
      setSavingProcess(false);
      if (responseOnCompletion.save.messageKey) {
        Toast.error(responseOnCompletion.save.message);
        return;
      }
      Toast.error(t("common:unknown-message"));
    },
  });

  const handleModuleCreation = async (values: FormikValues) => {
    setSavingProcess(true);
    try {
      await createCustomModule({
        variables: {
          id: null,
          modelName: "Module",
          saveInput: {
            name: values.label,
            label: { en: values.label },
            createNavigationItem: values.createNavigationItem,
          },
        },
      });
    } catch (error) {
      Toast.error(error as string);
    }
  };
  return (
    <>
      <div>
        <Button
          id="add-module"
          buttonType="thin"
          kind="primary"
          onClick={() => {
            setAddModuleModal({ visible: true, data: {} });
          }}
          disabled={loading}
          userEventName="open-add-module-modal-click"
        >
          <div className="flex gap-x-1">
            <AddIcon size={18} />
            <p>Add Module</p>
          </div>
        </Button>
      </div>
      <AddModuleModalForm
        visible={addModuleModal.visible}
        setAddModuleModal={setAddModuleModal}
        handleModuleCreation={handleModuleCreation}
        savingProcess={savingProcess}
        modulesFetched={modulesFetched}
        genericModels={genericModels}
        allLayoutFetched={allLayoutFetched}
      />
    </>
  );
};
