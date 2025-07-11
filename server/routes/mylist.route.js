import {Router} from 'express';
import auth from '../middleware/auth.js';
import { addToMyList, deleteFromMyList, getMyList } from '../controllers/mylist.controller.js';

const myListRouter = Router();

myListRouter.post('/add',auth,addToMyList);
myListRouter.get('/getMyList',auth,getMyList);
myListRouter.delete('/delete/:id',auth,deleteFromMyList);

export default myListRouter; 