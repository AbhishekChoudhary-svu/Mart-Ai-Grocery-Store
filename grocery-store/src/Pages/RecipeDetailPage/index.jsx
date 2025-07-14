import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { fetchDataFromApi } from "../../utils/api";

const RecipeDetailPage = () => {
  const { id } = useParams();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    fetchDataFromApi(`/api/recipe/${id}`).then((res) => {
      setProductData(res);
    });
  }, [id]);

  const recipe = productData;

  if (!recipe) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  const totalPrice =
    recipe?.products?.reduce((sum, item) => sum + item.price, 0) || 0;

  const handleAddAllToCart = async () => {
    setIsAddingToCart(true);
    // fake delay
    await new Promise((r) => setTimeout(r, 1000));
    setIsAddingToCart(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left - Image & badges */}
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={recipe.images[0]}
              alt={recipe.name}
              className="w-full h-64 sm:h-80 md:h-80 object-cover"
            />
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {recipe.isNew && (
                <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded">
                  New
                </span>
              )}
              {recipe.isPopular && (
                <span className="inline-block bg-emerald-500 text-white text-xs px-2 py-1 rounded">
                  Popular
                </span>
              )}
            </div>
          </div>

          {/* Right - Info */}
          <div className="space-y-4 sm:space-y-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {recipe.name}
            </h1>

            <p className="text-gray-700  leading-relaxed text-sm sm:text-base">
              {recipe.description?.substring(0, 400)}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4 flex-1">
                <p className="text-gray-600 text-sm sm:text-base font-medium">
                  Total Price:
                </p>
                <p className="text-green-700 font-semibold text-base sm:text-lg">
                  ₹ {totalPrice.toFixed(2)}
                </p>
              </div>

              <button
                onClick={handleAddAllToCart}
                disabled={isAddingToCart}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded text-sm sm:text-base font-semibold transition-colors flex-1"
              >
                <ShoppingCart className="h-5 w-5" />
                {isAddingToCart ? "Adding..." : "Add All to Cart"}
              </button>
            </div>
          </div>
        </div>

        {/* Ingredients grid */}
        <section className="mt-10 sm:mt-12">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
            Ingredients Included
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {recipe.products.map((ing, idx) => (
              <Link key={idx} to={`/product/${ing._id}`}>
                <div className="border border-green-100 rounded-lg p-3 sm:p-4 text-center bg-gray-50 hover:shadow transition-shadow">
                  <img
                    src={ing.images[0]}
                    alt={ing.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 object-cover mx-auto mb-2 rounded"
                  />
                  <h4 className="font-medium text-gray-900 text-xs sm:text-sm mb-1 truncate">
                    {ing.name}
                  </h4>
                  <span className="font-semibold text-green-700 text-xs sm:text-sm">
                    ₹ {ing.price.toFixed(2)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default RecipeDetailPage;
