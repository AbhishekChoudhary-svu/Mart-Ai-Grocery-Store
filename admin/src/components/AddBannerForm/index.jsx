import React, {  useEffect, useState } from "react";
import { useContext } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { CloudUpload } from "lucide-react"; // Optional: use
import { X } from "lucide-react";

import { MyContext } from '../../App';
import { deleteImages, editData, fetchDataFromApi, postData, uploadAdminImages } from "../../utils/api";

const AddBannerForm = () => {
    const { id } = useParams(); // If ID exists, it's edit mode
  const isEditMode = !!id;
  const context = useContext(MyContext);
  const history = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [preview, setPreview] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [cateData, setCateData] = useState([]);
  useEffect(() => {
    fetchDataFromApi("/api/category").then((res) => {
      setCateData(res?.categories || []);
    });
  }, []);
 
useEffect(() => {
  if (id) {
    fetchDataFromApi(`/api/Banner/${id}`).then((res) => {
      const banner = res.banner;

      if (banner) {
        setFormFields({
          images: banner.images || [],
          catId: banner.catId || "",
          subCatId: banner.subCatId || "",
          
        });

        setSelectedCategory(banner.catId || "");
        setSelectedSubCategory(banner.subCatId || "");
        setPreview(banner.images || []);
      } else {
        context.openAlertBox("error", "Failed to load Banner");
      }
    });
  }
}, [id]);


  const [formFields, setFormFields] = useState({
    images: [],
    catId: "",
    subCatId: "",
  });
  const onChangeFile = async (e, apiEndPoints) => {
  try {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    const formdata = new FormData();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (
        file &&
        (file.type === "image/jpg" ||
          file.type === "image/jpeg" ||
          file.type === "image/png" ||
          file.type === "image/webp")
      ) {
        formdata.append("images", file);
      } else {
        setUploading(false);
        context.openAlertBox("error", "Please upload valid image types");
        return;
      }
    }

    const res = await uploadAdminImages(apiEndPoints, formdata);
    setUploading(false);

    const uploadedImages = res?.data?.images || [];

    if (uploadedImages.length > 0) {
      setFormFields((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));
      setPreview((prev) => [...prev, ...uploadedImages]);
    }
  } catch (error) {
    console.error(error);
    setUploading(false);
    context.openAlertBox("error", "Upload failed");
  }
};



  const selectedCategoryId = (e) => {
    const selectedId = e.target.value;

    setSelectedCategory(selectedId);
    setFormFields({
      ...formFields,
      catId: selectedId,
      
    });
  };
  const selectedSubCategoryId = (e) => {
    const selectedId = e.target.value;

    let selectedSubCat = null;
    for (const cat of cateData) {
      selectedSubCat = cat.subCategories?.find(
        (subCat) => subCat._id === selectedId
      );
      if (selectedSubCat) break;
    }

    setSelectedSubCategory(selectedId);
    setFormFields({
      ...formFields,
      subCatId: selectedId,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formFields.images.length === 0) {
      context.openAlertBox("error", "Upload at least one image");
      return;
    }

    const endpoint = isEditMode
      ? `/api/Banner/update/${id}`
      : `/api/Banner/AddBanner`;

    const method = isEditMode ? editData : postData;

    const res = await method(endpoint, formFields);
    if (res) {
      context.openAlertBox("success", res.message);
      history("/AdsBanner/List");
    } else {
      context.openAlertBox("error", res?.message || "Operation failed");
    }
  };



  


  const removeImage = async (imgUrl, index) => {
    const res = await deleteImages(
      `/api/Banner/delete-Banner-Image?img=${encodeURIComponent(imgUrl)}`
    );
    if (res?.data?.success) {
      const updatedImages = preview.filter((_, i) => i !== index);
      setPreview(updatedImages);
      setFormFields((prev) => ({ ...prev, images: updatedImages }));
      context.openAlertBox("success", res?.data?.message);
    } else {
      context.openAlertBox("error", "Failed to delete image");
    }
  };
  return (
      <div className="w-full  p-6 bg-[#f7f7f7] shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">
        {" "}
        {isEditMode ? "Edit Ads Banner" : "Add Ads Banner"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        encType="multipart/form-data"
      >
        <div className="md:flex-row flex flex-col gap-4">
          <div className="col1 md:w-[50%] w-full">
            

            {/* Category */}
            <div>
              <label className="block font-medium">Category</label>
              <select
                value={selectedCategory}
                onChange={selectedCategoryId}
                className="w-full border border-gray-300 px-3 py-3 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold text-md"
              >
                <option className="font-bold" value="">
                  -- Select Category --
                </option>
                {cateData.length !== 0 &&
                  cateData.map((cat, idx) => (
                    <option className="font-bold" key={idx} value={cat?._id}>
                      {cat?.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Sub Category */}
            <div>
              <label className="block font-medium">Sub Category</label>
              <select
                value={selectedSubCategory}
                onChange={selectedSubCategoryId}
                className="w-full border border-gray-300 px-3 py-3 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold text-md"
              >
                <option className="font-bold" value="">
                  -- Select Sub-Category --
                </option>

                {cateData?.length !== 0 &&
                  // 🔍 Loop through main categories
                  cateData?.map((cat) =>
                    // ✅ Check if subCategories exist and map them
                    cat?.subCategories?.map((subCat) => (
                      <option
                        key={subCat._id}
                        value={subCat._id}
                        className="font-semibold"
                      >
                        {subCat.name}
                      </option>
                    ))
                  )}
              </select>
            </div>

          </div>
          <div className="col2 md:w-[50%] w-full">
            <label className="block font-semibold mb-1">
              Upload Banner Images
            </label>

            <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-md p-3 cursor-pointer hover:border-black transition">
              <CloudUpload className="w-10 h-10 text-gray-600 mb-2" />
              <p className="text-gray-600 text-sm">Drag & drop images here</p>
              <p className="text-gray-400 text-xs">or click to browse</p>

              <input
                type="file"
                multiple
                onChange={(e) =>
                  onChangeFile(e, "/api/Banner/upload-Banner-images")
                }
                accept="image/*"
                className="opacity-0 absolute w-full h-full top-0 left-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

       

        <div className="imgCont flex gap-3">
          <div className="col2 w-[100%]">
            <label className="block font-medium mb-2">Images</label>

            <div className="grid md:grid-cols-4 grid-cols-2 gap-3">
              {preview.map((img, idx) => (
                <div
                  key={idx}
                  className="relative bg-gray-200 rounded-md w-full h-[155px] flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={img}
                    alt={`Uploaded ${idx}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(img, idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          {isEditMode ? "Update Ads Banner" : "Add Ads Banner"}
        </button>
      </form>
    </div>
  )
}

export default AddBannerForm
