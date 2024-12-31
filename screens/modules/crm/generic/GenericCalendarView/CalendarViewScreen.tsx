import React, { useContext } from "react";
import { SupportedApps } from "../../../../../models/shared";
import { ConnectedBigCalendar } from "./BigCalendar/ConnectedBigCalendar";
import { CalendarViewScreenSideMenu } from "./CalendarViewScreenSideMenu";
import { useLazyQuery } from "@apollo/client";
import { getSortedFieldList } from "../../shared/utils/getOrderedFieldsList";
import { PageLoader } from "../../../../../components/TailwindControls/ContentLoader/Shared/PageLoader";
import { cookieUserStore } from "../../../../../shared/CookieUserStore";
import { InstanceStoreContext } from "../../../../../stores/InstanceStore";
import { isAfter, isEqual } from "date-fns";
import { toast } from "react-toastify";
import { IInstance } from "../../../../../models/Accounts";
import { NavigationStoreContext } from "../../../../../stores/RootStore/NavigationStore/NavigationStore";
import { evaluateDisplayExpression } from "../../shared/utils/getFieldsFromDisplayExpression";
import { ICustomField } from "../../../../../models/ICustomField";
import {
  INSTANCE_DETAIL_BY_SUBDOMAIN_QUERY,
  InstanceSubdomainData,
} from "../../../../../graphql/queries/instances";
import { FETCH_QUERY } from "../../../../../graphql/queries/fetchQuery";
import {
  calendarFieldValuesFilter,
  fetchRequestViewExtractor,
} from "./CalendarHelpers/calendarViewHelper";
import { observer } from "mobx-react-lite";
import { GeneralStoreContext } from "../../../../../stores/RootStore/GeneralStore/GeneralStore";

export interface IModuleList {
  value: string;
  label: string;
}

export interface ICalendarFieldsList {
  value: string;
  label: string;
  dataType: string;
  visible: boolean;
}

export interface ICalendarEventList {
  title: string;
  start: Date;
  end: Date;
  color: string;
  allDay: boolean;
  data: {
    id: string;
    module: string;
  };
}

export interface ICalendarFilterData {
  module: string;
  addRange: boolean;
  startField: string;
  endField: string;
  startFieldLabel: string;
  endFieldLabel: string;
  startFieldDatatype: string;
  endFieldDatatype: string;
  color: string;
  instanceId: string;
  userEmail: string;
  checked: boolean;
}

export const CalendarViewScreen = observer(
  ({ appName, modelName }: { appName: SupportedApps; modelName: string }) => {
    const { instances } = useContext(InstanceStoreContext);
    let [instanceData, setInstanceData] = React.useState<IInstance | null>(
      null
    );
    const { navigations } = useContext(NavigationStoreContext);
    const { generalModelStore } = useContext(GeneralStoreContext);
    const { genericModels, allLayoutFetched, allModulesFetched } =
      generalModelStore;

    const processGetInstance = () => {
      if (!instanceData) {
        const subDomain = window.location.hostname.split(".")[0];
        const findInstanceIndex = instances?.findIndex(
          (instance) => instance?.subdomain === subDomain
        );
        setInstanceData(instances[findInstanceIndex]);
      }
    };

    const cookieUser = cookieUserStore.getUserDetails();
    const [moduleList, setModuleList] = React.useState<IModuleList[]>([]);

    const [rawModuleFieldsList, setRawModuleFieldsList] = React.useState<{
      [moduleName: string]: ICustomField[];
    }>({});
    const [moduleFieldsList, setModuleFieldsList] = React.useState<{
      [modelName: string]: ICalendarFieldsList[];
    }>({});
    const [dateTimeFieldsList, setDateTimeFieldsList] = React.useState<{
      [modelName: string]: ICalendarFieldsList[];
    }>({});
    const [dateAndDateTimeFieldsList, setDateAndDateTimeFieldsList] =
      React.useState<{
        [modelName: string]: ICalendarFieldsList[];
      }>({});
    const [fieldsListLoading, setFieldsListLoading] = React.useState(true);

    const [filterData, setFilterData] = React.useState<ICalendarFilterData[]>(
      []
    );
    const [unrelatedSessionData, setUnrelatedSessionData] = React.useState<
      ICalendarFilterData[]
    >([]);

    const [currentView, setCurrentView] = React.useState<string>("month");
    const [dateParameters, setDateParameters] = React.useState<{
      start: Date | null;
      end: Date | null;
    }>({
      start: null,
      end: null,
    });

    const [calendarEventList, setCalendarEventList] = React.useState<
      ICalendarEventList[]
    >([]);
    const [masterCalendarEventList, setMasterCalendarEventList] =
      React.useState<ICalendarEventList[]>([]);
    const [sessionDataLoaded, setSessionDataLoaded] = React.useState(false);
    const [selectedColorList, setSelectedColorList] = React.useState<string[]>(
      []
    );

    React.useEffect(() => {
      if (allModulesFetched) {
        let modulesInfoFromStore: { label: string; value: string }[] = [
          ...Object.keys(genericModels)
            ?.map((model) => {
              if (
                genericModels[model]?.moduleInfo?.customizationAllowed === true
              )
                return genericModels[model]?.moduleInfo;
            })
            ?.filter((model) => model !== undefined),
        ].map((module) => {
          return {
            value: module.name,
            label: module.label.en,
          };
        });
        setModuleList([...modulesInfoFromStore]);
      }
    }, [allModulesFetched]);

    const [getInstanceViaSubdomain] = useLazyQuery<InstanceSubdomainData>(
      INSTANCE_DETAIL_BY_SUBDOMAIN_QUERY,
      {
        fetchPolicy: "cache-first",
        nextFetchPolicy: "standby",
        context: {
          headers: {
            vrynopath: SupportedApps.accounts,
          },
        },
        onCompleted: (responseOnCompletion) => {
          if (responseOnCompletion) {
            if (
              responseOnCompletion?.getSubdomainInstance?.messageKey?.includes(
                "success"
              ) &&
              responseOnCompletion?.getSubdomainInstance?.data
            ) {
              setInstanceData(responseOnCompletion?.getSubdomainInstance?.data);
            } else {
              toast.error("CalendarView: No instance found");
            }
          }
        },
      }
    );

    React.useEffect(() => {
      if (!instanceData) {
        getInstanceViaSubdomain({
          variables: { subdomain: window.location.hostname.split(".")[0] },
        });
      }
    }, [instanceData]);

    React.useEffect(() => {
      if (moduleList.length && allLayoutFetched) {
        (async () => {
          let dateTimeFieldsList: {
            [modelName: string]: ICalendarFieldsList[];
          } = {};
          let dateAndDateTimeFieldsList: {
            [modelName: string]: ICalendarFieldsList[];
          } = {};
          let rawModuleFieldsListData: {
            [modelName: string]: ICustomField[];
          } = {};

          moduleList?.forEach((data) => {
            let fieldsListFromStore: ICustomField[] =
              genericModels[data.value]?.fieldsList;
            const sortedFieldsList = getSortedFieldList(
              fieldsListFromStore.filter(
                (field) =>
                  ["createdAt", "updatedAt"].includes(field.name) ||
                  (!field.readOnly &&
                    ["date", "datetime"].includes(field.dataType))
              )
            );
            dateTimeFieldsList[data.value] = sortedFieldsList
              .filter((value) => value.dataType === "datetime")
              .map((field) => {
                return {
                  value: field.systemDefined
                    ? `${field.label.en}-${field.name}-${field.dataType}`
                    : `${field.label.en}-fields.${field.name}-${field.dataType}`,
                  label: field.label.en,
                  dataType: field.dataType,
                  visible: field.visible,
                };
              });
            dateAndDateTimeFieldsList[data.value] = sortedFieldsList.map(
              (field) => {
                return {
                  value: field.systemDefined
                    ? `${field.label.en}-${field.name}-${field.dataType}`
                    : `${field.label.en}-fields.${field.name}-${field.dataType}`,
                  label: field.label.en,
                  dataType: field.dataType,
                  visible: field.visible,
                };
              }
            );
            rawModuleFieldsListData[data.value] = sortedFieldsList.map(
              (field) => field
            );
          });
          setRawModuleFieldsList(rawModuleFieldsListData);
          setModuleFieldsList(dateAndDateTimeFieldsList);
          setDateTimeFieldsList(dateTimeFieldsList);
          setDateAndDateTimeFieldsList(dateAndDateTimeFieldsList);
          setFieldsListLoading(false);
        })();
      }
    }, [moduleList, allLayoutFetched]);

    // ------------------------------------ data fetch - start ------------------------------------
    const [getCalendarData] = useLazyQuery(FETCH_QUERY, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: appName,
        },
      },
    });

    const [getCalendarDataWithExpression] = useLazyQuery(FETCH_QUERY, {
      fetchPolicy: "no-cache",
      context: {
        headers: {
          vrynopath: appName,
        },
      },
    });

    const handleCalendarDataFetch = async (
      recordData: ICalendarFilterData[],
      filterData: ICalendarFilterData[]
    ) => {
      let fieldPermissionObject: Record<string, string[]> = {};
      if (recordData?.length) {
        const requestArray = recordData.map(async (d) => {
          const filter = fetchRequestViewExtractor(
            moduleFieldsList,
            d.addRange,
            d.startField,
            d.endField,
            d.module,
            currentView,
            dateParameters.start,
            dateParameters.end
          );

          let fieldPermissionArrayList: string[] = [];
          const fields = evaluateDisplayExpression(
            ["id", "name", "createdAt", d.startField, d.endField],
            rawModuleFieldsList[d.module]
          );
          [d.startField, d.endField].forEach((f) => {
            rawModuleFieldsList[d.module]?.forEach((field) => {
              if (f == field.name && field.visible == false)
                fieldPermissionArrayList.push(field.label.en);
            });
          });
          if (fieldPermissionArrayList.length) {
            fieldPermissionObject[d.module] = fieldPermissionArrayList;
            return;
          }
          filter?.push({
            name: "recordStatus",
            operator: "in",
            value: ["a", "i"],
          });
          if (filter) {
            return filter?.length === 1
              ? await getCalendarData({
                  variables: {
                    modelName: d.module,
                    fields: fields,
                    filters: filter,
                  },
                })
              : await getCalendarDataWithExpression({
                  variables: {
                    expression: "( ( a ) or b ) ",
                    modelName: d.module,
                    fields: fields,
                    filters: filter,
                  },
                });
          }
        });
        Promise.all(requestArray).then((response) => {
          const eventList: ICalendarEventList[] = [];
          const uncheckedEventData: ICalendarEventList[] = [];
          response.forEach((result) => {
            if (
              result?.data?.fetch.data?.length
              // && result?.data?.fetch.messageKey.includes("-success")
            ) {
              const dataArray: any[] = result?.data?.fetch.data;
              const moduleName = result?.data?.fetch.messageKey
                .split("-")[0]
                .toLowerCase();
              let targetedData: any = {};
              for (let i = 0; i < filterData.length; i++) {
                const data = filterData[i];
                if (data.module.toLowerCase() === moduleName) {
                  if (
                    dataArray[0][data.startField] ||
                    dataArray[0][data.endField]
                  ) {
                    targetedData = data;
                    break;
                  }
                }
              }

              navigations?.filter(
                (navigation) => navigation.groupKey === "default-navigation"
              ),
                dataArray.forEach((data) => {
                  const startDate = new Date(
                    data[targetedData.startField] || data[targetedData.endField]
                  );
                  const endDate = new Date(
                    data[targetedData.endField] || data[targetedData.startField]
                  );
                  if (!isAfter(startDate, endDate)) {
                    const eventData = {
                      title: data.name,
                      start: startDate,
                      end: endDate,
                      color: targetedData.color,
                      allDay:
                        targetedData.addRange === false &&
                        targetedData.startFieldDatatype == "date"
                          ? true
                          : false,
                      data: { id: data.id, module: targetedData.module },
                    };
                    if (targetedData.checked) {
                      eventList.push(eventData);
                    } else {
                      uncheckedEventData.push(eventData);
                    }
                  }
                });
            }
          });

          const updatedMasterEventList = [];
          const masterEventArray = [...uncheckedEventData, ...eventList];
          for (let i = 0; i < masterEventArray.length; i++) {
            let found = false;
            for (let j = 0; j < masterCalendarEventList.length; j++) {
              if (
                masterEventArray[i].data.id ===
                masterCalendarEventList[j].data.id
              ) {
                found = true;
                break;
              }
            }
            if (!found) {
              updatedMasterEventList.push(masterEventArray[i]);
            }
          }
          const updatedEventList = [];
          for (let i = 0; i < eventList.length; i++) {
            let found = false;
            for (let j = 0; j < calendarEventList.length; j++) {
              if (eventList[i].data.id === calendarEventList[j].data.id) {
                found = true;
                break;
              }
            }
            if (!found) {
              updatedEventList.push(eventList[i]);
            }
          }
          setCalendarEventList([...calendarEventList, ...updatedEventList]);
          setMasterCalendarEventList([
            ...masterCalendarEventList,
            ...updatedMasterEventList,
          ]);

          if (Object.keys(fieldPermissionObject).length) {
            let message = "";
            for (const key in fieldPermissionObject) {
              message += `${key} - ${fieldPermissionObject[key].toString()} \n`;
            }
            toast.error(`No field permission for: ${message}`);
          }
        });
      }
    };

    const handleSetFilterData = (data: ICalendarFilterData) => {
      setFilterData([...filterData, data]);
      handleCalendarDataFetch([data], [...filterData, data]);
      const [updatedDateTimeList, updatedDateAndDateTimeList] =
        calendarFieldValuesFilter(
          data,
          dateTimeFieldsList,
          dateAndDateTimeFieldsList
        );
      setDateTimeFieldsList({
        ...dateTimeFieldsList,
        [data.module]: updatedDateTimeList,
      });
      setDateAndDateTimeFieldsList({
        ...dateAndDateTimeFieldsList,
        [data.module]: updatedDateAndDateTimeList,
      });
      setSelectedColorList([...selectedColorList, data.color]);
    };

    const deleteView = (record: ICalendarFilterData) => {
      const updatedFilterData = filterData?.filter((data) => {
        if (
          record.color === data.color &&
          record.startField === data.startField &&
          record.endField === data.endField
        )
          return false;
        return true;
      });
      const updatedEventList = masterCalendarEventList.filter(
        (event) => event.color !== record.color
      );
      toast.success("Activity deleted successfully");
      let dateTimeFieldData = moduleFieldsList[record.module].filter((data) => {
          const fieldValue = data.value.split("-")[1];
          if (
            data.dataType === "datetime" &&
            (record.startField === fieldValue || record.endField === fieldValue)
          )
            return true;
          return false;
        }),
        dateAndDateTimeFieldData = moduleFieldsList[record.module].filter(
          (data) => {
            const fieldValue = data.value.split("-")[1];
            if (
              record.startField === fieldValue ||
              record.endField === fieldValue
            )
              return true;
            return false;
          }
        );

      localStorage.setItem(
        "calendarView",
        JSON.stringify([...unrelatedSessionData, ...updatedFilterData])
      );
      setSelectedColorList(
        [...selectedColorList].filter((color) => color !== record.color)
      );
      setDateTimeFieldsList({
        ...dateTimeFieldsList,
        [record.module]: [
          ...dateTimeFieldsList[record.module],
          ...dateTimeFieldData,
        ],
      });
      setDateAndDateTimeFieldsList({
        ...dateAndDateTimeFieldsList,
        [record.module]: [
          ...dateAndDateTimeFieldsList[record.module],
          ...dateAndDateTimeFieldData,
        ],
      });
      setFilterData(updatedFilterData);
      setCalendarEventList(updatedEventList);
      setMasterCalendarEventList(updatedEventList);
    };

    const handleToggleView = (record: ICalendarFilterData, show: boolean) => {
      if (show) {
        const hiddenEventData = masterCalendarEventList.filter(
          (event) => event.color === record.color
        );
        setCalendarEventList([...calendarEventList, ...hiddenEventData]);
      } else {
        const updatedEventList = calendarEventList.filter(
          (event) => event.color !== record.color
        );
        setCalendarEventList(updatedEventList);
      }
      const updatedFilterData: ICalendarFilterData[] = [];
      filterData?.forEach((data) => {
        if (
          record.color === data.color &&
          record.startField === data.startField &&
          record.endField === data.endField
        ) {
          updatedFilterData.push({ ...data, checked: show });
        } else {
          updatedFilterData.push(data);
        }
      });
      localStorage.setItem(
        "calendarView",
        JSON.stringify([...unrelatedSessionData, ...updatedFilterData])
      );
      setFilterData(updatedFilterData);
    };

    React.useEffect(() => {
      if (!fieldsListLoading && instanceData && cookieUser) {
        if (localStorage.getItem("calendarView")) {
          let sessionData: ICalendarFilterData[] = JSON.parse(
            localStorage.getItem("calendarView") || "[]"
          );
          let relatedSessionData: ICalendarFilterData[] = [];
          let unrelatedSessionData: ICalendarFilterData[] = [];
          sessionData.filter((d) => {
            if (
              d.instanceId === instanceData?.id &&
              d.userEmail === cookieUser?.email
            ) {
              relatedSessionData.push(d);
            } else {
              unrelatedSessionData.push(d);
            }
          });
          let updatedDateTimeList = { ...dateTimeFieldsList },
            updatedDateAndDateTimeList = { ...dateAndDateTimeFieldsList };
          let colorList = [...selectedColorList];
          relatedSessionData.forEach((data: ICalendarFilterData) => {
            colorList = [...colorList, data.color];
            updatedDateTimeList = {
              ...updatedDateTimeList,
              [data.module]: updatedDateTimeList[data.module].filter(
                (field) => {
                  const fieldValue = field.value.split("-")[1];
                  if (
                    fieldValue === data.startField ||
                    fieldValue === data.endField
                  )
                    return false;
                  return true;
                }
              ),
            };
            updatedDateAndDateTimeList = {
              ...updatedDateAndDateTimeList,
              [data.module]: updatedDateAndDateTimeList[data.module].filter(
                (field) => {
                  const fieldValue = field.value.split("-")[1];
                  if (
                    fieldValue === data.startField ||
                    fieldValue === data.endField
                  )
                    return false;
                  return true;
                }
              ),
            };
          });
          setSelectedColorList(colorList);
          setFilterData(relatedSessionData);
          setUnrelatedSessionData(unrelatedSessionData);
          // handleCalendarDataFetch(relatedSessionData);
          setDateTimeFieldsList(updatedDateTimeList);
          setDateAndDateTimeFieldsList(updatedDateAndDateTimeList);
        }
        setSessionDataLoaded(true);
      }
    }, [fieldsListLoading, instanceData]);

    React.useEffect(() => {
      let data =
        masterCalendarEventList.length === 0
          ? filterData
          : filterData.filter((data) => data.checked);

      if (data.length && dateParameters.start && dateParameters.end) {
        handleCalendarDataFetch(data, filterData);
      }
    }, [dateParameters]);

    const resetCalendar = () => {
      let updatedDateTimeFieldsList = {};
      for (const key in moduleFieldsList) {
        updatedDateTimeFieldsList = {
          ...updatedDateTimeFieldsList,
          [key]: moduleFieldsList[key].filter(
            (value) => value.dataType === "datetime"
          ),
        };
      }
      localStorage.setItem(
        "calendarView",
        JSON.stringify(unrelatedSessionData)
      );
      setCalendarEventList([]);
      setSelectedColorList([]);
      setFilterData([]);
      setUnrelatedSessionData([]);
      setDateTimeFieldsList(updatedDateTimeFieldsList);
      setDateAndDateTimeFieldsList(moduleFieldsList);
      toast.success("Calender reset successfully");
    };

    return fieldsListLoading || !sessionDataLoaded || !instanceData ? (
      <div className="flex items-center justify-center h-screen text-xl">
        <PageLoader />
      </div>
    ) : (
      <>
        <div className="md:hidden p-6">
          <div className="p-6 bg-white rounded-md text-sm mt-16 text-center">
            <p>
              Mobile view not supported, please open calendar in desktop mode
            </p>
          </div>
        </div>
        <div className="hidden md:flex w-full">
          <CalendarViewScreenSideMenu
            moduleList={moduleList}
            dateTimeFieldsList={dateTimeFieldsList}
            dateAndDateTimeFieldsList={dateAndDateTimeFieldsList}
            instanceData={instanceData}
            cookieUser={cookieUser}
            filterData={filterData}
            handleSetFilterData={handleSetFilterData}
            deleteView={deleteView}
            selectedColorList={selectedColorList}
            unrelatedSessionData={unrelatedSessionData}
            handleToggleView={handleToggleView}
            resetCalendar={resetCalendar}
            processGetInstance={processGetInstance}
          />
          <ConnectedBigCalendar
            currentView={currentView}
            handleCurrentViewChange={(view: string) => setCurrentView(view)}
            handleDateParameters={(value: { start: Date; end: Date }) => {
              if (!dateParameters.start || !dateParameters.end) {
                setDateParameters(value);
              } else if (
                !isEqual(value.start, dateParameters.start) ||
                !isEqual(value.end, dateParameters.end)
              ) {
                setDateParameters(value);
              }
            }}
            calendarEventList={calendarEventList}
          />
        </div>
      </>
    );
  }
);
