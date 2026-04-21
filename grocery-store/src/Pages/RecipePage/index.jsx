import { Search, Sparkles, Loader2 } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import RecipeCard from "../../components/RecipeCard";
import { MyContext } from "../../App";
import { fetchDataFromApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const RecipePage = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const sampleRecipes = context.recipeData;

  const [aiQuery, setAiQuery] = useState("");
  const [generating, setGenerating] = useState(false);
  const [productsData, setProductsData] = useState([]);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchDataFromApi("/api/product").then((res) => {
      setProductsData(res?.products || []);
    });
  }, []);

  const handleAiGenerate = async () => {
    if (!aiQuery.trim()) {
      context.openAlertBox("error", "Enter a recipe name to generate");
      return;
    }
    if (productsData.length === 0) {
      context.openAlertBox("error", "Products are still loading, please wait");
      return;
    }

    setGenerating(true);

    const productList = productsData
      .map((p) => `- ID: ${p._id} | Name: ${p.name}`)
      .join("\n");

    const prompt = `You are a recipe assistant. The user wants to create a recipe called "${aiQuery}".

Here are the available products in the database:
${productList}

Your task:
1. Generate a clean recipe name (use the user input, fix spelling/casing if needed).
2. Write a 1-2 sentence description for this recipe.
3. From the product list above, select all product IDs that are relevant ingredients or components for this recipe.
4. List any additional ingredients you would recommend that are NOT in the database (names only, no IDs).

Respond ONLY with a valid JSON object, no markdown, no backticks. Exact shape:
{
  "name": "Recipe Name",
  "description": "Short 1-2 sentence description.",
  "matchedProductIds": ["id1", "id2"],
  "notFoundProducts": ["Ingredient A", "Ingredient B"]
}`;

    try {
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const raw = data.content?.map((i) => i.text || "").join("") || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      const matchedProducts = productsData.filter((p) =>
        parsed.matchedProductIds?.includes(p._id)
      );

      // Build structured description (JSON format for proper rendering)
      const structuredDescription = JSON.stringify({
        about: parsed.description,
        inStore: matchedProducts.map((p) => p.name),
        notInStore: parsed.notFoundProducts || [],
      });

      // Navigate to a preview page passing AI result via state
      navigate("/recipe/ai-preview", {
        state: {
          name: parsed.name,
          description: structuredDescription,
          products: matchedProducts,
          notInStore: parsed.notFoundProducts || [],
        },
      });

      context.openAlertBox("success", "Recipe generated!");
    } catch (err) {
      console.error("AI Generate error:", err);
      context.openAlertBox("error", "Failed to generate recipe. Try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="lg:text-3xl text-2xl font-bold text-gray-900">
                  Recipe Meal Kits
                </h1>
                <p className="text-gray-600 text-sm lg:text-lg mt-1">
                  Fresh ingredients delivered with recipes
                </p>
              </div>
              <div className="lg:flex items-center hidden gap-3">
                <span className="inline-block text-sm border bg-white border-green-200 text-green-700 px-2 py-0.5 rounded">
                  {sampleRecipes.length} meal kits available
                </span>
              </div>
            </div>

            {/* AI Generator Bar */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
              <p className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                AI Recipe Generator — Get a custom recipe with ingredients from our store
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAiGenerate()}
                  placeholder="Type a recipe name (e.g. Chicken Biryani)..."
                  className="flex-1 p-2 border border-purple-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                />
                <button
                  type="button"
                  onClick={handleAiGenerate}
                  disabled={generating}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative flex-1">
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
        <button className="inline-flex font-[500] items-center border bg-white border-green-200 text-green-700 hover:bg-green-50 text-sm px-8 py-2 rounded">
          Load More Meal Kits
        </button>
      </div>
    </div>
  );
};

export default RecipePage;