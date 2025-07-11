import { React, useContext, useEffect, useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import SearchBox from "../../components/SearchBox";
import { Link, useNavigate } from "react-router-dom";
import { deleteData, fetchDataFromApi } from "../../utils/api";
import { MyContext } from "../../App";

const Categories = () => {
  const history = useNavigate();
  const context = useContext(MyContext);

  const [cateData, setCateData] = useState([]);

  useEffect(() => {
    fetchDataFromApi("/api/category/").then((res) => {
      setCateData(res?.categories);
    });
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(3);

  const totalPages = Math.ceil(cateData?.length / perPage);

  const paginatedProducts = cateData?.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handleSearch = (query) => {
    console.log("Searching:", query);
  };
  const handleDelete = (id) => {
    deleteData(`/api/category/delete/${id}`).then((res) => {
      if (res?.data?.success) {
        context.openAlertBox("success", res.data.message);
        fetchDataFromApi("/api/category/").then((res) => {
          setCateData(res?.categories);
        });
      }
    });
  };
  return (
    <>
      <div className="categoryTable bg-white shadow-md rounded-lg p-6 pt-4  overflow-x-hidden">
        <div className="flex flex-col gap-3 mb-4">
          {/* Top row: title + buttons */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Category List
            </h2>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">
              <Link to="/category/add" className="w-full sm:w-auto">
                <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow w-full sm:w-auto">
                  + Add Category
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
                placeholder="Search Your Categories..."
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
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length !== 0 ? (
                paginatedProducts?.map((cat, idx) => {
                  return (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-100"}
                    >
                      <td className="px-4 py-3">
                        <input type="checkbox" className="" />
                      </td>
                      <td className="px-4 py-3 flex items-center gap-2 max-w-[200px]">
                        <img
                          src={cat.images}
                          alt={"dasd"}
                          className="w-full  h-full  rounded object-cover"
                        />
                      </td>

                      <td className="px-4 py-3 font-bold">{cat.name}</td>

                      <td className="px-4 py-3 text-center space-x-2">
                        <div className="space-x-6 flex items-center">
                          <button className="text-green-500 hover:text-green-700">
                            <Link to={`/category/edit/${cat._id}`}>
                              <FaEdit className="text-[20px]" />
                            </Link>
                          </button>
                          <button
                            onClick={() => handleDelete(cat._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash className="text-[18px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500">
                    No Category Available
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

export default Categories;
