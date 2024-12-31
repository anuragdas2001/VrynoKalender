import { Formik } from "formik";
import SwitchToggle from "../../../../../../components/TailwindControls/Form/SwitchToggle/SwitchToggle";
import { MixpanelActions } from "../../../../../Shared/MixPanel";
import { DetailFieldPerDataTypeProps } from "./DetailFieldPerDataType";
import _ from "lodash";
import { useMutation } from "@apollo/client";
import { SAVE_MUTATION } from "../../../../../../graphql/mutations/saveMutation";
import React from "react";
import { Toast } from "../../../../../../components/TailwindControls/Toast";
import { NoDataControl } from "./NoDataControl";

export const DetailRecordStatus = ({
  data,
  field,
  truncateData,
  fontSize,
  fontColor = "text-vryno-card-value",
  viewType = "Card",
  value,
  displayType,
  showMaskedIcon = false,
  renderRecordStatusToggle = false,
}: Pick<
  DetailFieldPerDataTypeProps,
  | "data"
  | "field"
  | "truncateData"
  | "fontSize"
  | "fontColor"
  | "viewType"
  | "value"
  | "displayType"
  | "showMaskedIcon"
  | "renderRecordStatusToggle"
>) => {
  const [recordStatusValue, setRecordStatusValue] = React.useState(
    data.recordStatus === "a" ? true : false
  );
  const [statusChangeProcess, setStatusChangeProcess] = React.useState(false);

  const [saveRecordStatus] = useMutation(SAVE_MUTATION, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        vrynopath: "crm",
      },
    },
  });

  React.useEffect(() => {
    if (data?.recordStatus === "a") {
      setRecordStatusValue(true);
    } else {
      setRecordStatusValue(false);
    }
  }, [data]);

  const handleStatusChange = (id: string, recordStatus: "a" | "i") => {
    const modelName = field?.field?.moduleName;
    if (!modelName) {
      Toast.error("Model name not found");
      return;
    }
    saveRecordStatus({
      variables: {
        id: id,
        modelName: modelName,
        saveInput: { recordStatus: recordStatus },
      },
    }).then(async (responseOnCompletionRule) => {
      if (
        responseOnCompletionRule?.data?.save?.data &&
        responseOnCompletionRule.data.save.messageKey.includes("-success")
      ) {
        setRecordStatusValue(
          responseOnCompletionRule.data.save.data.recordStatus === "a"
            ? true
            : false
        );
        setStatusChangeProcess(false);
        Toast.success(responseOnCompletionRule.data.save.message);
      } else {
        setStatusChangeProcess(false);
        if (responseOnCompletionRule?.data?.save?.messageKey) {
          Toast.error(responseOnCompletionRule.data.save.message);
          return;
        }
        Toast.error(t("common:unknown-message"));
      }
    });
  };

  if (!renderRecordStatusToggle) {
    const fieldData = _.get(data, field.value, value);
    const dataToDisplay =
      fieldData === "a" ? "Active" : fieldData === "i" ? "Inactive" : "Deleted";
    return (
      <p
        className={`${displayType} ${fontSize.value} ${fontColor} ${
          viewType === "List" || truncateData
            ? "truncate"
            : "whitespace-normal break-all"
        }`}
        title={dataToDisplay}
      >
        <span>
          {dataToDisplay ? (
            dataToDisplay
          ) : (
            <NoDataControl fontSize={fontSize} />
          )}
        </span>
      </p>
    );
  }

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
          [`recordStatus`]: recordStatusValue,
        }}
        enableReinitialize
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ values }) => (
          <SwitchToggle
            name={`recordStatus`}
            dataTestId={`recordStatus-${data?.name}`}
            onChange={(checked, event, id) => {
              event?.preventDefault();
              event?.stopPropagation();
              setStatusChangeProcess(true);
              handleStatusChange(
                data.id,
                values[`recordStatus`] === true ? "i" : "a"
              );
              MixpanelActions.track(
                `switch-field-${data?.name}-recordStatus:toggle-click`,
                {
                  type: "switch",
                }
              );
            }}
            value={values[`recordStatus`] as any}
            disabled={statusChangeProcess}
          />
        )}
      </Formik>
    </form>
  );
};
