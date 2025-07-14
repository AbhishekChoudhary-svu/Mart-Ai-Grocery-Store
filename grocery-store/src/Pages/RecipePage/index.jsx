import { Search, ShoppingCart, Filter } from "lucide-react";
 // Make sure your RecipeCard is in this path, or update the import
import { useContext, useState } from "react";
import RecipeCard from "../../components/RecipeCard";
import { MyContext } from "../../App";




const RecipePage = () => {
    const context = useContext(MyContext)
    const [searchQuery, setSearchQuery] = useState("");
    const sampleRecipes = context.recipeData
    
  return (
      <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-100 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="lg:text-3xl text-2xl font-bold text-gray-900">Recipe Meal Kits</h1>
                <p className="text-gray-600 text-sm lg:text-lg mt-1">Fresh ingredients delivered with recipes</p>
              </div>
              <div className="lg:flex items-center hidden  gap-3">
                <span className="inline-block text-sm border bg-white border-green-200 text-green-700 px-2 py-0.5 rounded">
                  {sampleRecipes.length} meal kits available
                </span>
               
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative  flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search meal kits, ingredients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 bg-white border border-gray-200 rounded px-3 py-2 text-sm focus:border-green-300 focus:ring-2 focus:ring-green-100 outline-none"
                />
              </div>
              
            </div>
          </div>
        </div>
      </header>

     

      {/* Recipe Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sampleRecipes
            .filter((recipe) =>
              recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
        </div>
      </main>

      {/* Load More */}
      <div className="text-center pb-8">
        <button className="inline-flex font-[500] items-center border bg-white border-green-200 text-green-700  hover:bg-green-50 text-sm px-8 py-2 rounded">
          Load More Meal Kits
        </button>
      </div>
    </div>
  )
}

export default RecipePage
