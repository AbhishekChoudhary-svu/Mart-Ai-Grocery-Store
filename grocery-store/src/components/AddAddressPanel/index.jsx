import React, { useContext, useEffect } from "react";
import { useState } from "react";

import {
  User,
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
import { FaPlusSquare } from "react-icons/fa";
import { FaSquareMinus } from "react-icons/fa6";

import {
  deleteData,
  editData,
  fetchDataFromApi,
  postData,
} from "../../utils/api";

const AddAddressPanel = (props) => {
  const context = useContext(MyContext);

  const {
    formFields,
    setFormFields,
    editingIndex,
    setEditingIndex,
    addresses,
    setAddresses,
  } = props;

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });
  };

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
      context.openAlertBox(
        "error",
        "All fields are required and mobile must be a number"
      );
      return false;
    }

    if (editingIndex !== null) {
      // Edit mode
      const addressId = addresses[editingIndex]._id;
      editData(`/api/address/update/${addressId}`, formFields, {
        withCredentials: true,
      }).then((res) => {
        if (res?.success === true) {
          context.openAlertBox("success", res?.message);

          // Update local state
          const updated = [...addresses];
          updated[editingIndex] = { ...updated[editingIndex], ...formFields };
          setAddresses(updated);
          context.setOpenAddressPanel(false);
          setFormFields({
            userName:"",
            address_line: "",
            city: "",
            state: "",
            pincode: "",
            country: "",
            mobile: "",
            status: false,
          });

          setEditingIndex(null);

          window.scrollTo(0, 0);
        } else {
          context.openAlertBox("error", res?.message);
        }
      });
    } else {
      // Add new
      postData(`/api/address/add`, formFields, { withCredentials: true }).then(
        (res) => {
          if (res?.success === true) {
            context.openAlertBox("success", res?.message);
            // Optionally refetch or add to state
            fetchDataFromApi(`/api/address/get/${context.userData._id}`).then(
              (res) => {
                if (Array.isArray(res.data)) setAddresses(res.data);

                context.setOpenAddressPanel(false);
              }
            );
          } else {
            context.openAlertBox("error", res?.message);
          }
        }
      );
    }
  };
  return (
    <>
      <div className="p-3 ">
        <form onSubmit={onSubmitAddress} className="lg:space-y-4 space-y-2">
          {[
            ["userName", "Full Name", <User className="w-4 h-4" />],
            ["address_line", "Address Line", <MapPin className="w-4 h-4" />],
            ["city", "City", <Building2 className="w-4 h-4" />],
            ["state", "State", <Landmark className="w-4 h-4" />],
            ["pincode", "Pincode", <MapPin className="w-4 h-4" />],
            ["country", "Country", <Globe className="w-4 h-4" />],
            ["mobile", "Mobile", <Phone className="w-4 h-4" />],
          ].map(([name, label, icon]) => (
            <div key={name} className="flex items-center">
              <div className="text-gray-400 mr-3 mt-3">{icon}</div>
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
            className="flex items-center mt-6 ml-7 px-12 py-2 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md hover:bg-gray-700"
          >
            <Save className="mr-2 h-4 w-4" />
            {editingIndex !== null ? "Update Address" : "Save Address"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddAddressPanel;
