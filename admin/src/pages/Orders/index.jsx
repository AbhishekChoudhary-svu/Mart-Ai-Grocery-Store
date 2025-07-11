import React, { useState, useEffect } from "react";
import SearchBox from "../../components/SearchBox";
import { Collapse } from "react-collapse";
import { editData, fetchDataFromApi } from "../../utils/api";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const Orders = () => {
  const [orderData, setOrderData] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
   const [ordStatus, setOrdStatus] = useState('Pending');
    const [currentPage, setCurrentPage] = useState(1);
     const [perPage, setPerPage] = useState(5);

     const [searchQuery , setSearchQuery]= useState("")
   
     // filter by order ID, customer name, email etc. (you can customize)
const filteredOrders = orderData?.filter(order =>
  order._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  order.deliveryAddress?.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  order.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  order.orderStatus?.toLowerCase().includes(searchQuery.toLowerCase())
);

const totalPages = Math.ceil(filteredOrders.length / perPage);

const paginatedProducts = filteredOrders.slice(
  (currentPage - 1) * perPage,
  currentPage * perPage
);


  const handleChange = (event,id) => {
    setOrdStatus(event.target.value);
    editData(`/api/order/update`,{_id:id,orderStatus:event.target.value }).then((res)=>{
       fetchDataFromApi("/api/order/getAllUsers").then((res) => {
      setOrderData(res?.data);
    });
    }) 
  }; // track expanded orders

  useEffect(() => {
    fetchDataFromApi("/api/order/getAllUsers").then((res) => {
      setOrderData(res?.data);
    });
  }, []);

  const toggleRow = (orderId) => {
    setExpandedRows((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  

  return (
    <div className="orderTable font-sans bg-white shadow-md rounded-lg p-6 mb-5">
      <div className=" flex-col sm:flex  items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
        <div className="mb-3 flex items-center">

        <SearchBox 
  
  searchQuery={searchQuery}
  setSearchQuery={setSearchQuery}
  setCurrentPage={setCurrentPage}
  placeholder="Search Your Orders..." 
/>

        </div>
      </div>

      <div className="max-h-[520px]  overflow-x-scroll pr-4 pb-5">
        <table className="w-full text-sm font-[500] text-left text-gray-700">
          <thead className="bg-green-100 text-xs text-gray-700 uppercase sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">User ID</th>
              <th className="px-6 py-4">Customer Name</th>
              <th className="px-6 py-4">Items</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Payment</th>
              <th className="px-6 py-4">Shipping Address</th>
              <th className="px-6 py-4">Pincode</th>
              <th className="px-6 py-4">Tracking #</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((order, index) => (
              <React.Fragment key={order._id}>
                {/* Main order row */}
                <tr className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                  <td className="px-6 py-4 font-bold text-gray-900">{order._id}</td>
                  <td className="px-6 py-4 font-bold">{order.userId?._id}</td>
                  <td className="px-6 py-4 min-w-[200px]">{order.deliveryAddress?.userName}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleRow(order._id)}
                      className="text-blue-600 underline text-xs"
                    > 
                      {expandedRows.includes(order._id) ? "Hide Items" : "View Items"}
                    </button>
                  </td>
                  <td className="px-6 py-4">{order.deliveryAddress?.mobile}</td>
                  <td className="px-6 py-4">{order.userId?.email}</td>
                  <td className="px-6 py-4 min-w-[140px]">{order.createdAt.split("T")[0]}</td>
                  <td className="px-6 py-4">
                     <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={order.orderStatus !== null ? order.orderStatus : ordStatus}
          label="orderStatus"
          size="small"
          className="w-full"
          onChange={(e)=>handleChange(e,order._id)}
        >
          <MenuItem value={"Pending"}>Pending</MenuItem>
          <MenuItem value={"Shipped"}>Shipped</MenuItem>
          <MenuItem value={"Delivered"}>Delivered</MenuItem>
          <MenuItem value={"Cancelled"}>Cancelled</MenuItem>
          
        </Select>
                  </td>
                  <td className="px-6 py-4">₹{order.totalAMT}</td>
                  <td className="px-6 py-4 min-w-[180px]">{order.paymentId || order.paymentStatus}</td>
                  <td className="px-6 py-4 min-w-[300px]">
                    {order.deliveryAddress?.address_line}, {order.deliveryAddress?.city},{" "}
                    {order.deliveryAddress?.state}, {order.deliveryAddress?.country}
                  </td>
                  <td className="px-6 py-4">{order.deliveryAddress?.pincode}</td>
                  <td className="px-6 py-4 min-w-[200px]">
                    {order.trackingNumber || (
                      <span className="text-gray-400 italic">Not Available</span>
                    )}
                  </td>
                </tr>

                {/* Nested product table */}
                <tr>
                  <td colSpan="7" className="p-0">
                    <Collapse isOpened={expandedRows.includes(order._id)}>
                      <div className="p-4 bg-gray-50 ">
                        <table className="w-full text-sm font-[500] text-gray-700 ">
                          <thead className="bg-blue-100">
                            <tr>
                              <th className="px-4 py-2 ">Product ID</th>
                              <th className="px-4 py-2 ">Name</th>
                              <th className="px-4 py-2 ">Price</th>
                              
                              <th className="px-4 py-2 ">Quantity</th>
                              <th className="px-4 py-2 ">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.products.map((item, idx) => (
                              <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                                <td className="px-4 py-2 ">{item.productId}</td>
                                <td className="px-4 py-2 ">{item.productTitle}</td>
                                <td className="px-4 py-2 ">₹{item.price}</td>
                              
                                <td className="px-4 py-2 ">{item.quantity}</td>
                                <td className="px-4 py-2 ">₹{item.subTotal}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Collapse>
                  </td>
                </tr>
              </React.Fragment>
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
  );
};

export default Orders;
