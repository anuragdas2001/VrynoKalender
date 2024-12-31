import { Formik } from "formik";
import React, { useEffect, useRef } from "react";
import SaveIcon from "remixicon-react/SaveLineIcon";
import GenericHeaderCardContainer from "../../../../../components/TailwindControls/Cards/GenericHeaderCardContainer";
import Button from "../../../../../components/TailwindControls/Form/Button/Button";
import FormInputBox from "../../../../../components/TailwindControls/Form/InputBox/FormInputBox";
import { DomainDetailsContainer } from "./DomainDetailsContainer";
import ItemsLoader from "../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import { DomainRecordList } from "./DomainRecordList";
import { TrackingDomainContainer } from "./TrackingDomainContainer";
import { TrackingDomainRecordList } from "./TrackingDomainRecordList";
import * as Yup from "yup";
import { IEmailSettingsFormRootProps } from "./EmailSettingsForm";
import { setHeight } from "../../../crm/shared/utils/setHeight";
import _ from "lodash";

let initialValues = {
  sendFrom: null,
  replyTo: null,
  mailingDomain: "",
  trackSubdomain: "",
  firstName: null,
  lastName: null,
  middleName: null,
};

export const EmailSettingsFormContainer = ({
  data,
  handleSave,
  loading,
  handleConfigureDomain,
  domainRecords,
  spfData,
  dkimData,
  returnPathData,
  mxData,
  trackDomainData,
  showDomainRecords,
  domainLoading,
  handleShowDomainRecords,
  domainData,
  handleDeleteDomain,
  handleDomainCheck,
  showTrackingDomainRecord,
  trackDomainLoading,
  // showTrackingRecordList,
  handleTrackDomain,
  handleShowTrackingDomainRecord,
  handleDeleteTrackingDomain,
  handleTrackingDomainCheck,
  trackDomainRecords,
}: IEmailSettingsFormRootProps) => {
  const emailSchema = Yup.object().shape({
    sendFrom: Yup.string()
      .email("Must be a email")
      .nullable()
      .required("Sender's Email is required"),
    replyTo: Yup.string()
      .email("Must be a email")
      .nullable()
      .required("Receiver's Email is required"),
  });
  const domainSchema = Yup.object().shape({
    mailingDomain: Yup.string().nullable().required("Domain name is required"),
  });
  const trackSubdomainSchema = Yup.object().shape({
    trackSubdomain: Yup.string()
      .nullable()
      .required("Tracking sub-domain name is required"),
  });

  const heightRef = useRef(null);
  useEffect(() => {
    if (heightRef) {
      setHeight(heightRef);
    }
  });

  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full">
      <div ref={heightRef} className={`px-6 sm:pt-6 overflow-y-auto`}>
        <Formik
          initialValues={{
            ...initialValues,
            ...{
              ...data,
              sendFrom: _.get(data, "sendFrom", "")?.includes("<")
                ? _.get(data, "sendFrom", "")?.split("<")[1].split(">")[0]
                : _.get(data, "sendFrom", ""),
              replyTo: _.get(data, "replyTo", "")?.includes("<")
                ? _.get(data, "replyTo", "")?.split("<")[1].split(">")[0]
                : _.get(data, "replyTo", ""),
            },
          }}
          validationSchema={emailSchema}
          enableReinitialize
          onSubmit={(values) => {
            handleSave(values);
          }}
        >
          {({ handleSubmit }) => (
            <GenericHeaderCardContainer
              cardHeading="Email Setup"
              extended={true}
            >
              <div className="w-full grid grid-cols-1 grid-rows-3 lg:grid-cols-2 lg:grid-rows-2 gap-x-6">
                <div className="w-full col-span-full grid grid-cols-1 sm:grid-cols-3 sm:gap-x-6">
                  <FormInputBox name="firstName" label="First Name" />
                  <FormInputBox name="middleName" label="Middle Name" />
                  <FormInputBox name="lastName" label="Last Name" />
                </div>

                <div>
                  <FormInputBox
                    name="sendFrom"
                    label="Send From"
                    required={true}
                  />
                </div>
                <div>
                  <FormInputBox
                    name="replyTo"
                    label="Reply To"
                    required={true}
                  />
                </div>
                <div className="w-full lg:w-28 mt-3">
                  <Button
                    id="add-email-setting"
                    buttonType="thin"
                    kind="primary"
                    onClick={() => handleSubmit()}
                    loading={loading}
                    userEventName="emailSetting-save:submit-click"
                  >
                    <div className="flex gap-x-1">
                      <SaveIcon size={18} />
                      <p>{`Save`}</p>
                    </div>
                  </Button>
                </div>
              </div>
            </GenericHeaderCardContainer>
          )}
        </Formik>
        <Formik
          initialValues={{ ...initialValues, ...data }}
          validationSchema={domainSchema}
          enableReinitialize
          onSubmit={(values) => handleConfigureDomain(values.mailingDomain)}
        >
          {({ handleSubmit }) => (
            <GenericHeaderCardContainer
              cardHeading="Domain Verification"
              extended={true}
            >
              {domainLoading ? (
                <ItemsLoader currentView="List" loadingItemCount={0} />
              ) : showDomainRecords ? (
                <DomainDetailsContainer
                  spfData={spfData}
                  dkimData={dkimData}
                  returnPathData={returnPathData}
                  mxData={mxData}
                  handleShowDomainRecords={handleShowDomainRecords}
                  handleDomainCheck={handleDomainCheck}
                  data={domainData}
                />
              ) : domainRecords && Object.keys(domainRecords).length ? (
                <DomainRecordList
                  data={domainData}
                  handleDeleteDomain={handleDeleteDomain}
                  handleDomainCheck={handleDomainCheck}
                  handleShowDomainRecords={handleShowDomainRecords}
                />
              ) : (
                <div className="grid grid-cols-5 md:gap-x-4 w-full lg:w-4/6 xl:w-1/2 pr-2 items-end">
                  <div className="col-span-5">
                    <FormInputBox
                      name="mailingDomain"
                      label="Domain"
                      required={true}
                    />
                  </div>
                  <div className="mt-2 md:mt-0 md:mb-[9px] col-span-5 md:col-span-2">
                    <Button
                      id="check-dns"
                      onClick={() => handleSubmit()}
                      buttonType="thin"
                      userEventName="emailSetting-configure-domain:submit-click"
                    >
                      <span>Configure Domain</span>
                    </Button>
                  </div>
                </div>
              )}
            </GenericHeaderCardContainer>
          )}
        </Formik>
        <Formik
          initialValues={{ ...initialValues, ...data }}
          validationSchema={trackSubdomainSchema}
          enableReinitialize
          onSubmit={(values) => handleTrackDomain(values.trackSubdomain)}
        >
          {({ handleSubmit }) => (
            <GenericHeaderCardContainer
              cardHeading="Tracking Domain"
              extended={true}
            >
              {trackDomainLoading ? (
                <ItemsLoader currentView="List" loadingItemCount={0} />
              ) : data && data.mailingDomain && data.isDomainVerified ? (
                showTrackingDomainRecord ? (
                  <TrackingDomainContainer
                    trackDomainRecords={trackDomainRecords}
                    trackDomainData={trackDomainData}
                    domainName={data.mailingDomain}
                    handleShowTrackingDomainRecord={
                      handleShowTrackingDomainRecord
                    }
                    handleTrackingDomainCheck={handleTrackingDomainCheck}
                  />
                ) : trackDomainData?.length ? ( // && Object.keys(trackDomainData).length domainRecords && Object.keys(domainRecords).length &&
                  <TrackingDomainRecordList
                    handleShowTrackingDomainRecord={
                      handleShowTrackingDomainRecord
                    }
                    handleDeleteTrackingDomain={handleDeleteTrackingDomain}
                    handleTrackingDomainCheck={handleTrackingDomainCheck}
                    data={trackDomainData}
                  />
                ) : (
                  <div className="grid grid-cols-5 md:gap-x-4 w-full lg:w-4/6 xl:w-1/2 pr-2 items-end">
                    <div className="col-span-5">
                      <div className="flex">
                        <FormInputBox
                          name="trackSubdomain"
                          label="Domain"
                          required={true}
                        />
                        <span className="py-2 px-4 text-lg mt-10 mb-2">.</span>
                        <span className="py-2 px-4 border bg-vryno-header-color rounded-md mt-[38px] mb-2 h-[39px]">
                          {domainData ? domainData[0]?.domain : ""}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0 md:mb-[9px] col-span-5 md:col-span-2">
                      <Button
                        id="check-dns"
                        onClick={() => handleSubmit()}
                        buttonType="thin"
                        userEventName="emailSetting-track-domain:submit-click"
                      >
                        <span>Track Domain</span>
                      </Button>
                    </div>
                  </div>
                )
              ) : (
                <div>
                  <p className="text-sm text-gray-500">
                    Please configure custom domain first in order to setup Track
                    Domain
                  </p>
                </div>
              )}
            </GenericHeaderCardContainer>
          )}
        </Formik>
      </div>
    </form>
  );
};
