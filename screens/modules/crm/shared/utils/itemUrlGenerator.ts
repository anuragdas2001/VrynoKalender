import { IModuleMetadata } from "../../../../../models/IModuleMetadata";
import {
  ModuleFieldsItems,
  SettingsMenuItem,
} from "../../../../../models/Settings";
import { SupportedApps } from "../../../../../models/shared";
import { noId } from "../../../settings/customization/Shared/sharedConstants";
import { settingsUrlGenerator } from "./settingsUrlGenerator";

export const itemUrlGenerator = (item: IModuleMetadata) =>
  settingsUrlGenerator(
    SupportedApps.crm,
    SettingsMenuItem.moduleFields,
    item.id || noId,
    [ModuleFieldsItems.fields, item.name]
  );
