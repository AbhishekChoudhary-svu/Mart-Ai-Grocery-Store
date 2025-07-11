import React, { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Save,
  X,
  ShoppingBag,
  Heart,
  Settings,
  CreditCard,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";

import { editData } from "../../utils/api";
import AddAddressForm from "../../components/AddAddressForm";

const ProfilePage = () => {

    const context = useContext(MyContext);
      const history = useNavigate();
      const [userId, setUserId] = useState("");
    
      const [formFields, setFormFields] = useState({
        name: "",
        email: "",
        mobile: "",
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
      const validateValue = Object.values(formFields).every((el) => el);
      const [isEditing, setIsEditing] = useState(false);
    
      const [isLoading, setIsLoading] = useState(false);
    
      useEffect(() => {
        if (context?.userData?._id !== undefined || context?.userData?._id !== "") {
          setUserId(context?.userData?._id);
          setFormFields({
            name: context?.userData?.name,
            email: context?.userData?.email,
            mobile: context?.userData?.mobile,
          });
        }
      }, [context?.userData]);
    
      const ProfileSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Validation
        if (
          formFields.email === "" ||
          formFields.name === "" ||
          formFields.mobile === ""
        ) {
          context.openAlertBox("error", "All fields are required");
          //setError("All fields are required");
          return false;
        }
    
        editData(`/api/user/${userId}`, formFields, { withCredentials: true }).then(
          (res) => {
            if (res?.error === false) {
              setIsLoading(false);
             context.openAlertBox("success", res?.message);
               setIsEditing(false);
            } else {
              context.openAlertBox("error", res?.message);
              setIsLoading(false);
            }
          }
        );
      };
    
      
    
      const handleCancel = () => {
        // Reset form data to original values
        setIsEditing(false);
      };
  return (
    <>
      <div className="flex-1 bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      Personal Information
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Update your personal details and information.
                    </p>
                  </div>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      <Edit3 className="mr-2 h-4 w-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        form="profileForm"   
                        disabled={!validateValue}
                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {isLoading === true ? (
                          <CircularProgress color="inherit" />
                        ) : (
                          "Save"
                        )}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Section */}
              <form
                id="profileForm"
                onSubmit={ProfileSubmit}
                className="px-6 py-6"
              >
                <div className="space-y-6">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={formFields.name}
                          onChange={onChangeInput}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                        />
                      ) : (
                        <p className="text-base text-gray-900">
                          {formFields.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formFields.email}
                          onChange={onChangeInput}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                        />
                      ) : (
                        <p className="text-base text-gray-900">
                          {formFields.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="mobile"
                          value={formFields.mobile}
                          onChange={onChangeInput}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                        />
                      ) : (
                        <p className="text-base text-gray-900">
                          {formFields.mobile}
                        </p>
                      )}
                    </div>
                  </div>

                 
                </div>
              </form>
            </div>

            <AddAddressForm/>
    </>
  )
}

export default ProfilePage
