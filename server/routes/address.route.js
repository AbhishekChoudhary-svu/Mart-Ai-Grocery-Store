import {Router} from 'express';
import auth from '../middleware/auth.js';
import { addAddressController, deleteAddressById, getAddressById, selectAddress, updateAddressById } from '../controllers/address.controller.js';


const addressRouter = Router();
addressRouter.post('/add',auth, addAddressController);
addressRouter.get('/get/:userId',auth, getAddressById);
addressRouter.delete('/delete/:id',auth, deleteAddressById);
addressRouter.put('/select/:id',auth, selectAddress);
addressRouter.put('/update/:id',auth, updateAddressById);



export default addressRouter;