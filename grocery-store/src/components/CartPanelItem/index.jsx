import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { MyContext } from "../../App";
import { useEffect } from "react";
import { deleteData } from "../../utils/api";
const CartPanelItem = () => {
  const context = useContext(MyContext);
  const removeItem=(id)=>{
    deleteData(`/api/cart/deleteCartItems/${id}`).then((res) => {
            context.openAlertBox("success", res.data.message);
            context.getCartItemData();
          });
  }
  useEffect(()=>{
    context.getCartItemData();

  },[context.openCartPanel])

  const total = context.cartData.reduce((acc, item) => acc + item.price * item.quantity, 0);

  
  return (
    <>
      <div className="scroll w-full h-full lg:max-h-[450px] overflow-y-scroll overflow-x-hidden px-4 py-3">
        {
          context.cartData.length!==0 && context.cartData.map((item,idx)=>{
            return(
               <div key={idx} className="cartItem w-full flex  gap-4 rounded-sm border-b border-gray-200 py-2 px-2 mb-2">
          <div className="img w-[25%] overflow-hidden rounded-lg h-[100px]">
            <Link to={`/product/${item.productId._id}`}>
            <img
              className="w-full"
              src={item.image}
              alt=""
              onClick={context.toggleCartDrawer(false)}
            />
            </Link>
          </div>
          <div className="info w-[75%] pr-5  space-y-1 relative ">
            <h4 className="text-[15px] font-[500]">{item.productName.substr(0, 30)}</h4>
            <p className="flex items-center gap-4 text-[15px] font-[500]">
              <span>
                Qty : <span>{item.quantity}</span>
              </span>
              <span className="text-[#2fa22f] font-[600] ">Price : ₹{item.subTotal}</span>
            </p>
            
            <button
              className="p-2 absolute top-[35px] right-0 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
              aria-label="Remove item"
            >
              <Trash2 className="w-4 h-4" onClick={()=>removeItem(item._id)} />
            </button>
          </div>
        </div>
            )
          })
         
        }
        
      </div>
      <div className="border-t border-gray-100 p-4  space-y-10 justify-end">
        {/* Total */}
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Total:</span>
          <span className="text-green-600">₹{total}</span>
        </div>
        <div className="space-y-4">
          {/* View Cart Button */}
          <Link to="/cart" className="block">
            {" "}
            <button
              onClick={context.toggleCartDrawer(false)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
            >
              View Cart
            </button>
          </Link>

          {/* Checkout Button */}
          <Link to="/checkout" className="block">
            {" "}
            <button
              onClick={context.toggleCartDrawer(false)}
              className="w-full bg-green-700 hover:bg-green-800 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
            >
              Quick Checkout
            </button>
          </Link>

          {/* Continue Shopping */}
          <Link to="/" className="block">
            <button
              onClick={context.toggleCartDrawer(false)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors duration-200"
            >
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default CartPanelItem;
