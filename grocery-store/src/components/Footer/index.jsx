import React, { useContext } from "react";
import { LiaShippingFastSolid } from "react-icons/lia";
import { PiKeyReturn } from "react-icons/pi";
import { IoWalletOutline } from "react-icons/io5";
import { IoGiftOutline } from "react-icons/io5";
import { BiSupport } from "react-icons/bi";
import { useState } from "react";

import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { IoClose } from "react-icons/io5";
import CartPanelItem from "../CartPanelItem";

import { FiShoppingCart } from "react-icons/fi";

import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaShoppingCart,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { MyContext } from "../../App";

const FooterBoxes = [
  {
    icon: (
      <LiaShippingFastSolid className="text-[45px] group-hover:text-[#2fa22f] transition-all duration-300 group-hover:-translate-y-1" />
    ),
    title: "Free Shipping",
    description: "For all Orders Over $100",
  },
  {
    icon: (
      <PiKeyReturn className="text-[45px] group-hover:text-[#2fa22f] transition-all duration-300 group-hover:-translate-y-1" />
    ),
    title: "30 Days Returns",
    description: "For an Exchange Product",
  },
  {
    icon: (
      <IoWalletOutline className="text-[45px] group-hover:text-[#2fa22f] transition-all duration-300 group-hover:-translate-y-1" />
    ),
    title: "Secured Payment",
    description: "Payment Cards Accepted",
  },
  {
    icon: (
      <IoGiftOutline className="text-[45px] group-hover:text-[#2fa22f] transition-all duration-300 group-hover:-translate-y-1" />
    ),
    title: "Special Gifts",
    description: "Our First Product Order",
  },
  {
    icon: (
      <BiSupport className="text-[45px] group-hover:text-[#2fa22f] transition-all duration-300 group-hover:-translate-y-1" />
    ),
    title: "Support 24/7",
    description: "Contact us Anytime",
  },
];

const Footer = () => {
  const context = useContext(MyContext);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Subscribing email:", email);
    setEmail("");
  };
  return (
    <>
      <footer className="py-0 pb-12 lg:pb-0 bg-white">
        <div className="container mx-auto px-4">
          {/* Features Section */}
          <div className="w-full overflow-x-auto hide-scrollbar">
            <div className="flex flex-nowrap items-center lg:justify-center justify-start gap-6 lg:gap-10 py-9 pb-16 px-4">
              {FooterBoxes.map((box, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 flex flex-col items-center justify-center group w-[180px] text-center"
                >
                  {box.icon}
                  <h3 className="text-[16px] py-1 font-[600] text-black">
                    {box.title}
                  </h3>
                  <p className="text-[14px] font-[500] whitespace-nowrap text-black">
                    {box.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Separator */}
          <hr className="border-gray-300 mb-4" />

          {/* Main Footer Section */}
          <div className="bg-white text-black rounded-lg ">
            <div className="lg:px-6 lg:py-12 py-6 pb-6">
              {/* Main Footer Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Store Info */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <FaShoppingCart className="h-8 w-8 text-green-400" />
                      <h3 className="text-2xl font-bold text-black">Mart Ai</h3>
                    </div>
                    <p className="text-black font-[500] ">
                      Your New Futuristic grocery store providing fresh, quality
                      products for over 25 years.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link
                        to="/"
                        aria-label="Facebook"
                        className="text-black hover:text-green-500 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
                      >
                        <FaFacebookF className="h-5 w-5" />
                      </Link>
                      <Link
                        to="/"
                        aria-label="Twitter"
                        className="text-black hover:text-green-500 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
                      >
                        <FaTwitter className="h-5 w-5" />
                      </Link>
                      <Link
                        to="/"
                        aria-label="Instagram"
                        className="text-black hover:text-green-500 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
                      >
                        <FaInstagram className="h-5 w-5" />
                      </Link>
                      <Link
                        to="/"
                        aria-label="YouTube"
                        className="text-black hover:text-green-500 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
                      >
                        <FaYoutube className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>

                  {/* Shop */}
                  <div className="space-y-4 hidden lg:block">
                    <h4 className="text-lg font-semibold text-black">Shop</h4>
                    <ul className="space-y-2">
                      {[
                        "Fresh Produce",
                        "Meat & Seafood",
                        "Dairy & Eggs",
                        "Bakery",
                        "Pantry Essentials",
                        "Organic Products",
                      ].map((item) => (
                        <li key={item}>
                          <Link
                            to="/"
                            className="text-black font-[500] hover:text-green-500 transition-colors duration-200"
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                  {/* Customer Service */}
                  <div className="space-y-4">
                    <h4 className="lg:text-lg text-md  font-semibold text-black">
                      Customer Service
                    </h4>
                    <ul className="space-y-2 ">
                      {[
                        "About Us",
                        "Contact Us",
                        "Store Locations",
                        "Weekly Ads",
                        "Careers",
                        "Privacy Policy",
                      ].map((item) => (
                        <li key={item}>
                          <Link
                            to="/"
                            className="text-black font-[500] lg:text-[16px] text-[15px] hover:text-green-500 transition-colors duration-200"
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Contact & Hours */}
                  <div className="space-y-4">
                    <h4 className="text-md md:text-lg font-semibold text-black">
                      Contact & Hours
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <FaMapMarkerAlt className="h-4 w-4 md:h-5 md:w-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <div className="text-black font-[500] text-sm md:text-base">
                          <p>123 Main Street</p>
                          <p>Anytown, ST 12345</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FaPhone className="h-4 w-4 md:h-5 md:w-5 text-green-400 flex-shrink-0" />
                        <a
                          href="tel:+1234567890"
                          className="text-black font-[500] text-sm md:text-base hover:text-green-500 transition-colors duration-200"
                        >
                          (123) 456-7890
                        </a>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FaEnvelope className="h-4 w-4 md:h-5 md:w-5 text-green-400 flex-shrink-0" />
                        <a
                          href="mailto:info@freshmart.com"
                          className="text-black font-[500] text-sm md:text-base hover:text-green-500 transition-colors duration-200"
                        >
                          info@freshmart.com
                        </a>
                      </div>
                      <div className="flex items-start space-x-3">
                        <FaClock className="h-4 w-4 md:h-5 md:w-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <div className="text-black font-[500] text-xs md:text-sm">
                          <p>Mon-Sat: 7:00 AM - 10:00 PM</p>
                          <p>Sunday: 8:00 AM - 9:00 PM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Separator */}
              <div className="my-8 border-t border-gray-200"></div>

              {/* Newsletter Signup */}
              <div className="mb-8">
                <div className="max-w-xl mx-auto text-center space-y-2">
                  <h4 className="text-md md:text-lg font-semibold mb-2 text-black">
                    Stay Updated
                  </h4>
                  <p className="text-sm md:text-base  text-black font-[500] mb-4">
                    Subscribe to our newsletter for weekly deals and fresh
                    product updates
                  </p>
                  <form
                    onSubmit={handleSubscribe}
                    className="flex flex-col md:flex-row gap-2"
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-3 py-2 text-sm md:text-base rounded-md bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 md:px-6 md:py-2 bg-green-600 hover:bg-green-500 text-white rounded-md transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-white text-sm md:text-base"
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>

              {/* Bottom Separator */}
              <div className="mb-6 border-t border-gray-200"></div>

              {/* Bottom Footer */}
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="text-black font-[500] lg:text-sm text-xs">
                  <p>
                    &copy; {new Date().getFullYear()} Mart Ai Grocery Store. All
                    rights reserved.
                  </p>
                </div>
                <div className="flex space-x-6 lg:text-sm text-xs whitespace-nowrap">
                  {["Terms of Service", "Privacy Policy", "Accessibility"].map(
                    (item) => (
                      <Link
                        key={item}
                        href="#"
                        className="text-black font-[500] hover:text-green-500 transition-colors duration-200 "
                      >
                        {item}
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <Drawer
        open={context.openCartPanel}
        anchor={"right"}
        onClose={context.toggleCartDrawer(false)}
        className="CartPanel"
      >
        <div className="flex items-center justify-between py-3 px-4 gap-3 border-2 border-gray-200 ">
          <h4 className="font-[600] ">
            Shopping Cart ({context.cartData.length})
          </h4>
          <IoClose
            onClick={context.toggleCartDrawer(false)}
            className="text-[20px] cursor-pointer"
          />
        </div>
        {context.cartData.length !== 0 ? (
          <CartPanelItem />
        ) : (
          <>
            <div className="flex flex-col items-center justify-center h-full w-full text-gray-600">
              <FiShoppingCart className="text-6xl md:text-8xl text-gray-400 animate-bounce mb-4" />
              <h2 className="text-2xl md:text-3xl font-semibold mb-2">
                Your Cart is Empty
              </h2>
              <div></div>
            </div>
          </>
        )}
      </Drawer>
    </>
  );
};

export default Footer;
