import router from "next/router";
import Button from "../../../../../../../components/TailwindControls/Form/Button/Button";
import { settingsUrlGenerator } from "../../../../../crm/shared/utils/settingsUrlGenerator";
import { SupportedApps } from "../../../../../../../models/shared";
import { SettingsMenuItem } from "../../../../../../../models/Settings";
import GenericBackHeader from "../../../../../crm/shared/components/GenericBackHeader";

export const FieldsDependencyHeader = ({
  moduleName,
  showButtons,
}: {
  moduleName: string;
  showButtons: boolean;
}) => {
  return (
    <GenericBackHeader
      heading="Map Dependency Fields"
      subHeading={"Create dependencies between two pick lists"}
      addButtonInFlexCol={true}
    >
      {showButtons ? (
        <div className="flex gap-x-6 mt-2 lg:mt-0">
          <Button
            id="new-dependency-button"
            buttonType="thin"
            kind="primary"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              router.push(
                settingsUrlGenerator(
                  SupportedApps.crm,
                  SettingsMenuItem.moduleFields,
                  moduleName,
                  ["create-dependency"]
                )
              );
            }}
            userEventName="fieldsDependency-home-add-new-click"
          >
            <p>New</p>
          </Button>
          <Button
            id="back-button"
            buttonType="thin"
            kind="back"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              router.back();
            }}
            userEventName="fieldsDependency-home-cancel-click"
          >
            <p>Cancel</p>
          </Button>
        </div>
      ) : (
        <></>
      )}
    </GenericBackHeader>
  );
};
