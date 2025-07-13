import RecipeModel from "../models/recipe.model.js";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});


export async function uploadRecipeImages(req, res) {
  try {
    const image = req.files;
    const imagesArr = []; // move inside the function

    for (const i of image) {
      const result = await cloudinary.uploader.upload(i.path, {
        folder: 'recipe',
        use_filename: true,
        unique_filename: false
      });
      imagesArr.push(result.secure_url);
      fs.unlinkSync(i.path);
    }

    return res.status(200).json({ message: "Images uploaded successfully", images: imagesArr });
  } catch (error) {
    console.error("Error uploading images:", error);
    return res.status(500).json({ message: "Failed to upload images", error: error.message });
  }
}


// Create new recipe
export const createRecipe = async (req, res) => {
  try {
    const { name, description, images, products } = req.body;

    const newRecipe = new RecipeModel({
      name,
      description,
      images,
      products,
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({ message: "Failed to create recipe", error: error.message });
  }
};

// Get all recipes
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await RecipeModel.find().populate("products");
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recipes", error: error.message });
  }
};

// Get recipe by ID
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.params.id).populate("products");

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recipe", error: error.message });
  }
};

// Update recipe
export const updateRecipe = async (req, res) => {
  try {
    const updatedRecipe = await RecipeModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("products");

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: "Failed to update recipe", error: error.message });
  }
};
export async function deleteRecipeImages(req, res) {
  const imageUrl = req.query.img;
  console.log(imageUrl)

  if (!imageUrl) {
    return res.status(400).json({ message: "Image URL is required" });
  }

  try {
    const urlArr = imageUrl.split("/");
    const fileNameWithExtension = urlArr[urlArr.length - 1]; // "1750589193692-Slider2.jpg"
    const folder = urlArr[urlArr.length - 2]; // "categories"
    const fileName = fileNameWithExtension.split(".")[0]; // "1750589193692-Slider2"
    const publicId = `${folder}/${fileName}`; // "categories/1750589193692-Slider2"

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      return res.status(500).json({
        message: "Failed to delete image",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "Image deleted successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return res.status(500).json({ message: "Internal server error", error: true });
  }
}

// Delete recipe
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await RecipeModel.findByIdAndDelete(req.params.id);
     const images = recipe.images;
           
             for (const image of images) {
                  const urlArr = image.split("/");
        const fileNameWithExtension = urlArr[urlArr.length - 1]; // "1750589193692-Slider2.jpg"
        const folder = urlArr[urlArr.length - 2]; // "categories"
        const fileName = fileNameWithExtension.split(".")[0]; // "1750589193692-Slider2"
        const publicId = `${folder}/${fileName}`; // "categories/1750589193692-Slider2"
    
        await cloudinary.uploader.destroy(publicId);
                }
    

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete recipe", error: error.message });
  }
};

// Add product(s) to recipe
export const addProductsToRecipe = async (req, res) => {
  try {
    const { productIds } = req.body;
    const recipeId = req.params.id;

    const updatedRecipe = await RecipeModel.findByIdAndUpdate(
      recipeId,
      { $addToSet: { products: { $each: productIds } } },
      { new: true }
    ).populate("products");

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: "Failed to add products", error: error.message });
  }
};
