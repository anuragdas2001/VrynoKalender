import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "next-i18next";
import FormInputBox from "../../../components/TailwindControls/Form/InputBox/FormInputBox";
import Button from "../../../components/TailwindControls/Form/Button/Button";
import FormTextAreaBox from "../../../components/TailwindControls/Form/TextArea/FormTextAreaBox";
import { MultipleEmailInputBox } from "../../../components/TailwindControls/Form/MultipleEmailInputBox/MultipleEmailInputBox";
import GenericFormModalContainer from "../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import { IInstance } from "../../../models/Accounts";

export function InstanceEditForm({
  instance,
  handleSubmit,
  loading,
  supportOutsideClick,
  onOutsideClick = () => {},
}: {
  instance?: Partial<IInstance>;
  handleSubmit: (instanceData: Partial<IInstance>) => void;
  loading: boolean;
  supportOutsideClick: boolean;
  onOutsideClick?: (value: boolean) => void;
}) {
  const internalInstance: Partial<IInstance> = {
    ...{
      instanceAdmins: [],
      subdomain: "",
      description: "",
      name: "",
    },
    ...instance,
  };
  const { t } = useTranslation(["instances", "common"]);
  const [instanceAdmins, setAdmin] = React.useState(
    internalInstance.instanceAdmins || []
  );
  const [adminsError, setAdminsError] = React.useState<string>("");

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(t("name-error"))
      .max(50)
      .matches(
        /^([A-Za-z0-9_@./#&$+-\\\/_\-]|([A-Za-z0-9_@./#&$+-\\\/_\-][A-Za-z0-9_@./#&$+-\\\/_\- ]{0,50}[A-Za-z0-9_@./#&$+-\\\/_\-]))$/,
        t("common:no-space-trailing-error")
      ),
    subdomain: Yup.string()
      .required(t("sub-domain-error"))
      .matches(
        /^([A-Za-z0-9_@./#&$+-\\\/_\-]|([A-Za-z0-9_@./#&$+-\\\/_\-][A-Za-z0-9_@./#&$+-\\\/_\- ]{0,50}[A-Za-z0-9_@./#&$+-\\\/_\-]))$/,
        t("common:no-space-trailing-error")
      )
      .max(10),
    description: Yup.string()
      .optional()
      .max(300, `Cannot exceed 300 characters`),
  });

  return (
    <GenericFormModalContainer
      topIconType="MoreInfo"
      formHeading="Edit Instance"
      infoArray={[
        {
          label: "Instance",
          value:
            "An instance is like a database or a group of applications required for running your business. Enter a name that suits your business",
        },
        {
          label: "Sub Domain",
          value: "Personal access URL exclusive to every instance",
        },
        {
          label: "Admins",
          value: "Personals that can access your sub domain",
        },
        {
          label: "Description",
          value: "Leave personal comments describing your instance",
        },
      ]}
      onOutsideClick={() => {
        if (supportOutsideClick) {
          onOutsideClick(true);
        }
      }}
    >
      <div className="w-full h-full">
        <Formik
          initialValues={{
            name: internalInstance.name,
            subdomain: internalInstance?.subdomain,
            description: internalInstance.description,
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            if (!instanceAdmins || instanceAdmins.length === 0) {
              setAdminsError("Please enter atleast one valid email.");
              return;
            }
            handleSubmit({ ...values, instanceAdmins });
          }}
        >
          {({ handleSubmit, errors }) => (
            <>
              <div className="w-full max-h-[55vh] overflow-y-auto pr-1.5 card-scroll mt-8 flex flex-col items-center">
                <form onSubmit={(e) => e.preventDefault()} className="w-full">
                  <FormInputBox
                    name="name"
                    label="Instance Name"
                    type="text"
                    required={true}
                    placeholder="Enter Instance name"
                  />
                  <FormInputBox
                    name="subdomain"
                    label={t("sub-domain-label")}
                    type="text"
                    disabled={true}
                    placeholder={t("sub-domain-placeholder")}
                  />
                  <MultipleEmailInputBox
                    name="instanceAdmins"
                    label={t("admin-label")}
                    items={instanceAdmins}
                    handleAdd={(values) => setAdmin(values)}
                    handleDelete={(values) => setAdmin(values)}
                    disabled={false}
                    adminsError={adminsError}
                  />
                  <FormTextAreaBox
                    name="description"
                    label={t("description-label")}
                    placeholder={t("description-placeholder")}
                    rows={2}
                    maxCharLength={300}
                  />
                </form>
              </div>
              <div className="grid grid-cols-2 w-full gap-x-4">
                <div className="sm:hidden">
                  <Button
                    id="m-cancel-button"
                    onClick={() => {
                      onOutsideClick(true);
                    }}
                    type={"submit"}
                    kind="back"
                    userEventName="instance-edit-mobile:cancel-click"
                  >
                    Cancel
                  </Button>
                </div>
                <div className="hidden sm:flex">
                  <Button
                    id="d-cancel-button"
                    onClick={() => {
                      onOutsideClick(true);
                    }}
                    type={"submit"}
                    kind="back"
                    userEventName="instance-edit-desktop:cancel-click"
                  >
                    Cancel
                  </Button>
                </div>
                <Button
                  id="submit-instance"
                  onClick={() => {
                    if (Object.keys(errors).length > 0) {
                      return;
                    }
                    handleSubmit();
                  }}
                  type={"submit"}
                  kind="primary"
                  loading={loading}
                  userEventName="instance-edit:submit-click"
                >
                  Submit
                </Button>
              </div>
            </>
          )}
        </Formik>
      </div>
    </GenericFormModalContainer>
  );
}
