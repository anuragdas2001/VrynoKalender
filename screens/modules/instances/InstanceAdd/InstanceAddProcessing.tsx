import * as processingJson from "../../../../public/animations/processing.json";
import GenericFormModalContainer from "../../../../components/TailwindControls/Modals/FormModal/GenericFormModalContainer";
import Lottie from "lottie-react";
import { TextLoop } from "../../../../components/TailwindControls/TextLoop/TextLoop";
import React from "react";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: processingJson,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export function InstanceAddProcessing(props: {
  renderFullPage: boolean;
  messages: string[];
}) {
  return (
    <GenericFormModalContainer
      topIconType="None"
      renderFullPage={props.renderFullPage}
    >
      <div className="w-full h-full flex flex-col items-center">
        <span className="font-bold text-xl text-vryno-label-gray mb-4">
          Almost there
        </span>
        <div className="flex flex-col items-center justify-center">
          <img src="/laptop.svg" alt="laptop" className="w-48" />
          <img
            src="/vryno_icon.svg"
            alt="Vryno Icon"
            className="w-8 absolute"
          />
          <div className="absolute">
            <Lottie
              animationData={defaultOptions.animationData}
              loop={defaultOptions.loop}
              autoplay={defaultOptions.autoplay}
              rendererSettings={defaultOptions.rendererSettings}
              style={{ height: "120px", width: "120px" }}
            />
          </div>
        </div>
        <TextLoop messages={props.messages} />
      </div>
    </GenericFormModalContainer>
  );
}
