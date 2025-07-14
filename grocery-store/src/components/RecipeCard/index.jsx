import { ShoppingCart, Eye, Clock, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RecipeCard = ({ recipe }) => {
  const [isAdding, setIsAdding] = useState(false);
  const history = useNavigate()

  const handleAddToCart = async () => {
    setIsAdding(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsAdding(false);
  };
  const totalPrice = recipe.products
    .reduce((sum, product) => sum + product.price, 0)
    .toFixed(2);
 
  return (
    <div  className="group overflow-hidden shadow-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white border border-gray-100 rounded-xl">
      <div className="relative overflow-hidden">
        <img
          src={recipe.images[0] || "/placeholder.svg?height=200&width=300"}
          alt={recipe.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badges on top left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {recipe.isNew && (
            <span className="inline-block bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded">
              New
            </span>
          )}
          {recipe.isPopular && (
            <span className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-2 py-1 rounded">
              Popular
            </span>
          )}
        </div>

        {/* Price badge on top right */}
        <div className="absolute top-3 right-3">
          <span className="inline-block bg-white text-green-700 font-semibold text-sm px-3 py-1 rounded shadow-sm">
            ₹&nbsp;{totalPrice}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3 h-[190px] lg:h-[220px] bg-gray-50">
        {/* Title & description */}
        <div>
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 group-hover:text-green-600 transition-colors">
            {recipe.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1 leading-relaxed">
            {recipe.description}
          </p>
        </div>

        

        {/* Product badges */}
        <div className="flex flex-wrap gap-1">
          {recipe.products.slice(0, 4).map((product,idx) => (
            <span
              key={idx}
              className="inline-block text-xs  bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 px-2 py-0.5 rounded"
            >
              {product.name.substr(0,8)}
            </span>
          ))}

          {recipe.products.length > 4 && (
            <span className="inline-block text-xs text-gray-500">...</span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => history(`/recipe/${recipe._id}`)}
            className="flex-1 inline-flex items-center justify-center bg-green-700 text-white border border-green-200  text-sm px-3 py-1.5 rounded hover:bg-green-800 hover:border-green-300 transition-colors"
          >
            <Eye className="h-4 w-4 mr-1" />
            View Ingredients
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
