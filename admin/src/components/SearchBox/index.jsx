import { Button } from '@mui/material';
import React, { useState, useRef } from 'react';
import { FaSearch } from "react-icons/fa";

const SearchBox = ({ placeholder = "Search Your Product...", setSearchQuery, setCurrentPage }) => {
  const [searchQuery, setLocalSearchQuery] = useState("");
  const searchInput = useRef();

  const handleChange = (e) => {
    setLocalSearchQuery(e.target.value);
    setSearchQuery(e.target.value);
    if (e.target.value === "") { 
      setCurrentPage(1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
   
  };

  return (
    <form onSubmit={handleSubmit} className="flex relative items-center max-w-lg w-full mx-auto mt-4">
  <input
    type="text"
    value={searchQuery}
    ref={searchInput}
    onChange={handleChange}
    placeholder={placeholder}
    className="
      flex-grow
      w-full
      px-3 py-2
      border border-gray-300
      rounded-md
      focus:outline-none focus:ring-2 focus:ring-green-500
      text-sm
      md:min-w-[300px] lg:min-w-[350px]
    "
  />
  <Button
    type="submit"
    className="
      !absolute -right-1 top-0.5
      !w-[35px] !h-[35px] !min-w-[35px]
      !rounded-full !text-green-500
      flex items-center justify-center
      bg-white hover:bg-gray-100
    "
  >
    <FaSearch />
  </Button>
</form>

  );
};

export default SearchBox;
