import ErrorWarningIcon from "remixicon-react/ErrorWarningFillIcon";

export const NoFieldDataPermissionComponent = ({
  setShowFieldDataPermissionModal,
  fontSize,
  type = "data",
}: {
  setShowFieldDataPermissionModal: (value: boolean) => void;
  fontSize: string;
  type: "data" | "field";
}) => (
  <span className={`${fontSize}`}>
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowFieldDataPermissionModal(true);
      }}
      className="inline-block align-middle"
    >
      <ErrorWarningIcon
        size={14}
        className={`${
          type === "data" ? "text-vryno-orange" : "text-vryno-danger"
        }`}
      />
    </button>
  </span>
);

export const RecordLookupNoFieldDataComponent = ({
  fontSize,
  value,
  setShowFieldDataPermissionModal,
}: {
  fontSize: string;
  value: Record<string, any>;
  setShowFieldDataPermissionModal: React.Dispatch<
    React.SetStateAction<{
      visible: boolean;
      data: {
        type: "data" | "field";
        message: any;
      } | null;
    }>
  >;
}) => {
  return value["__expression_data_not_found__"] ? (
    <NoFieldDataPermissionComponent
      setShowFieldDataPermissionModal={(data) =>
        setShowFieldDataPermissionModal({
          visible: data,
          data: {
            type: "data",
            message: value["__expression_data_not_found_message__"],
          },
        })
      }
      type="data"
      fontSize={fontSize}
    />
  ) : value["__field_expression_not_found__"] ? (
    <NoFieldDataPermissionComponent
      setShowFieldDataPermissionModal={(data) =>
        setShowFieldDataPermissionModal({
          visible: data,
          data: {
            type: "field",
            message: value["__field_expression_not_found_message__"],
          },
        })
      }
      type="field"
      fontSize={fontSize}
    />
  ) : (
    ""
  );
};
