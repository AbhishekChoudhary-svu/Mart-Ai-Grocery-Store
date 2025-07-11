import {Router} from 'express';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import { addBanner, deleteBanner, deleteBannerImages, deleteMultipleBanner, getBanner, getBannerById, updateBanner, uploadBannerImages } from '../controllers/adsBanner.controller.js';




const adsBannerRouter = Router();

adsBannerRouter.post('/upload-Banner-images', auth, upload.array("images"), uploadBannerImages);
adsBannerRouter.post('/AddBanner', auth, addBanner);
adsBannerRouter.get('/', getBanner);
adsBannerRouter.get('/:id', getBannerById);
adsBannerRouter.delete('/delete-Banner-Image', auth, deleteBannerImages);
adsBannerRouter.delete('/delete/:id', auth, deleteBanner);
adsBannerRouter.put('/update/:id', auth, updateBanner);
adsBannerRouter.delete("/deleteMultipleSLides",auth, deleteMultipleBanner);



export default adsBannerRouter;