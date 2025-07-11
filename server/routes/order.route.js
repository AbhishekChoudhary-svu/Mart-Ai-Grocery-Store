import {Router} from 'express';
import auth from '../middleware/auth.js';
import { createOrder, getAllOrders, getUserOrders, updateOrderStatus } from '../controllers/order.controller.js';



 
const orderRouter = Router();

orderRouter.post('/create',auth,createOrder);
orderRouter.get('/get',auth,getUserOrders);
orderRouter.get('/getAllUsers',auth,getAllOrders);
orderRouter.put('/update',auth,updateOrderStatus);


export default orderRouter;