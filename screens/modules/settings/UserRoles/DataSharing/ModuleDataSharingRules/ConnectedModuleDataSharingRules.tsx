import React from "react";
import { Formik } from "formik";
import { ModuleDataSharingRulesForm } from "./ModuleDataSharingRulesForm";
import { IModuleMetadata } from "../../../../../../models/IModuleMetadata";
import GenericBackHeader from "../../../../crm/shared/components/GenericBackHeader";
import { NoViewPermission } from "../../../../crm/shared/components/NoViewPermission";
import ItemsLoader from "../../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";

export const ConnectedModuleDataSharingRules = ({
  loading,
  viewPermission,
  viewSelectorComponent,
  modulesData,
  moduleDataSharingRuleData,
  moduleDataRulesInitialValue,
  setModuleDataSharingRuleData,
  updateInitialValues,
}: {
  loading: boolean;
  viewPermission: boolean;
  viewSelectorComponent: () => React.JSX.Element;
  modulesData: IModuleMetadata[];
  moduleDataSharingRuleData: Record<string, string>;
  moduleDataRulesInitialValue: Record<string, boolean>;
  setModuleDataSharingRuleData: (value: Record<string, string>) => void;
  updateInitialValues: (keyName: string, name: string) => void;
}) => {
  const [dataSaving, setDataSaving] = React.useState(false);
  return loading ? (
    <>
      <GenericBackHeader heading="Module Data Sharing Rules" />
      {viewSelectorComponent()}
      <div className="px-6">
        <ItemsLoader currentView="List" loadingItemCount={2} />
      </div>
    </>
  ) : (
    <>
      <GenericBackHeader heading="Module Data Sharing Rules" />
      <div className="flex flex-col lg:flex-row">{viewSelectorComponent()}</div>
      {viewPermission ? (
        <Formik
          initialValues={{ ...moduleDataRulesInitialValue }}
          onSubmit={() => {}}
        >
          {() => (
            <ModuleDataSharingRulesForm
              modulesData={modulesData}
              moduleDataSharingRuleData={moduleDataSharingRuleData}
              dataSaving={dataSaving}
              setDataSaving={(value: boolean) => setDataSaving(value)}
              moduleDataRulesInitialValue={moduleDataRulesInitialValue}
              setModuleDataSharingRuleData={setModuleDataSharingRuleData}
              updateInitialValues={updateInitialValues}
            />
          )}
        </Formik>
      ) : (
        <NoViewPermission shadow={false} />
      )}
    </>
  );
};
