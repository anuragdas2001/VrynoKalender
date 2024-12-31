import { IEmailTemplate } from "../../../../../models/shared";
import Pagination from "../../../crm/shared/components/Pagination";

export const PaginationTemplate = ({
  currentTemplateType,
  emailTemplates,
  emailTemplateItemsCount,
  currentPageNumber,
  moduleTemplates,
  moduleTemplateItemsCount,
  onPageChange,
}: {
  currentTemplateType: "email-template" | "module-template";
  emailTemplates: IEmailTemplate[];
  emailTemplateItemsCount: number;
  currentPageNumber: number;
  moduleTemplates: IEmailTemplate[];
  moduleTemplateItemsCount: number;
  onPageChange: (pageNumber: number) => void;
}) => {
  return (
    <>
      {currentTemplateType === "email-template" ? (
        emailTemplates?.length > 0 && (
          <Pagination
            itemsCount={emailTemplateItemsCount}
            currentPageItemCount={[currentTemplateType].length}
            pageSize={50}
            onPageChange={(pageNumber) => {
              onPageChange(pageNumber);
            }}
            currentPageNumber={currentPageNumber}
          />
        )
      ) : currentTemplateType === "module-template" ? (
        moduleTemplates?.length > 0 && (
          <Pagination
            itemsCount={moduleTemplateItemsCount}
            currentPageItemCount={[currentTemplateType].length}
            pageSize={50}
            onPageChange={(pageNumber) => {
              onPageChange(pageNumber);
            }}
            currentPageNumber={currentPageNumber}
          />
        )
      ) : (
        <></>
      )}
    </>
  );
};
