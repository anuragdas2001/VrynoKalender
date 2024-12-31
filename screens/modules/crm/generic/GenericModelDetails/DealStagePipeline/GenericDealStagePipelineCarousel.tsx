import ThumbUpIcon from "remixicon-react/ThumbUpFillIcon";
import ThumbDownIcon from "remixicon-react/ThumbDownFillIcon";
import LeftArrowIcon from "remixicon-react/ArrowLeftSLineIcon";
import RightArrowIcon from "remixicon-react/ArrowRightSLineIcon";
import ItemsLoader from "../../../../../../components/TailwindControls/ContentLoader/Shared/ItemsLoader";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Mousewheel } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import Button from "../../../../../../components/TailwindControls/Form/Button/Button";
import React from "react";
import { IStageMetadata } from "../../../../settings/customization/ModuleAndFields/DealPipeline/ConnectedDealPipeline";

export const GenericDealStagePipelineCarousel = ({
  dealStagesLoading,
  hasPipeline,
  stagesData,
  modelData,
  saveLoading,
  handleStageSave,
}: {
  dealStagesLoading: boolean;
  hasPipeline: boolean;
  stagesData: IStageMetadata[];
  modelData: any;
  saveLoading: boolean;
  handleStageSave: (stageData: IStageMetadata) => void;
}) => {
  const [swiperTranslate, setSwiperTranslate] = React.useState(0);
  const sliderSettings = {
    480: {
      slidesPerView: stagesData?.length < 4 ? stagesData?.length : 4,
    },
    640: {
      slidesPerView: stagesData?.length < 2 ? stagesData?.length : 2,
    },
    768: {
      slidesPerView: stagesData?.length < 4 ? stagesData?.length : 4,
    },
    1024: {
      slidesPerView: stagesData?.length < 6 ? stagesData?.length : 6,
    },
    1200: {
      slidesPerView: stagesData?.length < 10 ? stagesData?.length : 10,
    },
  };
  const swiperRef = React.useRef<any>(null);
  const [initialSlide, setInitialSlide] = React.useState(0);

  React.useEffect(() => {
    if (stagesData?.length) {
      for (let i = 0; i < stagesData.length; i++) {
        if (modelData?.dealStageId === stagesData[i]?.id) setInitialSlide(i);
      }
    }
  }, [stagesData]);

  return !dealStagesLoading ? (
    <div className="mt-2">
      {hasPipeline ? (
        stagesData.length ? (
          <div className="flex ">
            <Button
              id="stage-list-left-button"
              customStyle={`bg-vryno-active-deal-blue hover:bg-vryno-theme-blue text-gray-500 hover:text-white px-1 rounded-tl-md rounded-bl-md h-[34px] ${
                swiperTranslate === 0 ? "opacity-20" : "opacity-60"
              }`}
              onClick={() => {
                if (swiperTranslate === 0) return;
                swiperRef.current?.slidePrev();
              }}
              userEventName="dealStage-list-move-left-click"
            >
              <LeftArrowIcon size={20} />
            </Button>
            <Swiper
              breakpoints={sliderSettings}
              spaceBetween={0}
              onSlideChange={() => {
                setSwiperTranslate(swiperRef.current.translate);
              }}
              mousewheel={true}
              modules={[Navigation, Mousewheel]}
              onBeforeInit={(swiper) => {
                swiperRef.current = swiper;
                setSwiperTranslate(swiper.translate);
              }}
              initialSlide={initialSlide}
            >
              {stagesData.map((item, index: number) => {
                return (
                  <SwiperSlide
                    key={index}
                    style={{ zIndex: `${stagesData.length - index}` }}
                    // ${
                    //   saveLoading
                    //     ? "unSelectedDealStageContainer"
                    //     : modelData?.dealStageId === item?.id &&
                    //       index !== stagesData.length - 1
                    //     ? "selectedDealStageContainer"
                    //     : index === stagesData.length - 1
                    //     ? ""
                    //     : "unSelectedDealStageContainer"
                    // }
                    className={`relative bg-vryno-medium-fade-blue ${
                      index === 0 ? "pl-1" : ""
                    }`}
                  >
                    <div className="relative h-[34px] w-[inherit] flex items-center">
                      <Button
                        id={`deal-stage-item-${item?.name || ""}`}
                        customStyle={`${
                          index === stagesData.length - 1
                            ? "w-full pr-1"
                            : "w-[85%]"
                        }`}
                        disabled={saveLoading}
                        userEventName={`deal-stage-item-click`}
                        renderChildrenOnly={true}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (
                            saveLoading ||
                            modelData?.dealStageId === item?.id
                          )
                            return;
                          if (item) handleStageSave(item);
                        }}
                      >
                        <span
                          className={`flex items-center justify-center py-1 px-1.5 ${
                            modelData?.dealStageId === item?.id && !saveLoading
                              ? "text-white"
                              : "text-vryno-gray-text"
                          } ${
                            modelData?.dealStageId === item?.id
                              ? "selectedDealStageContainer rounded-md"
                              : ""
                          }`}
                        >
                          {item?.dealCategory === "closed won" ? (
                            <span>
                              <ThumbUpIcon
                                size={14}
                                className="text-green-500 mr-1"
                              />
                            </span>
                          ) : item?.dealCategory === "closed lost" ? (
                            <span>
                              <ThumbDownIcon
                                size={14}
                                className="text-red-500 mr-1"
                              />
                            </span>
                          ) : (
                            <></>
                          )}
                          <p className="text-xs truncate" title={item?.name}>
                            {item?.name || ""}
                          </p>
                        </span>
                      </Button>
                      {index !== stagesData.length - 1 && (
                        <span className="w-[15%] flex justify-center">
                          <RightArrowIcon
                            className="text-vryno-gray-text"
                            size={stagesData.length <= 5 ? 30 : 20}
                          />
                        </span>
                      )}
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            <Button
              id="stage-list-right-button"
              customStyle={`bg-vryno-active-deal-blue hover:bg-vryno-theme-blue text-gray-500 hover:text-white px-1 rounded-tr-md rounded-br-md cursor-pointer h-[34px] ${
                swiperRef?.current &&
                parseInt(
                  (swiperRef?.current?.width -
                    swiperRef?.current?.translate) as any
                ) === parseInt(swiperRef?.current?.virtualSize)
                  ? "opacity-20"
                  : "opacity-60"
              }`}
              onClick={() => {
                if (
                  swiperRef?.current &&
                  parseInt(
                    (swiperRef?.current?.width -
                      swiperRef?.current?.translate) as any
                  ) === parseInt(swiperRef?.current?.virtualSize)
                )
                  return;
                swiperRef.current?.slideNext();
              }}
              userEventName="dealStage-list-move-right-click"
            >
              <RightArrowIcon size={20} />
            </Button>
          </div>
        ) : (
          <div className="flex items-center bg-vryno-light-fade-blue px-6 py-3 overflow-hidden rounded-md">
            <span className="text-vryno-gray-text">No Stages Found</span>
          </div>
        )
      ) : (
        <div className="flex items-center bg-vryno-light-fade-blue px-6 py-3 overflow-hidden rounded-md">
          <span className="text-vryno-gray-text">No Pipeline Found</span>
        </div>
      )}
    </div>
  ) : (
    <ItemsLoader currentView={"List"} loadingItemCount={0} />
  );
};
