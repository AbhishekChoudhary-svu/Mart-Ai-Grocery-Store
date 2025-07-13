import React, { useContext, useEffect, useState } from "react";
import { CloudUpload, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { MyContext } from "../../App";
import {
  postData,
  editData,
  fetchDataFromApi,
  uploadAdminImages,
  deleteImages
} from "../../utils/api";
import SearchBox from "../SearchBox";

const AddRecipeForm = () => {
  const { id } = useParams(); // edit mode if ID exists
  const isEditMode = !!id;
  const context = useContext(MyContext);
  const history = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
   const [currentPage, setCurrentPage] = useState(1);
    const perPage = 5;

  const [formFields, setFormFields] = useState({
    name: "",
    description: "",
    images: [],
    products: [], // product IDs
  });
  const [preview, setPreview] = useState([]); // local preview of images
  const [uploading, setUploading] = useState(false);

  const [productsData, setProductsData] = useState([]); // all products to select

  // Load products list
  useEffect(() => {
    fetchDataFromApi("/api/product").then((res) => {
      setProductsData(res?.products || []);
    });
  }, []);
  const filteredProduct = productsData.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If editing, load recipe data
  useEffect(() => {
    if (id) {
      fetchDataFromApi(`/api/recipe/${id}`).then((res) => {
        const recipe = res;
        if (recipe) {
          setFormFields({
            name: recipe.name || "",
            description: recipe.description || "",
            images: recipe.images || [],
            products: recipe.products?.map((p) => p._id) || [],
          });
          setPreview(recipe.images || []);
        } else {
          context.openAlertBox("error", "Failed to load recipe");
        }
      });
    }
  }, [id]);

  // Handle text input change
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  // Handle selecting products (checkbox multi-select)
  const toggleProductSelection = (productId) => {
    setFormFields((prev) => {
      const products = prev.products.includes(productId)
        ? prev.products.filter((id) => id !== productId)
        : [...prev.products, productId];
      return { ...prev, products };
    });
  };

const onChangeFile = async (e, apiEndPoints) => {
  try {
    const files = e.target.files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (
        file &&
        ["image/jpg", "image/jpeg", "image/png", "image/webp"].includes(file.type)
      ) {
        formData.append("images", file);
      } else {
        context.openAlertBox("error", "Invalid image type");
        return;
      }
    }

    setUploading(true);
    const res = await uploadAdminImages(apiEndPoints, formData);
    const uploaded = res?.images || res?.data?.images || [];

    const newImages = [...formFields.images, ...uploaded];
    setFormFields((prev) => ({ ...prev, images: newImages }));
    setPreview(newImages);
    setUploading(false);
  } catch (error) {
    console.error(error);
    setUploading(false);
    context.openAlertBox("error", "Failed to upload images");
  }
};


  // Remove image
  const removeImage = async (imgUrl, index) => {
    const res = await deleteImages(`/api/recipe/delete-recipe-Image?img=${encodeURIComponent(imgUrl)}`);
    
    if (res?.data.success) {
      const updatedImages = preview.filter((_, i) => i !== index);
      setPreview(updatedImages);
      setFormFields((prev) => ({ ...prev, images: updatedImages }));
      context.openAlertBox("success", res?.data.message);
    } else {
      context.openAlertBox("error", "Failed to delete image");
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formFields.name || !formFields.description) {
      context.openAlertBox("error", "Name and description are required");
      return;
    }
    if (formFields.images.length === 0) {
      context.openAlertBox("error", "Upload at least one image");
      return;
    }

    const endpoint = isEditMode ? `/api/recipe/update/${id}` : `/api/recipe/create`;
    const method = isEditMode ? editData : postData;

    const res = await method(endpoint, formFields);
    if (res) {
      context.openAlertBox("success", res.message || "Success");
      history("/recipes");
    } else {
      context.openAlertBox("error", res?.message || "Failed");
    }
  };

  return (
    <div className="w-full p-6 bg-[#f7f7f7] shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">
        {isEditMode ? "Edit Recipe" : "Add New Recipe"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        {/* Name */}
        <div>
          <label className="block font-medium">Recipe Name</label>
          <input
            type="text"
            name="name"
            value={formFields.name}
            onChange={onChangeInput}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={formFields.description}
            onChange={onChangeInput}
            rows={4}
            className="w-full mt-1 p-2 border border-gray-300 rounded"
            required
          ></textarea>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-medium mb-1">Upload Images</label>
          <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-md p-10 cursor-pointer hover:border-black transition">
            <CloudUpload className="w-10 h-10 text-gray-600 mb-2" />
            <p className="text-gray-600 text-sm">Drag & drop images here or click to browse</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                    onChangeFile(e, "/api/recipe/upload-images")
                  }
              className="opacity-0 absolute w-full h-full top-0 left-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="grid md:grid-cols-4 grid-cols-2 gap-3">
          {preview.map((img, idx) => (
            <div key={idx} className="relative bg-gray-200 rounded-md w-full h-[140px] flex items-center justify-center overflow-hidden">
              <img src={img} alt={`Uploaded ${idx}`} className="object-cover w-full h-full" />
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

        {/* Select Products */}
        <div>
          
          <label className="block text-center font-medium mb-2">Search & Select Products for this Recipe</label>
          <div className="mb-4 ">
        <SearchBox
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setCurrentPage={setCurrentPage}
          placeholder="Search Product For Recipe..."
        />
      </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2 max-h-[250px] overflow-y-auto border rounded p-3">
            {filteredProduct.map((product) => (
              <label key={product._id} className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={formFields.products.includes(product._id)}
                  onChange={() => toggleProductSelection(product._id)}
                />
                <img src={product.images[0]} className="w-[50px] h-[50px]" alt="" />
                <span className="lg:text-md text-sm truncate">{product.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={uploading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          {isEditMode ? "Update Recipe" : "Add Recipe"}
        </button>
      </form>
    </div>
  );
};

export default AddRecipeForm;
