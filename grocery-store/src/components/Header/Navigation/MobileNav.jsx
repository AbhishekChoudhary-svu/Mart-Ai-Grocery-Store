import React, { useContext } from "react";
import { Home, Search, Box, Heart, User, ListFilter } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { MyContext } from "../../../App";

const MobileNav = () => {
  const context = useContext(MyContext);
  const location = useLocation();

  const showFilters = location.pathname === "/products" || location.pathname === "/search";

  const menu = [
    { name: "Home", icon: <Home className="w-6 h-6" />, link: "/" },
    { name: "Filters", icon: <ListFilter className="w-6 h-6" />, action: () => context.setOpenFilters(true), showIf: showFilters },
    { name: "Search", icon: <Search className="w-6 h-6" />, action: () => context.setOpenSearch(true), showAlways: true },
    { name: "Wishlist", icon: <Heart className="w-6 h-6" />, link: "/wishlist" },
    { name: "Orders", icon: <Box className="w-6 h-6" />, link: "/orders" },
    { name: "My Account", icon: <User className="w-6 h-6" />, link: "/myaccount" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t font-[600] shadow-lg lg:hidden z-[1000]">
      <ul className="flex justify-around items-center">
        {menu.map((item) => {
          if (item.link) {
            return (
              <Link to={item.link} key={item.name} onClick={() => context.setOpenSearch(false)}  // 👈 close search
>
                <li
                  className={`flex flex-col items-center justify-center py-2 ${
                    location.pathname === item.link ? "text-green-700" : "text-gray-500"
                  }`}
                >
                  {item.icon}
                  <span className="text-xs mt-1 capitalize">{item.name}</span>
                </li>
              </Link>
            );
          } else if (item.action && (item.showAlways || item.showIf)) {
            return (
              <button
                key={item.name}
                onClick={item.action}
                
                className="flex flex-col items-center justify-center py-2 text-gray-500"
              >
                {item.icon}
                <span className="text-xs mt-1 capitalize">{item.name}</span>
              </button>
            );
          } else {
            return null;
          }
        })}
      </ul>
    </nav>
  );
};

export default MobileNav;
