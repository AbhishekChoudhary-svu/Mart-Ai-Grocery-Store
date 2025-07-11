import "./App.css";
import "./Responsive.css";
import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import Header from "./components/Header";
import Home from "./Pages/Home";
import Footer from "./components/Footer";
import ProductListing from "./Pages/ProductListing";
import ProductDetails from "./Pages/ProductDetails";
import LoginAuth from "./Pages/LoginAuth";

import CartPage from "./Pages/CartPage";
import CheckoutPage from "./Pages/CheckoutPage";
import MyAccount from "./Pages/MyAccount";
import WishListPage from "./Pages/WishListPage";
import SettingPage from "./Pages/SettingPage";
import OrderPage from "./Pages/OrderPage";
import Register from "./Pages/Register";
import EmailVerification from "./Pages/EmailVerification";
import ResetPass from "./Pages/ResetPass";
import toast, { Toaster } from "react-hot-toast";
import { fetchDataFromApi, postData } from "./utils/api";
import SearchPage from "./Pages/SearchPage";



export const MyContext = createContext();

const Layout = () => (
  <>
    <Header />
    <Outlet />         {/* renders the active route page */}
    <Footer />
         {/* fixed bottom nav */}
  </>
);



function App() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [openCartPanel, setOpenCartPanel] = useState(false);
  const [openAddressPanel, setOpenAddressPanel] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);
   const [catData, setCatData] = useState([]);
   const [cartData, setCartData] = useState([]);
   const [listData, setListData] = useState([]);
   const [searchData, setSearchData] = useState([]);
   const [windowWidth, setWindowWidth]= useState(window.innerWidth)
   const [openFilters, setOpenFilters]= useState(false)
   const [openSearch, setOpenSearch]= useState(false)
   

  const toggleCartDrawer = (newOpen) => () => {
    setOpenCartPanel(newOpen);
  };
  const toggleAddressDrawer = (newOpen) => () => {
    setOpenAddressPanel(newOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token !== undefined && token !== null && token !== "") {
      setIsLogin(true);
      fetchDataFromApi(`/api/user/user-details`,).then((res) => {
        setUserData(res.data);
        
          if (res?.response?.data?.message === "Invalid Login.") {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            openAlertBox("error", "Session Expired ! Login Again");
            window.location.href="/login"
            setIsLogin(false);
          }       
      });
      getCartItemData();
      getMyListItemData();
    } else {
      setIsLogin(false);
    }
  }, [isLogin]);
  
    useEffect(() => {
      fetchDataFromApi("/api/category/").then((res) => {
        setCatData(res?.categories);
      }); 

      const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
    }, []);

  const openAlertBox = (type, status) => {
    console.log(status);
    if (type === "success") {
      toast.success(status);
    }
    if (type === "error") {
      toast.error(status);
    }
  };


  const addToCartItem =(product,userId,quantity)=>{
    if(userId===undefined){
       openAlertBox("error", "Login First");
      return false;
    }

    postData("/api/cart/add",{
      productId:product?._id,
      quantity:quantity

    }).then((res)=>{
      if(res.success===true){
        openAlertBox("success",res.message)
        getCartItemData();
      }
    })

  }
  const handleToAddList =(item)=>{
    if(userData._id===undefined){
       openAlertBox("error", "Login First");
      return false;
    }

    postData("/api/mylist/add",{
      productId:item?._id,

    }).then((res)=>{
      if(res.success===true){
        openAlertBox("success",res.message)
        getMyListItemData();
      }else{
        openAlertBox("error",res.message)

      }
    })

  }

  const getCartItemData =()=>{
      fetchDataFromApi("/api/cart/getCartItems").then((res)=>{
          setCartData(res?.data)
      })
  }
  const getMyListItemData =()=>{
      fetchDataFromApi("/api/mylist/getMyList").then((res)=>{
          setListData(res)
      })
  }


  const values = {
    setOpenCartPanel,
    openCartPanel,
    toggleCartDrawer,
    openAddressPanel,
    setOpenAddressPanel,
    toggleAddressDrawer,
    isLogin,
    setIsLogin,
    apiUrl,
    openAlertBox,
    userData,
    setUserData,
    catData,
    setCatData,
    addToCartItem,
    cartData, 
    setCartData,
    getCartItemData,
    getMyListItemData,
    handleToAddList,
    listData,    
    setListData,
    searchData,
    setSearchData,
    windowWidth,
    openFilters,
    setOpenFilters,
    openSearch,
    setOpenSearch

  };

  return (
    <>
      <BrowserRouter>
        <MyContext.Provider value={values}>
           
        <Routes>
  <Route element={<Layout />}>
    <Route path="/" element={<Home />} />
    <Route path="/products" element={<ProductListing />} />
    <Route path="/product/:id" element={<ProductDetails />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/checkout" element={<CheckoutPage />} />
    <Route path="/myaccount" element={<MyAccount />} />
    <Route path="/orders" element={<OrderPage />} />
    <Route path="/wishlist" element={<WishListPage />} />
    <Route path="/search" element={<SearchPage />} />
    <Route path="/account/settings" element={<SettingPage />} />
  </Route>

  {/* Auth and special pages without nav/header/footer */}
  <Route path="/login" element={<LoginAuth />} />
  <Route path="/register" element={<Register />} />
  <Route path="/reset-password" element={<ResetPass />} />
  <Route path="/email-verify" element={<EmailVerification />} />
</Routes>


         
          
        </MyContext.Provider>
      </BrowserRouter>
      <Toaster />
      
    </>
  );




  
}

export default App;
