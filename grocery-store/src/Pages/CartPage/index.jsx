import React, { useState } from "react";
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Heart,
  Clock,
  Tag,
  Search,
  Filter,
  Star,
  Gift,
  Truck,
  MapPin,
  X,
  AlertCircle,
  ShoppingCart,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { MyContext } from "../../App";
import { deleteData, editData } from "../../utils/api";
import { useEffect } from "react";
import Rating from "@mui/material/Rating";

const CartPage = () => {
  const context = useContext(MyContext);
  const history = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const ChangeQuantity = (action, item) => {
    const nextQty = action === "plus" ? item.quantity + 1 : item.quantity - 1;

    if (nextQty > 0) {
      editData("/api/cart/update-qty", {
        cartProductId: item._id,
        quantity: nextQty,
      }).then(() => {
        context.getCartItemData();
        context.openAlertBox("success", "Quantity updated");
      });
    }
  };

  const removeItem = (id) => {
    deleteData(`/api/cart/deleteCartItems/${id}`).then((res) => {
      context.openAlertBox("success", res.data.message);
      context.getCartItemData();
    });
  };

  const total = context.cartData.reduce(
    (acc, item) => acc + (item.productId.price || 0) * (item.quantity || 1),
    0
  );

  const [deliveryCharge, setDeliveryCharge] = useState(0);

  useEffect(() => {
    if (total !== 0) {
      setDeliveryCharge(40);
    } else {
      setDeliveryCharge(0);
    }
  }, [total]);

  const totalItemPrice = total + deliveryCharge;
  return (
    <section className="py-3 CartSection pb-6">
      <div className="container flex flex-col lg:flex-row w-[90%] max-w-[90%] gap-4">
        {/* Left Section */}
        <div className="leftSecCart w-full rounded-lg bg-white lg:w-[70%]">
          <h3 className="font-[600] p-5 pb-0  text-[24px] sm:text-[26px] md:text-[28px] lg:text-[30px]">
            Your Cart
          </h3>
          <p className="mb-2 font-[600]  p-5 pt-0  text-[14px] sm:text-[15px] md:text-[16px]">
            There are{" "}
            <span className="text-[#2fa22f] font-[600]">
              {context.cartData.length}
            </span>{" "}
            products in Your Cart
          </p>

          <div className="bg-white rounded-md max-h-[450px] overflow-y-scroll overflow-x-hidden">
            {context.cartData.length !== 0 ? (
              context.cartData.map((item, idx) => (
                <div
                  key={idx}
                  className="CartItem1 p-2 w-full flex gap-3 sm:gap-4 lg:max-h-[150px] border-b border-gray-200"
                >
                  <div className="img w-[25%] sm:w-[20%] md:w-[15%] rounded-lg overflow-hidden">
                    <Link
                      to={`/product/${item.productId._id}`}
                      className="group block w-full h-full"
                    >
                      <img
                        src={item.image}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-all"
                      />
                    </Link>
                  </div>
                  <div className="info w-[75%] sm:w-[80%] md:w-[85%] space-y-1 relative">
                    
                    <h3 className="text-[12px] sm:text-[16px] font-[600] link">
                      <Link to={`/product/${item.productId._id}`}>
                        {item.productName}
                      </Link>
                    </h3>
                    <Rating
                      name="rating"
                      size={context.windowWidth < 768 ? "small" : "" }
                      value={Number(item.productId.rating)}
                      precision={0.5}
                      readOnly
                    />
                    <div className="flex items-center gap-2 sm:gap-3 font-semibold">
                      <span className="text-[13px] sm:text-[14px]">Qty:</span>
                      <div className="flex space-x-1 sm:space-x-2">
                        <button
                          className="p-1 hover:bg-gray-100 rounded-full transition"
                          onClick={() => ChangeQuantity("minus", item)}
                          disabled={item.quantity === 1}
                        >
                          <Minus className="lg:w-4 w-2 lg:h-4 h-2" />
                        </button>
                        <span className="lg:px-2 lg:py-1 pt-1 text-[10px] bg-gray-100 rounded-sm text-center min-w-[20px]">
                          {item.quantity}
                        </span>
                        <button
                          className="p-1 hover:bg-gray-100 rounded-full transition"
                          onClick={() => ChangeQuantity("plus", item)}
                        >
                          <Plus className="lg:w-4 w-2 lg:h-4 h-2" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
                      <span className="price text-[10px] sm:text-[15px] font-[700]">
                        Price : ₹{item.productId.price}
                      </span>
                      <span className="line-through text-gray-300 text-[10px] sm:text-[15px] font-[700]">
                        ₹{item.productId.oldPrice}
                      </span>
                      <span className="text-[10px] sm:text-[15px] font-[700] text-[#2fa22f]">
                        {item.productId.discount}% OFF
                      </span>
                    </div>
                    <button
                      className="p-2 absolute top-[35%] right-0 text-red-500 hover:bg-red-50 rounded-full transition"
                      onClick={() => removeItem(item._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center min-h-[300px] justify-center h-full w-full text-gray-600">
                <FiShoppingCart className="text-5xl sm:text-6xl md:text-8xl text-gray-400 animate-bounce mb-4" />
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2">
                  Your Cart is Empty
                </h2>
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="rightSecCart w-full lg:w-[30%] space-y-3">
          {/* Delivery Information */}
          <div className="bg-white shadow-md rounded-md p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-[#2fa22f]" />
              <h4 className="font-[600] text-[16px] sm:text-[18px]">
                Delivery Information
              </h4>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-[13px] sm:text-[14px]">
                  Estimated Delivery: 2-3 days
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-[13px] sm:text-[14px]">
                  Deliver to: 110001
                </span>
              </div>
              <div className="bg-green-50 p-2 sm:p-3 rounded-md">
                <p className="text-[11px] sm:text-[12px] text-[#2fa22f] font-[500]">
                  ✓ Free delivery on orders above ₹500
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white shadow-md rounded-md p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#2fa22f]" />
              <h4 className="font-[600] text-[16px] sm:text-[18px]">
                Order Summary
              </h4>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[13px] sm:text-[14px]">
                  Subtotal ({context.cartData.length} items)
                </span>
                <span className="text-[13px] sm:text-[14px] font-[600]">
                  ₹{total}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[13px] sm:text-[14px]">
                  Delivery Charges
                </span>
                <span className="text-[13px] sm:text-[14px] font-[600]">
                  ₹{deliveryCharge}
                </span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between items-center">
                <span className="text-[14px] sm:text-[16px] font-[600]">
                  Total Amount
                </span>
                <span className="text-[16px] sm:text-[18px] font-[700] text-[#2fa22f]">
                  ₹{totalItemPrice}
                </span>
              </div>
              <div className="bg-blue-50 p-2 sm:p-3 rounded-md">
                <p className="text-[11px] sm:text-[12px] text-blue-600 font-medium">
                  💰 You will save ₹{deliveryCharge} on this order <br /> 💰 Add
                  more ₹{500 - total} items
                </p>
              </div>
            </div>
            <button
              onClick={() => history("/checkout")}
              className="w-full mt-3 sm:mt-4 bg-[#2fa22f] text-white py-2.5 sm:py-3 rounded-md font-[600] text-[14px] sm:text-[16px] hover:bg-[#268a26] transition flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              Proceed to Checkout
            </button>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 rounded-md p-2 sm:p-3">
            <div className="flex items-center gap-2 text-gray-600">
              <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-[11px] sm:text-[12px]">
                Prices are inclusive of all taxes
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
