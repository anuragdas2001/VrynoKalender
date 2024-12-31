import * as completedJson from "../../../../public/animations/completed.json";
import GenericFormModalContainer from "../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import Lottie from "lottie-react";
import Link from "next/link";
import React, { useCallback } from "react";
import Button from "../../../../components/TailwindControls/Form/Button/Button";
import { useRouter } from "next/router";
import { Config } from "../../../../shared/constants";
import { cookieUserStore } from "../../../../shared/CookieUserStore";

const completeOptions = {
  loop: false,
  autoplay: true,
  animationData: completedJson,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export function InstanceAddFinished({
  href,
  onButtonClose,
  instanceAdmins,
}: {
  href: string;
  onButtonClose: () => void;
  instanceAdmins: string[];
}) {
  const router = useRouter();
  const callbackRef = useCallback((inputElement: HTMLAnchorElement) => {
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  const userEmail = cookieUserStore.getUserDetails()?.email;
  const isAdmin = userEmail && instanceAdmins.includes(userEmail);
  return (
    <GenericFormModalContainer
      topIconType="None"
      limitWidth={true}
      allowScrollbar={false}
    >
      <div className="w-full h-full flex flex-col items-center">
        <span className="font-bold text-xl text-vryno-label-gray">
          And we&#39;re done!
        </span>
        <Lottie
          animationData={completeOptions.animationData}
          loop={completeOptions.loop}
          autoplay={completeOptions.autoplay}
          rendererSettings={completeOptions.rendererSettings}
          style={{ height: "180px", width: "180px" }}
        />
        <div
          className={`w-full ${isAdmin ? "grid grid-cols-2" : "flex"} gap-x-6`}
        >
          <Button
            id="close-modal"
            kind="back"
            buttonType="thin"
            onClick={() => {
              router.replace(`${Config.publicRootUrl()}instances`);
              onButtonClose();
            }}
            userEventName="add-instance-finished:close-click"
          >
            Close
          </Button>
          {isAdmin && (
            <Link href={href} legacyBehavior>
              <a
                id="lets-start-link"
                className="py-2 w-full text-sm flex flex-row items-center justify-center text-white rounded-md bg-vryno-theme-blue"
                ref={callbackRef}
              >
                Let&#39;s Start
              </a>
            </Link>
          )}
        </div>
      </div>
    </GenericFormModalContainer>
  );
}
