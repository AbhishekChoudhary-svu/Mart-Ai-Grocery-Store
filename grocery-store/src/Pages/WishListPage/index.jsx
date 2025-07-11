import React, { useContext, useEffect } from 'react'
import { ArrowLeft, Heart, ShoppingCart, Trash2, User, ShoppingBag, Settings, CreditCard, LogOut } from "lucide-react"
import { Link, useNavigate } from 'react-router-dom'
import LeftSideBarMenu from '../../components/LeftSideBarMenu'
import { MyContext } from '../../App'
import Rating from "@mui/material/Rating";
import { deleteData } from '../../utils/api'


const WishListPage = () => {
  const context = useContext(MyContext)
    const history = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token === null || token === "" || token === undefined) {
      history("/login"); 
    }
  }, []);  
  const wishlistItems = context.listData;

     const removeItem = (id) => {
         deleteData(`/api/mylist/delete/${id}`).then((res) => {
          if(res){
          context.openAlertBox("success", res.data.message);
           context.getMyListItemData();
          }
         });
       };
       useEffect(()=>{
        window.scrollTo(0,0)

       },[])

 

  return (
    <section className='py-2'>
        <div className="container">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex gap-5">
          {/* Left Sidebar Menu */}
          {
            context.windowWidth >768 &&   <LeftSideBarMenu/>
          }
                  


          {/* Main Content */}
          <div className="flex-1 bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center">
              <Heart className="h-5 w-5 text-red-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">My Wishlist</h2>
              <span className="ml-2 text-sm text-gray-500">({wishlistItems.length} items)</span>
            </div>

            <div className="border-t overflow-y-scroll max-h-[330px] border-gray-200">
              {wishlistItems.length > 0 ? (
                <ul className="divide-y  divide-gray-200">
                  {wishlistItems.map((item ,idx) => (
                    <li key={idx} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Link to={`/product/${item.productId}`}>
                         
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.productTitle}
                            className="h-16 w-16 object-cover rounded"
                          /> </Link>
                          <div className="ml-4">
                            <p className="lg:text-sm text-xs font-medium text-gray-900 mb-1">{item.productTitle}</p>
                            <Rating
                        name="rating"
                        size={context.windowWidth <768 ? "small" : ""}
                        value={Number(item.rating)}
                        precision={0.5}
                        readOnly
                      />
                        <div className="flex lg:text-[16px] text-[10px] items-center gap-3 ">
                        <span className="price  font-[700] ">
                          Price : ₹{item.price}
                        </span>
                        <span className="price line-through text-gray-300  font-[700] ">
                          ₹{item.oldPrice}
                        </span>
                        <span className="price  font-[700] text-[#2fa22f]">
                          {item.discount}% OFF
                        </span>
                      </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                          onClick={() => removeItem(item._id)}
                          className="p-2 text-gray-400 hover:text-red-500">
                            <Trash2 className="lg:h-5 h-3 lg:w-5 w-3" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-12 text-center">
                  <Heart className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Your wishlist is empty</h3>
                  <p className="mt-1 text-sm text-gray-500">Start adding items you love to your wishlist.</p>
                  <div className="mt-6">
                    <Link
                      to="/"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
        </div>
    </section>
  )
}

export default WishListPage
