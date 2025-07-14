import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Search from "../Search";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { IoCartOutline } from "react-icons/io5";
import { TiShoppingCart } from "react-icons/ti";
import { BsBagHeart } from "react-icons/bs";
import Tooltip from '@mui/material/Tooltip';
import Navigation from "./Navigation";
import {MyContext} from "../../App"
import Button from "@mui/material/Button";
import { FaUserCircle } from "react-icons/fa";
import { useState, useRef, useEffect } from "react"
import { User, ShoppingBag, Heart, Settings,Soup, CreditCard, AlignJustify } from "lucide-react"

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { fetchDataFromApi } from "../../utils/api";
import SideCategoryPanel from "../Header/Navigation/MobileSidePanel";



const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -1,
    top: 3,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: "0 4px",
  },
}));

const Header = () => {

 const context =useContext(MyContext);
 const history = useNavigate();
const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);  
  };
  const logout = () => {
    setAnchorEl(null);
    fetchDataFromApi(`/api/user/logout?token=${localStorage.getItem("accessToken")}`, {withCredentials: true}).then((res)=>{
        if (res?.error===false){
          context.setIsLogin(false)
          localStorage.removeItem("accessToken")
          localStorage.removeItem("refreshToken")
          history("/login")
        }
    })

  };
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const [catData, setCatData]=useState([])
  
  useEffect(()=>{
    setCatData(context?.catData)
  
  },[context?.catData])


 
  return (
    <header className="bg-white sticky   top-[-45px] z-50 shadow-md ">
      <div className="Top-strip py-2 border-b-[1px] hidden lg:block border-t-[1px] border-gray-200">
        <div className="container">
          <div className="flex items-center md:justify-between justify-end">
            <div className="col1 w-[50%] hidden md:block">
              <p className="text-[13px] font-semibold">
                Welcome to My Futuristic Mart Ai Grocery store.
              </p>
            </div>
            <div className="col2 flex items-center justify-end">
              <ul className="flex items-center gap-5 ">
                
                <li className="list-none">
                  <Link
                    to="/order-tracking"
                    className="font-[500] md:text-[14px] text-[12px] link transition"
                  >
                    Order Tracking
                  </Link>
                </li>
                <li className="list-none">
                  <Link
                    to="/contact-us"
                    className="font-[500] md:text-[14px] text-[12px] link transition"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="header lg:py-4 py-3 border-b-[1px]  border-gray-200">
        <div className="container flex items-center justify-between">
            <AlignJustify onClick={() => setIsPanelOpen(true)}

             className="lg:hidden block text-[35px]"/>
          <div className="col1 xl:w-[25%] lg:w-[20%] flex items-center justify-center lg:justify-start w-[50%]">
            <Link to={"/"}>
              <img src="/logo-transparent.png" className="lg:h-15 h-10 " alt="" />
            </Link>
          </div>
          <div className={`col2 lg:w-[40%] xl:w-[45%] lg:pl-12 w-full h-full fixed lg:static top-0 left-0 p-2 lg:p-0 ${context.openSearch === true ?  "block" : "hidden" }  lg:block bg-white z-[888]`}>
            <Search />
          </div>
          <div className="col3 lg:w-[40%] w-[15%]">
            
            <ul className="flex items-center lg:gap-3 gap-1   w-full justify-end">
             {
                context.isLogin=== false ? <li className="hidden lg:flex">
                <Link
                  to="/login"
                  className="link transition font-[500] text-[17px]"
                >
                  Login
                </Link>{" "}
                |&nbsp;
                <Link
                  to="/register"
                  className="link transition font-[500] text-[17px]"
                >
                  Register
                </Link>
              </li>
              : <>
              
                <div className="  items-center hidden lg:flex gap-2">

                  <Button onClick={handleClick} className=" lg:!min-w-[40px] !min-w-[10px] !text-gray-500 !rounded-full"><FaUserCircle className="text-[30px] lg:text-[40px]"/></Button>
                  <div className="flex flex-col ">
                      <h4 className="text-[15px] font-[600]">{context.userData?.name}</h4>
                  <span className="text-[13px] font-[500]">{context.userData?.email}</span>
                  </div>
          
                 </div>

                  <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem >
           <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900">{context.userData?.name}</p>
              <p className="text-xs text-gray-500">{context.userData?.email}</p>
            </div>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link
              to="/myaccount"
              className="flex  items-center  text-sm text-gray-700 hover:bg-gray-100"
             
            >
              <User className="mr-3 h-4 w-4 text-gray-500" />
              My Account
            </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
        <Link
              to="/orders"
              className="flex items-center   text-sm text-gray-700 hover:bg-gray-100"

            >
              <ShoppingBag className="mr-3 h-4 w-4 text-gray-500" />
              Orders
            </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link
              to="/wishlist"
              className="flex items-center  text-sm text-gray-700 hover:bg-gray-100"
              
            >
              <Heart className="mr-3 h-4 w-4 text-gray-500" />
              Wishlist
            </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link
                to="/account/payment"
                className="flex items-center  text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              >
                <CreditCard className="mr-3 h-4 w-4" />
                Payment Methods
              </Link>
        </MenuItem>
        <MenuItem onClick={logout} className="flex items-center  text-sm font-medium !text-gray-800 bg-gray-100 rounded-md">
          
                <Settings className="mr-3 h-4 w-4" />
                Logout
          
        </MenuItem>
      </Menu>

                 </>
             }
              
              <li>
                <Link to="/recipes">
                <Tooltip title="Recipes" arrow>
                  <IconButton aria-label="recipe" >
                    <StyledBadge badgeContent={0} color="success">
                      <Soup />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
                </Link>
              </li>
              <li className="hidden lg:block">
                <Link to="/wishlist">
                <Tooltip title="Wishlist" arrow>
                  <IconButton aria-label="list">
                    <StyledBadge badgeContent={(context?.listData?.length)} color="success">
                      <BsBagHeart />
                    </StyledBadge>
                  </IconButton>
                </Tooltip></Link>
              </li>
              <li>
                <Tooltip title="Cart" arrow>
                  <IconButton aria-label="cart" onClick={()=>context.setOpenCartPanel(true)}>
                    <StyledBadge badgeContent={(context?.cartData?.length)} color="success">
                      <IoCartOutline />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              </li>
            </ul>
           
          </div>

        </div>
      </div>
      <Navigation/>
         <SideCategoryPanel
  isPanelOpen={isPanelOpen}
  setIsPanelOpen={setIsPanelOpen}
  catData={catData}
/>
    </header>
  );
};

export default Header;
