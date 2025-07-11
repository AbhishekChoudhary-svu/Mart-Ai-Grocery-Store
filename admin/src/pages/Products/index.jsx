import { React, useContext, useEffect, useState } from "react";
import Rating from "@mui/material/Rating";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import SearchBox from "../../components/SearchBox";
import { Link, useNavigate } from "react-router-dom";
import { deleteData, deleteMultipleData, fetchDataFromApi } from "../../utils/api";
import { MyContext } from "../../App";

const Products = () => {
  const history = useNavigate();
  const context = useContext(MyContext);

  const [productData, setProductData] = useState([]);
  const [cateData, setCateData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [sortedIds, setSortedIds] = useState([]);


  useEffect(() => {
   getProducts();
    fetchDataFromApi("/api/category").then((res) => {
      setCateData(res?.categories || []);
    });
  }, []);

  const getProducts = async ()=> {
      fetchDataFromApi("/api/product/").then((res) => {
        let productArr =[];
        for(let i=0; i<res?.products?.length;i++){
          productArr[i]= res?.products[i]
          productArr[i].checked = false;

        }
      setProductData(productArr);
    }); 
  }

  const selectedCategoryId = (e) => {
    const selectedId = e.target.value;
    setSelectedCategory(selectedId)
    setSelectedSubCategory("All")

    fetchDataFromApi(`/api/product/getAllProductsByCatId/${e.target.value}`).then((res)=>{
       setProductData(res?.products);
    })

  };
  const selectedSubCategoryId = (e) => {
    const selectedId = e.target.value;
    setSelectedSubCategory(selectedId)
    setSelectedCategory("All")

    fetchDataFromApi(`/api/product/getAllProductsBySubCatId/${e.target.value}`).then((res)=>{
       setProductData(res?.products);
    })
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const totalPages = Math.ceil(productData.length / perPage);

  const paginatedProducts = productData.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handleSearch = (query) => {
    console.log("Searching:", query);
  };

  const handleDelete = (id) => {
    deleteData(`/api/product/delete/${id}`).then((res) => {
      if (res) {
        context.openAlertBox("success", res.data.message);
        fetchDataFromApi("/api/product/").then((res) => {
          setProductData(res?.products);
        });
      }
    });
  };

  const handleSelectAll = (e)=>{
    const isChecked = e.target.checked;
    const updatedItem = productData.map((item)=>({
      ...item,
      checked:isChecked
    }))
    setProductData(updatedItem)
    if(isChecked){
      const ids = updatedItem.map((item)=>item._id).sort((a,b)=>a-b)
      setSortedIds(ids)
    }else{
      setSortedIds([])
    }
  }

  const handleCheckBoxChange = (e,id,index)=>{
    const updatedItem=productData.map((item)=>
    item._id === id ? {...item, checked:!item.checked}:item
    )
    setProductData(updatedItem)

    const selectedIds =updatedItem.filter((item)=> item.checked).map((item)=>item._id).sort((a,b)=>a-b)
    setSortedIds(selectedIds)

  }

  const deleteMultiple =()=>{
    if(sortedIds.length===0){
      context.openAlertBox("error","Please select Atleast One Item")
    }
    try {
      deleteMultipleData(`/api/product/deleteMultiple`,
        sortedIds,
      ).then((res)=>{
        getProducts()
        context.openAlertBox("success","Product Deleted")

      })
      
    } catch (error) {
        context.openAlertBox("error","Can't Delete")
      
    }
  }




  return (      
    <>
     <div className="productTable font-sans bg-white shadow-md rounded-lg p-4 md:p-6 overflow-x-auto">
  {/* Header & Top Controls */}
  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
    <h2 className="text-xl md:text-2xl font-bold text-gray-800">Product List</h2>
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">
      {sortedIds.length !== 0 && (
        <button
          onClick={deleteMultiple}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow w-full sm:w-auto"
        >
          Delete
        </button>
      )}
      <Link to="/product/upload" className="flex">
        <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow w-full sm:w-auto">
        + Add Product
        </button>
      </Link>
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow w-full sm:w-auto">
        📤 Export
      </button>
    </div>
  </div>

 {/* Filter Section */}
<div className="flex flex-col gap-4 mb-4">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
    <div className="flex flex-col w-full">
      <label className="block font-semibold text-gray-700 mb-1 text-sm">
        Category
      </label>
      <select
        value={selectedCategory}
        onChange={selectedCategoryId}
        className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-medium w-full"
      >
        <option value="">-- Select Category --</option>
        {cateData.map((cat) => (
          <option key={cat?._id} value={cat?._id}>
            {cat?.name}
          </option>
        ))}
      </select>
    </div>
    <div className="flex flex-col w-full">
      <label className="block font-semibold text-gray-700 mb-1 text-sm">
        Subcategory
      </label>
      <select
        value={selectedSubCategory}
        onChange={selectedSubCategoryId}
        className="border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-medium w-full"
      >
        <option value="">-- Select Sub-Category --</option>
        {cateData.map((cat) =>
          cat?.subCategories?.map((subCat) => (
            <option key={subCat._id} value={subCat._id}>
              {subCat.name}
            </option>
          ))
        )}
      </select>
    </div>
    <div className="w-full mt-0 sm:mt-2">
      <SearchBox onSearch={handleSearch} />
    </div>
  </div>
</div>



  {/* Table */}
  <div className="overflow-y-auto max-h-[500px] rounded-md">
    <table className="w-full text-sm text-left text-gray-700 min-w-[800px]">
      <thead className="bg-gray-100 text-xs uppercase sticky top-0 z-10">
        <tr>
          <th className="px-4 py-3">
            <input
              type="checkbox"
              onChange={handleSelectAll}
              checked={
                productData.length > 0
                  ? productData.every((item) => item.checked)
                  : false
              }
            />
          </th>
          <th className="px-4 py-3">Product</th>
          <th className="px-4 py-3">Category</th>
          <th className="px-4 py-3">Subcategory</th>
          <th className="px-4 py-3">Stock</th>
          <th className="px-4 py-3">Price</th>
          <th className="px-4 py-3">Rating</th>
          <th className="px-4 py-3 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {paginatedProducts.length !== 0 ? (
          paginatedProducts.map((product, idx) => (
            <tr
              key={idx}
              className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={product.checked || false}
                  onChange={(e) =>
                    handleCheckBoxChange(e, product._id, idx)
                  }
                />
              </td>
              <td className="px-4 py-3 flex items-center gap-2 min-w-[300px] lg:min-w-[200px]">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-12 h-12 rounded object-cover"
                />
                <div>
                  <div className="font-semibold mb-1">{product.name}</div>
                  <div className="text-xs font-semibold text-gray-500">
                    {product._id}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">{product.catName}</td>
              <td className="px-4 py-3">{product.subCatName}</td>
              <td className="px-4 py-3">{product.countInStock}</td>
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="line-through text-gray-400 font-semibold text-xs">
                    {product.oldPrice}
                  </span>
                  <span className="font-bold text-sm">{product.price}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <Rating
                  name="half-rating-read"
                  defaultValue={product.rating}
                  precision={0.5}
                  readOnly
                  size="small"
                />
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex gap-2 justify-center">
                  <Link to={`/product/view/${product._id}`}>
                    <button className="text-blue-500 hover:text-blue-700">
                      <FaEye className="text-[18px]" />
                    </button>
                  </Link>
                  <button
                    onClick={() => history(`/product/edit/${product._id}`)}
                    className="text-green-500 hover:text-green-700"
                  >
                    <FaEdit className="text-[18px]" />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash className="text-[16px]" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" className="text-center py-6 text-gray-500">
              No Products Available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* Pagination */}
  <div className="flex justify-between items-center mt-4 text-sm">
    <span>
      Page {currentPage} of {totalPages}
    </span>
    <div className="space-x-2">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>
      <button
        onClick={() =>
          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
        }
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</div>

    </>
  );
};

export default Products;
