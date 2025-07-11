import Button from "@mui/material/Button";
import React, { useContext, useEffect, useState } from "react";
import { CgMenuLeft } from "react-icons/cg";
import { TfiAngleDown, TfiAngleRight} from "react-icons/tfi";
import { Link } from "react-router-dom";
import "../Navigation/style.css";
import { fetchDataFromApi } from "../../../utils/api";
import { MyContext } from "../../../App";
import MobileNav from "./MobileNav";
import { ChevronDown, ChevronUp, X } from "lucide-react";





const Navigation = () => {
const context = useContext(MyContext)
const [catData, setCatData]=useState([])

useEffect(()=>{
  setCatData(context?.catData)

},[context?.catData])



  return (
    <>
      <nav className="py-2">
        <div className="container flex items-center justify-end gap-8">
          <div className="col1 xl:w-[20%] hidden xl:block ">
            <Button
              className="!text-black gap-2 w-full "
            >
              <CgMenuLeft className="text-[18px]" />
              Shop by Categories
              <TfiAngleRight className="ml-auto font-bold" />
            </Button>
          </div>
          <div className="col2 w-full xl:w-[80%]">
            
            <ul className="hidden lg:flex items-center gap-6 nav">
              {catData.length !== 0 && catData.map((cat,idx)=>{
                return(
                      <li key={idx} className="list-none relative">
                <Link
                  to={`/products?catId=${cat._id}`}
                  className="link transition text-[15px] text-[rgba(0,0,0,0.8)] font-[600] "
                >
                  {cat?.name}
                </Link>
                <div className="submenu opacity-0 transition-all absolute top-[140%] left-[0%] min-w-[200px] bg-white shadow-md">
                  <ul>
                    {
                      cat?.subCategories.length !==0 && cat?.subCategories?.map((subCat,idx)=>{
                        return(
                            <li key={idx} className="list-none w-full relative">
                      <Link 
                      to={`/products?subCatId=${subCat._id}`}
                      >
                        <Button className="w-full !border-b-1 !border-[rgba(0,0,0,0.1)]  !justify-start !text-left !rounded-none">
                          {subCat?.name}
                        </Button>
                      </Link>
                    </li>
                        )
                      })
                    }
                    
                    
                  </ul>
                </div>
              </li>
                )
              })
            }
            
            </ul>
            <div className="flex lg:hidden overflow-x-auto gap-3 hide-scrollbar">
    {catData.map((cat, idx) => (
      <Link
        key={idx}
        to={`/products?catId=${cat._id}`}
        className="flex-shrink-0 px-3 py-2 bg-gray-100 rounded-sm  text-[14px] font-medium whitespace-nowrap text-gray-700 hover:bg-gray-200 transition"
      >
        {cat?.name}
      </Link>
    ))}
  </div>
          </div>
        
          
        </div>
      </nav>
         
      <MobileNav/>
      
    </>
  );
};

export default Navigation;
