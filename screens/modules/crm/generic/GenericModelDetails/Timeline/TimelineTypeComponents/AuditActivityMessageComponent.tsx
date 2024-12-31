import { kebabCase } from "lodash";
import { sentenceCase } from "change-case";
import { INotesSuggestions } from "../TimelineContentMessageComponent";
import { AuditFieldMessageComponent } from "./AuditFieldMessageComponent";
import { IGenericModel } from "../../../../../../../stores/RootStore/GeneralStore/GenericModelStore";
import ViewRichTextEditor from "../../../../../../../components/TailwindControls/Form/RichTextEditor/ViewRichTextEditor";
import {
  IAuditActivityCreate,
  IAuditActivityUpdate,
  IFieldUpdateDetails,
} from "../../../../../../../shared/types/auditLogTypes";
import { ILayout } from "../../../../../../../models/ILayout";

export const AuditActivityMessageComponent = ({
  auditData,
  noteSuggestions,
  genericModels,
  layouts,
  type,
}: {
  auditData: IAuditActivityCreate | IAuditActivityUpdate;
  noteSuggestions: INotesSuggestions;
  genericModels: IGenericModel;
  layouts: ILayout[];
  type: "create" | "update" | "delete";
}) => {
  const activityData = auditData.activityType;
  if (!activityData)
    return (
      <div
        className="flex gap-x-1 items-center"
        data-testid={`audit-log-activity-data-not-found-${
          auditData.id || auditData.recordId
        }`}
      >
        {auditData.type} data not found
      </div>
    );
  if (activityData.__typename === "NoteActivity") {
    return (
      <div
        className="flex gap-x-1"
        data-testid={`audit-log-${kebabCase(
          activityData.__typename || ""
        )}-${type}`}
      >
        <p>Note activity</p>
        <div>
          <ViewRichTextEditor
            data={JSON.parse(activityData.content || "{}") || ""}
            richTextOverflowScroll={false}
            truncateData={false}
            editable={false}
            supportMentions={true}
            mentionSuggestions={noteSuggestions}
            fontSize={{
              header: "text-xsm",
              value: "text-xsm",
            }}
          />
        </div>
      </div>
    );
  } else {
    const moduleName =
      activityData.__typename === "CallLogActivity"
        ? "callLog"
        : activityData.__typename === "MeetingActivity"
        ? "meeting"
        : "task";
    const moduleLayout = layouts.find(
      (layout) => layout.moduleName === moduleName
    );
    const fieldsList = moduleLayout ? moduleLayout.config.fields : [];
    const nameField = fieldsList?.find((field) => field.name === "name");
    return (
      <div
        data-testid={`audit-log-${kebabCase(
          activityData.__typename || ""
        )}-${type}`}
      >
        {`${sentenceCase(activityData.__typename || "")}`}
        {nameField?.isMasked ? ` masked field ${nameField.label.en}` : ""}
        {activityData.activityRecordName && (
          <span className="font-semibold">{` ${activityData.activityRecordName}`}</span>
        )}
        {["CallLogActivity", "MeetingActivity", "TaskActivity"].includes(
          activityData.__typename
        ) ? (
          activityData?.fieldUpdateDetails &&
          Object.keys(activityData.fieldUpdateDetails)?.length ? (
            <>
              {Object.keys(activityData.fieldUpdateDetails).map(
                (key: string, index: number) => {
                  const extractedValue =
                    activityData.fieldUpdateDetails as IFieldUpdateDetails;
                  const field = fieldsList?.find(
                    (field) => field.name === key.split(".").pop()
                  );
                  if (!field) {
                    return "";
                  }
                  if (field.dataType === "relatedTo") {
                    let data = "";
                    if (extractedValue[key].relatedToMetadata)
                      for (const val in extractedValue[key].relatedToMetadata) {
                        data += ` ${val}: ${
                          extractedValue[key].relatedToMetadata?.[
                            val
                          ]?.toString() || ""
                        }`;
                      }
                    return (
                      <div
                        className="flex flex-row gap-x-1"
                        data-testid={"audit-log-field-update-data"}
                        key={index}
                      >
                        <div className="flex flex-row gap-x-1 flex-shrink-0">
                          {field?.isMasked ? "Masked field " : "Field "}
                          <div
                            className="italic font-light max-w-[200px] truncate pr-0.5"
                            title={
                              extractedValue[key].fieldLabel ||
                              field.label.en ||
                              field.name
                            }
                          >
                            {extractedValue[key].fieldLabel ||
                              field.label.en ||
                              field.name}
                          </div>{" "}
                          associated with
                        </div>
                        {/* <div className="flex-grow font-semibold"> */}
                        <div className="font-semibold">
                          <AuditFieldMessageComponent
                            field={field}
                            auditData={auditData}
                            data={data}
                          />
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div
                      className="flex flex-row gap-x-1"
                      data-testid={"audit-log-field-update-data"}
                      key={index}
                    >
                      <div className="flex flex-row gap-x-1 flex-shrink-0">
                        {field?.isMasked ? "Masked field " : "Field "}
                        <span
                          className="italic font-light max-w-[200px] truncate pr-0.5"
                          title={
                            extractedValue[key].fieldLabel ||
                            field.label.en ||
                            field.name
                          }
                        >
                          {extractedValue[key].fieldLabel ||
                            field.label.en ||
                            field.name}
                        </span>{" "}
                        {field.dataType === "recordImage"
                          ? "updated"
                          : "value updated from"}
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
                }
              )}
            </>
          ) : (
            ""
          )
        ) : (
          ""
        )}
      </div>
    );
  }
};
