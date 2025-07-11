import React, { useContext, useEffect, useState } from "react";
import { editData, fetchDataFromApi, postData } from "../../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import { MyContext } from "../../App";

const AddSubCategoryForm = () => {
  const { id } = useParams(); // If ID exists, it's edit mode
  const isEditMode = !!id;
  const history = useNavigate()
  const context = useContext(MyContext)
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cateData, setCateData] = useState([]);
  useEffect(() => {
  fetchDataFromApi("/api/category").then((res) => {
    setCateData(res?.categories || []);
  });
}, []);

 useEffect(() => {
  if (isEditMode) {
    fetchDataFromApi("/api/category").then((res) => {
      const allCategories = res?.categories || [];

      const parentWithSub = allCategories.find((cat) =>
        cat.subCategories?.some((sub) => sub._id === id)
      );

      if (parentWithSub) {
        const subCat = parentWithSub.subCategories.find((sub) => sub._id === id);

        setFormFields({
          name: subCat.name,
          parentCatName: parentWithSub.name,
          parentId: parentWithSub._id,
        });

        setSelectedCategory(parentWithSub._id); // 🟢 This preselects the category
      }
    });
  }
}, [id, isEditMode]);

  const [formFields, setFormFields] = useState({
    name: "",
    parentCatName: null,
    parentId: null,
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
  const selectedCategoryId=(e)=>{
  const selectedId = e.target.value;
  const selectedCat = cateData.find((cat) => cat._id === selectedId);

  setSelectedCategory(selectedId);
  setFormFields({
    ...formFields,
    parentId: selectedId,
    parentCatName: selectedCat?.name || null,
  });
  }
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formFields.name) {
      context.openAlertBox("error", "Sub-Category name is required");
      return;
    }
    if (selectedCategory === "") {
      context.openAlertBox("error", "Select One Category");
      return;
    }

    const endpoint = isEditMode
      ? `/api/category/updateSubCategory/${id}`
      : `/api/category/create`;

    const method = isEditMode ? editData : postData;

    const res = await method(endpoint, formFields);
    console.log(res)
    if (res?.success) {
       fetchDataFromApi("/api/category").then((res) => {
      setCateData(res?.categories);
      
      history("/category/subCategories")
    });
    context.openAlertBox("success", res.message);
      
    } else {
      context.openAlertBox("error", res?.message || "Operation failed");
    }
  };

  return (
    <>
      <div className="w-full  p-6 bg-[#f7f7f7] shadow-md rounded-md">
        <h2 className="text-2xl font-semibold mb-4"> {isEditMode ? "Edit Sub-Category" : "Add Sub-Category"}</h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          encType="multipart/form-data"
        >
          <div className="flex flex-col md:flex-row  gap-4">
            <div className="col1 flex flex-col gap-4 md:w-[50%] w-full">
              {/* Product Name */}
              <div>
                <label className="block font-medium mb-2">Category Name</label>
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
                      <option className="font-bold" key={idx}  value={cat?._id}>
                        {cat?.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block font-medium">Sub-Category</label>
                <input
                  type="text"
                  name="name"
                  value={formFields.name}
                  onChange={onChangeInput}
                  className="w-full mt-1 p-3 font-bold focus:outline-none focus:ring-1 focus:ring-green-500 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
          >
            {isEditMode ? "Update Sub-Category" : "Add Sub-Categories"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddSubCategoryForm;
