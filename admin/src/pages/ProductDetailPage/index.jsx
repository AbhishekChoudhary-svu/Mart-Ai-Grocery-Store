import React, { useEffect, useState } from "react";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { BiCategoryAlt } from "react-icons/bi";
import { SiBrandfolder } from "react-icons/si";
import { MdCurrencyRupee } from "react-icons/md";
import { MdRateReview } from "react-icons/md";
import { GiWeight } from "react-icons/gi";
import { CiCalendarDate } from "react-icons/ci";
import { AiOutlineStock } from "react-icons/ai";
import { fetchDataFromApi } from "../../utils/api";
import { useParams } from "react-router-dom";
import { Star } from "lucide-react";

const ProductDetailPage = () => {
  const { id } = useParams(); //
  const [selectedImage, setSelectedImage] = useState(0);
  const [productData, setProductData] = useState({});

  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
  useEffect(() => {
    fetchDataFromApi(`/api/product/${id}`).then((res) => {
      setProductData(res.product);
    });
  }, [id]);
  const productImages = productData?.images || [];

  return (
    <>
      <div className="py-3">
        <h1 className="font-bold pl-2 text-xl sm:text-2xl">Product Details</h1>
      </div>
      <div className="rounded-md">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image with Magnify */}
            <div className="relative">
              <div
                className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 h-[350px] sm:h-[400px] lg:h-[480px] cursor-crosshair"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={productImages[selectedImage] || "/placeholder.svg"}
                  alt="Product"
                  className="w-full h-full object-cover select-none"
                  style={{
                    transform: isZoomed ? `scale(2.5)` : "scale(1)",
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                    transition: isZoomed ? "none" : "transform 0.3s ease-out",
                  }}
                  draggable={false}
                />
                {isZoomed && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                    2.5x Zoom
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                <span className="inline-block bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded">
                  Organic
                </span>
                <span className="inline-block bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded">
                  20% OFF
                </span>
              </div>

              {/* Zoom Instructions */}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                Hover to zoom
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition-all duration-200 ${
                    selectedImage === index
                      ? "border-2 border-green-500 ring-2 ring-green-200"
                      : "border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                {productData.name}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                {productData.description}
              </p>
            </div>
            <div className="detail-container w-full sm:w-[90%] space-y-2">
              {[
                {
                  icon: <BiSolidCategoryAlt className="text-xl" />,
                  label: "Category",
                  value: productData.catName,
                },
                {
                  icon: <BiCategoryAlt className="text-xl" />,
                  label: "Sub-Category",
                  value: productData.subCatName,
                },
                {
                  icon: <SiBrandfolder className="text-xl" />,
                  label: "Brand",
                  value: productData.brand,
                },
                {
                  icon: <MdCurrencyRupee className="text-xl" />,
                  label: "Price",
                  value: productData.price,
                },
                {
                  icon: <MdRateReview className="text-xl" />,
                  label: "Review",
                  value: `(${productData?.reviews?.length || 0}) Reviews`,
                },
                productData.productWeight?.length && {
                  icon: <GiWeight className="text-xl" />,
                  label: "Weight",
                  value: productData.productWeight.join(", "),
                },
                {
                  icon: <AiOutlineStock className="text-xl" />,
                  label: "Stock",
                  value: productData.countInStock,
                },
                {
                  icon: <CiCalendarDate className="text-xl" />,
                  label: "Published Date",
                  value: productData.updatedAt,
                },
              ]
                .filter(Boolean)
                .map((item, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-[140px_10px_1fr] items-center text-sm sm:text-base font-medium text-gray-700"
                  >
                    <span className="flex items-center gap-2">
                      {item.icon}
                      {item.label}
                    </span>
                    <span>:</span>
                    <span className="pl-1">{item.value}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="space-y-4 overflow-y-auto max-h-[300px] mt-6">
          <h1 className="font-bold pl-2 text-xl sm:text-2xl">
            Product Reviews
          </h1>
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="reviewBox border border-gray-200 rounded-lg p-3"
            >
              <div className="flex items-center gap-2">
                <div className="profile w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src="https://res.cloudinary.com/dagkmjoro/image/upload/v1750959328/products/1750959327636-Banner_V2.jpg"
                    alt=""
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="font-medium">Sarah M.</span>
                    <span className="text-xs text-gray-500">2 days ago</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Perfect ripeness and great taste! These bananas were exactly
                    what I was looking for.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
