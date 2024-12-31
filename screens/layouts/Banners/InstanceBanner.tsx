import React, { useContext } from "react";
import _ from "lodash";
import { MessageListContext } from "../../../pages/_app";
import GenericBanner from "./GenericBanner";

const InstanceBanner = () => {
  const { appMessage, instanceMessage } = useContext(MessageListContext);
  if (!instanceMessage.length) return null;

  return (
    <GenericBanner
      messageList={instanceMessage}
      backgroundColor="black"
      marginFromTop={appMessage.length ? 5 : 0}
      type="Instance"
    />
  );
};

export default InstanceBanner;
