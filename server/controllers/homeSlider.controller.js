import HomeSliderModel from "../models/homeSlider.model.js"

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
export async function uploadHomeSliderImages(req,res) {
    try {
        const image = req.files;
     imagesArr = [];

        for (const i of image) {
            const result = await cloudinary.uploader.upload(i.path, {
                folder: 'homeSlider',
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

export async function addHomeSlider(req, res) {
    try {

    const homeSlider = new HomeSliderModel({
      images:imagesArr,
    });
        const saveSlider = await homeSlider.save();

        
        return res.status(201).json({ message: "HomeSlider Added successfully",success:true, Slider: saveSlider }); 
    }
    catch (error) {
        console.error("Error creating HomeSlider:", error);
        return res.status(500).json({ message: "Failed to create HomeSlider", error: error.message });
    }
}

export async function getHomeSlides(req, res) {
        try {
        const slides = await HomeSliderModel.find().sort({ order: 1 });

        return res.status(200).json({
            message: "Slides fetched successfully",
            success: true,
            slides:slides
        });
    } catch (error) {
        console.error("Error fetching slides:", error);
        return res.status(500).json({ message: "Failed to fetch slides", error: error.message });
    }
}

export async function getSlidesById(req, res) {
    try {
        const slidesId = req.params.id;
        const slides = await HomeSliderModel.findById(slidesId);
        if (!slides) {
            return res.status(404).json({ message: "slides not found" });
        }
        return res.status(200).json({ message: "slides fetched successfully", slides });
    }
    catch (error) {
        console.error("Error fetching slides by ID:", error);
        return res.status(500).json({ message: "Failed to fetch slides", error: error.message });
    }
} 

export async function deleteSlidesImages(req, res) {
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

export async function deleteSlides(req, res) {
    try {
        const slides = await HomeSliderModel.findById(req.params.id);
        const images = slides.images;
       
         for (const image of images) {
              const urlArr = image.split("/");
    const fileNameWithExtension = urlArr[urlArr.length - 1]; // "1750589193692-Slider2.jpg"
    const folder = urlArr[urlArr.length - 2]; // "categories"
    const fileName = fileNameWithExtension.split(".")[0]; // "1750589193692-Slider2"
    const publicId = `${folder}/${fileName}`; // "categories/1750589193692-Slider2"

    const result = await cloudinary.uploader.destroy(publicId);
            }

          
        const deletedSlides = await HomeSliderModel.findByIdAndDelete(req.params.id);
        
       

    
        return res.status(200).json({ message: "Slides deleted successfully", success:true, error:false, category: deletedSlides });
    } catch (error) {
    
        return res.status(500).json({ message: "Failed to delete Slides", error: error.message });
    }
}

export async function updateSlides(req, res) {
    try {
        const slideId = req.params.id;
        const updatedData = {
            images: imagesArr.length > 0 ? imagesArr[0] : req.body.images, 
           
        };

        const updatedSlides = await HomeSliderModel.findByIdAndUpdate(slideId, updatedData, { new: true });
        if (!updatedSlides) {
            return res.status(404).json({ message: "Slides not found" });
        }
        imagesArr = [];
        return res.status(200).json({ message: "Slides updated successfully", Slides: updatedSlides });
    }
    catch (error) {
        console.error("Error updating category:", error);
        return res.status(500).json({ message: "Failed to update Slides", error: error.message });
    }
}

export async function deleteMultipleHomeSliders(req, res) {
  try {
    const { ids } = req.body; 

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No slider IDs provided" });
    }

    for (let i = 0; i < ids.length; i++) {
      const slider = await HomeSliderModel.findById(ids[i]);
      if (!slider) {
        console.warn(`Slider with ID ${ids[i]} not found`);
        continue;
      }

      const images = slider.images;

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

    
    const result = await HomeSliderModel.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No sliders were deleted" });
    }

    return res.status(200).json({
      message: "Sliders deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting multiple sliders:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}


 