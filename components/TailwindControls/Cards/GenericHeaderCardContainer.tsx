import React from "react";
import ChevronUpIcon from "remixicon-react/ArrowUpSLineIcon";
import ChevronDownIcon from "remixicon-react/ArrowDownSLineIcon";
import FormInputBox from "../Form/InputBox/FormInputBox";
import { get, isArray } from "lodash";
import { Formik } from "formik";
import * as Yup from "yup";
import { containerWidth } from "../../../screens/modules/crm/shared/components/Form/FieldContainers/GetDetailsContainerFields";
import { handleDebounceSearch } from "../Form/SearchBox/debounceHandler";
import { paramCase } from "change-case";
import Button from "../Form/Button/Button";
import { IUserPreference } from "../../../models/shared";
import {
  FieldSupportedDataType,
  ICustomField,
} from "../../../models/ICustomField";
import { User } from "../../../models/Accounts";
import { DetailFieldValuePerDatatype } from "../../../screens/modules/crm/shared/components/ReadOnly/DetailFieldValuePerDatatype";
import PermissionModal, {
  NoPermissionComponent,
} from "../Modals/PermissionModal";
import { Backdrop } from "../Backdrop";
import { SectionDetailsType } from "../../../screens/modules/crm/generic/GenericForms/Shared/genericFormProps";

export type GenericHeaderCardContainerType = {
  id?: string;
  modelName?: string;
  children?: React.ReactElement;
  cardHeading: string;
  extended?: boolean;
  headerButton?: React.ReactElement;
  headerColor?: string;
  marginBottom?: string;
  cardHeadingSize?:
    | "text-base"
    | "text-sm"
    | "text-xsm"
    | "text-md"
    | "text-lg"
    | "text-xl"
    | "text-sl";
  borderTop?: boolean;
  getExtendedValue?: (extended: boolean) => void;
  applyBorder?: boolean;
  marginTop?: string;
  renderHtmlNextToOpenCloseButton?: React.ReactElement;
  renderHtmlRightToOpenCloseButton?: React.ReactElement;
  childPadding?: boolean;
  renderHtmlHeading?: React.ReactElement;
  allowOverflow?: boolean;
  allowToggle?: boolean;
  customizeHeader?: boolean;
  section?: SectionDetailsType;
  loadingCustomizationForm?: boolean;
  userPreferences?: IUserPreference[];
  allowRecordImage?: {
    visible: boolean;
    information: {
      field: {
        label: string;
        value: string;
        dataType: FieldSupportedDataType;
        field: ICustomField;
      };
      fieldDetail?: ICustomField;
      detailSizeImage?: boolean;
      data: any;
      onDetail: boolean;
      headerVisible: boolean;
      fontSize: { header: string; value: string };
      truncateData?: boolean;
      isSample?: boolean;
      showIcons?: boolean;
      fontColor?: string;
      modelName?: string;
      manualModelName?: string;
      includeBaseUrl?: boolean;
      marginBottom?: string;
      user?: User;
      userPreferences?: IUserPreference;
      dataProcessed?: boolean;
      dataProcessing?: boolean;
      viewType?: "Card" | "List";
      supportedLabelLocation?: "onTop" | "onLeftSide";
      richTextOverflowScroll?: boolean;
    } | null;
  };
  handleOpenCollapseCardContainer?: (
    id: string | undefined,
    showDetails: boolean
  ) => void;
  setLoadingCustomizationForm?: (value: boolean) => void;
  updateSectionHeading?: (value: string, section?: SectionDetailsType) => void;
  fetchErrorIconData?: string[] | null;
  setSaveFormCustomization?: (value: boolean) => void;
};

export default function GenericHeaderCardContainer({
  id,
  modelName,
  children,
  cardHeading,
  extended = false,
  headerButton,
  headerColor = "bg-white",
  marginBottom = "mb-5",
  cardHeadingSize = "text-base",
  borderTop = true,
  getExtendedValue = (extended: boolean) => {},
  applyBorder = false,
  marginTop = "mt-0",
  renderHtmlNextToOpenCloseButton,
  renderHtmlRightToOpenCloseButton,
  childPadding = true,
  renderHtmlHeading,
  allowOverflow = false,
  allowToggle = true,
  customizeHeader = false,
  section,
  loadingCustomizationForm,
  userPreferences,
  allowRecordImage,
  handleOpenCollapseCardContainer = () => {},
  setLoadingCustomizationForm = () => {},
  updateSectionHeading = () => {},
  fetchErrorIconData = null,
  setSaveFormCustomization,
}: GenericHeaderCardContainerType) {
  const [showDetails, setShowDetails] = React.useState(extended);
  const [showPermissionModal, setShowPermissionModal] = React.useState(false);
  React.useEffect(() => {
    if (extended !== showDetails) {
      setShowDetails(extended);
    }
  }, [extended]);

  React.useEffect(() => {
    if (userPreferences && modelName && userPreferences?.length > 0 && id) {
      const detailCardVisible: { id: string; value: boolean }[] | null =
        userPreferences[0]?.defaultPreferences
          ? userPreferences[0]?.defaultPreferences?.[modelName]
            ? userPreferences[0]?.defaultPreferences?.[modelName]
                ?.detailCardsVisible
              ? get(
                  userPreferences[0]?.defaultPreferences?.[modelName],
                  "detailCardsVisible",
                  null
                )
              : null
            : null
          : null;

      if (!detailCardVisible || !isArray(detailCardVisible)) {
        setShowDetails(showDetails);
        return;
      }
      const findIndexOfContainer = detailCardVisible?.findIndex(
        (container) => container.id === id
      );

      if (findIndexOfContainer === -1) {
        setShowDetails(showDetails);
        return;
      }
      setShowDetails(detailCardVisible[findIndexOfContainer].value);
    }
  }, [userPreferences, modelName, id]);

  return (
    <>
      <div
        id={id}
        className={`w-full rounded-[0.6rem] bg-white relative 
          ${
            !allowOverflow && !allowRecordImage?.information && !showDetails
              ? "overflow-hidden"
              : ""
          } 
        ${marginBottom} ${marginTop} ${
          containerWidth[get(section, "columnLayout", "4")]
        } ${applyBorder ? "border shadow-sm" : ""} ${
          allowRecordImage?.visible ? "mt-10" : ""
        }`}
      >
        <Button
          id="generic-card-container-header"
          customStyle={`flex rounded-t-[0.6rem] justify-between items-center w-full ${
            allowToggle ? "cursor-pointer" : "cursor-auto"
          } ${headerColor} ${!showDetails ? "rounded-[0.6rem]" : ""}`}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            if (!allowToggle) return;
            e.preventDefault();
            e.stopPropagation();
            setShowDetails(!showDetails);
            handleOpenCollapseCardContainer(id, !showDetails);
            if (getExtendedValue) {
              getExtendedValue(showDetails);
            }
          }}
          renderChildrenOnly={true}
          userEventName="generic-card-container-toggle-details"
        >
          <>
            {renderHtmlHeading ? (
              renderHtmlHeading
            ) : !customizeHeader ? (
              <p
                data-testid={`${cardHeading}-section`}
                className={`font-medium text-left flex items-center justify-center gap-x-2 px-5 py-3 ${cardHeadingSize}`}
              >
                {cardHeading}
                {fetchErrorIconData?.length ? (
                  <NoPermissionComponent
                    setShowPermissionModal={(value) => {
                      setShowPermissionModal(value);
                    }}
                    fontSize={"text-sm"}
                  />
                ) : (
                  <></>
                )}
              </p>
            ) : (
              <div className="px-4 pt-[5px] pb-1">
                <Formik
                  initialValues={{
                    [`${cardHeading}-${section?.sectionName}`]: cardHeading,
                  }}
                  validationSchema={Yup.object().shape({
                    [`${cardHeading}-${section?.sectionName}`]: Yup.string()
                      .required("Section name is required")
                      .max(
                        50,
                        "Section name cannot be more than 50 characters"
                      ),
                  })}
                  enableReinitialize
                  onSubmit={(values) =>
                    updateSectionHeading(
                      values[`${cardHeading}-${section?.sectionName}`],
                      section
                    )
                  }
                >
                  {({ values, handleSubmit, handleChange }) => (
                    <FormInputBox
                      name={`${cardHeading}-${section?.sectionName}`}
                      allowMargin={false}
                      onChange={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleChange(e);
                        setLoadingCustomizationForm(true);
                        handleDebounceSearch({
                          fieldName: paramCase(
                            `${cardHeading}-${section?.sectionName}`
                          ),
                          handleOnDebounce: (value) => {
                            handleSubmit();
                            setLoadingCustomizationForm(false);
                          },
                        });
                      }}
                      onKeyPress={(e) => {
                        if (e?.key === "Enter" && setSaveFormCustomization) {
                          setSaveFormCustomization(true);
                        }
                      }}
                    />
                  )}
                </Formik>
              </div>
            )}
            <div
              className="flex items-center justify-center gap-x-4"
              data-testid={`${cardHeading}-expand-button`}
            >
              {renderHtmlNextToOpenCloseButton}
              <div className="flex items-center gap-x-4 pr-4">
                {allowToggle ? (
                  showDetails ? (
                    <span className="p-1 rounded-full bg-gray-500 hover:bg-vryno-theme-light-blue text-white">
                      <ChevronUpIcon size={16} />
                    </span>
                  ) : (
                    <span className="p-1 rounded-full bg-gray-500 hover:bg-vryno-theme-light-blue text-white">
                      <ChevronDownIcon size={16} />
                    </span>
                  )
                ) : (
                  <></>
                )}
                {renderHtmlRightToOpenCloseButton}
              </div>
            </div>
            {allowRecordImage?.information && showDetails && (
              <div
                style={{ background: "#f2f7fa" }}
                className="absolute -top-15 left-[38%] z-[10] p-2 rounded-full"
              >
                <DetailFieldValuePerDatatype
                  field={allowRecordImage.information.field}
                  data={allowRecordImage.information.data}
                  headerVisible={allowRecordImage.information.headerVisible}
                  fontSize={allowRecordImage.information.fontSize}
                  truncateData={allowRecordImage.information.truncateData}
                  showIcons={allowRecordImage.information.showIcons}
                  onDetail={
                    allowRecordImage.information.detailSizeImage
                      ? allowRecordImage.information.detailSizeImage
                      : allowRecordImage.information.onDetail
                  }
                  modelName={
                    allowRecordImage.information.manualModelName
                      ? allowRecordImage.information.manualModelName
                      : allowRecordImage.information.modelName
                  }
                  isSample={allowRecordImage.information.isSample ?? false}
                  fontColor={allowRecordImage.information.fontColor}
                  includeBaseUrl={allowRecordImage.information.includeBaseUrl}
                  dataProcessed={allowRecordImage.information.dataProcessed}
                  dataProcessing={allowRecordImage.information.dataProcessing}
                  fieldsList={[]}
                />
              </div>
            )}
          </>
        </Button>
        <div className="absolute top-1.5 right-14">{headerButton}</div>
        {showDetails && (
          <div
            className={`w-full mb-2 rounded-b-[0.6rem] ${
              childPadding ? "p-5" : ""
            } ${borderTop ? "border-t" : ""} ${headerColor}`}
          >
            {children}
          </div>
        )}
      </div>
      {showPermissionModal && (
        <>
          <PermissionModal
            formHeading={"No Data Found"}
            onCancel={() => setShowPermissionModal(false)}
            type={"noData"}
            recordIds={fetchErrorIconData?.toString() || ""}
            shortMessage={false}
          />
          <Backdrop onClick={() => setShowPermissionModal(false)} />
        </>
      )}
    </>
  );
}
