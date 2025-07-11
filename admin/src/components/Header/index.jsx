import React, { useContext } from "react";
import Button from "@mui/material/Button";
import { CgMenuLeft } from "react-icons/cg";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { IoMdNotificationsOutline } from "react-icons/io";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from '@mui/material/Divider';
import { FaRegUser } from "react-icons/fa";
import { PiSignOutBold } from "react-icons/pi";
import {MyContext} from "../../App"
import { Link, useNavigate } from "react-router-dom";

import { fetchDataFromApi } from "../../utils/api";



const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 3,
    top: 3,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: "0 4px",
  },
}));



const Header = () => {
  const context = useContext(MyContext);
 const history = useNavigate();

  
  const [anchorElMyacc, setAnchorElMyacc] = React.useState(null);
  const openMyacc = Boolean(anchorElMyacc);
  const handleClickMyacc = (event) => {
    setAnchorElMyacc(event.currentTarget);
  };
  const handleCloseMyacc = () => {
    setAnchorElMyacc(null);
  };
  const OpenAccount = () => {
    setAnchorElMyacc(null);
    history("/profile-page")
  };
  const logout = () => {
      setAnchorElMyacc(null);
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
    <header className={`w-full h-auto shadow-md py-2 pr-7 bg-white sticky top-0 z-50 flex items-center justify-between transition-all
  
  ${context.isSideBarOpen ? "lg:pl-54 xl:pl-64  pl-64" : "pl-4"}
`}>

      <div className="part1">
       <Button
  onClick={() => context.setIsSideBarOpen(!context.isSideBarOpen)}
  className="lg:hidden !w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-black"
>
  <CgMenuLeft className="text-black text-[26px] font-[600]" />
</Button>

      </div>
      <div className="part2 w-[40%] flex items-center justify-end gap-4">
        <IconButton aria-label="cart">
          <StyledBadge badgeContent={4} color="success">
            <IoMdNotificationsOutline />
          </StyledBadge>
        </IconButton>

{
  context.isLogin === true? <div className="relative">
          <div
            className="rounded-full w-[35px] h-[35px] overflow-hidden cursor-pointer  "
            onClick={handleClickMyacc}
          >
            <img
              className="w-full h-full object-cover"
              src={context?.userData?.avatar}
              alt=""
            />
          </div>
          <Menu
            anchorEl={anchorElMyacc}
            id="account-menu"
            open={openMyacc}
            onClose={handleCloseMyacc}
            onClick={handleCloseMyacc}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleCloseMyacc} className="!bg-white">
            <div className="flex items-center  gap-3">
          <div className="rounded-full w-[40px] h-[40px] overflow-hidden cursor-pointer  "  >
            <img
              className="w-full h-full object-cover"
              src={context?.userData?.avatar}
                alt=""
            />
          </div>
          <div className="info flex flex-col">
            <h3 className="text-[15px] font-[600]">{context.userData?.name}</h3>
            <span className="text-[14px] font-[500] text-[rgba(0,0,0,0.5)]">{context.userData?.email}</span>
          </div>
            </div>
            </MenuItem>
            <Divider/>
             <MenuItem onClick={OpenAccount} className="!bg-white space-x-3 flex items-center ">
             <FaRegUser className="text-[18px]"/> <span className="text-[16px]">Account</span>
             </MenuItem>
             <MenuItem onClick={logout} className="!bg-white space-x-3 flex items-center ">
             <PiSignOutBold className="text-[18px]"/> <span className="text-[16px]">Sign Out</span>
             </MenuItem>

          </Menu>
        </div>
        : <Link to="/register"><Button className="!bg-green-500 !px-4 !py-1 !text-white !capitalize !rounded-lg">Sign In</Button></Link>
}

        
      </div>  
    </header>
  );
};

export default Header;
