import React from "react";
// import Meeting from "../components/vrynoKalenderComponents/Meetings/[...MeetingType]";
// import MeetingType from "../components/vrynoKalenderComponents/Meetings/[[...type]]";
import MeetingType from "./meetings/[...type]";
const meetings = () => {
  return <MeetingType />;
};

export default meetings;
