import Meeting from "../../components/vrynoKalenderComponents/Meetings/MeetingType";
import { useParams } from "next/navigation";
const MeetingType = () => {
  const  params  = useParams();
  // console.log("type", params?.type[0]);
  return (
    <div>
      <Meeting  />
    </div>
  );
};

export default MeetingType;
