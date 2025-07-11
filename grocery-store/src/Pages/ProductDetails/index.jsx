import { useContext, useEffect, useState } from "react";
import { Star, Plus, Minus, Heart, Share2, ShoppingCart } from "lucide-react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Rating from "@mui/material/Rating";
import { MyContext } from "../../App";
import { useParams } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";
import ReviewBox from "../ProductDetails/review";
import { TbHeartX } from "react-icons/tb";

const ProductDetails = () => {
  const context = useContext(MyContext);
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [productData, setProductData] = useState({});
  const [reviewsCount, setReviewsCount] = useState(0);

  useEffect(() => {
    if (id) {
      fetchDataFromApi(`/api/product/${id}`).then((res) => {
        setProductData(res.product);
      });
      fetchDataFromApi(`/api/user/getReviews/${id}`).then((res) => {
        setReviewsCount(res?.data?.length);
      });
    }
  }, [id, reviewsCount]);
  const productImages = productData?.images || [];

  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState("details");
  const [added, setAdded] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, quantity + change));
  };
  const addToCartItem = (product, userId, quantity) => {
    context?.addToCartItem(product, userId, quantity);
  };

  const handleToAddList = (item) => {
    context?.handleToAddList(item);
    setAdded(true);
  };

  return (
    <section className=" ">
      <div className="container ">
        <div className="min-h-screen bg-white font-sans">
          <div className="max-w-7xl lg:mx-auto p-4  lg:px-0 lg:py-8">
            <div className="grid lg:grid-cols-2 gap-4 lg:gap-12">
              {/* Product Images */}
              <div className="lg:space-y-4 space-y-2">
                {/* Main Image with Magnify */}
                <div className="relative">
                  <div
                    className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 h-[350px] lg:h-[500px] cursor-crosshair"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={handleMouseMove}
                  >
                    <img
                      src={productImages[selectedImage] || "/placeholder.svg"}
                      alt="Fresh Organic Bananas"
                      className="w-full h-full object-contain select-none"
                      style={{
                        transform: isZoomed ? `scale(2.5)` : "scale(1)",
                        transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                        transition: isZoomed
                          ? "none"
                          : "transform 0.3s ease-out",
                      }}
                      draggable={false}
                    />

                    {/* Zoom Indicator */}
                    {isZoomed && (
                      <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                        2.5x Zoom
                      </div>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    <span className="inline-block bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded">
                      Organic
                    </span>
                    <span className="inline-block bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded">
                      {productData.discount}% OFF
                    </span>
                  </div>

                  {/* Zoom Instructions */}
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded text-sm">
                    Hover to zoom
                  </div>
                </div>

                {/* Thumbnail Images */}
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-200 ${
                        selectedImage === index
                          ? "border-2 border-green-500 ring-2 ring-green-200"
                          : "border-2 border-gray-200 hover:border-gray-300 hover:shadow-md"
                      }`}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Product view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Information */}
              <div className="lg:space-y-5 space-y-3">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2 font-semibold">
                    <span>{productData?.catName}</span>
                    <span>•</span>
                    <span>{productData?.subCatName}</span>
                  </div>
                  <h1 className="lg:text-3xl text-xl font-bold text-gray-900 mb-4">
                    {productData?.name}
                  </h1>
                  <p className="text-gray-600 lg:text-[15px] text-[12px] mb-2">
                    {productData?.description}
                  </p>
                  <span className="text-black lg:text-[16px] text-[13px] font-[500]">
                    <span className="text-red-500 font-bold">
                      Brand :&nbsp;{" "}
                    </span>
                    {productData?.brand}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <Rating
                      name="rating"
                      value={Number(productData.rating)}
                      precision={0.5}
                      readOnly
                    />
                  </div>
                  <span className="text-sm text-gray-600">
                    ({productData.rating}) • {reviewsCount} reviews
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3">
                  <span className="lg:text-2xl text-xl font-bold text-green-600">
                    ₹{productData.price}
                  </span>
                  <span className="lg:text-xl text-lg text-gray-500 line-through">
                    ₹{productData.oldPrice}
                  </span>
                  <span className="inline-block bg-green-100 text-green-700 lg:text-xs text-[10px] font-semibold px-2.5 py-1 rounded">
                    Save ₹
                    {Number(productData.oldPrice) - Number(productData.price)}
                    .00
                  </span>
                </div>
                <p className="lg:text-sm text-xs text-gray-600 font-[500]">
                  {productData.productWeight} • {productData.size}
                </p>

                {/* Quantity and Add to Cart */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-sm sm:text-base">
                      Quantity:
                    </span>
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <span className="px-3 py-2 font-medium text-sm sm:text-base min-w-[2.5rem] text-center">
                        {quantity}
                      </span>
                      <button
                        className="p-2 text-gray-600 hover:bg-gray-100 transition-colors"
                        onClick={() => handleQuantityChange(1)}
                      >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={() =>
                        addToCartItem(
                          productData,
                          context?.userData?._id,
                          quantity
                        )
                      }
                      className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 text-white font-medium text-sm sm:text-base rounded-lg transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleToAddList(productData)}
                      className="p-2.5 sm:p-3 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Heart className="w-6 h-6 sm:w-7 sm:h-7" />
                    </button>
                    <button className="p-2.5 sm:p-3 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">
                      <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>

                {/* Product Details */}
                <hr className="my-6 border-gray-200" />

                {/* Tabs */}

                {/* Additional Info */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">
                    🚚 Delivery Information
                  </h4>
                  <ul className="text-sm font-[500] text-green-700 space-y-1">
                    <li>• Same-day delivery available</li>
                    <li>• Free delivery on orders over ₹499</li>
                    <li>• Fresh guarantee - 100% satisfaction</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Review Section  */}
            <div className="w-full py-4">
              <div className="flex border-b border-gray-200">
                {["details", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors capitalize ${
                      activeTab === tab
                        ? "border-green-500 text-green-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="py-6">
                {activeTab === "details" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-900">
                          Origin:
                        </span>
                        <p className="text-gray-600">{productData?.brand}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">
                          Ripeness:
                        </span>
                        <p className="text-gray-600">Perfect for eating</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">
                          Storage:
                        </span>
                        <p className="text-gray-600">Room temperature</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">
                          Shelf Life:
                        </span>
                        <p className="text-gray-600">5-7 days</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Description
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {productData?.description}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <ReviewBox
                    userId={context?.userData?._id}
                    productId={id}
                    userName={context?.userData?.name}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
