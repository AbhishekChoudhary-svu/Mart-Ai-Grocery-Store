import {Router} from 'express';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import { createCategory, deleteCategory, deleteCatImages, deleteSubCategory, getAllCategories, getCategoriesCount, getCategoryById, getSubCategoriesCount, updateCategory, updateSubCategory, uploadCategoryImages } from '../controllers/category.controller.js';



const categoryRouter = Router();

categoryRouter.post('/upload-cat-images', auth, upload.array("images"), uploadCategoryImages);
categoryRouter.post('/create', auth, createCategory);
categoryRouter.get('/', getAllCategories);
categoryRouter.get('/get/count', getCategoriesCount);
categoryRouter.get('/get/subCat/count', getSubCategoriesCount);
categoryRouter.get('/:id', getCategoryById);
categoryRouter.delete('/delete-cate-Image', auth, deleteCatImages);
categoryRouter.delete('/delete/:id', auth, deleteCategory);
categoryRouter.put('/updateCategories/:id', auth, updateCategory);
categoryRouter.put("/updateSubCategory/:id", updateSubCategory);
categoryRouter.delete("/deleteSubCategory/:id", deleteSubCategory);



export default categoryRouter;