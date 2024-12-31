import React from "react";
import RetryIcon from "remixicon-react/RestartLineIcon";
import Button from "../../components/TailwindControls/Form/Button/Button";

export type RetryButtonProps = {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
};

const RetryButton = ({ onClick, disabled, loading }: RetryButtonProps) => {
  return (
    <Button
      id="retry-fields-fetch"
      onClick={onClick}
      kind="primary"
      disabled={disabled}
      loading={loading}
      userEventName="Instant-workflow-activity:button-to-refetch-fields"
    >
      <span
        className={`col-span-8 sm:col-span-10 flex justify-center items-center pr-1`}
      >
        <RetryIcon size={20} className="mr-2" />
        <span>Retry Again</span>
      </span>
    </Button>
  );
};
export default RetryButton;
