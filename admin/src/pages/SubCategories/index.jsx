import { React, useEffect, useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import SearchBox from "../../components/SearchBox";
import { Link, useNavigate } from "react-router-dom";
import Chip from "@mui/material/Chip";
import { deleteData, fetchDataFromApi } from "../../utils/api";

const SubCategories = () => {
  const [cateData, setCateData] = useState([]);
  const history = useNavigate();

  const handleEdit = (subCategoryId) => {
    history(`/category/subCategories/edit/${subCategoryId}`);
  };

  useEffect(() => {
    fetchDataFromApi("/api/category").then((res) => {
      setCateData(res?.categories);
    });
  }, []);

  const handleCatDelete = async (CategoryId) => {
    try {
      const res = await deleteData(`/api/category/delete/${CategoryId}`);
      if (res) {
        // Refetch updated data
        const updated = await fetchDataFromApi("/api/category");
        setCateData(updated?.categories || []);
      } else {
        alert(res?.message || "Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting sub-category", error);
    }
  };
  const handleDelete = async (subCategoryId) => {
    try {
      const res = await deleteData(
        `/api/category/deleteSubCategory/${subCategoryId}`
      );
      if (res) {
        // Refetch updated data
        const updated = await fetchDataFromApi("/api/category");
        setCateData(updated?.categories || []);
      } else {
        alert(res?.message || "Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting sub-category", error);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(3);

  const totalPages = Math.ceil(cateData.length / perPage);

  const paginatedProducts = cateData.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handleSearch = (query) => {
    console.log("Searching:", query);
  };
  return (
    <>
      <div className="subCategoriesTable bg-white shadow-md rounded-lg p-6 pt-4  overflow-x-hidden">
        <div className="flex flex-col gap-3  mb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <h2 className="text-[25px] font-bold pl-1 mb-2 text-gray-800">
              Sub-Category List
            </h2>
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-3 w-full md:w-auto">
              <Link to="/category/subCategories/add">
                <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow w-full sm:w-auto">
                  + Add Sub-Category
                </button>
              </Link>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow w-full sm:w-auto">
                📤 Export
              </button>
            </div>
          </div>
          {/* Search box */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div className="w-full md:w-1/2">
              <SearchBox
                onSearch={handleSearch}
                placeholder="Search Your sub-Categories..."
              />
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[450px]">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3">
                  <input type="checkbox" />
                </th>
                <th className="px-4 py-3">Category Image</th>
                <th className="px-4 py-3 ">Category Name</th>
                <th className="px-4 py-3 ">Sub-Category Name</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length !== 0 ? (
                paginatedProducts.map((product, idx) => (
                  <tr
                    key={product._id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-100"}
                  >
                    <td className="px-4 py-3">
                      <input type="checkbox" className="" />
                    </td>
                    <td className="px-4 py-3    gap-2 max-w-[200px]">
                      <img
                        src={product.images}
                        alt={""}
                        className="w-full  h-full  rounded object-cover"
                      />
                    </td>

                    <td className="px-4 py-3 font-bold">{product.name}</td>
                    <td className="px-4 py-3  font-bold">
                      {product.subCategories?.length > 0 ? (
                        product.subCategories.map((sub, idx) => (
                          <Chip
                            key={idx}
                            label={sub.name}
                            color="success"
                            variant="outlined"
                            onClick={() =>
                              history(`/category/subCategories/edit/${sub._id}`)
                            } // 👈 Edit on chip click
                            onDelete={() => handleDelete(sub._id)}
                            className="mr-2 mb-1"
                          />
                        ))
                      ) : (
                        <span className="text-gray-500 italic">
                          No sub-categories
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center space-x-2">
                      <div className="space-x-3 flex items-center">
                        <button
                          onClick={() => handleCatDelete(product._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash className="text-[18px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500">
                    No Sub-Category Available
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

export default SubCategories;
