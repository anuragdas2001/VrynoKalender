import React from "react";
import SidePageMenuContainer from "../../shared/components/SidePageMenuContainer";
import { Formik } from "formik";
import {
  ICalendarFieldsList,
  ICalendarFilterData,
  IModuleList,
} from "./CalendarViewScreen";
import { BaseUser, IInstance } from "../../../../../models/Accounts";
import AddIcon from "remixicon-react/AddLineIcon";
import CheckIcon from "remixicon-react/CheckLineIcon";
import DeleteIcon from "remixicon-react/DeleteBinLineIcon";
import { CalendarAddForm } from "./CalendarAddForm";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { Backdrop } from "../../../../../components/TailwindControls/Backdrop";
import DeleteModal from "../../../../../components/TailwindControls/Modals/DeleteModal";

export const CalendarViewScreenSideMenu = ({
  moduleList,
  dateTimeFieldsList,
  dateAndDateTimeFieldsList,
  instanceData,
  cookieUser,
  filterData,
  handleSetFilterData,
  deleteView,
  selectedColorList,
  unrelatedSessionData,
  handleToggleView,
  resetCalendar,
  processGetInstance,
}: {
  moduleList: IModuleList[];
  dateTimeFieldsList: {
    [modelName: string]: ICalendarFieldsList[];
  };
  dateAndDateTimeFieldsList: {
    [modelName: string]: ICalendarFieldsList[];
  };
  instanceData: IInstance | null;
  cookieUser: BaseUser | null;
  filterData: ICalendarFilterData[];
  handleSetFilterData: (data: any) => void;
  deleteView: (record: any) => void;
  selectedColorList: string[];
  unrelatedSessionData: any[];
  handleToggleView: (record: any, show: boolean) => void;
  resetCalendar: () => void;
  processGetInstance: () => void;
}) => {
  const [openAddCalendarFilter, setOpenAddCalendarFilter] =
    React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [initialValues, setInitialValue] = React.useState<
    Record<string, string>
  >({});

  React.useEffect(() => {
    if (filterData?.length) {
      let initValues = {};
      filterData.forEach((value: any) => {
        initValues = { ...initValues, [value.color]: value.checked };
      });
      setInitialValue(initValues);
    }
  }, [filterData]);

  return (
    <>
      <SidePageMenuContainer menuLoading={false}>
        <div>
          <Button
            id="resetCalendar"
            buttonType="thin"
            onClick={() => setDeleteModal(true)}
            disabled={filterData?.length ? false : true}
            userEventName="open-calenderView-delete-modal-click"
          >
            <p>Reset</p>
          </Button>
          <Formik
            initialValues={initialValues}
            onSubmit={(values) => {}}
            enableReinitialize
          >
            {({ setFieldValue, values }) => (
              <div className={`text-sm block py-1.5 px-4 my-2`}>
                <div className="flex justify-between">
                  <p>My Calendar</p>
                  <Button
                    id="add-calender-modal"
                    customStyle="break-all"
                    onClick={() => {
                      if (!instanceData) processGetInstance();
                      setOpenAddCalendarFilter(true);
                    }}
                    userEventName="open-add-calendarView-modal-click"
                  >
                    <AddIcon size={24} />
                  </Button>
                </div>
                <div>
                  {filterData?.map((data: any, index: number) => {
                    return (
                      <div key={`filter-${index}`}>
                        <Button
                          id={`calender-view-filter-item-${index}`}
                          customStyle={`w-full flex flex-col pb-2 mb-2 ${
                            filterData?.length > 1 ? "border-b" : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleView(data, !values[data.color]);
                            setFieldValue(data.color, !values[data.color]);
                          }}
                          userEventName="calendarView-filter-item-click"
                        >
                          <>
                            <span className="flex gap-x-2 items-center w-full">
                              {!values[data.color] ? (
                                <span
                                  className="w-4 h-4 rounded-md flex justify-center items-center"
                                  style={{
                                    borderColor: data.color,
                                    borderWidth: "1px",
                                    borderStyle: "solid",
                                  }}
                                >
                                  <CheckIcon size={14} className="text-white" />
                                </span>
                              ) : (
                                <span
                                  className="w-4 h-4 rounded-md flex justify-center items-center"
                                  style={{
                                    borderColor: data.color,
                                    backgroundColor: data.color,
                                    borderWidth: "1px",
                                    borderStyle: "solid",
                                  }}
                                >
                                  <CheckIcon size={14} />
                                </span>
                              )}
                              <p className="text-left truncate w-full">{`${
                                moduleList.filter(
                                  (mod) => mod.value === data.module
                                )?.[0].label || data.module
                              }`}</p>
                            </span>
                            <span className="w-full flex items-center">
                              <span
                                className={`text-xs truncate text-left ${
                                  data.endField ? "w-[42%]" : "w-[90%]"
                                }`}
                              >
                                {data.startFieldLabel}
                              </span>
                              {data.endField && (
                                <>
                                  <span className="w-[6%] mr-1 pt-1">-</span>
                                  <span className="text-xs truncate text-left w-[42%]">{`${data.endFieldLabel}`}</span>
                                </>
                              )}
                              <Button
                                id={`calender-view-filter-item-delete-${index}`}
                                customStyle="w-[10%]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteView(data);
                                }}
                                userEventName="calendarView-delete:action-click"
                              >
                                <DeleteIcon
                                  size={16}
                                  className="text-gray-500"
                                />
                              </Button>
                            </span>
                          </>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Formik>
        </div>
      </SidePageMenuContainer>

      {openAddCalendarFilter && (
        <CalendarAddForm
          instanceData={instanceData}
          cookieUser={cookieUser}
          handleSetFilterData={handleSetFilterData}
          setOpenAddCalendarFilter={(value: boolean) =>
            setOpenAddCalendarFilter(value)
          }
          moduleList={moduleList}
          dateAndDateTimeFieldsList={dateAndDateTimeFieldsList}
          unrelatedSessionData={unrelatedSessionData}
          filterData={filterData}
          dateTimeFieldsList={dateTimeFieldsList}
          selectedColorList={selectedColorList}
        />
      )}
      {deleteModal && (
        <>
          <DeleteModal
            id="reset-calendar-modal"
            modalHeader="Reset Calendar"
            modalMessage="Are you sure you want to reset calendar?"
            leftButton="Cancel"
            rightButton="Reset"
            onCancel={() => setDeleteModal(false)}
            onDelete={() => {
              resetCalendar();
              setDeleteModal(false);
            }}
            onOutsideClick={() => setDeleteModal(false)}
            loading={false}
          />
          <Backdrop onClick={() => setDeleteModal(false)} />
        </>
      )}
    </>
  );
};
