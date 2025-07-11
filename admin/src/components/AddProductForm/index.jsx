import React, { useContext, useEffect, useState } from "react";
import { CloudUpload } from "lucide-react"; // Optional: use
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { MyContext } from "../../App";
import {
  deleteImages,
  editData,
  fetchDataFromApi,
  postData,
  uploadAdminImages,
} from "../../utils/api";

const AddProductForm = () => {
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
    fetchDataFromApi(`/api/product/${id}`).then((res) => {
      const product = res.product;

      if (product) {
        setFormFields({
          name: product.name || "",
          images: product.images || [],
          brand: product.brand || "",
          price: product.price || "",
          oldPrice: product.oldPrice || "",
          catName: product.catName || "",
          catId: product.catId || "",
          subCatName: product.subCatName || "",
          subCatId: product.subCatId || "",
          discount: product.discount || "",
          countInStock: product.countInStock || "",
          isFeatured: product.isFeatured ?? false,
          rating: product.rating || "",
          size: Array.isArray(product.size) ? product.size : [],
          productRam: Array.isArray(product.productRam) ? product.productRam : [],
          productWeight: Array.isArray(product.productWeight) ? product.productWeight : [],
          description: product.description || "",
        });

        setSelectedCategory(product.catId || "");
        setSelectedSubCategory(product.subCatId || "");
        setPreview(product.images || []);
      } else {
        context.openAlertBox("error", "Failed to load product");
      }
    });
  }
}, [id]);


  const [formFields, setFormFields] = useState({
    name: "",
    images: [],
    brand: "",
    price: "",
    oldPrice: "",
    catName: "",
    catId: "",
    subCatName: "",
    subCatId: "",
    discount: "",
    countInStock: "",
    isFeatured: false,
    rating: "",
    size: [],
    productRam: [],
    productWeight: [],
    description: "",
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

  const selectedCategoryId = (e) => {
    const selectedId = e.target.value;
    const selectedCat = cateData.find((cat) => cat._id === selectedId);

    setSelectedCategory(selectedId);
    setFormFields({
      ...formFields,
      catId: selectedId,
      catName: selectedCat?.name || null,
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
      subCatName: selectedSubCat?.name || null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formFields.name ||
      !formFields.brand ||
      !formFields.price ||
      !formFields.oldPrice ||
      !formFields.discount ||
      !formFields.countInStock ||
      !formFields.rating ||
      !formFields.description ||
      !formFields.productWeight
    ) {
      context.openAlertBox("error", "All Fields Are required");
      return;
    }
    if (formFields.images.length === 0) {
      context.openAlertBox("error", "Upload at least one image");
      return;
    }

    const endpoint = isEditMode
      ? `/api/product/updateProduct/${id}`
      : `/api/product/create`;

    const method = isEditMode ? editData : postData;

    const res = await method(endpoint, formFields);
    if (res) {
      context.openAlertBox("success", res.message);
      history("/products");
    } else {
      context.openAlertBox("error", res?.message || "Operation failed");
    }
  };



 const onChangeFile = async (e, apiEndPoints) => {
  try {
    const formdata = new FormData(); // ✅ scoped correctly
    const files = e.target.files;

    setUploading(true);
    const validImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (
        file &&
        ["image/jpg", "image/jpeg", "image/png", "image/webp"].includes(file.type)
      ) {
        formdata.append("images", file); // ✅ append each file to FormData
        validImages.push(file.name); // just for logging
      } else {
        setUploading(false);
        context.openAlertBox("error", "Please provide valid images");
        return;
      }
    }

    const res = await uploadAdminImages(apiEndPoints, formdata);

    const uploadedImages = res?.data?.images || [];
    const newImages = [...formFields.images, ...uploadedImages];
    setFormFields((prev) => ({ ...prev, images: newImages }));
    setPreview(newImages);
    setUploading(false);
  } catch (error) {
    console.log(error);
    setUploading(false);
  }
};


  const removeImage = async (imgUrl, index) => {
    const res = await deleteImages(
      `/api/product/deleteProductImages?img=${encodeURIComponent(imgUrl)}`
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
        {isEditMode ? "Edit Product" : "Add New Product"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        encType="multipart/form-data"
      >
        <div className="md:flex-row flex flex-col gap-4">
          <div className="col1 md:w-[50%] w-full ">
            {/* Product Name */}
            <div>
              <label className="block font-medium">Product Name</label>
              <input
                type="text"
                name="name"
                value={formFields.name}
                onChange={onChangeInput}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                required
              />
            </div>

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

            {/* Brand */}
            <div>
              <label className="block font-medium">Brand</label>
              <input
                type="text"
                name="brand"
                value={formFields.brand}
                onChange={onChangeInput}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          <div className="col2 md:w-[50%] w-full">
            <label className="block font-semibold mb-1">
              Upload Product Images
            </label>

            <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-md md:p-20 p-5 cursor-pointer hover:border-black transition">
              <CloudUpload className="w-10 h-10 text-gray-600 mb-2" />
              <p className="text-gray-600 text-sm">Drag & drop images here</p>
              <p className="text-gray-400 text-xs">or click to browse</p>

              <input
                type="file"
                multiple
                onChange={(e) =>
                  onChangeFile(e, "/api/product/upload-product-images")
                }
                accept="image/*"
                className="opacity-0 absolute w-full h-full top-0 left-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium">Price</label>
            <input
              type="number"
              name="price"
              value={formFields.price}
              onChange={onChangeInput}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Old Price</label>
            <input
              type="number"
              name="oldPrice"
              value={formFields.oldPrice}
              onChange={onChangeInput}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Discount (%)</label>
            <input
              type="number"
              name="discount"
              value={formFields.discount}
              onChange={onChangeInput}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        {/* countInStock */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium">Stock</label>
            <input
              type="number"
              name="countInStock"
              value={formFields.countInStock}
              onChange={onChangeInput}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">IsFeatured</label>
            <select
              value={formFields.isFeatured ? "True" : "False"}
              onChange={(e) =>
                setFormFields({
                  ...formFields,
                  isFeatured: e.target.value === "True",
                })
              }
              className="w-full border border-gray-300 px-3 py-3 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 font-semibold text-md"
            >
              <option value="False">False</option>
              <option value="True">True</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Ratings</label>
            <input
              type="number"
              name="rating"
              value={formFields.rating}
              onChange={onChangeInput}
              className="w-full mt-1 p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        {/* productRAM */}
        <div className="grid grid-cols-1  sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium">Product RAM</label>
            <input
              type="text"
              name="productRam"
              placeholder="e.g. 4GB, 6GB, 8GB"
              value={formFields.productRam.join(", ")}
              onChange={(e) =>
                setFormFields({
                  ...formFields,
                  productRam: e.target.value.split(",").map((r) => r.trim()),
                })
              }
              className="w-full mt-1 p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Product Weight</label>
            <input
              type="text"
              name="productWeight"
              placeholder="e.g. 1kg, 2kg"
              value={formFields.productWeight.join(", ")}
              onChange={(e) =>
                setFormFields({
                  ...formFields,
                  productWeight: e.target.value.split(",").map((w) => w.trim()),
                })
              }
              className="w-full mt-1 p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Product Size</label>
            <input
              type="text"
              name="size"
              placeholder="e.g. S, M, L"
              value={formFields.size.join(", ")}
              onChange={(e) =>
                setFormFields({
                  ...formFields,
                  size: e.target.value.split(",").map((s) => s.trim()),
                })
              }
              className="w-full mt-1 p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="imgCont flex flex-col md:flex-row gap-3">
          <div className="col1 md:w-[33%] w-full">
            {/* Description */}
            <div>
              <label className="block font-medium">Description</label>
              <textarea
                name="description"
                value={formFields.description}
                onChange={onChangeInput}
                rows={6}
                className="w-full mt-1 p-2 border border-gray-300 rounded"
              ></textarea>
            </div>
          </div>
          <div className="col2 w-[67%]">
            <label className="block font-medium mb-2">Images</label>

            <div className="grid md:grid-cols-4 grid-cols-2  gap-3">
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
          {isEditMode ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
