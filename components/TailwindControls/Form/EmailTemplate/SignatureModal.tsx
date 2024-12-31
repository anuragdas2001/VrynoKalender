import React from "react";
import GenericFormModalContainer from "../../Modals/FormModal/GenericFormModalContainer";
import { Formik } from "formik";
import { User } from "../../../../models/Accounts";
import { Backdrop } from "../../Backdrop";
import { SignatureModalFormFields } from "./SignatureModalFormFields";
import { Content, Editor } from "@tiptap/react";

type SignatureModalProps = {
  user: User | null;
  handleSelectedHtml: (value: Editor | null) => void;
  setOpenSignatureWindow: (value: boolean) => void;
};

export const SignatureModal = ({
  user,
  handleSelectedHtml,
  setOpenSignatureWindow,
}: SignatureModalProps) => {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full">
      <GenericFormModalContainer
        formHeading={`Add Signature`}
        onOutsideClick={() => {
          setOpenSignatureWindow(false);
        }}
        limitWidth={true}
        onCancel={() => {
          setOpenSignatureWindow(false);
        }}
      >
        <Formik
          initialValues={{
            signature: user?.signature,
          }}
          onSubmit={(values) => {}}
        >
          {({}) => (
            <SignatureModalFormFields
              handleSelectedHtml={handleSelectedHtml}
              setOpenSignatureWindow={setOpenSignatureWindow}
            />
          )}
        </Formik>
      </GenericFormModalContainer>
      <Backdrop onClick={() => setOpenSignatureWindow(false)} />
    </form>
  );
};
