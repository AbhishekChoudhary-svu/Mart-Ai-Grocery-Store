import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Collapse } from "react-collapse";
import {
  PackageOpen,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  TicketCheck,
  Phone,
  AtSign,
  IndianRupee,
  CircleUserRound,
  EyeOff,
  Truck,
  MapPin,
  Calendar,
  CreditCardIcon as PaymentIcon,
  Eye,
  MessageCircle,
} from "lucide-react";
import LeftSideBarMenu from "../../components/LeftSideBarMenu";
import { fetchDataFromApi } from "../../utils/api";
import { MyContext } from "../../App";

const OrderPage = () => {
  const context = useContext(MyContext);
  const [orderData, setOrderData] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [expandedTrackId, setExpandedTrackId] = useState(null);
  const history = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token === null || token === "" || token === undefined) {
      history("/login"); 
    }
  }, []);  

  useEffect(() => {
    fetchDataFromApi("/api/order/get").then((res) => {
      setOrderData(res?.data || []);
    });
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "Shipped":
        return <Truck className="h-5 w-5 text-blue-500" />;
      case "Pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "Cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "Shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <section className="py-2">
      <div className="container max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Sidebar hidden on small screens */}
          {context.windowWidth > 768 && <LeftSideBarMenu />}

          <div className="flex-1">
            <div className="bg-white shadow rounded-lg overflow-hidden mb-3">
              <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      My Orders
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-gray-500">
                      Track and manage your orders.
                    </p>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    {orderData.length} {orderData.length === 1 ? "order" : "orders"}
                  </div>
                </div>
              </div>
            </div>

            {orderData.length !== 0 ? (
              <div className="overflow-y-auto max-h-[600px] space-y-3 pr-1 sm:pr-3">
                {orderData.map((order, idx) => (
                  <div key={idx} className="bg-white shadow rounded-lg overflow-hidden">
                    {/* Order Header */}
                    <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
                      <div className="flex flex-col sm:flex-row justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {getStatusIcon(order.orderStatus)}
                          <span className="text-xs sm:text-sm font-medium text-gray-900">
                            {order._id}
                          </span>
                          <span className={`px-2 py-0.5 text-xs rounded-full border ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">
                          Date: {order.createdAt.split("T")[0]}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="px-4 sm:px-6">
                      {order.products.map((item, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b py-3 border-gray-200">
                          <div className="flex gap-3">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.productTitle}
                            className="h-16 w-16 object-cover rounded border"
                          />
                           <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">{item.productTitle}</h4>

                            <p className="text-xs sm:text-sm text-gray-800">Price: ₹{item.price}</p>
                            <p className="text-xs sm:text-sm text-gray-800">Quantity: {item.quantity}</p>
                          </div>
                            </div>
                         
                          <p className="text-xs sm:text-sm font-[500] text-gray-900">Total Amount:&nbsp;₹{item.subTotal}</p>
                        </div>
                      ))}
                    </div>

                    {/* Order Details Collapse */}
                    <Collapse isOpened={expandedOrderId === order._id}>
                      <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm">
                          {/* User info */}
                          <div className="space-y-3">
                            <InfoRow icon={<CircleUserRound className="h-4 w-4" />} label="Username" value={order.deliveryAddress.userName} />
                            <InfoRow icon={<Phone className="h-4 w-4" />} label="Mobile No." value={order.deliveryAddress.mobile} />
                            <InfoRow icon={<AtSign className="h-4 w-4" />} label="Email" value={order.userId.email} />
                          </div>
                          {/* Payment info */}
                          <div className="space-y-3">
                            <InfoRow icon={<IndianRupee className="h-4 w-4" />} label="Total Amount" value={`₹${order.totalAMT}`} />
                            <InfoRow icon={<PaymentIcon className="h-4 w-4" />} label="Payment Method" value={order.paymentStatus} />
                            <InfoRow icon={<TicketCheck className="h-4 w-4" />} label="Payment ID" value={order.paymentId || "Payment Pending"} />
                          </div>
                          {/* Address & delivery */}
                          <div className="space-y-3">
                            <InfoRow
                              icon={<MapPin className="h-4 w-4" />}
                              label="Shipping Address"
                              value={`${order.deliveryAddress.address_line}, ${order.deliveryAddress.city} - ${order.deliveryAddress.pincode}, ${order.deliveryAddress.state}, ${order.deliveryAddress.country}`}
                            />
                            {order.estimatedDelivery && (
                              <InfoRow
                                icon={<Calendar className="h-4 w-4" />}
                                label="Estimated Delivery"
                                value={order.estimatedDelivery.split("T")[0]}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </Collapse>

                    {/* Actions */}
                    <div className="px-4 sm:px-6 py-3 bg-white border-t border-gray-200 flex flex-wrap gap-2 justify-between">
                      <div className="flex gap-2">
                        <ToggleButton
                          isOpen={expandedOrderId === order._id}
                          onClick={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)}
                          openLabel="Close Details"
                          closedLabel="View Details"
                        />
                        <ToggleButton
                          isOpen={expandedTrackId === order._id}
                          onClick={() => setExpandedTrackId(expandedTrackId === order._id ? null : order._id)}
                          openLabel="Track Package"
                          closedLabel="Track Package"
                          color="blue"
                          icon={<Truck className="h-3 w-3 mr-1.5" />}
                        />
                      </div>
                      <button className="flex items-center px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded">
                        <MessageCircle className="h-3 w-3 mr-1.5" />
                        Contact Support
                      </button>
                    </div>
                    <Collapse isOpened={expandedTrackId === order._id}>
                        <div className="px-6 py-4 font-[500] bg-gray-50 border-t border-gray-200">
                          {order.cancelledDate ? (
                            <div className="flex items-center justify-center  text-red-600">
                              <XCircle className="h-5 w-5" />
                              <div className="text-center">
                                <p className="font-semibold">Order Cancelled</p>
                                <p className="text-xs">
                                  {order.cancelledDate.split("T")[0]}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {order.cancelReason || "Out Of Stock"}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-between items-center relative">
                              {/* Step: Order Placed */}
                              <div className="flex flex-col items-center flex-1">
                                {order.createdAt ? (
                                  <>
                                    <CheckCircle className="h-6 w-6 text-green-500" />
                                    <p className="mt-1 text-xs font-medium text-gray-700">
                                      Order Placed
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {order.createdAt.split("T")[0]}
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="h-6 w-6 text-gray-400" />
                                    <p className="mt-1 text-xs font-medium text-gray-500">
                                      Order Placed
                                    </p>
                                  </>
                                )}
                              </div>

                              {/* Connector */}
                              <div className="flex-1 border-t-2 mx-2 border-dashed border-gray-300"></div>

                              {/* Step: Shipped */}
                              <div className="flex flex-col items-center flex-1">
                                {order.shippedDate ? (
                                  <>
                                    <CheckCircle className="h-6 w-6 text-green-500" />
                                    <p className="mt-1 text-xs font-medium text-gray-700">
                                      Shipped
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {order.shippedDate.split("T")[0]}
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <Truck className="h-6 w-6 text-gray-400" />
                                    <p className="mt-1 text-xs font-medium text-gray-500">
                                      Shipped
                                    </p>
                                  </>
                                )}
                              </div>

                              {/* Connector */}
                              <div className="flex-1 border-t-2 mx-2 border-dashed border-gray-300"></div>

                              {/* Step: Delivered */}
                              <div className="flex flex-col items-center flex-1">
                                {order.deliveredDate ? (
                                  <>
                                    <CheckCircle className="h-6 w-6 text-green-500" />
                                    <p className="mt-1 text-xs font-medium text-gray-700">
                                      Delivered
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {order.deliveredDate.split("T")[0]}
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <Package className="h-6 w-6 text-gray-400" />
                                    <p className="mt-1 text-xs font-medium text-gray-500">
                                      Delivered
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </Collapse>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

/** Helper components for cleaner code */
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start">
    {React.cloneElement(icon, { className: `${icon.props.className} text-gray-400 mr-2 mt-0.5 flex-shrink-0` })}
    <div>
      <p className="font-medium text-gray-700">{label}</p>
      <p className="text-gray-600 break-words">{value}</p>
    </div>
  </div>
);

const ToggleButton = ({ isOpen, onClick, openLabel, closedLabel, color = "gray", icon }) => {
  const Icon = isOpen ? EyeOff : Eye;
  const base = color === "blue" ? "text-blue-700 bg-blue-100 hover:bg-blue-200" : "text-gray-700 bg-gray-100 hover:bg-gray-200";
  return (
    <button onClick={onClick} className={`flex items-center px-2.5 py-1 text-xs font-medium rounded ${base}`}>
      {icon || <Icon className="h-3 w-3 mr-1.5" />}
      {isOpen ? openLabel : closedLabel}
    </button>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-10 px-4 bg-white rounded shadow">
    <PackageOpen className="h-12 w-12 text-gray-400 mb-3" />
    <h2 className="text-base sm:text-lg font-semibold text-gray-800">No Orders Yet</h2>
    <p className="mt-1 text-xs sm:text-sm text-gray-500 text-center">
      Looks like you haven't placed any orders yet.
    </p>
    <Link to="/" className="mt-4 inline-flex items-center px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded shadow">
      Start Shopping
    </Link>
  </div>
);

export default OrderPage;
