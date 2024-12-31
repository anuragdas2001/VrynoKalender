import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import BigCalendar from "react-big-calendar";
import React from "react";
import { ICalendarEventList } from "../CalendarViewScreen";
import { appsUrlGenerator } from "../../../shared/utils/appsUrlGenerator";
import { AllowedViews } from "../../../../../../models/allowedViews";
import Link from "next/link";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export const ConnectedBigCalendar = ({
  currentView,
  handleCurrentViewChange,
  handleDateParameters,
  calendarEventList,
}: {
  currentView: string;
  handleCurrentViewChange: (view: string) => void;
  handleDateParameters: (value: { start: Date; end: Date }) => void;
  calendarEventList: ICalendarEventList[];
}) => {
  const calendarRef = React.useRef<any>(null);
  React.useEffect(() => {
    if (calendarRef && calendarRef.current) {
      calendarRef?.current?.handleViewChange("month");
    }
  }, [calendarRef]);

  const components = {
    event: (prop: Record<string, any>) => {
      return (
        <Link
          href={appsUrlGenerator(
            "crm",
            prop.event.data.module,
            AllowedViews.detail,
            prop.event.data.id
          )}
          legacyBehavior
        >
          <a className="text-xsm w-full block px-1 truncate" target="_blank">
            {prop.title}
          </a>
        </Link>
      );
    },
    // toolbar: CustomToolbar,
  };

  return (
    <div className="p-6 w-full">
      <div className="bg-white p-6 rounded-xl flex flex-col w-full sm:w-8/12 md:w-9/12 lg:w-4/5 xl:w-10/12 h-full sm:ml-4/12 md:ml-3/12 lg:ml-1/5 xl:ml-2/12">
        <Calendar
          ref={calendarRef}
          dayLayoutAlgorithm="no-overlap"
          localizer={localizer}
          views={["day", "week", "month"]}
          events={calendarEventList}
          startAccessor="start"
          endAccessor="end"
          style={{ minHeight: 500 }}
          eventPropGetter={(event) => {
            return {
              style: { backgroundColor: event.color },
              border: "1px solid black",
            };
          }}
          components={components}
          onView={(view) => {
            if (currentView !== view) handleCurrentViewChange(view);
          }}
          onRangeChange={(
            range:
              | Date[]
              | {
                  start: Date;
                  end: Date;
                },
            view?: BigCalendar.View | undefined
          ) => {
            if (Array.isArray(range)) {
              handleDateParameters({
                start: range[0],
                end: range[range.length - 1],
              });
            } else if (typeof range === "object" && range !== null) {
              handleDateParameters({ start: range.start, end: range.end });
            }
          }}
        />
      </div>
    </div>
  );
};
