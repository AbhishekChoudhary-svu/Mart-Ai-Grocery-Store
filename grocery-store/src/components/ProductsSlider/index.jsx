import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { Navigation, FreeMode } from "swiper/modules";
import ProductItem from "../ProductItem";

const ProductsSlider = (props) => {
  return (
    <div className="productslider lg:py-2">
      <Swiper
        slidesPerView={props.items}
        spaceBetween={10}
        navigation={true}
        className="ProductSliders"
        freeMode={true}
        modules={[Navigation, FreeMode]}
        breakpoints={{
          0: {
            slidesPerView: 2,
            spaceBetween: 7,
          },
          640: {
            // ≥ 640px (sm)
            slidesPerView: 3,
            spaceBetween: 7,
          },
          768: {
            // ≥ 768px (md)
            slidesPerView: 4,
            spaceBetween: 5,
          },
          1280: {
            // ≥ 1024px (lg)
            slidesPerView: 6,
          },
        }}
      >
        {props?.data?.map((item, idx) => {
          return (
            <SwiperSlide key={idx}>
              <ProductItem
                item={item}
                id={item._id}
                Brand={item.brand}
                imgItem={item.images}
                ItemName={item.name}
                Price={item.price}
                Discount={item.discount}
                oldPrice={item.oldPrice}
                Rating={item.rating}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default ProductsSlider;
