import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import required modules
import { Navigation, Autoplay } from "swiper/modules";

const HomeSlider = (props) => {
  return (
    <div className="homeSlider py-4 pb-2">
      <div className="container">
        <Swiper
          loop={true}
          spaceBetween={20}
          navigation={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[Navigation, Autoplay]}
          className="SliderHome"
        >
          {props.data.map((slide, idx) => {
            return (
              <SwiperSlide key={idx}>
                <div className="item rounded-2xl max-h-[500px]  overflow-hidden ">
                  <img src={slide.images} alt="" className="w-full h-full object-contain" />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeSlider;
