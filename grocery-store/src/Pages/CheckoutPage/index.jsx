import React, { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import AddAddressForm from "../../components/AddAddressForm";
import { MyContext } from "../../App";
import { deleteData, fetchDataFromApi, postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const VITE_APP_RAZERPAY_KEY_ID = import.meta.env.VITE_APP_RAZERPAY_KEY_ID;
const VITE_APP_RAZERPAY_KEY_SECRET = import.meta.env
  .VITE_APP_RAZERPAY_KEY_SECRET;

const CheckoutPage = () => {
  const context = useContext(MyContext);
  const history = useNavigate();
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedAddress, setSelectedAddress] = useState([]);

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    context.getCartItemData();
  }, []);
  useEffect(() => {}, [selectedAddress]);

  const total = context.cartData.reduce(
    (acc, item) => acc + (item.productId.price || 0) * (item.quantity || 1),
    0
  );

  useEffect(() => {
    if (total !== 0) {
      setDeliveryCharge(40);
    } else {
      setDeliveryCharge(0);
    }
  }, [total]);

  const gstRate = 0.18;
  const gstAmount = total * gstRate;
  const totalItemPrice = total + deliveryCharge + gstAmount;

  const checkout = (e) => {
    e.preventDefault();
    if (context.userData.address_details.length ===0) {
    context.openAlertBox("error", "Please add and select an address first");
    return;
  }
   
      if (paymentMethod === "credit-card") {
      context.openAlertBox(
        "error",
        "Please select Other as payment method to continue."
      );
      return;
    }
    if (paymentMethod === "cash") {
      const user = context.userData;

      const payload = {
        userId: user._id,
        products: context.cartData,
        paymentId: "",
        paymentStatus: "Cash On Delivery",
        deliveryAddress: selectedAddress._id,
        totalAMT: totalItemPrice,
        date: new Date().toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      };

      postData(`/api/order/create`, payload).then((res) => {
        context.openAlertBox("success", res.message);
        if (res.success === true) {
          setIsPlacingOrder(true); // start animation
          setTimeout(() => {
            setOrderPlaced(true); // show success
          }, 1500); // after car finishes moving
          setTimeout(() => {
            deleteData(`/api/cart/emptyCart/${user._id}`).then(() => {
              context.getCartItemData();
            });
            history("/"); // navigate after showing success
          }, 3000);
        } else {
          context.openAlertBox("error", res.message);
        }
      });
    }
    if (paymentMethod === "razorpay") {
      var option = {
        key: VITE_APP_RAZERPAY_KEY_ID,
        secret: VITE_APP_RAZERPAY_KEY_SECRET,
        amount: totalItemPrice * 100,
        currency: "INR",
        order_receipt: context.userData.name,
        name: "Mart Ai Grocery Store",
        description: "Testing Purpose",
        handler: async function (response) {
          const paymentId = response.razorpay_payment_id;
          const user = context.userData;

          const payload = {
            userId: user._id,
            products: context.cartData,
            paymentId: paymentId,
            paymentStatus: "Completed",
            deliveryAddress: selectedAddress._id,
            totalAMT: totalItemPrice,
            date: new Date().toLocaleString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            }),
          };

          postData(`/api/order/create`, payload).then((res) => {
            context.openAlertBox("success", res.message);
            if (res.success === true) {
              deleteData(`/api/cart/emptyCart/${user._id}`).then(() => {
                context.getCartItemData();
              });
              history("/");
            } else {
              context.openAlertBox("error", res.message);
            }
          });
        },
        theme: {
          color: "#00A63E",
        },
      };

      var pay = new window.Razorpay(option);
      pay.open();
    }

  };

  return (
    <section className="py-6">
      <form onSubmit={checkout}>
        <div className="container flex flex-col lg:flex-row gap-4">
           <div className="LeftSec w-full lg:w-[30%]">
            <div className="lg:col-span-1">
              <div className="bg-white  rounded-lg shadow-md border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold flex items-center text-gray-800">
                    <svg
                      className="mr-2 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    Order Summary
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    7 items in your cart
                  </p>
                </div>
                <div className="p-6 space-y-4 ">
                  <div className="scroll overflow-y-scroll px-5 max-h-[382px] overflow-x-hidden space-y-4">
                    {context.cartData.length !== 0 &&
                      context.cartData.map((item, idx) => {
                        return (
                          <div
                            key={idx}
                            className="CheckoutItem flex items-center space-x-4"
                          >
                            <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                              <img
                                src={item.image}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-sm font-medium text-gray-800">
                                {item.productName.substr(0, 40)}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="text-sm font-medium text-gray-800">
                              ₹{item.subTotal}
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  <hr className="my-4 border-gray-200" />

                  <div className="space-y-2 font-[500]">
                    <div className="flex justify-between text-sm text-gray-900">
                      <span>Subtotal</span>
                      <span>₹{total}.00</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-900">
                      <span>Tax 18% GST</span>
                      <span>₹{gstAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-900">
                      <span>Delivery</span>
                      <span>₹{deliveryCharge}.00</span>
                    </div>
                    <hr className="my-2 border-gray-200" />
                    <div className="flex justify-between font-semibold text-lg text-gray-800">
                      <span>Total</span>
                      <span>₹{totalItemPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="RightSec w-full lg:w-[70%] space-y-2">
            <AddAddressForm
              showDelete={false}
              selectedAddress={selectedAddress}
              setSelectedAddress={setSelectedAddress}
            />

            <div className="paymentMethod bg-white rounded-lg shadow-md border border-gray-200 mb-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold flex items-center text-gray-800">
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  Payment Method
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {/* Credit / Debit Card */}
                  <div className="flex items-center justify-between border rounded-md p-3 hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="credit-card"
                        name="paymentMethod"
                        value="credit-card"
                        checked={paymentMethod === "credit-card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <label
                        htmlFor="credit-card"
                        className="cursor-pointer text-sm font-medium text-gray-700"
                      >
                        Credit / Debit Card
                      </label>
                    </div>
                    <div className="flex space-x-1">
                      <img
                        src="/card1.png"
                        alt="Visa"
                        className="h-10 w-auto"
                      />
                      <img
                        src="/visa.png"
                        alt="Mastercard"
                        className="h-10 w-auto"
                      />
                      <img
                        src="/visa2.png"
                        alt="Mastercard"
                        className="h-10 w-auto"
                      />
                    </div>
                  </div>

                  {/* Razorpay */}
                  <div className="flex items-center justify-between border rounded-md p-3 hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="razorpay"
                        name="paymentMethod"
                        value="razorpay"
                        checked={paymentMethod === "razorpay"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <label
                        htmlFor="razorpay"
                        className="cursor-pointer text-sm font-medium text-gray-700"
                      >
                        Razorpay
                      </label>
                    </div>
                    <img
                      src="/razor.png"
                      alt="Razorpay"
                      className="h-8 w-auto"
                    />
                  </div>

                  {/* Cash */}
                  {/* Cash */}
                  <div className="flex items-center justify-between border rounded-md p-3 hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="cash"
                        name="paymentMethod"
                        value="cash"
                        checked={paymentMethod === "cash"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <label
                        htmlFor="cash"
                        className="cursor-pointer text-sm font-medium text-gray-700"
                      >
                        Cash on Delivery
                      </label>
                    </div>

                    <img src="/cash.png" alt="Cash" className="h-10 w-auto" />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col space-y-4">
              <motion.button
                type="submit"
                disabled={!paymentMethod || isPlacingOrder}
                onClick={(e) => {
                  e.preventDefault();
                  checkout(e);
                }}
                className="relative overflow-hidden bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200 text-lg disabled:opacity-50 flex items-center justify-center"
              >
                <AnimatePresence mode="wait">
                  {!orderPlaced ? (
                    <motion.div
                      key="moving-car"
                      className="flex items-center justify-center w-full relative"
                    >
                      {isPlacingOrder ? (
                        <motion.img
                          src="/cash.png" // use your COD car icon
                          alt="Car"
                          initial={{ x: "-1300%" }}
                          animate={{ x: "1300%" }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                          className="h-8 w-auto"
                        />
                      ) : (
                        <span>Place Order ₹{totalItemPrice}</span>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="order-placed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center space-x-2"
                    >
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm">Order Placed!</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              <p className="text-sm text-center text-gray-500">
                By placing your order, you agree to our Terms of Service and
                Privacy Policy
              </p>
            </div>
          </div>
         
        </div>
      </form>
    </section>
  );
};

export default CheckoutPage;
