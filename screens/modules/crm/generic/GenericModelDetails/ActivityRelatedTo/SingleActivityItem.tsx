import React from "react";
import Link from "next/link";
import { GenericField } from "../GenericField";
import EditIcon from "remixicon-react/EditBoxLineIcon";
import DeleteIcon from "remixicon-react/DeleteBinLineIcon";
import ErrorWarningIcon from "remixicon-react/ErrorWarningFillIcon";
import { SingleActivityItemProps } from "./activityRelatedToHelper";
import { AllowedViews } from "../../../../../../models/allowedViews";
import { appsUrlGenerator } from "../../../shared/utils/appsUrlGenerator";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import ExpandCollapseIcon from "../../../../../../components/TailwindControls/Cards/ExpandCollapseIcon";
import { FieldPermissionModal } from "../../../../../../components/TailwindControls/Modals/FieldPermissionModal";
import { Backdrop } from "../../../../../../components/TailwindControls/Backdrop";

export function SingleActivityItem({
  appName,
  relatedName,
  data,
  fieldsList,
  onDelete,
  onActivityEdit,
  activityType,
  activityName,
  visibleFields,
}: SingleActivityItemProps) {
  const [visibleActivity, setVisibleActivity] = React.useState(false);

  const hiddenFields = visibleFields?.filter((field) => !field.visible) || [];
  const [showHiddenFieldsModal, setShowHiddenFieldsModal] =
    React.useState(false);

  return (
    <>
      <div className="grid grid-cols-12">
        <div>
          <ExpandCollapseIcon
            setShowDetails={setVisibleActivity}
            showDetails={visibleActivity}
            kind={"iconInverted"}
          />
        </div>

        <div className="col-span-9 pt-0.5">
          {data && data?.relatedTo && (
            <div className="mb-3.5">
              <Link
                legacyBehavior
                href={appsUrlGenerator(
                  appName,
                  relatedName,
                  AllowedViews.detail,
                  data.id,
                  [data.relatedTo[0]?.moduleName, data.relatedTo[0]?.recordId]
                )}
              >
                <a className="text-vryno-theme-light-blue cursor-pointer">
                  <GenericField
                    data={data}
                    fieldsList={fieldsList}
                    fieldName={`name`}
                    headerVisible={false}
                    fontSize={{ header: "text-xs", value: "text-xs" }}
                    fontColor={"text-vryno-theme-light-blue"}
                  />
                </a>
              </Link>
              <GenericField
                data={data}
                fieldsList={fieldsList}
                fieldName={`${
                  activityName === "task" ? "dueDate" : "startedAt"
                }`}
                headerVisible={false}
                fontSize={{ header: "text-xs", value: "text-xs" }}
              />
            </div>
          )}

          {visibleActivity && (
            <div className="w-full grid grid-cols-2 gap-x-2">
              {visibleFields
                ?.filter((field) => field.visible)
                .map((field, index) => (
                  <GenericField
                    data={data}
                    key={index}
                    fieldsList={fieldsList}
                    fieldName={field.name}
                    headerVisible={true}
                    fontSize={{ header: "text-xs", value: "text-xs" }}
                  />
                ))}
            </div>
          )}
        </div>
        <div className="col-span-2 pt-0.5 flex justify-end gap-3 items-start">
          {hiddenFields?.length ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowHiddenFieldsModal(true);
              }}
            >
              <ErrorWarningIcon
                size={14}
                className="text-vryno-orange-disabled ml-1"
              />
            </button>
          ) : (
            <></>
          )}
          <Button
            id={`edit-${activityType}-${activityName}-${data["id"]}`}
            onClick={(e) => {
              e.preventDefault();
              onActivityEdit(data["id"]);
            }}
            customStyle=""
            userEventName={`${activityType}-${activityName.toLowerCase()}-related-activity-edit:action-click`}
          >
            <EditIcon size={16} className="text-vryno-theme-light-blue" />
          </Button>
          <Button
            id={`delete-${activityType}-${activityName}-${data["id"]}`}
            onClick={(e) => {
              e.preventDefault();
              onDelete(data["id"]);
            }}
            customStyle=""
            userEventName={`${activityType}-${activityName.toLowerCase()}-related-activity-delete:action-click`}
          >
            <DeleteIcon size={16} className="text-vryno-theme-light-blue" />
          </Button>
        </div>
      </div>
      {showHiddenFieldsModal && (
        <>
          <FieldPermissionModal
            onCancel={() => setShowHiddenFieldsModal(false)}
            fieldsNameArray={hiddenFields.map((field) => field.label.en)}
          />
          <Backdrop onClick={() => setShowHiddenFieldsModal(false)} />
        </>
      )}
    </>
  );
}
