import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// import required modules
import { EffectFade, Navigation, Pagination, Autoplay } from 'swiper/modules';
import Button from '@mui/material/Button';


const HomeSliderV2 = () => {
  return (
    <Swiper
        loop={true}
        spaceBetween={30}
        effect={'fade'}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[EffectFade, Navigation, Pagination,Autoplay]}
        className="homeSliderV2"
      >
        <SwiperSlide>
            <div className='w-full rounded-md overflow-hidden relative'>
          <img src="./Banner V2.jpg" />
                <div className="info absolute top-0 -right-[100%] z-50 w-[50%] h-[100%] flex-col flex items-center justify-center p-8 transition-all duration-700 opacity-0">
                    <h4 className='text-[20px] font-[600] w-full'>Big Savings Day Sale</h4>
                    <h2 className='text-[30px] font-[800] w-full'>Fresh And Organic
                        Fruits and Vegetables
                    </h2>
                    <div className='w-full mt-1'>

                    <Button className='!bg-[#22a130] !text-white'>Shop Now</Button>
                    </div>
                </div>
            </div>
        </SwiperSlide>
        <SwiperSlide>
             <div className='w-full rounded-md overflow-hidden'>
          <img src="./Banner V3.jpg" />
                     <div className="info absolute top-0 -right-[100%] z-50 w-[50%] h-[100%] flex-col flex items-center justify-center p-8 transition-all duration-700 opacity-0">
                    <h4 className='text-[20px] font-[600] w-full'>Big Savings Day Sale</h4>
                    <h2 className='text-[30px] font-[800] w-full'>Fresh And Organic
                        Fruits and Vegetables
                    </h2>
                    <div className='w-full mt-1'>

                    <Button className='!bg-[#22a130] !text-white'>Shop Now</Button>
                    </div>
                </div>
            </div>
        </SwiperSlide>
        
      </Swiper>
  )
}

export default HomeSliderV2
