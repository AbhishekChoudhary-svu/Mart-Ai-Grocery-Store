import React from "react";
import "../ProductItem/style.css";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { BsBagHeart } from "react-icons/bs";
import { MdOutlineZoomOutMap } from "react-icons/md";
import Rating from "@mui/material/Rating";
import { FaCartPlus } from "react-icons/fa6";
import { useContext } from "react";
import { MyContext } from "../../App";
import { useState } from "react";
  


const ProductItem = (props) => {
  const context = useContext(MyContext);
    const [ quantity,setQuantity] = useState(1)
  
  
    const addToCartItem=(product,userId,quantity)=>{
      context?.addToCartItem(product,userId,quantity);
    }
     const handleToAddList=(item)=>{
    context?.handleToAddList(item);
  }

  

  return (
    <div className="productitem  items-center shadow-lg overflow-hidden rounded-lg border-1 border-gray-200  flex ">
      <div className="imgWrapper  group lg:w-[30%] w-[40%] h-[200px] lg:h-[250px] overflow-hidden rounded-l-lg relative">
         <Link to={`/product/${props.id}`}><img
          src={props.imgItem}
          alt=""
          className="w-full h-full  object-cover group-hover:scale-110 transition-all duration-300"
        /></Link>
        <span className="absolute z-40 left-[10px] top-[10px] py-0 rounded-sm bg-[#2fa22f] text-white p-2 text-[12px] font-[500]">
          -{props.Discount}%
        </span>

        <div className="actions opacity-0 group-hover:opacity-100 transition-all duration-500 absolute top-[10px] right-[5px] flex items-center gap-3 z-50 w-[50px] flex-col">
          <Button onClick={()=>handleToAddList(props.item)} 
           className="!w-[30px] !h-[30px] !min-w-[30px] !bg-[#f0ededde] !text-black hover:!bg-[#2fa22f] hover:!text-white !rounded-full">
            <BsBagHeart />
          </Button>
          <Button className="!w-[30px] !h-[30px] !min-w-[30px] !bg-[#f0ededde] !text-black hover:!bg-[#2fa22f] hover:!text-white !rounded-full">
            <MdOutlineZoomOutMap />
          </Button>
        </div>
      </div>
      <div className="info lg:w-[100%] w-[60%] px-4 p-3 py-4 bg-[#f4f3f3bc] flex flex-col justify-between flex-grow">
        <h6 className="text-[13px] ">
          <Link to={`/product/${props.id}`}className="link transition-all">
            {props.Brand}
          </Link>
        </h6>
        <h3 className="text-[15px] title mt-2 font-[500] ">
          <Link to={`/product/${props.id}`}className="link transition-all">
           {props.ItemName}
          </Link>
        </h3>

        <p className="text-[13px] my-1 clamp-2-lines lg:clamp-none">{context.windowWidth <992 ? props.Description.substring(0, 80) + "..." : props.Description}</p>
         <Rating
          name="half-rating-read"
          value={props.Rating}
          precision={0.5}
          readOnly
        />
        <div className="flex items-center gap-3  mt-2">
          <span className="price text-[16px] font-[700] text-[#2fa22f]">
           <span className="price text-[16px] font-[500] text-[#2fa22f]" >MRP :</span> ₹{props.Price}
          </span>
          <span className="oldPrice line-through text-[16px] font-[400] text-[gray]">
            ₹{props.oldPrice}
          </span>
         
        </div>
          <div className="buttonCart flex w-full mt-2">
          <button
          onClick={()=>addToCartItem(props.item,context?.userData?._id,quantity)}
            className=" 
              flex items-center  gap-3
              bg-gradient-to-r from-[#28a745] to-[#218838]
              hover:from-[#1e7e34] hover:to-[#1c7430]
              text-white font-semibold
              px-7  py-2  rounded-md
              shadow-md hover:shadow-lg
              transform hover:scale-105 text-[15px]
              transition duration-200 ease-in-out
            " 
          >
            <FaCartPlus className="w-3 h-3 xl:w-5 xl:h-5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]" />
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
