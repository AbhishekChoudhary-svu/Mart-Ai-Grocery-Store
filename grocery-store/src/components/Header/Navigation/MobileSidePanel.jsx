import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, ChevronDown, ChevronUp, LogIn, LogOut } from "lucide-react";
import { MyContext } from "../../../App"; // adjust path
import { fetchDataFromApi } from "../../../utils/api";

const SideCategoryPanel = ({ isPanelOpen, setIsPanelOpen, catData }) => {
  const [openCategory, setOpenCategory] = useState(null);
  const { isLogin, setIsLogin } = useContext(MyContext);
  const history = useNavigate();

  const toggleCategory = (id) => {
    setOpenCategory(openCategory === id ? null : id);
  };

  const handleLogout = () => {
     fetchDataFromApi(`/api/user/logout?token=${localStorage.getItem("accessToken")}`, {withCredentials: true}).then((res)=>{
            if (res?.error===false){
              setIsLogin(false)
              localStorage.removeItem("accessToken")
              localStorage.removeItem("refreshToken")
              history("/login")
            }
        })
  };

  return isPanelOpen ? (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-[998]"
        onClick={() => setIsPanelOpen(false)}
      ></div>

      <div className="fixed top-0 left-0 h-full w-[80%] max-w-xs bg-white z-[999] shadow-lg overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-50">
          <Link to={"/"}>
            <img src="/logo-transparent.png" className=" h-10 " alt="" />
          </Link>
          <button onClick={() => setIsPanelOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <ul className="flex-1 flex flex-col max-h-[75vh]">
          {catData?.map((cat) => (
            <li key={cat._id} className="border-b border-gray-100">
              <div
                onClick={() => toggleCategory(cat._id)}
                className="flex items-center justify-between px-4 py-2 cursor-pointer font-medium text-[15px] text-gray-800 hover:bg-gray-100 transition"
              >
                {cat?.name}
                {cat?.subCategories?.length > 0 &&
                  (openCategory === cat._id ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  ))}
              </div>

              {openCategory === cat._id && (
                <ul className="ml-4">
                  {cat?.subCategories?.map((subCat) => (
                    <li key={subCat._id} className="border-b border-gray-50">
                      <Link
                        to={`/products?subCatId=${subCat._id}`}
                        onClick={() => setIsPanelOpen(false)}
                        className="block px-4 py-1 text-[14px] text-gray-600 hover:text-black hover:bg-gray-100 transition"
                      >
                        {subCat?.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
            <div className="border-t border-gray-50 p-2 pl-0">
          {isLogin ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 rounded text-[15px] font-semibold text-red-600 hover:bg-gray-100 transition"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsPanelOpen(false)}
              className="w-full flex items-center gap-2 px-4 py-2 rounded text-[15px] font-semibold text-blue-600 hover:bg-gray-100 transition"
            >
              <LogIn className="w-4 h-4" /> Login
            </Link>
          )}
        </div>
        </ul>

      
      </div>
    </>
  ) : null;
};

export default SideCategoryPanel;
