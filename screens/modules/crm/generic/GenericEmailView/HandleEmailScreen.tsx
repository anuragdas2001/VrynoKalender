import React from "react";
import { useRouter } from "next/router";
import GenericList from "../../../../../components/TailwindControls/Lists/GenericList";
import {
  IEmailSetting,
  IEmailTemplate,
  SupportedApps,
} from "../../../../../models/shared";
import NoDataFoundContainer from "../../shared/components/NoDataFoundContainer";
import { settingsUrlGenerator } from "../../shared/utils/settingsUrlGenerator";
import ItemsLoader from "../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import { ActionWrapper } from "../../shared/components/ActionWrapper";
import CloseCircleIcon from "remixicon-react/CloseCircleLineIcon";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import { useRef } from "react";
import { setHeight } from "../../shared/utils/setHeight";
import SwitchToggle from "../../../../../components/TailwindControls/Form/SwitchToggle/SwitchToggle";
import { Formik } from "formik";
import { SupportedDataTypes } from "../../../../../models/ICustomField";
import { MixpanelActions } from "../../../../Shared/MixPanel";
import _ from "lodash";

export type HandleEmailScreenProps = {
  appName: string;
  modelName: string;
  emailTemplates: IEmailTemplate[];
  emails: Record<string, string>[];
  selectedButton: string;
  emailFetchLoading: boolean;
  setSendEmailModal: (value: boolean) => void;
  handleCancelEmail: (item: Record<string, string>) => void;
  statusChangeProcess: boolean;
  setStatusChangeProcess: (value: boolean) => void;
  handleEmailJobStatusChange: (id: string, recordStatus: "a" | "i") => void;
};

export const HandleEmailScreen = ({
  appName,
  modelName,
  emailTemplates,
  emails,
  selectedButton,
  emailFetchLoading,
  setSendEmailModal,
  handleCancelEmail,
  statusChangeProcess,
  setStatusChangeProcess,
  handleEmailJobStatusChange,
}: HandleEmailScreenProps) => {
  const router = useRouter();

  const heightRefOne = useRef(null);
  React.useEffect(() => {
    if (heightRefOne) {
      setHeight(heightRefOne, 40);
    }
  }, [emails]);

  if (emailFetchLoading) {
    return <ItemsLoader currentView="List" loadingItemCount={3} />;
  } else if (!emailTemplates?.length) {
    return (
      <NoDataFoundContainer
        modelName={"Email Template"}
        onClick={() =>
          router.push(
            settingsUrlGenerator(
              SupportedApps.crm,
              "templates",
              "email-template"
            )
          )
        }
      />
    );
  } else if (emails.length === 0) {
    return (
      <NoDataFoundContainer
        modelName={`${selectedButton} Emails`}
        onClick={() => {
          setSendEmailModal(true);
        }}
      />
    );
  } else
    return (
      <div className="bg-white pt-4 pb-1 px-4 rounded-xl mt-2">
        <div ref={heightRefOne}>
          <GenericList
            listSelector={false}
            rowUrlGenerator={(item) =>
              `${appName}/${modelName}/emailDetail/${item.id}`
            }
            tableHeaders={
              selectedButton === "inProcess"
                ? [
                    {
                      columnName: "templateId",
                      label: "Template Name",
                      dataType: "singleline",
                    },
                    {
                      columnName: "status",
                      label: "Status",
                      dataType: "singleline",
                    },
                    {
                      columnName: "createdAt",
                      label: "Sent At",
                      dataType: "date",
                    },
                    {
                      label: "Active",
                      columnName: "recordStatus",
                      dataType: SupportedDataTypes.boolean,
                      render: (item: Record<string, string>, index: number) => {
                        return (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className="w-full py-2"
                          >
                            <Formik
                              initialValues={{
                                [`recordStatus${index}`]:
                                  item.recordStatus === "a" ? true : false,
                              }}
                              enableReinitialize
                              onSubmit={(values) => {
                                console.log(values);
                              }}
                            >
                              {({ values }) => (
                                <SwitchToggle
                                  name={`recordStatus${index}`}
                                  dataTestId={`toggle-recordStatus-${_.get(
                                    item?.label,
                                    "en",
                                    ""
                                  )}`}
                                  onChange={() => {
                                    setStatusChangeProcess(true);
                                    handleEmailJobStatusChange(
                                      item.id,
                                      values[`recordStatus${index}`] === true
                                        ? "i"
                                        : "a"
                                    );
                                    MixpanelActions.track(
                                      `active-inactive-emailJob-${item?.name}-recordStatus:toggle-click`,
                                      {
                                        type: "switch",
                                      }
                                    );
                                  }}
                                  value={values[`recordStatus${index}`] as any}
                                  disabled={
                                    item?.status === "scheduled"
                                      ? statusChangeProcess
                                      : true
                                  }
                                />
                              )}
                            </Formik>
                          </form>
                        );
                      },
                    },
                    {
                      columnName: "actions",
                      label: "Action",
                      dataType: "singleline",
                      render: (item: any, index: number) => {
                        return (
                          <ActionWrapper
                            index={index}
                            content={
                              <div
                                className={`flex flex-row items-center gap-x-2 max-w-[120px]`}
                              >
                                <Button
                                  onClick={
                                    item.id
                                      ? () => handleCancelEmail(item)
                                      : () => {}
                                  }
                                  id={`cancel-email-job-${item.id}`}
                                  kind="white"
                                  userEventName="email-job-cancel:action-click"
                                >
                                  <span
                                    className={`flex items-center gap-x-2 ${
                                      item?.id
                                        ? ""
                                        : "cursor-default opacity-50"
                                    }`}
                                  >
                                    <CloseCircleIcon
                                      size={20}
                                      className={`text-red-400`}
                                    />
                                    Cancel
                                  </span>
                                </Button>
                              </div>
                            }
                          />
                        );
                      },
                    },
                  ]
                : [
                    {
                      columnName: "templateId",
                      label: "Template Name",
                      dataType: "singleline",
                    },
                    {
                      columnName: "status",
                      label: "Status",
                      dataType: "singleline",
                    },
                    {
                      columnName: "createdAt",
                      label: "Sent At",
                      dataType: "date",
                    },
                    {
                      label: "Active",
                      columnName: "recordStatus",
                      dataType: SupportedDataTypes.boolean,
                      render: (item: Record<string, string>, index: number) => {
                        return (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className="w-full py-2"
                          >
                            <Formik
                              initialValues={{
                                [`recordStatus${index}`]:
                                  item.recordStatus === "a" ? true : false,
                              }}
                              enableReinitialize
                              onSubmit={(values) => {
                                console.log(values);
                              }}
                            >
                              {({ values }) => (
                                <SwitchToggle
                                  name={`recordStatus${index}`}
                                  dataTestId={`toggle-recordStatus-${_.get(
                                    item?.label,
                                    "en",
                                    ""
                                  )}`}
                                  onChange={() => {}}
                                  value={values[`recordStatus${index}`] as any}
                                  disabled={true}
                                />
                              )}
                            </Formik>
                          </form>
                        );
                      },
                    },
                  ]
            }
            data={emails}
          />
        </div>
      </div>
    );
};
