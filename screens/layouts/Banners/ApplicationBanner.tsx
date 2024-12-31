import React, { useContext } from "react";
import _ from "lodash";
import { MessageListContext } from "../../../pages/_app";
import GenericBanner from "./GenericBanner";

const ApplicationBanner = () => {
  const { appMessage, instanceMessage } = useContext(MessageListContext);
  if (!appMessage.length) return null;

  return <GenericBanner messageList={appMessage} type="Application" />;
};

export default ApplicationBanner;
