import React, { useContext, useEffect, useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import "../SideBar/style.css";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import Rating from "@mui/material/Rating";
import { MyContext } from "../../App";
import { useLocation } from "react-router-dom";
import { postData } from "../../utils/api";
import { Button } from "@mui/material";
import { ListFilter } from "lucide-react";


const SideBar = (props) => {
  const context = useContext(MyContext);
  const location = useLocation();

  const [filters, setFilters] = useState({
    catId: [],
    subCatId: [],
    stockStatus: [], //
    maxPrice: "",
    minPrice: "",
    rating: "",
    page: 1,
    limit: 10,
  });
  const [price, setPrice] = useState([0, 5000]);

  const handleCheckBoxChange = (field, value) => {
    context.setSearchData([])
    const currentValues = filters[field] || [];
    const updatedValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    setFilters((prev) => ({
      ...prev,
      [field]: updatedValues,
    }));

    if (field === "catId") {
      setFilters((prev) => ({
        ...prev,
        subCatId: [],
      }));
    }
  };

  useEffect(() => {
    const url = window.location.href;
    const queryParameters = new URLSearchParams(location.search);

    if (url.includes("catId")) {
      const categoryId = queryParameters.get("catId");
      const catArr = [];
      catArr.push(categoryId);
      filters.catId = catArr;
      filters.subCatId = [];
      context.setSearchData([])
    }
    if (url.includes("subCatId")) {
      const subCategoryId = queryParameters.get("subCatId");
      const subCatArr = [];
      subCatArr.push(subCategoryId);
      filters.subCatId = subCatArr;
      filters.catId = [];
      context.setSearchData([])
    }

    filters.page = 1;

    setTimeout(() => {
      filterData();
    }, 200);
    
  }, [location]);

  const filterData = () => {
    props.setIsLoading(true);
    if(context.searchData.length>0){
      props.setProductData(context.searchData);
      props.setIsLoading(false);
      props.setTotalPages(context.searchData.totalPages);
      window.scrollTo(0,0)
    }else{
        postData(`/api/product/filters`, filters).then((res) => {
      props.setProductData(res.data);
      props.setIsLoading(false);
      props.setTotalPages(res?.totalPages);
      window.scrollTo(0,0)
    });
    }
    
  };

  useEffect(() => {
    filters.page = props.page;
    filterData();
  }, [filters, props.page]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      minPrice: price[0],
      maxPrice: price[1],
    }));
  }, [price]);

  return (
    <aside className="sidebar   pb-2 lg:sticky pr-5 lg:pr-0 static top-[150px] z-40">
      <div className="w-full lg:pl-3 overflow-auto lg:max-h-[120vh] lg:overflow-hidden max-h-[68vh] hide-scrollbar">
      <div className="box pb-2  ">
        <h3 className=" text-[18px] font-[600] ">Filter By Category</h3>
        <div className="scroll hide-scrollbar flex flex-col p-4 lg:p-2 mt-1 relative -left-[10px]">
          {context?.catData?.length !== 0 &&
            context?.catData?.map((cat, idx) => {
              return (
                <FormControlLabel
                  key={idx}
                  value={cat._id}
                  checked={filters?.catId?.includes(cat._id)}
                  control={<Checkbox />}
                  onChange={() => handleCheckBoxChange("catId", cat._id)}
                  label={cat.name}
                />
              );
            })}
        </div>
      </div>
      <div className="box2 py-2 ">
        <h3 className=" text-[18px] font-[600]">Avaiability</h3>
        <div className="scroll2 flex flex-col p-5 lg:p-2 relative -left-[10px]">
          <FormControlLabel
            label="Avaiable In Stock"
            value="available"
            checked={filters?.stockStatus?.includes("available")}
            control={<Checkbox />}
            onChange={() => handleCheckBoxChange("stockStatus", "available")}
          />
          <FormControlLabel
            label="Limited Stock"
            value="limited"
            checked={filters?.stockStatus?.includes("limited")}
            control={<Checkbox />}
            onChange={() => handleCheckBoxChange("stockStatus", "limited")}
          />
          <FormControlLabel
            label="Out of Stock"
            value="outofstock"
            checked={filters?.stockStatus?.includes("outofstock")}
            control={<Checkbox />}
            onChange={() => handleCheckBoxChange("stockStatus", "outofstock")}
          />
        </div>
      </div>
      <div className="box3 py-2 p-5 lg:p-0">
        <h3 className="mb-3 text-[18px]  font-[600]">Price</h3>
        <RangeSlider
          value={price}
          onInput={setPrice}
          min={50}
          max={5000}
          step={5}
        />
        <div className="flex pt-4 pb-2 priceRange">
          <span className="text-[13px]">
            From : <strong className="text-dark"> Rs.{price[0]}</strong>
          </span>
          <span className="ml-auto text-[13px]">
            To : <strong className="text-dark"> Rs.{price[1]}</strong>
          </span>
        </div>
      </div>
      <div className="box4 py-2 p-1 lg:p-0">
        <h3 className="mb-3 text-[18px] font-[600]">Rating</h3>
        <div className=" flex items-center  justify-start">
          <FormControlLabel
            value={5}
            checked={filters?.rating?.includes(5)}
            control={<Checkbox color="success" />}
            onChange={() => handleCheckBoxChange("rating", 5)}
          />
          <Rating name="rating" value={5} readOnly />
        </div>
        <div className=" flex items-center justify-start">
          <FormControlLabel
            value={4}
            checked={filters?.rating?.includes(4)}
            control={<Checkbox color="success" />}
            onChange={() => handleCheckBoxChange("rating", 4)}
          />
          <Rating name="rating" value={4} readOnly />
        </div>
        <div className=" flex items-center justify-start">
          <FormControlLabel
            value={3}
            checked={filters?.rating?.includes(3)}
            control={<Checkbox color="success" />}
            onChange={() => handleCheckBoxChange("rating", 3)}
          />
          <Rating name="rating" value={3} readOnly />
        </div>
        <div className=" flex items-center justify-start">
          <FormControlLabel
            value={2}
            checked={filters?.rating?.includes(2)}
            control={<Checkbox color="success" />}
            onChange={() => handleCheckBoxChange("rating", 2)}
          />
          <Rating name="rating" value={2} readOnly />
        </div>
        <div className=" flex items-center justify-start">
          <FormControlLabel
            value={1}
            checked={filters?.rating?.includes(1)}
            control={<Checkbox color="success" />}
            onChange={() => handleCheckBoxChange("rating", 1)}
          />
          <Rating name="rating" value={1} readOnly />
        </div>
      </div>
      </div>
      <br />
      <Button onClick={()=>context.setOpenFilters(false)} className="!flex lg:!hidden !px-4 !py-2 !bg-green-600 !text-white gap-2 !rounded-lg w-full mt-3"><ListFilter/> Filters</Button>
    </aside>
  );
};

export default SideBar;
