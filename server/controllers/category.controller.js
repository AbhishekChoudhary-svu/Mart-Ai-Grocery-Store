import CategoryModel from "../models/category.model.js";

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
 

var imagesArr = [];
export async function uploadCategoryImages(req,res) {
    try {
        const image = req.files;
     imagesArr = [];

        for (const i of image) {
            const result = await cloudinary.uploader.upload(i.path, {
                folder: 'categories',
                use_filename: true,
                unique_filename: false
            });
            imagesArr.push(result.secure_url);
            try {
                fs.unlinkSync(i.path);
                } catch(e) {
                console.warn('Failed to delete temp file', e);
                }

        }


        return res.status(200).json({ message: "Images uploaded successfully", images: imagesArr });
    } catch (error) {
        console.error("Error uploading images:", error);
        return res.status(500).json({ message: "Failed to upload images", error: error.message });
    }
}

export async function createCategory(req, res) {
    try {

        const { name, images, parentCatName, parentId } = req.body; 

    const category = new CategoryModel({
      name,
      images,
      parentCatName,
      parentId,
    });
        const savedCategory = await category.save();

        
        return res.status(201).json({ message: "Category created successfully",success:true, category: savedCategory }); 
    }
    catch (error) {
        console.error("Error creating category:", error);
        return res.status(500).json({ message: "Failed to create category", error: error.message });
    }
}

export async function getAllCategories(req, res) {
        try {
            const categories = await CategoryModel.find();
            const categoryMap ={};
            
            categories.forEach(category => {
                categoryMap[category._id] = { ...category._doc, subCategories: [] };
            });

            const rootCategories =[];
            categories.forEach(category => {
                if (category.parentId) {
                    categoryMap[category.parentId].subCategories.push(categoryMap[category._id]);
                }
                else {
                    rootCategories.push(categoryMap[category._id]);
                }
            });
            return res.status(200).json({ message: "Categories fetched successfully", categories: rootCategories });
          
        } catch (error) {
            console.error("Error fetching categories:", error);
            return res.status(500).json({ message: "Failed to fetch categories", error: error.message });
        }
}

export async function getCategoriesCount(req, res) {
    try {
        const categoriesCount = await CategoryModel.countDocuments({parentId: null});
        return res.status(200).json({ message: "Category count fetched successfully", categoriesCount });
    } catch (error) {
        console.error("Error fetching category count:", error);
        return res.status(500).json({ message: "Failed to fetch category count", error: error.message });
    }
}

export async function getSubCategoriesCount(req, res) {
    try {
        const categories = await CategoryModel.find();
        if(!categories || categories.length === 0) {
            return res.status(404).json({ message: "No categories found" });
        }else{
            const subCatArr=[];
            for(let categorie of categories){
                if(categorie.parentId!== undefined && categorie.parentId !== null){
                    subCatArr.push(categorie);
                }

            }
            const subCategoriesCount = subCatArr.length;
            if(subCategoriesCount === 0) {
                return res.status(404).json({ message: "No sub-categories found" });
            }

            return res.status(200).json({ message: "Sub-category count fetched successfully", subCategoriesCount });
        }
        
        
    } catch (error) {
        console.error("Error fetching sub-category count:", error);
        return res.status(500).json({ message: "Failed to fetch sub-category count", error: error.message });
    }
}

export async function getCategoryById(req, res) {
    try {
        const categoryId = req.params.id;
        const category = await CategoryModel.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        return res.status(200).json({ message: "Category fetched successfully", category });
    }
    catch (error) {
        console.error("Error fetching category by ID:", error);
        return res.status(500).json({ message: "Failed to fetch category", error: error.message });
    }
} 

export async function deleteCatImages(req, res) {
  const imageUrl = req.query.img;

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

export async function deleteCategory(req, res) {
    try {
        const category = await CategoryModel.findById(req.params.id);
        const images = category.images;
       
         for (const image of images) {
              const urlArr = image.split("/");
    const fileNameWithExtension = urlArr[urlArr.length - 1]; // "1750589193692-Slider2.jpg"
    const folder = urlArr[urlArr.length - 2]; // "categories"
    const fileName = fileNameWithExtension.split(".")[0]; // "1750589193692-Slider2"
    const publicId = `${folder}/${fileName}`; // "categories/1750589193692-Slider2"

    const result = await cloudinary.uploader.destroy(publicId);
            }

            const subCategories = await CategoryModel.find({ parentId: req.params.id });
        for (let subCategory of subCategories) {
            const thirdSubCategories = await CategoryModel.find({ parentId: subCategory._id });
            for (let thirdSubCategory of thirdSubCategories) {
               const deletedThirdSubCategory = await CategoryModel.findByIdAndDelete(thirdSubCategory._id);
                
            }
            const deletedSubCategory = await CategoryModel.findByIdAndDelete(subCategory._id);
        }
        const deletedCategory = await CategoryModel.findByIdAndDelete(req.params.id);
        
       

    
        return res.status(200).json({ message: "Category deleted successfully", success:true, error:false, category: deletedCategory });
    } catch (error) {
        console.error("Error deleting category:", error);
        return res.status(500).json({ message: "Failed to delete category", error: error.message });
    }
}

export async function updateCategory(req, res) {
    try {
        const categoryId = req.params.id;
        const updatedData = {
            name: req.body.name,
            images: imagesArr.length > 0 ? imagesArr[0] : req.body.images, 
            parentCatName: req.body.parentCatName,
            parentId: req.body.parentId
        };

        const updatedCategory = await CategoryModel.findByIdAndUpdate(categoryId, updatedData, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        imagesArr = [];
        return res.status(200).json({ message: "Category updated successfully", category: updatedCategory });
    }
    catch (error) {
        console.error("Error updating category:", error);
        return res.status(500).json({ message: "Failed to update category", error: error.message });
    }
}

export async function deleteSubCategory(req, res) {
  try {
    const subCategoryId = req.params.id;

    const subCategory = await CategoryModel.findById(subCategoryId);

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "Sub-category not found",
      });
    }

    await CategoryModel.findByIdAndDelete(subCategoryId);

    return res.status(200).json({
      success: true,
      message: "Sub-category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting sub-category:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete sub-category",
      error: error.message,
    });
  }
}


export const updateSubCategory = async (req, res) => {
  const subCatId = req.params.id;
  const { name, parentCatName, parentId } = req.body;

  try {
    const subCategory = await CategoryModel.findById(subCatId);

    if (!subCategory) {
      return res.status(404).json({ success: false, message: "Subcategory not found" });
    }

    
    subCategory.name = name;
    subCategory.parentCatName = parentCatName;
    subCategory.parentId = parentId;

    await subCategory.save();

    res.status(200).json({ success: true, message: "Sub-category updated successfully" });
  } catch (error) {
    console.error("Update sub-category error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



