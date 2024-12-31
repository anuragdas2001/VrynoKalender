/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useLinkedAccountContext } from "../shared/UserEmailSettingsContext";
import { EmailConfigWidgets } from "./EmailConfigWidget";
import { LinkedAccount } from "../shared/UserEmailSettingsConstants";

const EmailConfig = ({
  handleRemoveAccount,
  handleRemoveSynchronzation,
}: {
  handleRemoveAccount: (account: LinkedAccount) => void;
  handleRemoveSynchronzation: (id: string | null) => void;
}) => {
  const { accounts, loading } = useLinkedAccountContext();
  return (
    <div className="flex flex-col gap-y-6">
      <EmailConfigWidgets
        key={"email-config-widgets"}
        accounts={accounts}
        handleRemoveAccount={handleRemoveAccount}
        handleRemoveSynchronzation={handleRemoveSynchronzation}
      />
    </div>
  );
};

export default EmailConfig;
