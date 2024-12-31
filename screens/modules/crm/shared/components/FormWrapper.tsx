import { Formik } from "formik";
import { useTranslation } from "next-i18next";
import React from "react";

export type FormWrapperProps = {
  data: Record<string, string>;
  validationSchema?: any;
  handleSave: (values: any) => void;
  children: React.ReactElement;
};

const FormWrapper = ({
  data,
  validationSchema,
  handleSave,
  children,
}: FormWrapperProps) => {
  const { t } = useTranslation(["common"]);

  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full">
      <Formik
        initialValues={{
          data,
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handleSave(values);
        }}
      >
        {({ handleSubmit, values, initialValues }) => (
          <div className="w-full">{children}</div>
        )}
      </Formik>
    </form>
  );
};

export default FormWrapper;
