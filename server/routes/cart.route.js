import {Router} from 'express';
import auth from '../middleware/auth.js';
import { addToCart, deleteCartItem, emptyCart, getCartItems, updateCartItem } from '../controllers/cart.controller.js';


 
const cartRouter = Router();

cartRouter.post('/add',auth,addToCart);
cartRouter.get('/getCartItems',auth,getCartItems);
cartRouter.put('/update-qty',auth,updateCartItem);
cartRouter.delete('/deleteCartItems/:id',auth,deleteCartItem);
cartRouter.delete('/emptyCart/:id',auth,emptyCart);

export default cartRouter;