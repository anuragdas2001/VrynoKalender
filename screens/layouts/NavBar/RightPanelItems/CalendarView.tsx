import CalenderIcon from "remixicon-react/CalendarEventLineIcon";
import Button from "../../../../components/TailwindControls/Form/Button/Button";
import router from "next/router";
import { SupportedApps } from "../../../../models/shared";

export const CalendarView = ({
  appName,
  disabled = false,
  navbarTextColor,
}: {
  appName: string;
  disabled?: boolean;
  navbarTextColor: string;
}) => {
  return (
    <Button
      id="global-calendar-view-button"
      kind="invisible"
      disabled={disabled}
      buttonType="invisible"
      onClick={() => router.push(`/app/${SupportedApps.crm}/calendar`)}
      userEventName="open-calendarView-page-click"
    >
      <CalenderIcon size={22} color={navbarTextColor} />
    </Button>
  );
};
