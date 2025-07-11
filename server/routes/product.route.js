import {Router} from 'express';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import { createProduct, deleteMultipleProduct, deleteProduct, deleteProductImages, filterProducts, getAllFeaturedProducts, getAllProducts, getAllProductsByCatId, getAllProductsByCatName, getAllProductsByPrice, getAllProductsByRating, getAllProductsBySubCatId, getAllProductsBySubCatName, getAllProductsByThirdSubCatId, getAllProductsByThirdSubCatName, getAllProductsCount, getProductById, searchProducts, sortByProducts, updateProduct, uploadProductImages } from '../controllers/product.controller.js';


const productRouter = Router(); 

productRouter.post('/upload-product-images', auth, upload.array("images"), uploadProductImages);
productRouter.post('/create', auth, upload.array("images"), createProduct);
productRouter.get('/',getAllProducts);
productRouter.get('/getAllProductsByCatId/:id',getAllProductsByCatId);
productRouter.get('/getAllProductsByCatName',getAllProductsByCatName);
productRouter.get('/getAllProductsBySubCatId/:id',getAllProductsBySubCatId);
productRouter.get('/getAllProductsBySubCatName',getAllProductsBySubCatName);
productRouter.get('/getAllProductsByThirdSubCatId/:id',getAllProductsByThirdSubCatId);
productRouter.get('/getAllProductsByThirdSubCatName',getAllProductsByThirdSubCatName);
productRouter.get('/getAllProductsByPrice',getAllProductsByPrice);
productRouter.get('/getAllProductsByRating',getAllProductsByRating);
productRouter.get('/getAllProductsCount',getAllProductsCount);
productRouter.get('/getAllFeaturedProducts',getAllFeaturedProducts);
productRouter.delete('/deleteProductImages',auth,deleteProductImages);
productRouter.get('/:id',getProductById);
productRouter.put('/updateProduct/:id',auth,upload.array("images"),updateProduct);
productRouter.delete('/delete/:id',auth,deleteProduct);
productRouter.delete('/deleteMultiple',auth,deleteMultipleProduct);
productRouter.post('/filters',filterProducts);
productRouter.post('/sortBy',sortByProducts);
productRouter.post('/search/get',searchProducts);








export default productRouter;