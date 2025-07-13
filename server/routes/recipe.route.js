import { Router } from 'express';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import {
  uploadRecipeImages,
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  addProductsToRecipe,
  deleteRecipeImages
} from '../controllers/recipe.controller.js';

const recipeRouter = Router();
recipeRouter.post('/upload-images', auth, upload.array("images"), uploadRecipeImages);
recipeRouter.post('/create', auth, createRecipe);
recipeRouter.get('/', getAllRecipes);
recipeRouter.get('/:id', getRecipeById);
recipeRouter.put('/update/:id', auth, updateRecipe);
recipeRouter.delete('/delete-recipe-Image', auth, deleteRecipeImages);
recipeRouter.delete('/delete/:id', auth, deleteRecipe);
recipeRouter.put('/:id/add-products', auth, addProductsToRecipe);

export default recipeRouter;
