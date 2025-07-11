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
  Edit3 
} from "lucide-react";

import { MyContext } from "../../App";
import { Collapse } from "react-collapse";
import { FaPlusSquare } from "react-icons/fa";
import { FaSquareMinus } from "react-icons/fa6";

import {
  deleteData,
  editData,
  fetchDataFromApi,
  postData,
} from "../../utils/api";

const AddAddressForm = () => {
  const context = useContext(MyContext);
  const [addresses, setAddresses] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);


  const [isAddOpen, setIsAddOpen] = useState(false);

  const [formFields, setFormFields] = useState({
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    mobile: "",
    status: false, // optional to expose in the UI
  });

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    if (context?.userData?._id) {
      const uid = context.userData._id;

      fetchDataFromApi(`/api/address/get/${uid}`).then((res) => {
        if (Array.isArray(res.data)) {
          setAddresses(res.data);

          // Find which address has status true, select that one by default
          const selectedIdx = res.data.findIndex(
            (addr) => addr.status === true
          );
          if (selectedIdx !== -1) setSelectedIndex(selectedIdx);
          else setSelectedIndex(null);
        }
      });
    }
  }, [context?.userData]);

  const onSubmitAddress = (e) => {
  e.preventDefault();

  // Validation
  if (
    formFields.address_line.trim() === "" ||
    formFields.city.trim() === "" ||
    formFields.state.trim() === "" ||
    formFields.pincode.trim() === "" ||
    formFields.country.trim() === "" ||
    formFields.mobile === "" ||
    isNaN(formFields.mobile)
  ) {
    context.openAlertBox("error", "All fields are required and mobile must be a number");
    return false;
  }

  if (editingIndex !== null) {
    // Edit mode
    const addressId = addresses[editingIndex]._id;
    editData(`/api/address/update/${addressId}`, formFields, { withCredentials: true }).then((res) => {
      if (res?.success === true) {
        context.openAlertBox("success", res?.message);

        // Update local state
        const updated = [...addresses];
        updated[editingIndex] = { ...updated[editingIndex], ...formFields };
        setAddresses(updated);

        setEditingIndex(null);
        setIsAddOpen(false);
      } else {
        context.openAlertBox("error", res?.message);
      }
    });
  } else {
    // Add new
    postData(`/api/address/add`, formFields, { withCredentials: true }).then((res) => {
      if (res?.success === true) {
        context.openAlertBox("success", res?.message);
        // Optionally refetch or add to state
        fetchDataFromApi(`/api/address/get/${context.userData._id}`).then((res) => {
          if (Array.isArray(res.data)) setAddresses(res.data);
        });
        setIsAddOpen(false);
      } else {
        context.openAlertBox("error", res?.message);
      }
    });
  }
};


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
    address_line: address.address_line,
    city: address.city,
    state: address.state,
    pincode: address.pincode,
    country: address.country,
    mobile: address.mobile,
    status: address.status
  });
  setEditingIndex(index);
  setIsAddOpen(true); // open the form
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
      <div className="bg-[#f7f7f7] shadow rounded-lg mt-4 p-6">
        {/* Saved Addresses */}
        {addresses.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-700 mb-2">
              Saved Addresses
            </h3>
            <div className="space-y-2">
              {addresses.map((addr, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between px-4 py-4 text-md font-semibold font-sans border rounded-lg ${
                    selectedIndex === index
                      ? "bg-gray-100 border-gray-400"
                      : "bg-white"
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="selectedAddress"
                      checked={selectedIndex === index}
                      onChange={() => handleSelectAddress(index)}
                      className="mr-3"
                    />
                    <span className="text-md capitalise text-gray-600">
                      <span className="text-[22px] font-[600] ">
                        {context.userData.name}
                      </span>
                      <br />
                      <span className="font-[500] text-gray-800">
                        Address :
                      </span>{" "}
                      {addr.address_line}, {addr.city}, {addr.state},{" "}
                      {addr.pincode}, {addr.country},<br />
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
                    <button
                      onClick={() => handleDelete(index)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isAddOpen === false ? (
          <div className="flex items-center  justify-between mb-4 ">
            <h2
              onClick={() => setIsAddOpen(true)}
              className="text-xl cursor-pointer font-semibold text-gray-800 mr-2 "
            >
              Add Address
            </h2>
            <FaPlusSquare className="mr-auto text-[16px] cursor-pointer" />
          </div>
        ) : (
          <div className="flex items-center justify-between mb-4 ">
            <h2
              onClick={() => setIsAddOpen(false)}
              className="text-xl cursor-pointer font-semibold text-gray-800 mr-2 "
            >
              Add Address
            </h2>
            <FaSquareMinus className="mr-auto text-[16px] cursor-pointer" />
          </div>
        )}

        <Collapse isOpened={isAddOpen === true ? true : false}>
          <form onSubmit={onSubmitAddress} className="space-y-4">
            {[
              ["address_line", "Address Line", <MapPin className="w-4 h-4" />],
              ["city", "City", <Building2 className="w-4 h-4" />],
              ["state", "State", <Landmark className="w-4 h-4" />],
              ["pincode", "Pincode", <MapPin className="w-4 h-4" />],
              ["country", "Country", <Globe className="w-4 h-4" />],
              ["mobile", "Mobile", <Phone className="w-4 h-4" />],
            ].map(([name, label, icon]) => (
              <div key={name} className="flex items-center">
                <div className="text-gray-400 mr-3">{icon}</div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-500 mb-1">
                    {label}
                  </label>
                  <input
                    type={name === "mobile" ? "tel" : "text"}
                    name={name}
                    value={formFields[name]}
                    onChange={onChangeInput}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
              </div>
            ))}

            <button
              type="submit"
              className="flex items-center mt-4 px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md hover:bg-gray-700"
            >
              <Save className="mr-2 h-4 w-4" />
              {editingIndex !== null ? "Update Address" : "Save Address"}

            </button>
          </form>
        </Collapse>
      </div>
    </>
  );
};

export default AddAddressForm;
