import React, { useContext, useState } from 'react'
import Button from '@mui/material/Button'
import { MdOutlineSearch } from "react-icons/md";
import {fetchDataFromApi, postData} from "../../utils/api"
import { MyContext } from '../../App';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const context = useContext(MyContext)
  const history = useNavigate()
  const [searchQuery, setLocalSearchQuery] = useState("");
  
   
  
    const handleChange = (e) => {
      setLocalSearchQuery(e.target.value);
     
    };

    const search=()=>{
       if (searchQuery !== "") {
     const   data={
          keyword:searchQuery,
          page:1,
          limit:10
        }
        postData(`/api/product/search/get`,data).then((res)=>{
          context.setSearchData(res.data)
          context.setOpenSearch(false)
           history("/search")
           setLocalSearchQuery("")
        })
      }
     
      
    }
  return (
    <div className='searchBox w-[100%] h-[55px] bg-gray-200 rounded-[10px] relative p-2'>
        <input type="text"
          placeholder="Search for products..." 
          value={searchQuery}
          
          onChange={handleChange}
          name="" id="" className='p-2 w-full h-[40px] focus:outline-none text-[15px]' />
      <Button onClick={search} className='!absolute top-[4px] right-[5px] z-50 w-[48px] !min-w-[48px] h-[48px] !rounded-full !text-black' ><MdOutlineSearch className='text-black text-[20px]'/></Button>
    </div>
  )
}

export default Search
