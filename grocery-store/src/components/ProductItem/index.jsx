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
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { useEffect } from "react";
import { deleteData, editData } from "../../utils/api";

const ProductItem = (props) => {
  const context = useContext(MyContext);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const [item, setItem] = useState(null);

  useEffect(() => {
    const found = context.cartData.find(
      (cartItem) =>
        cartItem.productId === props.id || cartItem.productId?._id === props.id
    );

    setItem(found);
    setAdded(!!found);
    setQuantity(found?.quantity || 1);
  }, [context.cartData, props.id]);

  const ChangeQuantity = (action) => {
    if (!item) return; // safety

    if (action === "plus") {
      const nextQty = quantity + 1;
      setQuantity(nextQty);

      const data = {
        cartProductId: item._id,
        quantity: nextQty,
      };
      editData(`/api/cart/update-qty`, data).then((res) => {
        context.openAlertBox("success", `Updated Cart Successfull`);
      });
    }

    if (action === "minus") {
      const nextQty = quantity - 1;
      if (nextQty > 0) {
        setQuantity(nextQty);

        const data = {
          cartProductId: item._id,
          quantity: nextQty,
        };
        editData(`/api/cart/update-qty`, data).then((res) => {
          context.openAlertBox("success", `Updated Cart Successfull`);
        });
      } else {
        deleteData(`/api/cart/deleteCartItems/${item._id}`).then((res) => {
          context.openAlertBox("success", res.data.message);
          context.getCartItemData();
          setAdded(false);
        });
        setQuantity(1);
      }
    }
  };

  const addToCartItem = (product, userId, quantity) => {
    context?.addToCartItem(product, userId, quantity);
    setAdded(true);
  };
  const handleToAddList = (item) => {
    context?.handleToAddList(item);
  };

  return (
    <div className="productitem shadow-lg overflow-hidden rounded-lg border-2 border-gray-200 lg:h-[400px] h-[350px] flex flex-col">
      <div className="imgWrapper group w-[100%] h-[280px] overflow-hidden rounded-t-lg relative">
        <Link to={`/product/${props.id}`}>
          <img
            src={props.imgItem}
            alt=""
            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
          />
        </Link>
        <span className="absolute z-40 left-[10px] top-[10px] py-0 rounded-sm bg-[#2fa22f] text-white p-2 text-[12px] font-[500]">
          -{props.Discount}%
        </span>

        <div className="actions opacity-0 group-hover:opacity-100 transition-all duration-500 absolute top-[10px] right-[5px] flex items-center gap-3 z-50 w-[50px] flex-col">
          <Button
            onClick={() => handleToAddList(props.item)}
            className="!w-[30px] !h-[30px] !min-w-[30px] !bg-[#f0ededde] !text-black hover:!bg-[#2fa22f] hover:!text-white !rounded-full"
          >
            <BsBagHeart />
          </Button>
          <Button className="!w-[30px] !h-[30px] !min-w-[30px] !bg-[#f0ededde] !text-black hover:!bg-[#2fa22f] hover:!text-white !rounded-full">
            <MdOutlineZoomOutMap />
          </Button>
        </div>
      </div>
      <div className="info p-3 lg:py-4 py-2 lg:pb-3 bg-[#f8f4f4] flex flex-col justify-between flex-grow">
        <h6 className="lg:text-[13px] text-[10px] font-[500]">
          <Link className="link transition-all">{props.Brand}</Link>
        </h6>
        <h3 className="lg:text-[15px] text-[12px] title lg:my-1 font-[500] min-h-[40px] max-h-[40px] overflow-hidden">
          <Link to={`/product/${props.id}`} className="link transition-all">
            {props.ItemName}
          </Link>
        </h3>
        <Rating
          name="rating"
          size={context.windowWidth < 992 ? "small" : ""}
          value={props.Rating}
          precision={0.5}
          readOnly
        />
        <div className="flex items-center lg:text-[16px] text-[12px] gap-3  mt-1">
          <span className="price font-[700] text-[#2fa22f]">
            <span className="price  font-[500] text-[#2fa22f]">MRP :</span> ₹
            {props.Price}
          </span>
          <span className="oldPrice line-through  font-[400] text-[gray]">
            ₹{props.oldPrice}
          </span>
        </div>
        {added === true ? (
          <div className="buttonCart py-1 sm:py-1 flex items-center bg-gray-100 border border-[rgba(0,0,0,0.1)] rounded-sm justify-between mt-2">
            <Button
              onClick={() => ChangeQuantity("minus", props.id)}
              disabled={quantity === 0}
              size="small"
              className="
                !bg-gray-400 !text-white
                !p-1 sm:!p-2
                !min-w-[28px] sm:!min-w-[30px]
                !h-[28px] sm:!h-[30px]
                !rounded
              "
            >
              <FaMinus className="text-[10px] sm:text-[12px]" />
            </Button>
            <span className="text-xs sm:text-sm">{quantity}</span>
            <Button
              onClick={() => ChangeQuantity("plus")}
              size="small"
              className="
              !bg-green-500 !text-white
              !p-1 sm:!p-2
              !min-w-[28px] sm:!min-w-[30px]
              !h-[28px] sm:!h-[30px]
              !rounded
            "
            >
              <FaPlus className="text-[10px] sm:text-[12px]" />
            </Button>
          </div>
        ) : (
          <div className="buttonCart flex items-center justify-center mt-1 lg:mt-2">
            <button
              onClick={() =>
                addToCartItem(props.item, context?.userData?._id, quantity)
              }
              className=" w-full
                flex items-center justify-center gap-3
                bg-[#f8f4f4]
                border-2 border-green-600
                hover:from-[#1e7e34] hover:to-[#1c7430]
                text-[#28a745] font-semibold
                xl:px-7 px-3 xl:py-2 py-1 rounded-md  
                shadow-md hover:shadow-lg
                transform hover:scale-105 text-[12px] xl:text-[15px]
                transition duration-200 ease-in-out
              "
            >
              <FaCartPlus className="w-3 h-3 xl:w-5 xl:h-5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]" />
              Add To Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductItem;
