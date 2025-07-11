import React from "react";
import { useContext } from "react";
import { MyContext } from "../../App";
import { useState } from "react";
import { useEffect } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import SearchBox from "../../components/SearchBox";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteData,
  deleteMultipleData,
  fetchDataFromApi,
} from "../../utils/api";

const AdsBanner = () => {
  const history = useNavigate();
  const context = useContext(MyContext);

  const [bannerData, setBannerData] = useState([]);
  const [sortedIds, setSortedIds] = useState([]);

  useEffect(() => {
    getBanner();
  }, []);

  const getBanner = async () => {
    fetchDataFromApi("/api/Banner/").then((res) => {
      let bannerArr = [];
      for (let i = 0; i < res?.banner?.length; i++) {
        bannerArr[i] = res?.banner[i];
        bannerArr[i].checked = false;
      }
      setBannerData(bannerArr);
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(3);

  const totalPages = Math.ceil(bannerData.length / perPage);

  const paginatedProducts = bannerData.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handleSearch = (query) => {
    console.log("Searching:", query);
  };
  const handleDelete = (id) => {
    deleteData(`/api/Banner/delete/${id}`).then((res) => {
      if (res?.data?.success) {
        context.openAlertBox("success", res.data.message);
        fetchDataFromApi("/api/Banner/").then((res) => {
          setBannerData(res?.banner);
        });
      }
    });
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    const updatedItem = bannerData.map((item) => ({
      ...item,
      checked: isChecked,
    }));
    setBannerData(updatedItem);
    if (isChecked) {
      const ids = updatedItem.map((item) => item._id).sort((a, b) => a - b);
      setSortedIds(ids);
    } else {
      setSortedIds([]);
    }
  };

  const handleCheckBoxChange = (e, id, index) => {
    const updatedItem = bannerData.map((item) =>
      item._id === id ? { ...item, checked: !item.checked } : item
    );
    setBannerData(updatedItem);

    const selectedIds = updatedItem
      .filter((item) => item.checked)
      .map((item) => item._id)
      .sort((a, b) => a - b);
    setSortedIds(selectedIds);
  };

  const deleteMultiple = () => {
    if (sortedIds.length === 0) {
      context.openAlertBox("error", "Please select Atleast One Item");
    }
    try {
      deleteMultipleData(`/api/Banner/deleteMultipleBanner`, sortedIds).then(
        (res) => {
          getBanner();
          context.openAlertBox("success", "Banner Deleted");
        }
      );
    } catch (error) {
      context.openAlertBox("error", "Can't Delete");
    }
  };

  return (
    <div className="productTable bg-white shadow-md rounded-lg p-6 pt-4  overflow-x-hidden">
      <div className="flex flex-col gap-3 mb-4">
        {/* Top row: title + action buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Ads Banner List
          </h2>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">
            {sortedIds.length !== 0 && (
              <button
                onClick={deleteMultiple}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow w-full sm:w-auto"
              >
                Delete
              </button>
            )}
            <Link to="/AdsBanner/Add" className="w-full sm:w-auto">
              <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow w-full sm:w-auto">
                + Add Banner
              </button>
            </Link>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow w-full sm:w-auto">
              📤 Export
            </button>
          </div>
        </div>

        {/* Second row: search box */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="w-full md:w-1/2">
            <SearchBox
              onSearch={handleSearch}
              placeholder="Search Your Banner..."
            />
          </div>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[450px]">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    bannerData.length > 0
                      ? bannerData.every((item) => item.checked)
                      : false
                  }
                />
              </th>
              <th className="px-4 py-3">Ads Banner </th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length !== 0 ? (
              paginatedProducts.map((banner, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-100"}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className=""
                      checked={banner.checked === true ? true : false}
                      onChange={(e) => handleCheckBoxChange(e, banner._id, idx)}
                    />
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2 min-w-[200px]">
                    <img
                      src={banner.images}
                      alt={banner.name}
                      className="w-[500px]  h-[100px]  rounded object-cover"
                    />
                  </td>

                  <td className="px-4 py-3 text-center space-x-2">
                    <div className="space-x-3 flex items-center">
                      <button className="text-green-500 hover:text-green-700">
                        {" "}
                        <Link to={`/AdsBanner/Edit/${banner._id}`}>
                          <FaEdit className="text-[20px]" />
                        </Link>
                      </button>
                      <button
                        onClick={() => handleDelete(banner._id)}
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
                  No Banner Available
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
  );
};

export default AdsBanner;
