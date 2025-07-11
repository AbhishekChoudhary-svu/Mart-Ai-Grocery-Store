import React, { useContext, useEffect } from "react";
import { useState } from "react";

import {
  Trash,
  Phone,
  MapPin,
  Save,
  Globe,
  Landmark,
  Building2,
  Edit3,
} from "lucide-react";

import { MyContext } from "../../App";
import { Collapse } from "react-collapse";
import Drawer from "@mui/material/Drawer";
import { IoClose } from "react-icons/io5";
import { FaPlusSquare } from "react-icons/fa";
import { FaSquareMinus } from "react-icons/fa6";

import {
  deleteData,
  editData,
  fetchDataFromApi,
  postData,
} from "../../utils/api";
import AddAddressPanel from "../AddAddressPanel";

const AddAddressForm = ({ showDelete = true, selectedAddress, setSelectedAddress }) => {
  const context = useContext(MyContext);
  const [addresses, setAddresses] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  const [formFields, setFormFields] = useState({
    userName: "",
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    mobile: "",
    status: false, // optional to expose in the UI
  });

useEffect(() => {
  if (context?.userData?._id) {
    fetchDataFromApi(`/api/address/get/${context.userData._id}`).then((res) => {
      if (Array.isArray(res.data)) {
        setAddresses(res.data);
        const selected = res.data.find((addr) => addr.status === true);
        if (selected) {
          setSelectedAddress(selected);
          setSelectedIndex(res.data.findIndex((a) => a._id === selected._id));
        } else {
          setSelectedAddress(null);
          setSelectedIndex(null);
        }
      }
    });
  }
}, [context?.userData]);



  const handleSelectAddress = async (index) => {
    const selectedAddressId = addresses[index]._id;

    // Call API to update status
    const res = await editData(`/api/address/select/${selectedAddressId}`, {});

    if (res?.success) {
      // Update frontend addresses state:
      const updatedAddresses = addresses.map((addr, i) => ({
        ...addr,
        status: i === index, // true only for selected index
      }));

      setAddresses(updatedAddresses);
      setSelectedIndex(index);
      setSelectedAddress(updatedAddresses[index]);

      context.openAlertBox("success", "Selected address updated.");
    } else {
      context.openAlertBox(
        "error",
        res?.message || "Failed to update selected address"
      );
    }
  };
  const handleEdit = (index) => {
    const address = addresses[index];
    setFormFields({
      userName: address.userName,
      address_line: address.address_line,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
      mobile: address.mobile,
      status: address.status,
    });
    setEditingIndex(index);

    // ✅ Open the Drawer
    context.setOpenAddressPanel(true);
  };

  const handleDelete = async (index) => {
    const addressId = addresses[index]._id; // 🆔 get the ID from the array

    const res = await deleteData(`/api/address/delete/${addressId}`);

    if (res?.data?.success) {
      const updated = addresses.filter((_, i) => i !== index);
      setAddresses(updated);

      // 🧠 Update selected index smartly
      if (selectedIndex === index) setSelectedIndex(null);
      else if (selectedIndex > index) setSelectedIndex((prev) => prev - 1);

      context.openAlertBox("success", res.data.message);
    } else {
      context.openAlertBox(
        "error",
        res?.data?.message || "Failed to delete address"
      );
    }
  };
  return (
    <>
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center justify-center">
          <div
            onClick={() => context.setOpenAddressPanel(true)}
            className="flex items-center justify-center cursor-pointer bg-gray-200 w-full py-4 rounded-lg  border border-dotted border-gray-700  "
          >
            <h2 className="text-xl  font-semibold text-gray-800  ">
              Add Address
            </h2>
          </div>
        </div>

        {/* Saved Addresses */}
        {addresses.length !== 0 ? (
          <div className="my-6">
            <div className="space-y-2">
              {addresses.map((addr, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between px-4 py-4 lg:text-md text-sm font-semibold font-sans border rounded-lg ${
                    selectedIndex === index
                      ? "bg-gray-100 border-gray-400"
                      : "bg-white"
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="selectedAddress"
                      value={addr._id}
                      checked={selectedIndex === index}
                      onChange={() => handleSelectAddress(index)}
                      className="mr-3"
                    />
                    <span className="lg:text-md text-sm capitalise text-gray-600">
                      <span className="lg:text-[22px] text-[19px] font-[600] ">
                        {addr.userName}
                      </span>
                      <br />
                      <span className="font-[500] text-gray-800">
                        Address :
                      </span>{" "}
                      {addr.address_line}, {addr.city} {"-"} {addr.pincode}, {addr.state},{" "}
                       {addr.country},<br />
                      <span className="font-[500] pr-2 text-gray-800">
                        Mobile{" "}
                      </span>{" "}
                      : {addr.mobile}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    {showDelete && (
                      <button
                        onClick={() => handleDelete(index)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="min-h-[200px] flex items-center justify-center">
              <div className="flex flex-col items-center justify-center bg-white border border-dashed border-gray-300 rounded-xl p-6 shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-400 mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M12 11c1.38 0 2.5-1.12 2.5-2.5S13.38 6 12 6 9.5 7.12 9.5 8.5 10.62 11 12 11z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M19.5 8.5c0 5-7.5 12-7.5 12S4.5 13.5 4.5 8.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                <h1 className="text-lg font-medium text-gray-700">
                  No Addresses Added
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Add a delivery address to continue
                </p>
              </div>
            </div>
          </>
        )}
        <Drawer
          open={context.openAddressPanel}
          anchor={"right"}
          onClose={context.toggleAddressDrawer(false)}
          className="AddressPanel"
        >
          <div className="flex items-center justify-between py-3 px-4 gap-3 border-2 border-gray-200 ">
            <h4 className="font-[600] ">Add Delivery Address</h4>
            <IoClose
              onClick={context.toggleAddressDrawer(false)}
              className="text-[20px] cursor-pointer"
            />
          </div>
          <AddAddressPanel
            formFields={formFields}
            setFormFields={setFormFields}
            editingIndex={editingIndex}
            setEditingIndex={setEditingIndex}
            addresses={addresses}
            setAddresses={setAddresses}
          />
        </Drawer>
      </div>
    </>
  );
};

export default AddAddressForm;
