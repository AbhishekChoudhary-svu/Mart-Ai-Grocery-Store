import React, { useContext, useEffect, useState } from "react";
import SideBar from "../../components/SideBar";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import ProductItem from "../../components/ProductItem";
import ProductItemView from "../../components/ProductItemView";
import Button from "@mui/material/Button";
import { IoGridSharp } from "react-icons/io5";
import { ImMenu } from "react-icons/im";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Pagination from '@mui/material/Pagination';
import {fetchDataFromApi, postData} from "../../utils/api"
import { MyContext } from "../../App";

const SearchPage = () => {
  const context = useContext(MyContext);

  const [itemView, SetitemView] = useState("grid");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading]= useState(false);
  const [page, setPage]= useState(1);
  const [totalPages, setTotalPages]= useState(1);
  const [sortByValue, setSortByValue]= useState("Name, A to Z");





  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortBy =(names,order,products,value)=>{
    setSortByValue(value);
    postData("/api/product/sortBy",{
      products : products,
      sortBy : names,
      order: order

    }).then((res)=>{
      setProductData(res.data)
      setAnchorEl(null);
    })
  }

  return (
  <section className="py-5 pb-0">
      <div className="container">
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="/material-ui/getting-started/installation/"
          >
            Fresh Product
          </Link>
        </Breadcrumbs>
      </div>
      <div className="bg-white mt-3 py-4">
        <div className="container flex gap-3">
          <div className={` lg:w-[20%] w-full  lg:h-full fixed  left-0 lg:static    -bottom-[100%] z-[77] lg:z-0 p-5 pr-0 py-3 lg:py-5 lg:p-0 bg-white  transition-all lg:opacity-100 opacity-0 ${context.openFilters === true && "sidebarWrapper"} `}>
            <SideBar
              productData={productData}
              setProductData={setProductData}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              page={page}
              setTotalPages={setTotalPages}
            />
          </div>
          {context.windowWidth < 992 && (
            <div onClick={()=>context.setOpenFilters(false)} className={`fixed inset-0 bg-black/40 z-[68] ${context.openFilters === true ? "block" : "hidden"} `}></div>
          )}
          <div className="rightContent w-full lg:w-[80%] py-3 lg:pl-2">
            <div className="bg-[#f1f1f1] w-full rounded-md flex items-center justify-between p-2 mb-3">
              <div className="col1 flex items-center gap-1 itemViewAction">
                <Button
                  className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[rgba(0,0,0,0.7)] ${
                    itemView === "grid" && "active"
                  } `}
                  onClick={() => SetitemView("grid")}
                >
                  <IoGridSharp className="text-[20px]" />
                </Button>
                <Button
                  className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[rgba(0,0,0,0.7)] ${
                    itemView === "list" && "active"
                  } `}
                  onClick={() => SetitemView("list")}
                >
                  <ImMenu className="text-[25px]" />
                </Button>

                <span className="text-[15px] hidden md:block font-[500] text-[rgba(0,0,0,0.7)] pl-3">
                  There are {productData?.length} Products..
                </span>
              </div>
              <div className="col2 ml-auto flex items-center justify-end">
                <span className="text-[15px] font-[500] text-[rgba(0,0,0,0.7)] pl-3">
                  Sort By:
                </span>
                <Button
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  className="!text-[rgba(0,0,0,0.7)] !capitalize !bg-white !rounded-sm !mx-3"
                >
                  {sortByValue}
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  slotProps={{
                    list: {
                      "aria-labelledby": "basic-button",
                    },
                  }}
                >
                  <MenuItem
                    onClick={() =>
                      handleSortBy("name", "asc", productData, "Name, A to Z")
                    }
                  >
                    Name, A to Z
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleSortBy("name", "desc", productData, "Name, Z to A")
                    }
                  >
                    Name, Z to A
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleSortBy(
                        "price",
                        "asc",
                        productData,
                        "Price, Low to High"
                      )
                    }
                  >
                    Price, Low to High
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleSortBy(
                        "price",
                        "desc",
                        productData,
                        "Price, High to Low"
                      )
                    }
                  >
                    Price, High to Low
                  </MenuItem>
                </Menu>
              </div>
            </div>

            <div
              className={`grid ${
                itemView === "grid"
                  ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                  : "grid-cols-1 md:grid-cols-1"
              }  gap-2 lg:gap-4`}
            >
              {itemView === "grid" ? (
                <>
                  {productData.length !== 0 &&
                    productData.map((item, idx) => {
                      return (
                        <ProductItem
                          key={idx}
                          item={item}
                          id={item._id}
                          imgItem={item.images}
                          ItemName={item.name}
                          Brand={item.brand}
                          Price={item.price}
                          Discount={item.discount}
                          oldPrice={item.oldPrice}
                          Rating={item.rating}
                        />
                      );
                    })}
                </>
              ) : (
                <>
                  {productData.length !== 0 &&
                    productData.map((item, idx) => {
                      return (
                        <ProductItemView
                          key={idx}
                          item={item}
                          id={item._id}
                          imgItem={item.images}
                          ItemName={item.name}
                          Description={item.description}
                          Brand={item.brand}
                          Price={item.price}
                          Discount={item.discount}
                          oldPrice={item.oldPrice}
                          Rating={item.rating}
                        />
                      );
                    })}
                </>
              )}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-5">
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchPage;
