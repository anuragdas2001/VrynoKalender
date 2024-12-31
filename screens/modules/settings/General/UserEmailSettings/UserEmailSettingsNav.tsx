import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import {
  PrimaryNavItem,
  UserEmailSettingsNavItem,
} from "./shared/UserEmailSettingsConstants";

type UserEmailSettingsNavInput = {
  navItems: UserEmailSettingsNavItem[];
  setSelectedTab: (item: PrimaryNavItem) => void;
};

export const UserEmailSettingsNav = ({
  navItems,
  setSelectedTab,
}: UserEmailSettingsNavInput) => {
  return (
    <div className="inline-flex flex-col whitespace-nowrap lg:flex-row gap-x-6">
      {navItems.map((item: UserEmailSettingsNavItem) => {
        return (
          <Button
            id={item.id}
            key={item.key}
            onClick={() => {
              setSelectedTab(item.key);
            }}
            buttonType={item.buttonType}
            userEventName={item.userEvent}
          >
            {item.label}
          </Button>
        );
      })}
    </div>
  );
};
