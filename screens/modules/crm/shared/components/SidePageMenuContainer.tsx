import React, { useContext } from "react";
import { SideMenuLoader } from "../../../../../components/TailwindControls/ContentLoader/SideMenuLoader";
import { MessageListContext } from "../../../../../pages/_app";

export type SidePageMenuContainerProps = {
  menuLoading?: boolean;
  children?: React.ReactElement;
};

const SidePageMenuContainer = ({
  menuLoading = false,
  children,
}: SidePageMenuContainerProps) => {
  const { appMessage, instanceMessage } = useContext(MessageListContext);
  return (
    <>
      <div
        className={`min-h-screen fixed inset-y-0 left-0 ${
          appMessage?.length > 0 && instanceMessage?.length > 0
            ? `mt-[120px] sm:mt-[126px] md:mt-[100px] pb-32`
            : appMessage?.length > 0 || instanceMessage?.length > 0
            ? `mt-[100px] sm:mt-[106px] md:mt-[80px] pb-24`
            : "mt-20 sm:mt-21.5 md:mt-15 pb-20"
        }  bg-white hidden sm:flex sm:flex-col p-3 h-full z-10 w-1/4 sm:w-4/12 md:w-3/12 lg:w-1/5 xl:w-2/12 shadow-xl`}
      >
        <div className={`h-full card-scroll hover:overflow-y-auto pr-2`}>
          {menuLoading ? <SideMenuLoader /> : children}
        </div>
      </div>
      <div
        className={`min-h-screen fixed inset-y-0 left-0 ${
          appMessage?.length > 0 && instanceMessage?.length > 0
            ? `mt-[120px] sm:mt-[126px] md:mt-[100px] pb-32`
            : appMessage?.length > 0 || instanceMessage?.length > 0
            ? `mt-[100px] sm:mt-[106px] md:mt-[80px] pb-24`
            : "mt-20 sm:mt-21.5 md:mt-15 pb-20"
        }  w-1/4 sm:w-4/12 md:w-3/12 lg:w-1/5 xl:w-2/12 hidden sm:flex sm:flex-col p-3`}
      />
    </>
  );
};
export default SidePageMenuContainer;
