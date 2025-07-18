import AdsBannerModel from "../models/adsBanner.model.js"

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


var imagesArr=[]
export async function uploadBannerImages(req,res) {
    try {
        const image = req.files;
     imagesArr = [];

        for (const i of image) {
            const result = await cloudinary.uploader.upload(i.path, {
                folder: 'Banner',
                use_filename: true,
                unique_filename: false
            });
            imagesArr.push(result.secure_url);
            fs.unlinkSync(i.path); // Remove the file from local storage
        }


        return res.status(200).json({ message: "Images uploaded successfully", images: imagesArr });
    } catch (error) {
        
        return res.status(500).json({ message: "Failed to upload images", error: error.message });
    }
}

export async function addBanner(req, res) {
    try {

    const banner = new AdsBannerModel({

      images:imagesArr,
      catId:req.body.catId,
      subCatId:req.body.subCatId
    });
        const saveBanner = await banner.save();
        imagesArr = [];

        
        return res.status(201).json({ message: "Banner Added successfully",success:true, banner: saveBanner }); 
    }
    catch (error) {
        
        return res.status(500).json({ message: "Failed to create Banner", error: error.message });
    }
}

export async function getBanner(req, res) {
        try {
        const banner = await AdsBannerModel.find().sort({ order: 1 });

        return res.status(200).json({
            message: "Banner fetched successfully",
            success: true,
            banner:banner
        });
    } catch (error) {
        
        return res.status(500).json({ message: "Failed to fetch Banner", error: error.message });
    }
}

export async function getBannerById(req, res) {
    try {
        const BannerId = req.params.id;
        const banner = await AdsBannerModel.findById(BannerId);
        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }
        return res.status(200).json({ message: "Banner fetched successfully", banner });
    }
    catch (error) {
        
        return res.status(500).json({ message: "Failed to fetch Banner", error: error.message });
    }
} 

export async function deleteBannerImages(req, res) {
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
    
    return res.status(500).json({ message: "Internal server error", error: true });
  }
}

export async function deleteBanner(req, res) {
    try {
        const banner = await AdsBannerModel.findById(req.params.id);
        const images = banner.images;
       
         for (const image of images) {
              const urlArr = image.split("/");
    const fileNameWithExtension = urlArr[urlArr.length - 1]; // "1750589193692-Slider2.jpg"
    const folder = urlArr[urlArr.length - 2]; // "categories"
    const fileName = fileNameWithExtension.split(".")[0]; // "1750589193692-Slider2"
    const publicId = `${folder}/${fileName}`; // "categories/1750589193692-Slider2"

    const result = await cloudinary.uploader.destroy(publicId);
            }

          
        const deletedBanner = await AdsBannerModel.findByIdAndDelete(req.params.id);
        
       

    
        return res.status(200).json({ message: "Banner deleted successfully", success:true, error:false, banner: deletedBanner });
    } catch (error) {
    
        return res.status(500).json({ message: "Failed to delete Banner", error: error.message });
    }
}

export async function updateBanner(req, res) {
    try {
        const BannerId = req.params.id;
        const updatedData = {
            images: imagesArr.length > 0 ? imagesArr[0] : req.body.images, 
            catId: req.body.catId,        
            subCatId: req.body.subCatId
           
        };

        const updatedBanner = await AdsBannerModel.findByIdAndUpdate(BannerId, updatedData, { new: true });
        if (!updatedBanner) {
            return res.status(404).json({ message: "Banner not found" });
        }
        imagesArr = [];
        return res.status(200).json({ message: "Banner updated successfully", banner: updatedBanner });
    }
    catch (error) {
        
        return res.status(500).json({ message: "Failed to update Banner", error: error.message });
    }
}

export async function deleteMultipleBanner(req, res) {
  try {
    const { ids } = req.body; 

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No Banner IDs provided" });
    }

    for (let i = 0; i < ids.length; i++) {
      const banner = await AdsBannerModel.findById(ids[i]);
      if (!banner) {
        console.warn(`Banner with ID ${ids[i]} not found`);
        continue;
      }

      const images = banner.images;

      for (const imgUrl of images) {
        try {
          
          const urlArr = imgUrl.split("/");
          const folder = urlArr[urlArr.length - 2];
          const fileNameWithExt = urlArr[urlArr.length - 1];
          const fileName = fileNameWithExt.split(".")[0];
          const publicId = `${folder}/${fileName}`;

          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error(`Error deleting image from Cloudinary: ${imgUrl}`, err);
        }
      }
    }

    
    const result = await AdsBannerModel.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No banner were deleted" });
    }

    return res.status(200).json({
      message: "Banner deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}


 