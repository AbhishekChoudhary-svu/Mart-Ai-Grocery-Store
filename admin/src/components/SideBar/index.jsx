import { Button } from "@mui/material";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { IoMdImages } from "react-icons/io";
import { FaUserTie } from "react-icons/fa";
import { TbCategoryPlus } from "react-icons/tb";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { RiProductHuntLine } from "react-icons/ri";
import { TbLogout } from "react-icons/tb";
import { FaAngleDown } from "react-icons/fa";
import { Collapse } from "react-collapse";
import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/api";

const SideBar = () => {

   const context = useContext(MyContext);
 const history = useNavigate();

  const [submenuIndex, setSubmenuIndex] = useState(null);
  const openSubmenu = (index) => {
    if (submenuIndex === index) {
      setSubmenuIndex(null);
    } else {
      setSubmenuIndex(index);
    }
  };  
  
   const handleSidebarClose = () => {
  if (window.innerWidth < 1280) { // lg breakpoint
    context.setIsSideBarOpen(false);
  }
};
const logout = () => {
      handleSidebarClose()
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
    <div 
    className={`
    fixed top-0 left-0 z-60 h-full
    bg-white border-r border-[rgba(0,0,0,0.1)]
    py-2 px-4
    transition-all duration-300
    ${context.isSideBarOpen ? " w-64" : "w-0"}
    lg:w-[16%] lg:opacity-100 lg
    overflow-x-hidden
  `}>
      <div  className="logo py-2 w-full">
        <Link onClick={handleSidebarClose} to="/dashboard">
          <img className="w-[150px]" src="/AdMart.png" alt="" />
        </Link>
      </div>

      <ul className="mt-4 ">
        <li>
          <Link to="/dashboard" onClick={handleSidebarClose}>
          <Button className="w-full !py-2 hover:!bg-[#f1f1f1]  !capitalize  !justify-start !text-[rgba(0,0,0,0.7)] !text-[16px] !font-[600] flex gap-3 items-center">
            <MdOutlineSpaceDashboard className="text-[20px] font-[600]" />
            <span>Dashboard</span>
          </Button>
          </Link>
        </li>
        <li>
           
          <Button
            className="w-full !py-2 hover:!bg-[#f1f1f1] !capitalize  !justify-start !text-[rgba(0,0,0,0.7)] !text-[16px] !font-[600] flex gap-3 items-center"
            onClick={() => openSubmenu(1)}
          >
            <IoMdImages className="text-[20px] font-[600]" />
            <span>Home Slides</span>
            <span className="ml-auto w-[30px] h-[30px] flex items-center justify-center">
              <FaAngleDown className={`transition-all ${submenuIndex===1 ? "rotate-180" : ""}`} />
            </span>
          </Button>
          <Collapse isOpened={submenuIndex=== 1 ? true : false}>
            <ul className="w-full">
              <li className="w-full">
                <Link to="/homeSlider/BannerList" onClick={handleSidebarClose}>
                <Button className="!w-full !capitalize !justify-start !text-[rgba(0,0,0,0.6)] !pl-9 flex gap-3 !text-[14px] !font-[400]"><span className="block w-[5px] h-[5px] bg-[rgba(0,0,0,0.4)] rounded-full"></span>Home Banner List</Button></Link>
              </li>
              <li className="w-full">
                <Link to="/homeSlider/AddBanner" onClick={handleSidebarClose}>
                <Button className="!w-full !capitalize !justify-start !text-[rgba(0,0,0,0.6)] !pl-9 flex gap-3 !text-[14px] !font-[400]"><span className="block w-[5px] h-[5px] bg-[rgba(0,0,0,0.4)] rounded-full"></span>Add Banner Slides</Button></Link>
              </li>
              <li className="w-full">
                <Link to="/AdsBanner/List" onClick={handleSidebarClose}>
                <Button className="!w-full !capitalize !justify-start !text-[rgba(0,0,0,0.6)] !pl-9 flex gap-3 !text-[14px] !font-[400]"><span className="block w-[5px] h-[5px] bg-[rgba(0,0,0,0.4)] rounded-full"></span>AdsBanner List</Button></Link>
              </li>
              <li className="w-full">
                <Link to="/AdsBanner/Add" onClick={handleSidebarClose}>
                <Button className="!w-full !capitalize !justify-start !text-[rgba(0,0,0,0.6)] !pl-9 flex gap-3 !text-[14px] !font-[400]"><span className="block w-[5px] h-[5px] bg-[rgba(0,0,0,0.4)] rounded-full"></span>Add Banner</Button></Link>
              </li>
            </ul>
          </Collapse>
        </li>
        <li>
          <Link to="/users" onClick={handleSidebarClose}>
          <Button className="w-full !py-2 hover:!bg-[#f1f1f1] !capitalize  !justify-start !text-[rgba(0,0,0,0.7)] !text-[16px] !font-[600] flex gap-3 items-center">
            <FaUserTie className="text-[20px] font-[600]" />
            <span>Users</span>
          </Button>
          </Link>
        </li>
        <li>
          <Button
            className="w-full !py-2 hover:!bg-[#f1f1f1] !capitalize  !justify-start !text-[rgba(0,0,0,0.7)] !text-[16px] !font-[600] flex gap-3 items-center"
            onClick={() => openSubmenu(3)}
          >
            <RiProductHuntLine className="text-[20px] font-[600]" />
            <span>Products</span>
            <span className="ml-auto w-[30px] h-[30px] flex items-center justify-center">
              <FaAngleDown className={`transition-all ${submenuIndex===3 ? "rotate-180" : ""}`} />
            </span>
          </Button>
          <Collapse isOpened={submenuIndex=== 3 ? true : false}>
            <ul className="w-full">
              <li className="w-full">
                <Link to="/products" onClick={handleSidebarClose}>
                <Button className="!w-full !capitalize !justify-start !text-[rgba(0,0,0,0.6)] !pl-9 flex gap-3 !text-[14px] !font-[400]"><span className="block w-[5px] h-[5px] bg-[rgba(0,0,0,0.4)] rounded-full"></span>Product List</Button></Link>
              </li>
              <li className="w-full">
                <Link to="/product/upload" onClick={handleSidebarClose}>
                <Button className="!w-full !capitalize !justify-start !text-[rgba(0,0,0,0.6)] !pl-9 flex gap-3 !text-[14px] !font-[400]"><span className="block w-[5px] h-[5px] bg-[rgba(0,0,0,0.4)] rounded-full"></span>Product Upload</Button></Link>
              </li>
            </ul>
          </Collapse>
        </li>
         <li>
          <Button
            className="w-full !py-2 hover:!bg-[#f1f1f1] !capitalize  !justify-start !text-[rgba(0,0,0,0.7)] !text-[16px] !font-[600] flex gap-3 items-center"
            onClick={() => openSubmenu(4)}
          >
            <TbCategoryPlus className="text-[20px] font-[600]" />
            <span>Category</span>
            <span className="ml-auto w-[30px] h-[30px] flex items-center justify-center">
              <FaAngleDown className={`transition-all ${submenuIndex===4 ? "rotate-180" : ""}`} />
            </span>
          </Button>
          <Collapse isOpened={submenuIndex=== 4 ? true : false}>
            <ul className="w-full">
              <li className="w-full">
                <Link to="/categories" onClick={handleSidebarClose}>
                <Button className="!w-full !capitalize !justify-start !text-[rgba(0,0,0,0.6)] !pl-9 flex gap-3 !text-[14px] !font-[400]"><span className="block w-[5px] h-[5px] bg-[rgba(0,0,0,0.4)] rounded-full"></span>Category List</Button></Link>
              </li>
              <li className="w-full">
                <Link to="/category/add" onClick={handleSidebarClose}>
                <Button className="!w-full !capitalize !justify-start !text-[rgba(0,0,0,0.6)] !pl-9 flex gap-3 !text-[14px] !font-[400]"><span className="block w-[5px] h-[5px] bg-[rgba(0,0,0,0.4)] rounded-full"></span>Add a Category</Button></Link>
              </li>
              <li className="w-full">
                <Link to="/category/subCategories" onClick={handleSidebarClose}>
                <Button className="!w-full !capitalize !justify-start !text-[rgba(0,0,0,0.6)] !pl-9 flex gap-3 !text-[14px] !font-[400]"><span className="block w-[5px] h-[5px] bg-[rgba(0,0,0,0.4)] rounded-full"></span>Sub-Category List</Button></Link>
              </li>
              <li className="w-full">
                <Link to="/category/subCategories/add" onClick={handleSidebarClose}>
                <Button className="!w-full !capitalize !justify-start !text-[rgba(0,0,0,0.6)] !pl-9 flex gap-3 !text-[14px] !font-[400]"><span className="block w-[5px] h-[5px] bg-[rgba(0,0,0,0.4)] rounded-full"></span>Add a Sub-Category</Button></Link>
              </li>
            </ul>
          </Collapse>
        </li>
        <li>
          <Link to="/orders" onClick={handleSidebarClose}>
          <Button className="w-full !py-2 hover:!bg-[#f1f1f1] !capitalize  !justify-start !text-[rgba(0,0,0,0.7)] !text-[16px] !font-[600] flex gap-3 items-center">
            <LiaShoppingBagSolid className="text-[20px] font-[600]" />
            <span>Orders</span>
          </Button></Link>
        </li>
        <li>
          <Button onClick={logout} className="w-full !py-2 hover:!bg-[#f1f1f1] !capitalize  !justify-start !text-[rgba(0,0,0,0.7)] !text-[16px] !font-[600] flex gap-3 items-center">
            <TbLogout className="text-[20px] font-[600]" />
            <span>Logout</span>
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
