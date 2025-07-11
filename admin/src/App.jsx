import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import "./Responsive.css";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import { createContext, useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import Products from "./pages/Products";
import AddProductForm from "./components/AddProductForm";
import HomeSliderBanners from "./pages/HomeSliderBanners";
import AddSlidesForm from "./components/AddSlidesForm";
import Categories from "./pages/Categories";
import AddCategoryForm from "./components/AddCategoryForm";
import SubCategories from "./pages/SubCategories";
import AddSubCategoryForm from "./components/AddSubCategoryForm";
import Users from "./pages/Users";
import Orders from "./pages/Orders";
import Register from "./pages/Register";
import ResetPass from "./pages/ResetPass";
import EmailVerification from "./pages/EmailVerification";
import toast, { Toaster } from "react-hot-toast";
import { fetchDataFromApi } from "./utils/api";
import ProfilePage from "./pages/ProfilePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AdsBanner from "./pages/AdsBanner";
import AddBannerForm from "./components/AddBannerForm";

const MyContext = createContext();

function App() {

  const apiUrl = import.meta.env.VITE_API_URL;

  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);


  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token !== undefined && token !== null && token !== "") {
      setIsLogin(true);
      fetchDataFromApi(`/api/user/user-details`).then((res) => {
        setUserData(res.data);

        if (res?.response?.data?.message === "Invalid Login.") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          openAlertBox("error", "Session Expired ! Login Again");
          window.location.href = "/login";

          setIsLogin(false);
        }
      });
    } else {
      setIsLogin(false);
    }
  }, [isLogin]);



  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  
  useEffect(() => {
    if (windowWidth < 1024) {
      setIsSideBarOpen(false);
    }
  }, [windowWidth]);
  


  const router = createBrowserRouter([
    {
      path: "/",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="ContentMain flex">
              <div
                className={`sidebarWrapper ${
                  isSideBarOpen === true ? "w-[16%] " : "w-[0px] opacity-0"
                } transition-all`}
              >
                <SideBar />
                {isSideBarOpen && (
                  <div
                    onClick={() => setIsSideBarOpen(false)}
                    className="fixed inset-0 bg-[rgba(0,0,0,0.5)]  z-40 lg:hidden"
                  ></div>
                )}
              </div>
              <div
                className={`contentRight py-4 px-5 ${
                  isSideBarOpen === true ? "lg:w-[84%] w-[100%] " : "w-[100%]"
                } transition-all`}
              >
                <Dashboard />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/login",
      exact: true,
      element: (
        <>
          <LoginPage />
        </>
      ),
    },
    {
      path: "/register",
      exact: true,
      element: (
        <>
          <Register />
        </>
      ),
    },
    {
      path: "/reset-password",
      exact: true,
      element: (
        <>
          <ResetPass />
        </>
      ),
    },
    {
      path: "/email-verify",
      exact: true,
      element: (
        <>
          <EmailVerification />
        </>
      ),
    },
    {
      path: "/products",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="ContentMain flex">
              <div
                className={`sidebarWrapper ${
                  isSideBarOpen === true ? "w-[16%]" : "w-[0px] opacity-0"
                } transition-all `}
              >
                <SideBar />
                {isSideBarOpen && (
                  <div
                    onClick={() => setIsSideBarOpen(false)}
                    className="fixed inset-0 bg-[rgba(0,0,0,0.5)]  z-40 lg:hidden"
                  ></div>
                )}
              </div>
              <div
                 className={`contentRight py-4 px-5 ${
                  isSideBarOpen === true ? "lg:w-[84%] w-[100%] " : "w-[100%]"
                } transition-all`}
              >
                <Products />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/product/view/:id",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="ContentMain flex">
              <div
                className={`sidebarWrapper ${
                  isSideBarOpen === true ? "w-[16%]" : "w-[0px] opacity-0"
                } transition-all `}
              >
                <SideBar />
                {isSideBarOpen && (
                  <div
                    onClick={() => setIsSideBarOpen(false)}
                    className="fixed inset-0 bg-[rgba(0,0,0,0.5)]  z-40 lg:hidden"
                  ></div>
                )}
              </div>
              <div
                 className={`contentRight py-4 px-5 ${
                  isSideBarOpen === true ? "lg:w-[84%] w-[100%] " : "w-[100%]"
                } transition-all`}
              >
                <ProductDetailPage />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/product/edit/:id",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="ContentMain flex">
              <div
                className={`sidebarWrapper ${
                  isSideBarOpen === true ? "w-[16%]" : "w-[0px] opacity-0"
                } transition-all `}
              >
                <SideBar />
                {isSideBarOpen && (
                  <div
                    onClick={() => setIsSideBarOpen(false)}
                    className="fixed inset-0 bg-[rgba(0,0,0,0.5)]  z-40 lg:hidden"
                  ></div>
                )}
              </div>
              <div
                 className={`contentRight py-4 px-5 ${
                  isSideBarOpen === true ? "lg:w-[84%] w-[100%] " : "w-[100%]"
                } transition-all`}
              >
                <AddProductForm />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/product/upload",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="ContentMain flex">
              <div
                className={`sidebarWrapper ${
                  isSideBarOpen === true ? "w-[16%]" : "w-[0px] opacity-0"
                } transition-all `}
              >
                <SideBar />
                {isSideBarOpen && (
                  <div
                    onClick={() => setIsSideBarOpen(false)}
                    className="fixed inset-0 bg-[rgba(0,0,0,0.5)]  z-40 lg:hidden"
                  ></div>
                )}
              </div>
              <div
                 className={`contentRight py-4 px-5 ${
                  isSideBarOpen === true ? "lg:w-[84%] w-[100%] " : "w-[100%]"
                } transition-all`}
              >
                <AddProductForm />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/AdsBanner/List",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="ContentMain flex">
              <div
                className={`sidebarWrapper ${
                  isSideBarOpen === true ? "w-[16%]" : "w-[0px] opacity-0"
                } transition-all `}
              >
                <SideBar />
                {isSideBarOpen && (
                  <div
                    onClick={() => setIsSideBarOpen(false)}
                    className="fixed inset-0 bg-[rgba(0,0,0,0.5)]  z-40 lg:hidden"
                  ></div>
                )}
              </div>
              <div
                 className={`contentRight py-4 px-5 ${
                  isSideBarOpen === true ? "lg:w-[84%] w-[100%] " : "w-[100%]"
                } transition-all`}
              >
                <AdsBanner />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/AdsBanner/Edit/:id",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="ContentMain flex">
              <div
                className={`sidebarWrapper ${
                  isSideBarOpen === true ? "w-[16%]" : "w-[0px] opacity-0"
                } transition-all `}
              >
                <SideBar />
                {isSideBarOpen && (
                  <div
                    onClick={() => setIsSideBarOpen(false)}
                    className="fixed inset-0 bg-[rgba(0,0,0,0.5)]  z-40 lg:hidden"
                  ></div>
                )}
              </div>
              <div
                 className={`contentRight py-4 px-5 ${
                  isSideBarOpen === true ? "lg:w-[84%] w-[100%] " : "w-[100%]"
                } transition-all`}
              >
                <AddBannerForm />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/AdsBanner/Add",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="ContentMain flex">
              <div
                className={`sidebarWrapper ${
                  isSideBarOpen === true ? "w-[16%]" : "w-[0px] opacity-0"
                } transition-all `}
              >
                <SideBar />
                {isSideBarOpen && (
                  <div
                    onClick={() => setIsSideBarOpen(false)}
                    className="fixed inset-0 bg-[rgba(0,0,0,0.5)]  z-40 lg:hidden"
                  ></div>
                )}
              </div>
              <div
                 className={`contentRight py-4 px-5 ${
                  isSideBarOpen === true ? "lg:w-[84%] w-[100%] " : "w-[100%]"
                } transition-all`}
              >
                <AddBannerForm />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/homeSlider/BannerList",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="ContentMain flex">
              <div
                className={`sidebarWrapper ${
                  isSideBarOpen === true ? "w-[16%]" : "w-[0px] opacity-0"
                } transition-all `}
              >
                <SideBar />
                {isSideBarOpen && (
                  <div
                    onClick={() => setIsSideBarOpen(false)}
                    className="fixed inset-0 bg-[rgba(0,0,0,0.5)]  z-40 lg:hidden"
                  ></div>
                )}
              </div>
              <div
                 className={`contentRight py-4 px-5 ${
                  isSideBarOpen === true ? "lg:w-[84%] w-[100%] " : "w-[100%]"
                } transition-all`}
              >
                <HomeSliderBanners />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/homeSlider/editBanner/:id",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="ContentMain flex">
              <div
                className={`sidebarWrapper ${
                  isSideBarOpen === true ? "w-[16%]" : "w-[0px] opacity-0"
                } transition-all `}
              >
                <SideBar />
                {isSideBarOpen && (
                  <div
                    onClick={() => setIsSideBarOpen(false)}
                    className="fixed inset-0 bg-[rgba(0,0,0,0.5)]  z-40 lg:hidden"
                  ></div>
                )}
              </div>
              <div
                 className={`contentRight py-4 px-5 ${
                  isSideBarOpen === true ? "lg:w-[84%] w-[100%] " : "w-[100%]"
                } transition-all`}
              >
                <AddSlidesForm />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/homeSlider/AddBanner",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="ContentMain flex">
              <div
                className={`sidebarWrapper ${
                  isSideBarOpen === true ? "w-[16%]" : "w-[0px] opacity-0"
                } transition-all `}
              >
                <SideBar />
                {isSideBarOpen && (
                  <div
                    onClick={() => setIsSideBarOpen(false)}
                    className="fixed inset-0 bg-[rgba(0,0,0,0.5)]  z-40 lg:hidden"
                  ></div>
                )}
              </div>
              <div
                 className={`contentRight py-4 px-5 ${
                  isSideBarOpen === true ? "lg:w-[84%] w-[100%] " : "w-[100%]"
                } transition-all`}
              >
                <AddSlidesForm />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/categories",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="ContentMain flex">
              <div
                className={`sidebarWrapper ${
                  isSideBarOpen === true ? "w-[16%]" : "w-[0px] opacity-0"
                } transition-all `}
              >
                <SideBar />
                {isSideBarOpen && (
                  <div
                    onClick={() => setIsSideBarOpen(false)}
                    className="fixed inset-0 bg-[rgba(0,0,0,0.5)]  z-40 lg:hidden"
                  ></div>
                )}
              </div>
              <div
                 className={`contentRight py-4 px-5 ${
                  isSideBarOpen === true ? "lg:w-[84%] w-[100%] " : "w-[100%]"
                } transition-all`}
              >
                <Categories />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/category/edit/:id",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="ContentMain flex">
              <div
                className={`sidebarWrapper ${
                  isSideBarOpen === true ? "w-[16%]" : "w-[0px] opacity-0"
                } transition-all `}
              >
                <SideBar />
                {isSideBarOpen && (
                  <div
                    onClick={() => setIsSideBarOpen(false)}
                    className="fixed inset-0 bg-[rgba(0,0,0,0.5)]  z-40 lg:hidden"
                  ></div>
                )}
              </div>
              <div
                 className={`contentRight py-4 px-5 ${
                  isSideBarOpen === true ? "lg:w-[84%] w-[100%] " : "w-[100%]"
                } transition-all`}
              >
                <AddCategoryForm />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/category/add",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="ContentMain flex">
              <div
                className={`sidebarWrapper ${
                  isSideBarOpen === true ? "w-[16%]" : "w-[0px] opacity-0"
                } transition-all `}
              >
                <SideBar />
                {isSideBarOpen && (
                  <div
                    onClick={() => setIsSideBarOpen(false)}
                    className="fixed inset-0 bg-[rgba(0,0,0,0.5)]  z-40 lg:hidden"
                  ></div>
                )}
              </div>
              <div
                 className={`contentRight py-4 px-5 ${
                  isSideBarOpen === true ? "lg:w-[84%] w-[100%] " : "w-[100%]"
                } transition-all`}
              >
                <AddCategoryForm />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/category/subCategories",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="ContentMain flex">
              <div
                className={`sidebarWrapper ${
                  isSideBarOpen === true ? "w-[16%]" : "w-[0px] opacity-0"
                } transition-all `}
              >
                <SideBar />
                {isSideBarOpen && (
                  <div
                    onClick={() => setIsSideBarOpen(false)}
                    className="fixed inset-0 bg-[rgba(0,0,0,0.5)]  z-40 lg:hidden"
                  ></div>
                )}
              </div>
              <div
                 className={`contentRight py-4 px-5 ${
                  isSideBarOpen === true ? "lg:w-[84%] w-[100%] " : "w-[100%]"
                } transition-all`}
              >
                <SubCategories />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/category/subCategories/edit/:id",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="ContentMain flex">
              <div
                className={`sidebarWrapper ${
                  isSideBarOpen === true ? "w-[16%]" : "w-[0px] opacity-0"
                } transition-all `}
              >
                <SideBar />
                {isSideBarOpen && (
                  <div
                    onClick={() => setIsSideBarOpen(false)}
                    className="fixed inset-0 bg-[rgba(0,0,0,0.5)]  z-40 lg:hidden"
                  ></div>
                )}
              </div>
              <div
                 className={`contentRight py-4 px-5 ${
                  isSideBarOpen === true ? "lg:w-[84%] w-[100%] " : "w-[100%]"
                } transition-all`}
              >
                <AddSubCategoryForm />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/category/subCategories/add",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="ContentMain flex">
              <div
                className={`sidebarWrapper ${
                  isSideBarOpen === true ? "w-[16%]" : "w-[0px] opacity-0"
                } transition-all `}
              >
                <SideBar />
                {isSideBarOpen && (
                  <div
                    onClick={() => setIsSideBarOpen(false)}
                    className="fixed inset-0 bg-[rgba(0,0,0,0.5)]  z-40 lg:hidden"
                  ></div>
                )}
              </div>
              <div
                 className={`contentRight py-4 px-5 ${
                  isSideBarOpen === true ? "lg:w-[84%] w-[100%] " : "w-[100%]"
                } transition-all`}
              >
                <AddSubCategoryForm />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/users",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="ContentMain flex">
              <div
                className={`sidebarWrapper ${
                  isSideBarOpen === true ? "w-[16%]" : "w-[0px] opacity-0"
                } transition-all `}
              >
                <SideBar />
                {isSideBarOpen && (
                  <div
                    onClick={() => setIsSideBarOpen(false)}
                    className="fixed inset-0 bg-[rgba(0,0,0,0.5)]  z-40 lg:hidden"
                  ></div>
                )}
              </div>
              <div
                 className={`contentRight py-4 px-5 ${
                  isSideBarOpen === true ? "lg:w-[84%] w-[100%] " : "w-[100%]"
                } transition-all`}
              >
                <Users />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/orders",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="ContentMain flex">
              <div
                className={`sidebarWrapper ${
                  isSideBarOpen === true ? "w-[16%]" : "w-[0px] opacity-0"
                } transition-all `}
              >
                <SideBar />
                {isSideBarOpen && (
                  <div
                    onClick={() => setIsSideBarOpen(false)}
                    className="fixed inset-0 bg-[rgba(0,0,0,0.5)]  z-40 lg:hidden"
                  ></div>
                )}
              </div>
              <div
                 className={`contentRight py-4 px-5 ${
                  isSideBarOpen === true ? "lg:w-[84%] w-[100%] " : "w-[100%]"
                } transition-all`}
              >
                <Orders />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/profile-page",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="ContentMain flex">
              <div
                className={`sidebarWrapper ${
                  isSideBarOpen === true ? "w-[16%]" : "w-[0px] opacity-0"
                } transition-all `}
              >
                <SideBar />
                {isSideBarOpen && (
                  <div
                    onClick={() => setIsSideBarOpen(false)}
                    className="fixed inset-0 bg-[rgba(0,0,0,0.5)]  z-40 lg:hidden"
                  ></div>
                )}
              </div>
              <div
                 className={`contentRight py-4 px-5 ${
                  isSideBarOpen === true ? "lg:w-[84%] w-[100%] " : "w-[100%]"
                } transition-all`}
              >
                <ProfilePage />
              </div>
            </div>
          </section>
        </>
      ),
    },
  ]);

  const openAlertBox = (type, status) => {
    console.log(status);
    if (type === "success") {
      toast.success(status);
    }
    if (type === "error") {
      toast.error(status);
    }
  };

  const values = {
    isSideBarOpen,
    setIsSideBarOpen,
    isLogin,
    setIsLogin,
    openAlertBox,
    apiUrl,
    userData,
    setUserData,
  };

  return (
    <>
      <MyContext.Provider value={values}>
        <RouterProvider router={router} />
      </MyContext.Provider>
      <Toaster />
    </>
  );
}

export default App;

export { MyContext };
