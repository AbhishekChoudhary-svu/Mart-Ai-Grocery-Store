import React from "react";
import "../BannerBoxV2/style.css";
import { Link } from "react-router-dom";

const BannerBoxV2 = (props) => {
  return (
    <div className="bannerboxV2 w-full rounded-md overflow-hidden group relative ">
      <img
        src={props.imgItem}
        alt=""
        className=" group-hover:scale-105 overflow-hidden w-full transition-all duration-200"
      />
             <div className="info absolute top-0 right-0 z-50 w-[60%] h-[100%] flex-col flex items-center justify-center pl-8  ">
                    <h4 className='text-white text-[15px] font-[600] w-full '>Sale Live..</h4>
                    <h2 className='text-white text-[22px] font-[800] w-full '>Fresh 
                        Fruits
                    </h2>
                    <div className='w-full mt-1'>

                    <Link className=' text-white group-hover:underline group-hover:text-[#2fa22f]'>Shop Now</Link>
                    </div>
                </div>

    </div>
  );
};

export default BannerBoxV2;
