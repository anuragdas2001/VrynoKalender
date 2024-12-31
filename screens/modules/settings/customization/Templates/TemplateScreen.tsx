import React, { useEffect, useRef } from "react";
import Link from "next/link";
import AddIcon from "remixicon-react/AddCircleFillIcon";
import { useRouter } from "next/router";
import GenericBackHeader from "../../../crm/shared/components/GenericBackHeader";
import { IEmailTemplate, SupportedApps } from "../../../../../models/shared";
import { SideDrawer } from "../../../crm/shared/components/SideDrawer";
import { setHeight } from "../../../crm/shared/utils/setHeight";
import { SettingsSideBar } from "../../SettingsSidebar";
import { PaginationTemplate } from "./PaginationTemplate";
import { TemplateTable } from "./TemplateTable";
import { TableQuickFilter } from "../../../../Shared/TableQuickFilter";
import { settingsUrlGenerator } from "../../../crm/shared/utils/settingsUrlGenerator";
import { paramCase } from "change-case";

export type TemplateScreenProps = {
  dataFetchProcessing: boolean;
  emailTemplateViewPermission: boolean;
  emailTemplates: IEmailTemplate[];
  emailTemplateItemsCount: number;
  moduleTemplateViewPermission: boolean;
  moduleTemplates: IEmailTemplate[];
  moduleTemplateItemsCount: number;
  templateButtons: {
    [templateName: string]: { moduleName: string; label: string };
  };
  currentTemplateType: "email-template" | "module-template";
  currentPageNumber: number;
  filterValue: string;
  setFilterValue?: (value: string) => void;
  onPageChange: (pageNumber: number) => void;
  deleteEmailTemplate: (item: IEmailTemplate) => void;
};

export const TemplateScreen = ({
  dataFetchProcessing,
  templateButtons,
  emailTemplateViewPermission,
  emailTemplates,
  emailTemplateItemsCount,
  moduleTemplateViewPermission,
  moduleTemplates,
  moduleTemplateItemsCount,
  currentTemplateType,
  currentPageNumber,
  filterValue,
  setFilterValue = () => {},
  onPageChange = () => {},
  deleteEmailTemplate,
}: TemplateScreenProps) => {
  const router = useRouter();
  const [sideMenuClass, setSideMeuClass] = React.useState("-translate-x-full");
  const heightRef = useRef(null);
  useEffect(() => {
    if (heightRef) {
      setHeight(heightRef, 40);
    }
  }, [emailTemplates, moduleTemplates]);

  return (
    <>
      {(currentTemplateType === "email-template"
        ? emailTemplateViewPermission
        : currentTemplateType === "module-template"
        ? moduleTemplateViewPermission
        : false) && !dataFetchProcessing ? (
        <GenericBackHeader
          heading={templateButtons[currentTemplateType]?.label}
        >
          <Link href="" legacyBehavior>
            <a
              onClick={
                dataFetchProcessing
                  ? () => {}
                  : (e) => {
                      e.preventDefault();
                      router
                        .push(`crm/templates/${currentTemplateType}/add`)
                        .then();
                    }
              }
              className={`py-2 px-4 text-white rounded-md text-sm flex items-center justify-center gap-x-2 bg-vryno-theme-blue ${
                dataFetchProcessing ? "opacity-50 cursor-default" : ""
              }`}
              id={`add-${currentTemplateType}`}
            >
              <AddIcon size={18} />
              <span>{templateButtons[currentTemplateType]?.label}</span>
            </a>
          </Link>
        </GenericBackHeader>
      ) : (
        <GenericBackHeader heading="Templates" />
      )}
      <div className="w-full flex max-w-md px-6 gap-x-4 my-3">
        {Object.keys(templateButtons)?.map((templateButton, index) => {
          return (
            <Link
              key={index}
              legacyBehavior
              href={{
                pathname: settingsUrlGenerator(
                  SupportedApps.crm,
                  "templates",
                  templateButtons[templateButton].moduleName === "emailTemplate"
                    ? "email-template"
                    : "module-template"
                ),
              }}
            >
              <a
                id={templateButton}
                data-testid={paramCase(templateButton)}
                className={`text-sm text-white flex flex-row  items-center justify-center ${
                  currentTemplateType ===
                  paramCase(templateButtons[templateButton].moduleName)
                    ? "arrow_box_down bg-vryno-theme-blue"
                    : "bg-gray-400"
                } py-2 px-2 rounded-md w-full`}
              >
                {templateButtons[templateButton]?.label}
              </a>
            </Link>
          );
        })}
      </div>
      <div
        className={`w-full hidden sm:flex sm:justify-between pt-4 px-6 gap-x-4`}
      >
        {((currentTemplateType === "email-template" &&
          emailTemplates?.length > 0) ||
          (currentTemplateType === "module-template" &&
            moduleTemplates?.length > 0)) && (
          <TableQuickFilter
            filterName={
              (currentTemplateType as any) === "email-template"
                ? "email template"
                : currentTemplateType === "module-template"
                ? "module template"
                : ""
            }
            setFilterValue={(value) => setFilterValue(value)}
          />
        )}
        <PaginationTemplate
          currentTemplateType={currentTemplateType}
          currentPageNumber={currentPageNumber}
          emailTemplates={emailTemplates}
          moduleTemplates={moduleTemplates}
          emailTemplateItemsCount={emailTemplateItemsCount}
          moduleTemplateItemsCount={moduleTemplateItemsCount}
          onPageChange={(pageNumber) => onPageChange(pageNumber)}
        />
      </div>
      <div className={`sm:hidden`}>
        <div className="flex justify-between pr-6 pt-4">
          <SideDrawer
            sideMenuClass={sideMenuClass}
            setSideMenuClass={setSideMeuClass}
            buttonType={"thin"}
          >
            <SettingsSideBar />
          </SideDrawer>
          <PaginationTemplate
            currentTemplateType={currentTemplateType}
            currentPageNumber={currentPageNumber}
            emailTemplates={emailTemplates}
            moduleTemplates={moduleTemplates}
            emailTemplateItemsCount={emailTemplateItemsCount}
            moduleTemplateItemsCount={moduleTemplateItemsCount}
            onPageChange={(pageNumber) => onPageChange(pageNumber)}
          />
        </div>
        {((currentTemplateType === "email-template" &&
          emailTemplates?.length > 0) ||
          (currentTemplateType === "module-template" &&
            moduleTemplates?.length > 0)) && (
          <TableQuickFilter
            filterName={
              (currentTemplateType as any) === "email-template"
                ? "email template"
                : "module template"
            }
            setFilterValue={(value) => setFilterValue(value)}
          />
        )}
        <div className="flex items-center justify-between px-6 pt-4">
          {Object.keys(templateButtons)?.map((templateButton, index) => {
            return (
              <Link
                key={index}
                legacyBehavior
                href={{
                  pathname: settingsUrlGenerator(
                    SupportedApps.crm,
                    "templates",
                    templateButtons[templateButton].moduleName ===
                      "emailTemplate"
                      ? "email-template"
                      : "module-template"
                  ),
                }}
              >
                <a
                  id={templateButton}
                  data-testid={paramCase(templateButton)}
                  className={`text-sm text-white flex flex-row  items-center justify-center ${
                    currentTemplateType ===
                    paramCase(templateButtons[templateButton].moduleName)
                      ? "arrow_box_down bg-vryno-theme-blue"
                      : "bg-gray-400"
                  } py-2 px-6 rounded-md `}
                >
                  {templateButtons[templateButton]?.label}
                </a>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="px-6" ref={heightRef}>
        <TemplateTable
          currentTemplateType={currentTemplateType}
          emailTemplates={emailTemplates}
          moduleTemplates={moduleTemplates}
          emailTemplateViewPermission={emailTemplateViewPermission}
          moduleTemplateViewPermission={moduleTemplateViewPermission}
          dataFetchProcessing={dataFetchProcessing}
          deleteEmailTemplate={(item) => deleteEmailTemplate(item)}
          filterValue={filterValue}
        />
      </div>
    </>
  );
};
