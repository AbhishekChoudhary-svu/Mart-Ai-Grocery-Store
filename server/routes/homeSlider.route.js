import {Router} from 'express';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import { addHomeSlider, deleteMultipleHomeSliders, deleteSlides, deleteSlidesImages, getHomeSlides, getSlidesById, updateSlides, uploadHomeSliderImages } from '../controllers/homeSlider.controller.js';




const homeSliderRouter = Router();

homeSliderRouter.post('/upload-Slides-images', auth, upload.array("images"), uploadHomeSliderImages);
homeSliderRouter.post('/AddSlides', auth, addHomeSlider);
homeSliderRouter.get('/', getHomeSlides);
homeSliderRouter.get('/:id', getSlidesById);
homeSliderRouter.delete('/delete-Slides-Image', auth, deleteSlidesImages);
homeSliderRouter.delete('/delete/:id', auth, deleteSlides);
homeSliderRouter.put('/update/:id', auth, updateSlides);
homeSliderRouter.delete("/deleteMultipleSLides",auth, deleteMultipleHomeSliders);



export default homeSliderRouter;