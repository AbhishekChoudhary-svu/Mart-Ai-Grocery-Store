import { React, useEffect, useState } from "react";
import SearchBox from "../../components/SearchBox";
import { fetchDataFromApi } from "../../utils/api";
import { HiOutlineMail } from "react-icons/hi";

const Users = () => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    fetchDataFromApi("/api/user/orderCount").then((res) => {
      setUserData(res.data || []);
    });
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [searchQuery, setSearchQuery] = useState("");

  // filter by order ID, customer name, email etc. (you can customize)
  const filteredOrders = (userData || []).filter(
    (user) =>
      user._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(user.mobile ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      String(user.orderCount ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / perPage);

  const paginatedProducts = filteredOrders.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );
  return (
    <>
      <div className="userTable bg-white shadow-md rounded-lg p-6 overflow-x-hidden">
        <div className="flex flex-col gap-1 mb-4">
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Users List</h2>
    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow w-full sm:w-auto">
      📤 Export
    </button>
  </div>

  <div className="flex justify-center md:justify-start">
    <div className="w-full md:w-auto">
      <SearchBox
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setCurrentPage={setCurrentPage}
        placeholder="Search Users..."
      />
    </div>
  </div>
</div>

        <div className="overflow-y-auto max-h-[440px]">
          <table className="w-full text-md text-left font-sans text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3">
                  <input type="checkbox" />
                </th>

                <th className="px-4 py-3">Profile</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">User ID</th>
                <th className="px-4 py-3">Verify</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Order Count</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((user, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-100"}
                >
                  <td className="px-4 py-3">
                    <input type="checkbox" className="" />
                  </td>

                  <td className="px-4 py-4 flex items-center  gap-3 font-[500]">
                    <img
                      src={
                        user?.avatar !== "" && user?.avatar !== undefined
                          ? user?.avatar
                          : "/user.jpg"
                      }
                      className="w-13 h-13 rounded-lg overflow-hidden object-cover"
                      alt=""
                    />
                    <div className="font-[500] flex flex-col ">
                      <span className="capitalize font-[800]">{user.name}</span>
                      <span className="flex gap-1 items-center ">
                        <HiOutlineMail className="mt-1 text-[16px]" />
                        {user.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-[500]">
                    {user.mobile || "None"}
                  </td>
                  <td className="px-4 py-3 font-[800]">{user._id}</td>
                  <td className="px-4 py-3 font-[500]">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-[500] 
                          ${
                            user.verify_email === true
                              ? "bg-green-200 text-green-700"
                              : "bg-red-200 text-red-700"
                          }
                        `}
                    >
                      {user.verify_email === true ? "Verified" : "Not Yet"}
                    </span>
                  </td>

                  <td className="px-4 py-3 font-[500] capitalize">
                    {user.role}
                  </td>
                  <td className="px-4 py-3 text-center font-[800]">
                    <span className="  text-[15px]">
                      {user?.orderCount === 0 ? "No Orders" : user?.orderCount}
                    </span>{" "}
                  </td>
                </tr>
              ))}
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

export default Users;
