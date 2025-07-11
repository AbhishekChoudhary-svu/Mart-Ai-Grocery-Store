import { React, useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import SearchBox from "../../components/SearchBox";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "../../App";
import {
  deleteData,
  deleteMultipleData,
  fetchDataFromApi,
} from "../../utils/api";
import { useEffect } from "react";

const HomeSliderBanners = () => {
  const history = useNavigate();
  const context = useContext(MyContext);

  const [slideData, setSlideData] = useState([]);
  const [sortedIds, setSortedIds] = useState([]);

  useEffect(() => {
    getSlides();
  }, []);

  const getSlides = async () => {
    fetchDataFromApi("/api/homeSlides/").then((res) => {
      let slidesArr = [];
      for (let i = 0; i < res?.slides?.length; i++) {
        slidesArr[i] = res?.slides[i];
        slidesArr[i].checked = false;
      }
      setSlideData(slidesArr);
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(3);

  const totalPages = Math.ceil(slideData.length / perPage);

  const paginatedProducts = slideData.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handleSearch = (query) => {
    console.log("Searching:", query);
  };
  const handleDelete = (id) => {
    deleteData(`/api/homeSlides/delete/${id}`).then((res) => {
      if (res?.data?.success) {
        context.openAlertBox("success", res.data.message);
        fetchDataFromApi("/api/homeSlides/").then((res) => {
          setSlideData(res?.slides);
        });
      }
    });
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    const updatedItem = slideData.map((item) => ({
      ...item,
      checked: isChecked,
    }));
    setSlideData(updatedItem);
    if (isChecked) {
      const ids = updatedItem.map((item) => item._id).sort((a, b) => a - b);
      setSortedIds(ids);
    } else {
      setSortedIds([]);
    }
  };

  const handleCheckBoxChange = (e, id, index) => {
    const updatedItem = slideData.map((item) =>
      item._id === id ? { ...item, checked: !item.checked } : item
    );
    setSlideData(updatedItem);

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
      deleteMultipleData(
        `/api/homeSlides/deleteMultipleSLides`,
        sortedIds
      ).then((res) => {
        getSlides();
        context.openAlertBox("success", "Product Deleted");
      });
    } catch (error) {
      context.openAlertBox("error", "Can't Delete");
    }
  };

  return (
    <>
      <div className="HomeSlideList bg-white shadow-md rounded-lg p-6 pt-4  overflow-x-hidden">
        <div className="flex flex-col gap-3 mb-4">
          {/* Top header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-0">
              Home Banner Slides List
            </h2>
             <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              {sortedIds.length !== 0 && (
                <button
                  onClick={deleteMultiple}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow w-full sm:w-auto"
                >
                  Delete
                </button>
              )}
              <Link to="/homeSlider/AddBanner" className="w-full sm:w-auto">
                <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow w-full sm:w-auto">
                  + Add Banner Slides
                </button>
              </Link>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow w-full sm:w-auto">
                📤 Export
              </button>
            </div>
          </div>

          {/* Filter row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="w-full md:w-auto">
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
                      slideData.length > 0
                        ? slideData.every((item) => item.checked)
                        : false
                    }
                  />
                </th>
                <th className="px-4 py-3">Home Banner Slides</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length !== 0 ? (
                paginatedProducts.map((slides, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-100"}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className=""
                        checked={slides.checked === true ? true : false}
                        onChange={(e) =>
                          handleCheckBoxChange(e, slides._id, idx)
                        }
                      />
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2 min-w-[200px]">
                      <img
                        src={slides.images}
                        alt={slides.name}
                        className="w-[500px]  h-[100px]  rounded object-cover"
                      />
                    </td>

                    <td className="px-4 py-3 text-center space-x-2">
                      <div className="space-x-3 flex items-center">
                        <button className="text-green-500 hover:text-green-700">
                          {" "}
                          <Link to={`/homeSlider/editBanner/${slides._id}`}>
                            <FaEdit className="text-[20px]" />
                          </Link>
                        </button>
                        <button
                          onClick={() => handleDelete(slides._id)}
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
                    No Slides Available
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

export default HomeSliderBanners;
