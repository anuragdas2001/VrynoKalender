import React from "react";
import Slider from "react-slick";

export const SimpleSlider = ({
  children,
  dots = true,
  infinite = true,
  speed = 500,
  slidesToShow = 3,
  slidesToScroll = 3,
  arrows = true,
}: {
  children: any;
  dots?: boolean;
  infinite?: boolean;
  speed?: number;
  slidesToShow?: number;
  slidesToScroll?: number;
  arrows?: boolean;
}) => {
  var settings = {
    arrows: arrows,
    dots: dots,
    infinite: infinite,
    speed: speed,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToScroll,
    // initialSlide: 0,
    // responsive: [
    //   {
    //     breakpoint: 1024,
    //     settings: {
    //       slidesToShow: 3,
    //       slidesToScroll: 3,
    //       infinite: true,
    //       dots: true
    //     }
    //   },
    //   {
    //     breakpoint: 600,
    //     settings: {
    //       slidesToShow: 2,
    //       slidesToScroll: 2,
    //       initialSlide: 2
    //     }
    //   },
    //   {
    //     breakpoint: 480,
    //     settings: {
    //       slidesToShow: 1,
    //       slidesToScroll: 1
    //     }
    //   }
    // ]
  };
  return (
    <div className="block">
      <Slider {...settings}>{children}</Slider>
    </div>
  );
};
