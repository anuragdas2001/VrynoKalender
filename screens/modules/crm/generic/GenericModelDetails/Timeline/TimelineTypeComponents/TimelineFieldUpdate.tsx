import { ICustomField } from "../../../../../../../models/ICustomField";
import { AuditFieldMessageComponent } from "./AuditFieldMessageComponent";
import {
  IAuditFieldUpdate,
  IFieldUpdateDetails,
} from "../../../../../../../shared/types/auditLogTypes";

export const TimelineFieldUpdate = ({
  auditData,
  fieldsList,
}: {
  auditData: IAuditFieldUpdate;
  fieldsList: ICustomField[];
}) => {
  if (
    !auditData.fieldUpdateDetails ||
    Object.keys(auditData.fieldUpdateDetails).length === 0
  )
    return (
      <div data-testid={"audit-log-field-update-no-data-found"}>
        Field updated
      </div>
    );
  return Object.keys(auditData.fieldUpdateDetails).map((key, index) => {
    const extractedValue = auditData.fieldUpdateDetails as IFieldUpdateDetails;
    const field = fieldsList.find(
      (field) => field.name === key.split(".").pop()
    );
    if (!field)
      return (
        <div data-testid={"audit-log-field-update-no-data-found"} key={index}>
          Field updated
        </div>
      );
    // if (field.dataType === "relatedTo") {
    //   let data = "";
    //   if (extractedValue[key].relatedToMetadata)
    //     for (const val in extractedValue[key].relatedToMetadata) {
    //       data += ` ${val}: ${
    //         extractedValue[key].relatedToMetadata?.[val]?.toString() || ""
    //       }`;
    //     }
    //   return (
    //     <div
    //       className="flex flex-row gap-x-1"
    //       data-testid={"audit-log-field-update-data"}
    //       key={index}
    //     >
    //       <div className="flex flex-row gap-x-1 flex-shrink-0">
    //         {field?.isMasked ? "Masked field " : "Field "}
    //         <div
    //           className="italic font-light max-w-[200px] truncate pr-0.5"
    //           title={
    //             extractedValue[key].fieldLabel || field.label.en || field.name
    //           }
    //         >
    //           {extractedValue[key].fieldLabel || field.label.en || field.name}
    //         </div>{" "}
    //         associated with
    //       </div>
    //       {/* <div className="flex-grow font-semibold"> */}
    //       <div className="font-semibold">
    //         <AuditFieldMessageComponent
    //           field={field}
    //           auditData={auditData}
    //           data={data ?? ""}
    //         />
    //       </div>
    //     </div>
    //   );
    // }
    return (
      <div
        className="flex flex-row gap-x-1 items-start"
        data-testid={"audit-log-field-update-data"}
        key={index}
      >
        <div className="flex flex-row gap-x-1 flex-shrink-0">
          {field?.isMasked ? "Masked field " : "Field "}
          <div
            className="italic font-light max-w-[200px] truncate pr-0.5"
            title={
              extractedValue[key].fieldLabel || field.label.en || field.name
            }
          >
            {extractedValue[key].fieldLabel || field.label.en || field.name}
          </div>{" "}
          {field.dataType === "recordImage" ? "updated" : "value updated from"}
        </div>
        {field.dataType === "recordImage" ? (
          <></>
        ) : (
          <>
            {/* <div className="flex-grow font-semibold"> */}
            <div className="font-semibold">
              <AuditFieldMessageComponent
                field={field}
                auditData={auditData}
                data={extractedValue[key].oldValue ?? ""}
              />
            </div>
            <div className="flex-shrink-0">{` to `}</div>
            <div className="flex-grow font-semibold">
              <AuditFieldMessageComponent
                field={field}
                auditData={auditData}
                data={extractedValue[key].newValue ?? ""}
              />
            </div>
          </>
        )}
      </div>
    );
  });
};
