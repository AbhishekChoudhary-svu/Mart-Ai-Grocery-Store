import { React, useState, useEffect } from "react";
import DashboardBoxes from "../../components/DashboardBoxes";
import { MdOutlineWavingHand } from "react-icons/md";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import SearchBox from "../../components/SearchBox";

import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "../../App";

import {
  deleteData,
  deleteMultipleData,
  fetchDataFromApi,
} from "../../utils/api";
import Orders from "../Orders";
import Products from "../Products";
import Users from "../Users";

const Dashboard = () => {
  const history = useNavigate();
  const context = useContext(MyContext);
  const [productData, setProductData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [salesData, setSalesData] = useState([]);

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchDataFromApi("/api/product/").then((res) => {
      setProductData(res.products);
    });
    fetchDataFromApi("/api/order/getAllUsers").then((res) => {
      setOrderData(res.data);
    });
    fetchDataFromApi("/api/user/").then((res) => {
      setUserData(res.data);
    });
  }, []);
  useEffect(() => {
    const deliveredSales = orderData
      .filter((order) => order.orderStatus === "Delivered")
      .reduce((sum, order) => sum + (order.totalAMT || 0), 0);
    setSalesData(deliveredSales);
  }, [orderData]);

  useEffect(() => {
    if (userData.length === 0 && orderData.length === 0) return;

    // Prepare an object with months
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Initialize data
    const dataByMonth = months.map((month, idx) => ({
      month,
      users: 0,
      sales: 0,
    }));

    // Aggregate users by createdAt month
    userData.forEach((user) => {
      if (user.createdAt) {
        const date = new Date(user.createdAt);
        const monthIdx = date.getMonth(); // 0-11
        dataByMonth[monthIdx].users += 1;
      }
    });

    // Aggregate orders by createdAt month
    orderData.forEach((order) => {
      if (order.createdAt) {
        const date = new Date(order.createdAt);
        const monthIdx = date.getMonth(); // 0-11
        dataByMonth[monthIdx].sales += order.totalAMT || 0;
      }
    });

    setChartData(dataByMonth);
  }, [userData, orderData]);

  return (
    <>
      <div className="introInterFace flex flex-col md:flex-row bg-white justify-between gap-6 md:gap-8 p-4 md:p-5 border border-[#f1f1f1] rounded-md shadow-md mb-5 w-full">
        <div className="info space-y-4 md:space-y-6 lg:space-y-8 flex-1">
          <h1 className="text-[24px] md:text-[30px] lg:text-[35px] font-bold  mb-2">
            Good Morning,
          </h1>
          <h1 className="text-[25px] md:text-[32px] lg:text-[35px] font-bold leading-tight flex items-center gap-2">
            {context?.userData?.name}
            <MdOutlineWavingHand className="fill-green-500 text-green-500" />
          </h1>
          <p className="font-[500]  text-gray-500">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Modi,
            tenetur!
          </p>
          <Link to="/product/upload">
            <Button className="!bg-green-500 !text-white !px-3 !py-2 !text-sm md:!text-base">
              + Add Product
            </Button>
          </Link>
        </div>

        <div className="hidden md:block w-[250px] lg:w-[300px] flex-shrink-0">
          <img
            src="/shopping.png"
            alt=""
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      <DashboardBoxes
        productData={productData}
        orderData={orderData}
        userData={userData}
        salesData={salesData}
      />

      <Products />

      <div className="Charts bg-white shadow-md rounded-lg p-6 my-4">
        <div className="flex justify-between  mb-4">
          <div className="max-w-sm p-4 py-0 bg-white flex flex-col rounded-lg">
            <h2 className="text-xl font-bold mb-2 text-gray-800">
              Total Users & Sales Chart
            </h2>
            <div className="flex gap-4 mt-2">
              <label className=" text-sm font-medium text-gray-700 mb-2 flex  items-center gap-2">
                <span className="w-3 h-3 bg-purple-500 rounded-full min-w-3"></span>
                Users
              </label>
              <label className=" text-sm font-medium text-gray-700 mb-2 flex  items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full min-w-3"></span>
                Sales
              </label>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 40, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="none" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#8884d8"
              strokeWidth={3}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#82ca9d"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <Orders />

      <Users />
    </>
  );
};

export default Dashboard;
