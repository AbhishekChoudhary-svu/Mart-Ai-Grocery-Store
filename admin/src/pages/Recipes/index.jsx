import React, { useContext, useEffect, useState } from "react";
import { fetchDataFromApi, deleteImages } from "../../utils/api";
import { Link, useNavigate } from "react-router-dom";
import SearchBox from "../../components/SearchBox";
import { Trash2, Pencil, Eye, EyeOff } from "lucide-react";
import { Collapse } from "react-collapse";
import { MyContext } from "../../App";

const Recipes = () => {
  const context = useContext(MyContext)
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;
  const [expandedRows, setExpandedRows] = useState([]); // track which recipes are expanded

  const navigate = useNavigate();

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = () => {
    fetchDataFromApi("/api/recipe").then((res) => {
      setRecipes(res || []);
    });
  };

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRecipes.length / perPage);

  const paginatedRecipes = filteredRecipes.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handleDelete = async (id) => {

      const res = await deleteImages(`/api/recipe/delete/${id}`);
      if (res) {
        loadRecipes();
        context.openAlertBox("success", "Delete Recipe Successfull");
      } else {
        context.openAlertBox("error", res.message);
      }
    
  };

  const toggleRow = (recipeId) => {
    setExpandedRows((prev) =>
      prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  return (
  <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">

       <div className="flex flex-col gap-3 mb-4">
          {/* Top row: title + buttons */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Recipes List
            </h2>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">
              <Link to="/recipe/add" className="w-full sm:w-auto">
                <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow w-full sm:w-auto">
                  + Add New Recipe
                </button>
              </Link>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow w-full sm:w-auto">
                📤 Export
              </button>
            </div>
          </div>

          {/* Search box */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div className="w-full md:w-1/2">
              <SearchBox
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setCurrentPage={setCurrentPage}
          placeholder="Search recipes..."
        />
            </div>
          </div>
        </div>

      <div className="overflow-x-auto">
  <table className="min-w-full text-left text-gray-700">
    <thead className="bg-green-100 text-xs uppercase">
      <tr>
        <th className="px-4 py-3">Images</th>
        <th className="px-4 py-3">Name</th>
        {/* Hide description on extra small screens */}
        <th className="px-4 py-3 hidden sm:table-cell">Description</th>
        <th className="px-4 py-3 text-center">Products</th>
        <th className="px-4 py-3 text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      {paginatedRecipes.map((recipe, idx) => (
        <React.Fragment key={recipe._id}>
          <tr className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
            <td className="px-4 py-3">
              <img
                src={recipe.images[0]}
                alt=""
                className="w-[120px] h-[70px] rounded object-cover"
              />
            </td>
            <td className="px-4 py-3 font-medium">{recipe.name}</td>

            <td className="px-4 py-3 max-w-[150px] truncate hidden sm:table-cell">
              {recipe.description}
            </td>

            <td className="px-4 py-3 text-center">{recipe.products?.length || 0}</td>

            <td className="px-4 py-3 text-center">
              <div className="flex justify-center space-x-3 md:space-x-6">
                <button
                  onClick={() => toggleRow(recipe._id)}
                  className="text-gray-600 hover:text-black"
                >
                  {expandedRows.includes(recipe._id) ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
                <button
                  onClick={() => navigate(`/recipe/edit/${recipe._id}`)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(recipe._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>

          {/* Collapsible row */}
          <tr>
            <td colSpan="5" className="p-0">
              <Collapse isOpened={expandedRows.includes(recipe._id)}>
                <div className="p-4 bg-gray-50">
                  {recipe.products?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-blue-100">
                          <tr>
                            <th className="px-3 py-2">Image</th>
                            <th className="px-3 py-2">Product ID</th>
                            <th className="px-3 py-2">Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recipe.products.map((product, i) => (
                            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                              <td className="px-3 py-2">
                                <img
                                  src={product.images?.[0]}
                                  alt=""
                                  className="w-[80px] h-[50px] rounded object-cover"
                                />
                              </td>
                              <td className="px-3 py-2">{product._id}</td>
                              <td className="px-3 py-2">{product.name || "N/A"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No products linked to this recipe.</p>
                  )}
                </div>
              </Collapse>
            </td>
          </tr>
        </React.Fragment>
      ))}
      {paginatedRecipes.length === 0 && (
        <tr>
          <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
            No recipes found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>


      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Recipes;
