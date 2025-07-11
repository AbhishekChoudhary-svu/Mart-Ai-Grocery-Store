import React, { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { Navigation, FreeMode } from "swiper/modules";
import { Link } from "react-router-dom";
import { MyContext } from "../../App";

const HomeCatSlider = () => {
  const context = useContext(MyContext);
  return (
    <div className="homeCatSlider  lg:py-4 py-2">
      <div className="container ">
        <Swiper
          spaceBetween={10}
          navigation={true}
          freeMode={true}
          modules={[Navigation, FreeMode]}
          className="CatSlider"
          breakpoints={{
            0:{
                slidesPerView: 3,
                spaceBetween:7
            },
            640: {    // ≥ 640px (sm)
      slidesPerView: 3,
      spaceBetween:7
    },
    768: {    // ≥ 768px (md)
      slidesPerView: 4,
      spaceBetween:5
    },
    1280: {   // ≥ 1024px (lg)
      slidesPerView: 7,
      
    },
          }}
        >
          {context?.catData?.length !== 0 &&
            context?.catData?.map((cat, idx) => {
              return (
                <SwiperSlide key={idx}>
                  <Link to={`/products?catId=${cat._id}`}>
                    <div className="item bg-[#e2dede] h-[120px] sm:h-[200px] md:h-[220px] lg:h-[220px]  rounded-lg text-center flex flex-col items-center justify-center">
                      <div className="imge w-[70px] h-[70px] sm:w-[120px] sm:h-[120px] md:w-[140px] md:h-[140px] lg:w-[150px] lg:h-[150px] rounded-full overflow-hidden">
                        <img
                          src={cat.images}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-[600] mt-3 whitespace-nowrap text-[9px] sm:text-[14px] md:text-[15px]">
                        {cat.name}
                      </h3>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeCatSlider;
