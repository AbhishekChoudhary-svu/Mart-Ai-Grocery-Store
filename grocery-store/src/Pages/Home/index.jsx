import { React, useContext, useEffect, useState } from "react";
import HomeSlider from "../../components/HomeSlider";
import HomeCatSlider from "../../components/HomeCatSlider";
import { TbTruckDelivery } from "react-icons/tb";
import AdsBannerPart from "../../components/AdsBannerPart";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ProductsSlider from "../../components/ProductsSlider";
import Footer from "../../components/Footer";
import HomeSliderV2 from "../../components/HomeSliderV2";
import BannerBoxV2 from "../../components/BannerBoxV2";
import { fetchDataFromApi } from "../../utils/api";
import { MyContext } from "../../App";
import ProductLoading from "../../components/ProductLoading";

const Home = () => {
  const context = useContext(MyContext);

  const [value, setValue] = useState(0);
  const [slideData, setSlideData] = useState([]);
  const [popularProductData, setPopularProductData] = useState([]);
  const [allProductData, setAllProductData] = useState([]);
  const [featureProductData, setFeatureProductData] = useState([]);
  const [bannerData, setBannerData] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDataFromApi("/api/homeSlides/").then((res) => {
      setSlideData(res?.slides);
    });
    fetchDataFromApi("/api/product/").then((res) => {
  // clone and shuffle the products
  const shuffled = [...res?.products].sort(() => 0.5 - Math.random());
  setAllProductData(shuffled);
});
    fetchDataFromApi("/api/product/getAllFeaturedProducts").then((res) => {
      const shuffled = [...res?.products].sort(() => 0.5 - Math.random());
  setFeatureProductData(shuffled);
      
    });
    fetchDataFromApi("/api/Banner/").then((res) => {
      setBannerData(res?.banner);
    });
  }, []);

  useEffect(() => {
    if (context?.catData && context.catData.length > 0) {
      fetchDataFromApi(
        `/api/product/getAllProductsByCatId/${context.catData[0]._id}`
      ).then((res) => {
        setPopularProductData(res?.products);
      });
    }
  }, [context?.catData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const filterByCatId = (id) => {
    fetchDataFromApi(`/api/product/getAllProductsByCatId/${id}`).then((res) => {
      setPopularProductData(res?.products);
    });
  };
  return (
    <>
      {slideData.length !== 0 && <HomeSlider data={slideData} />}

      {/* <section className="py-4 homeSliderrrV2">
      <div className="container flex gap-5 ">
        <div className="part1 w-[75%]">
            <HomeSliderV2/>
        </div>
        <div className="part2 w-[25%] flex items-center justify-between flex-col ">
          <BannerBoxV2 imgItem={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROESNJ7cx1MFhgOqaX9WtJLlSXCLz9EPH6JQ&s"}/>
          <BannerBoxV2 imgItem={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpy0-mrou7Uh4Vx-2-ID4l2u_Epoq3O6EWX7PaWugFmwOqPrMXksE4kZTYoDclExO6P_E&usqp=CAU"}/>
        </div>
      </div>
     </section> */}

      {context.catData.length !== 0 && <HomeCatSlider />}

      <section className="PopularProduct bg-white py-5">
        <div className="container">
          <div className="flex items-start lg:items-center justify-between flex-col lg:flex-row">
            <div className="leftSec">
              <h2 className="lg:text-[25px] sm:text-[20px] text-[15px] font-[600]">
                Popular Products
              </h2>
              <p className="text-[10px] sm:text-[12px] lg:text-[15px]">
                Don't Miss the Offer valid till End of the Month
              </p>
            </div>
            <div className="rightSec  w-full lg:w-[70%] overflow-x-auto">
              <Box
                sx={{
                  width: "100%", // always take full width
                  maxWidth: { xs: "100%", sm: 1080 }, // cap on larger screens
                  bgcolor: "background.paper",
                }}
              >
                <Tabs
                  value={value}
                  onChange={handleChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="scrollable auto tabs example"
                >
                  {context?.catData?.length !== 0 &&
                    context.catData.map((cat, idx) => (
                      <Tab
                        key={idx}
                        label={
                          <span className="text-[10px] sm:text-sm md:text-base font-bold sm:font-[500] truncate">
                            {cat.name}
                          </span>
                        }
                        onClick={() => filterByCatId(cat._id)}
                      />
                    ))}
                </Tabs>
              </Box>
            </div>
          </div>

          {popularProductData?.length !== 0 ? (
            <ProductsSlider items={6} data={popularProductData} />
          ) : (
            <ProductLoading />
          )}
        </div>
      </section>

      <section className="freeShipOrBanner bg-white py-0 lg:py-4 ">
        <div className="container">
          <div className="freeShipping  w-full flex-col lg:flex-row p-4  border-3 border-[darkgreen] rounded-sm flex items-center justify-between">
            <div className="col1 flex items-center justify-center gap-4">
              <TbTruckDelivery className="lg:text-[50px] text-[30px]  font-[500]" />
              <span className="lg:text-[30px] whitespace-nowrap text-[20px] font-[600] uppercase ">
                Free Shipping
              </span>
            </div>
            <div className="col2 border-r-1 border-l-1 border-gray-200 lg:px-12 px-6">
              <p className=" lg:text-[18px] text-[13px]  whitespace-nowrap  font-[400]">
                Free Delivery on First Order Above Rs.400/-
              </p>
            </div>
            <p className=" text-[30px] font-[600] whitespace-nowrap hidden xl:block">- Above Rs.400</p>
          </div>
          {bannerData?.length !== 0 && <AdsBannerPart data={bannerData} />}
        </div>
      </section>

      <section className="LatestProduct bg-white">
        <div className="container">
          <h2 className="lg:text-[25px] text-[15px] font-[600]">Latest Products</h2>
          {allProductData?.length !== 0 ? (
            <ProductsSlider items={6} data={allProductData} />
          ) : (
            <ProductLoading />
          )}
        </div>
      </section>

      <section className="FeaturedProduct py-2 bg-white">
        <div className="container">
          <h2 className="lg:text-[25px] text-[15px] font-[600]">Featured Products</h2>
          {featureProductData?.length !== 0 ? (
            <ProductsSlider items={6} data={featureProductData} />
          ) : (
            <ProductLoading />
          )}
          {bannerData?.length !== 0 && <AdsBannerPart data={bannerData} />}
        </div>
      </section>
    </>
  );
};

export default Home;
