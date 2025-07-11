import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { FaBoxes } from "react-icons/fa";
import { IoStatsChartSharp } from "react-icons/io5";
import { BsPieChartFill } from "react-icons/bs";
import { SiBitcoincash } from "react-icons/si";
import { FaWarehouse } from "react-icons/fa6";
import { MyContext } from "../../App";
import { useContext } from "react";






const DashboardBoxes = ({productData,orderData,userData,salesData}) => {
  const context = useContext(MyContext)
  return (
    <>
    <Swiper
  slidesPerView={1}           // default for very small screens
  spaceBetween={15}
  navigation={true}
  modules={[Navigation]}
  breakpoints={{
    640: {    // ≥ 640px (sm)
      slidesPerView: 2,
    },
    768: {    // ≥ 768px (md)
      slidesPerView: 3,
    },
    1024: {   // ≥ 1024px (lg)
      slidesPerView: 4,
    },
  }}
  className="dashboardBoxSlider mb-4"
>
  {productData.length !== 0 && (
    <SwiperSlide>
      <div className="box bg-white p-5 py-6 cursor-pointer hover:bg-gray-50 rounded-md border border-[#f1f1f1] shadow-md flex items-center gap-4">
        <FaWarehouse className="text-[30px] text-red-500"/>
        <div className="info w-[70%]">
          <h3 className="text-[16px] font-[600] text-gray-800">Total Products</h3>
          <b className="text-[20px] font-sans leading-none">{productData.length}</b>
        </div>
        <IoStatsChartSharp className="text-[55px] text-red-500"/>
      </div>
    </SwiperSlide>
  )}
  {orderData.length !== 0 && (
    <SwiperSlide>
      <div className="box bg-white p-5 py-6 cursor-pointer hover:bg-gray-50 rounded-md border border-[#f1f1f1] shadow-md flex items-center gap-4">
        <FaBoxes className="text-[30px] text-blue-500"/>
        <div className="info w-[70%]">
          <h3 className="text-[16px] font-[600] text-gray-800">Total Orders</h3>
          <b className="text-[20px] font-sans leading-none">{orderData.length}</b>
        </div>
        <IoStatsChartSharp className="text-[55px] text-blue-500"/>
      </div>
    </SwiperSlide>
  )}
  {userData.length !== 0 && (
    <SwiperSlide>
      <div className="box bg-white p-5 py-6 cursor-pointer hover:bg-gray-50 rounded-md border border-[#f1f1f1] shadow-md flex items-center gap-4">
        <BsPieChartFill className="text-[30px] text-green-500"/>
        <div className="info w-[70%]">
          <h3 className="text-[16px] font-[600] text-gray-800">Total Users</h3>
          <b className="text-[20px] font-sans leading-none">{userData.length}</b>
        </div>
        <IoStatsChartSharp className="text-[55px] text-green-500"/>
      </div>
    </SwiperSlide>
  )}
  <SwiperSlide>
    <div className="box bg-white p-5 py-6 cursor-pointer hover:bg-gray-50 rounded-md border border-[#f1f1f1] shadow-md flex items-center gap-4">
      <SiBitcoincash className="text-[30px] text-purple-500"/>
      <div className="info w-[70%]">
        <h3 className="text-[16px] font-[600] text-gray-800">Revenue</h3>
        <b className="text-[20px] font-sans leading-none">₹{salesData}</b>
      </div>
      <IoStatsChartSharp className="text-[55px] text-purple-500"/>
    </div>
  </SwiperSlide>
</Swiper>

    </>
  );
};

export default DashboardBoxes;
