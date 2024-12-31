import router from "next/router";
import React from "react";
import { toast } from "react-toastify";
import { SEND_EMAIL_VERIFICATION_QUERY } from "../../../../graphql/queries/login";
import { SupportedApps } from "../../../../models/shared";
import { useTranslation } from "next-i18next";
import Button from "../../../../components/TailwindControls/Form/Button/Button";
import { getGraphqlWsLinkClient } from "../../../../shared/getGrapqhlWsLinkClient";

export const EmailVerifyErrorContainer = ({
  imagePath,
  heading,
  message,
  token,
}: {
  imagePath: string;
  heading: React.ReactNode;
  message: React.ReactNode;
  token: string;
}) => {
  const { t } = useTranslation(["common"]);
  const [tokenSaveLoading, setTokenSaveLoading] = React.useState(false);

  const resendToken = async () => {
    setTokenSaveLoading(true);
    const { data } = await getGraphqlWsLinkClient().query({
      context: {
        headers: {
          vrynopath: SupportedApps.accounts,
        },
      },
      query: SEND_EMAIL_VERIFICATION_QUERY,
      variables: {
        token: token,
      },
    });

    if (data.sendEmailVerificationLink.code === 200) {
      router.replace("/login");
    } else {
      toast.error(data.sendEmailVerificationLink.message);
      setTokenSaveLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <img className="mx-auto my-7" src={imagePath} alt="continue login" />
        <span id="congratulations-label" className="text-lg font-bold ">
          {heading}
        </span>
        <span className="text-sm mb-7">{message}</span>
        <Button
          id="reset-token-button"
          disabled={tokenSaveLoading}
          loading={tokenSaveLoading}
          onClick={(e) => {
            e.preventDefault();
            resendToken();
          }}
          userEventName="reset-token:submit-click"
        >
          Reset token
        </Button>
      </div>
    </>
  );
};
