import React, { useContext, useEffect, useState } from "react";
import { CloudUpload } from "lucide-react"; // Optional: use
import { X } from "lucide-react";
import {
  deleteImages,
  editData,
  fetchDataFromApi,
  postData,
  uploadAdminImages,
} from "../../utils/api";
import { MyContext } from "../../App";
import { useNavigate, useParams } from "react-router-dom";

const AddCategoryForm = () => {
  const { id } = useParams(); // If ID exists, it's edit mode
  const isEditMode = !!id;
  const context = useContext(MyContext);
  const history = useNavigate();
  const [preview, setPreview] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [formFields, setFormFields] = useState({
    name: "",
    images: [],
  });
  useEffect(() => {
    if (id) {
      fetchDataFromApi(`/api/category/${id}`).then((res) => {
        console.log(res);
        if (res) {
          const category = res.category;
          setFormFields({
            name: category.name,
            images: category.images,
          });
          setPreview(category.images);
        } else {
          context.openAlertBox("error", "Failed to load category");
        }
      });
    }
  }, [id]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });
  };
  let selectedImages = [];

  const formdata = new FormData();

  const onChangeFile = async (e, apiEndPoints) => {
    try {
      setPreview([]);
      const files = e.target.files;
      setUploading(true);

      for (var i = 0; i < files.length; i++) {
        if (
          files[i] &&
          (files[i].type === "image/jpg" ||
            files[i].type === "image/jpeg" ||
            files[i].type === "image/png" ||
            files[i].type === "image/webp")
        ) {
          const file = files[i];
          selectedImages.push(file);
          formdata.append(`images`, file);
        } else {
          setUploading(false);
          context.openAlertBox("error", "please provide a Valid Images");
          return false;
        }
      }
      uploadAdminImages(apiEndPoints, formdata).then((res) => {
        setUploading(false);
        const uploadedImages = res?.data?.images || [];
        const newImages = [...formFields.images, ...uploadedImages];
        setFormFields((prev) => ({ ...prev, images: newImages }));
        setPreview(newImages);
        setUploading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formFields.name) {
      context.openAlertBox("error", "Category name is required");
      return;
    }
    if (formFields.images.length === 0) {
      context.openAlertBox("error", "Upload at least one image");
      return;
    }

    const endpoint = isEditMode
      ? `/api/category/updateCategories/${id}`
      : `/api/category/create`;

    const method = isEditMode ? editData : postData;

    const res = await method(endpoint, formFields);
    if (res) {
      context.openAlertBox("success", res.message);
      history("/categories");
    } else {
      context.openAlertBox("error", res?.message || "Operation failed");
    }
  };

  const removeImage = async (imgUrl, index) => {
    const res = await deleteImages(
      `/api/category/delete-cate-Image?img=${encodeURIComponent(imgUrl)}`
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
    <>
      <div className="w-full  p-6 bg-[#f7f7f7] shadow-md rounded-md">
        <h2 className="text-2xl font-semibold mb-4">
          {isEditMode ? "Edit Category" : "Add Category"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="col1 flex flex-col gap-4 md:w-[50%] w-full">
              {/* Product Name */}
              <div>
                <label className="block font-medium">Category Name</label>
                <input
                  type="text"
                  name="name"
                  value={formFields.name}
                  onChange={onChangeInput}
                  className="w-full mt-1 p-2 border border-gray-300 rounded"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block font-medium">Category Id</label>
                <input
                  type="text"
                  name="id"
                  className="w-full mt-1 p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            <div className="col2 md:w-[50%] w-full">
              <label className="block font-semibold mb-1">
                Upload Category Images
              </label>

              <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-md p-5 cursor-pointer hover:border-black transition">
                <CloudUpload className="w-10 h-10 text-gray-600 mb-2" />
                <p className="text-gray-600 text-sm">Drag & drop images here</p>
                <p className="text-gray-400 text-xs">or click to browse</p>

                <input
                  type="file" 
                  multiple
                  name="images"
                  onChange={(e) =>
                    onChangeFile(e, "/api/category/upload-cat-images")
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
            {isEditMode ? "Update Category" : "Add Categories"} 
          </button>
        </form>
      </div>
    </>
  );
};

export default AddCategoryForm;
