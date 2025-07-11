import React, { useContext, useEffect } from "react";
import { useState } from "react";
import {
  User,
  CloudUpload,
  ShoppingBag,
  Heart,
  Settings,
  CreditCard,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import CircularProgress from '@mui/material/CircularProgress';
import { fetchDataFromApi, uploadAvatarImage } from "../../utils/api";
import { useLocation } from "react-router-dom";


const LeftSideBarMenu = () => {
  const context = useContext(MyContext);
  

  const location = useLocation();

const isActive = (path) => location.pathname === path;
const history = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token === null || token === "" || token === undefined) {
      history("/login"); 
    }
  }, []);  

  const [preview ,setPreview]=useState([])
  const [uploading ,setUploading]=useState(false)
  useEffect(()=>{
    const userAvatar=[]
    userAvatar.push(context?.userData?.avatar)
    setPreview(userAvatar)

  },[context?.userData])

  let selectedImages = []
 
  const formdata = new FormData();

  const onChangeFile = async (e , apiEndPoints)=>{
    try {
      setPreview([])
      const files = e.target.files;
      setUploading(true)

      for (var i = 0; i < files.length; i++) {
        if (
          files[i] &&
          (files[i].type === "image/jpg" ||
            files[i].type === "image/jpeg" ||
            files[i].type === "image/png" ||
            files[i].type === "image/webp")
        ) {
          const file = files[i];
          selectedImages.push(file);
          formdata.append(`avatar`, file);

         
        } else {
          setUploading(false);
          context.openAlertBox("error", "please provide a Valid Images");
          return false;
        }
      }
       uploadAvatarImage("/api/user/user-avatar", formdata).then((res)=>{
          setUploading(false);
          let avatar=[]
          avatar.push(res?.data?.avatar1)
          setPreview(avatar)
          
          })
      
    } catch (error) {
      console.log(error)
    }
  }

  const handleLogout = () => {
    fetchDataFromApi(`/api/user/logout?token=${localStorage.getItem("accessToken")}`, {withCredentials: true}).then((res)=>{
               if (res?.error===false){
                 context.setIsLogin(false)
                 localStorage.removeItem("accessToken")
                 localStorage.removeItem("refreshToken")
                 history("/login")
               }
           })
  };
  return (
    <>
      <div className="min-w-[260px] bg-white shadow rounded-lg p-6 h-full sticky top-[180px]">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 relative flex items-center justify-center cursor-pointer bg-gray-200 rounded-full overflow-hidden group">
            {uploading === true ? (
              <CircularProgress color="inherit" />
            ) : (
              <>
                {preview?.length !== 0 &&
                  preview.map((img, i) => {
                    return (
                      <img
                        src={img}
                        key={i}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    );
                  })}
              </>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center opacity-0 group-hover:opacity-55 transition-opacity duration-200">
              <CloudUpload className="w-6 h-6 text-white" />
            </div>

            {/* Hidden file input */}
            <input
              className="absolute inset-0 opacity-0 cursor-pointer"
              type="file"
              name="avatar"
              accept="image/*"
              onChange={(e) => onChangeFile(e, "/api/user/user-avatar")}
            />
          </div>

          <div className="ml-3">
            <p className="font-medium text-sm text-gray-900">
              {context.userData?.name}
            </p>
            <p className="text-sm text-gray-500">Premium Member</p>
          </div>
        </div>

        <nav className="space-y-2">
          <Link
            to="/myaccount"
             className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
    isActive("/myaccount")
      ? "bg-gray-100 text-gray-900"
      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
  }`}
          >
            <User className="mr-3 h-4 w-4" />
            My Account
          </Link>

          <Link
            to="/orders"
           className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
    isActive("/orders")
      ? "bg-gray-100 text-gray-900"
      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
  }`}
          >
            <ShoppingBag className="mr-3 h-4 w-4" />
            Orders
          </Link>

          <Link
            to="/wishlist"
             className={` hidden lg:flex items-center px-3 py-2 text-sm font-medium rounded-md ${
    isActive("/wishlist")
      ? "bg-gray-100 text-gray-900"
      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
  }`}
          >
            <Heart className="mr-3 h-4 w-4" />
            Wishlist
          </Link>

          

          <Link
            to="/account/settings"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
    isActive("/account/settings")
      ? "bg-gray-100 text-gray-900"
      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
  }`}
          >
            <Settings className="mr-3 h-4 w-4" />
            Settings
          </Link>
        </nav>
        <div className="border-t border-gray-200 mt-4 pt-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default LeftSideBarMenu;
