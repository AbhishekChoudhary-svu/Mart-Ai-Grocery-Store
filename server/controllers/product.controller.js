import ProductModel from "../models/product.model.js";

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
export async function uploadProductImages(req,res) {
    try {
        const image = req.files;
     imagesArr = [];

        for (const i of image) {
            const result = await cloudinary.uploader.upload(i.path, {
                folder: 'products',
                use_filename: true,
                unique_filename: false
            });
            imagesArr.push(result.secure_url);
            fs.unlinkSync(i.path); 
        }


        return res.status(200).json({ message: "Images uploaded successfully", images: imagesArr });
    } catch (error) {
        
        return res.status(500).json({ message: "Failed to upload images", error: error.message });
    }
}


export async function createProduct(req, res) {

    try {
        const { name, description, price,oldPrice, brand, catName,
            catId,
            subCatId,
            subCatName,
            thirdSubCatId,
            thirdSubCatName, countInStock, rating, isFeatured, discount, productRam, size, productWeight } = req.body;

        const newProduct = new ProductModel({
            name,
            description,
            price,
            oldPrice,
            brand,
            images: imagesArr,
            catName,
            catId,
            subCatId,
            subCatName,
            thirdSubCatId,
            thirdSubCatName,
            countInStock,
            rating,
            isFeatured,
            discount,
            productRam,
            size,
            productWeight
        });

        await newProduct.save();

    


        return res.status(201).json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
        
        return res.status(500).json({ message: "Failed to create product", error: error.message });
    }
}

export async function getAllProducts(req, res) {
    try {
        const page= parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 100;
        const totalProducts = await ProductModel.countDocuments();
       const totalPages = Math.max(1, Math.ceil(totalProducts / perPage));

        if( page < 1 || page > totalPages) {
            return res.status(400).json({ message: "Invalid page number" });
        }



        const products = await ProductModel.find().populate('category', 'name').skip((page - 1) * perPage).limit(perPage).exec();


        return res.status(200).json({products:products,totalPages: totalPages,page:page});
    } catch (error) {
        
        return res.status(500).json({ message: "Failed to fetch products", error: error.message });
    }
}

export async function getAllProductsByCatId(req, res) {
    try {
        const page= parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 100;
        const totalProducts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalProducts / perPage);

        if( page < 1 || page > totalPages) {
            return res.status(400).json({ message: "Invalid page number" });
        }



        const products = await ProductModel.find({
            catId: req.params.id
        }).populate('category', 'name').skip((page - 1) * perPage).limit(perPage).exec();
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }


        return res.status(200).json({products:products,totalPages: totalPages,page:page});
    } catch (error) {
        
        return res.status(500).json({ message: "Failed to fetch products", error: error.message });
    }
}

export async function getAllProductsByCatName(req, res) {
    try {
        const page= parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 100;
        const totalProducts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalProducts / perPage);

        if( page < 1 || page > totalPages) {
            return res.status(400).json({ message: "Invalid page number" });
        }



        const products = await ProductModel.find({
            catName: req.query.catName
        }).populate('category', 'name').skip((page - 1) * perPage).limit(perPage).exec();
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }


        return res.status(200).json({products:products,totalPages: totalPages,page:page});
    } catch (error) {
        
        return res.status(500).json({ message: "Failed to fetch products", error: error.message });
    }
}

export async function getAllProductsBySubCatId(req, res) {
    try {
        const page= parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 100;
        const totalProducts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalProducts / perPage);

        if( page < 1 || page > totalPages) {
            return res.status(400).json({ message: "Invalid page number" });
        }



        const products = await ProductModel.find({
            subCatId: req.params.id
        }).populate('category', 'name').skip((page - 1) * perPage).limit(perPage).exec();
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }


        return res.status(200).json({products:products,totalPages: totalPages,page:page});
    } catch (error) {
        
        return res.status(500).json({ message: "Failed to fetch products", error: error.message });
    }
}

export async function getAllProductsBySubCatName(req, res) {
    try {
        const page= parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 100;
        const totalProducts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalProducts / perPage);

        if( page < 1 || page > totalPages) {
            return res.status(400).json({ message: "Invalid page number" });
        }



        const products = await ProductModel.find({
            subCatName: req.query.subCatName
        }).populate('category', 'name').skip((page - 1) * perPage).limit(perPage).exec();
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }


        return res.status(200).json({products:products,totalPages: totalPages,page:page});
    } catch (error) {
        
        return res.status(500).json({ message: "Failed to fetch products", error: error.message });
    }
}

export async function getAllProductsByThirdSubCatId(req, res) {
    try {
        const page= parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 100;
        const totalProducts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalProducts / perPage);

        if( page < 1 || page > totalPages) {
            return res.status(400).json({ message: "Invalid page number" });
        }



        const products = await ProductModel.find({
            thirdSubCatId: req.params.id
        }).populate('category', 'name').skip((page - 1) * perPage).limit(perPage).exec();
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }


        return res.status(200).json({products:products,totalPages: totalPages,page:page});
    } catch (error) {
        
        return res.status(500).json({ message: "Failed to fetch products", error: error.message });
    }
}

export async function getAllProductsByThirdSubCatName(req, res) {
    try {
        const page= parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 100;
        const totalProducts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalProducts / perPage);

        if( page < 1 || page > totalPages) {
            return res.status(400).json({ message: "Invalid page number" });
        }



        const products = await ProductModel.find({
            thirdSubCatName: req.query.thirdSubCatName
        }).populate('category', 'name').skip((page - 1) * perPage).limit(perPage).exec();
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }


        return res.status(200).json({products:products,totalPages: totalPages,page:page});
    } catch (error) {
        
        return res.status(500).json({ message: "Failed to fetch products", error: error.message });
    }
}

export async function getAllProductsByPrice(req,res){
    try{
        let productList =[];

        if (req.query.catId !== undefined && req.query.catId !== null && req.query.catId !== "") {
           const productListArr = await ProductModel.find({catId: req.query.catId})
                .populate('category');

                productList = productListArr

        }
        if (req.query.subCatId !== undefined && req.query.subCatId !== null && req.query.subCatId !== "") {
           const productListArr = await ProductModel.find({subCatId: req.query.subCatId})
                .populate('category');

                productList = productListArr

        }
        if (req.query.thirdSubCatId !== undefined && req.query.thirdSubCatId !== null && req.query.thirdSubCatId !== "") {
           const productListArr = await ProductModel.find({thirdSubCatId: req.query.thirdSubCatId})
                .populate('category');

                productList = productListArr

        }

        const filteredProducts = productList.filter((product) => {
            if(req.query.minPrice && product.price < parseInt(req.query.minPrice)){
                return false;
            }
            if(req.query.maxPrice && product.price > parseInt(req.query.maxPrice)){
                return false;
            }
            return true;
        });
        return res.status(200).json({ products: filteredProducts,
            totalPages: 0,
            page:0
         });


}catch (error) {
        
        return res.status(500).json({ message: "Failed to fetch products by price", error: error.message });
    }
}

export async function getAllProductsByRating(req, res) {
    try {
        const page= parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 100;
        const totalProducts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalProducts / perPage);

        if( page < 1 || page > totalPages) {
            return res.status(400).json({ message: "Invalid page number" });
        }

        let products = [];
        if (req.query.catId !== undefined && req.query.catId !== null && req.query.catId !== "") {
            products = await ProductModel.find({catId: req.query.catId, rating: req.query.rating})
                .populate('category', 'name').skip((page - 1) * perPage).limit(perPage).exec();
        }
        if (req.query.subCatId !== undefined && req.query.subCatId !== null && req.query.subCatId !== "") {
            products = await ProductModel.find({subCatId: req.query.subCatId, rating: req.query.rating})
                .populate('category', 'name').skip((page - 1) * perPage).limit(perPage).exec();
        }
        if (req.query.thirdSubCatId !== undefined && req.query.thirdSubCatId !== null && req.query.thirdSubCatId !== "") {
            products = await ProductModel.find({thirdSubCatId: req.query.thirdSubCatId, rating: req.query.rating})
                .populate('category', 'name').skip((page - 1) * perPage).limit(perPage).exec();
        }


        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }


        return res.status(200).json({products:products,totalPages: totalPages,page:page});
    } catch (error) {
        
        return res.status(500).json({ message: "Failed to fetch products", error: error.message });
    }
}

export async function getAllProductsCount(req, res) {
    try {
        const totalProducts = await ProductModel.countDocuments();
        return res.status(200).json({ count: totalProducts });
    } catch (error) {
        
        return res.status(500).json({ message: "Failed to fetch product count", error: error.message });
    }
}

export async function getAllFeaturedProducts(req, res) {
    try {
        const products = await ProductModel.find({ isFeatured: true }).populate('category', 'name').exec();
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No featured products found" });
        }
        return res.status(200).json({ products: products });
    } catch (error) {
        
        return res.status(500).json({ message: "Failed to fetch featured products", error: error.message });
    }
}

export async function deleteProduct(req, res) {
    try {
        const productId = req.params.id;

       
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        
        for (const image of product.images) {
            const publicId = image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`products/${publicId}`);
        }

        
        const deletedProduct=  await ProductModel.findByIdAndDelete(productId);

        if(!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ message: "Product deleted successfully" });
       
    } catch (error) {
        
        return res.status(500).json({ message: "Failed to delete images", error: error.message });
    }
}

export async function deleteMultipleProduct(req, res) {
  try {
    const { ids } = req.body; 

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No product IDs provided" });
    }
    for(let i = 0; i<ids?.length; i++){
        const product = await ProductModel.findById(ids[i]);
        const images = product.images;
        let img="";
        for(img of images){
            const imageUrl = img;
            const urlArr = imageUrl.split("/");
    const fileNameWithExtension = urlArr[urlArr.length - 1];
    const folder = urlArr[urlArr.length - 2];
    const fileName = fileNameWithExtension.split(".")[0];
    const publicId = `${folder}/${fileName}`;

     await cloudinary.uploader.destroy(publicId);

        }


    }

   
    const result = await ProductModel.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No products were deleted" });
    }

    return res.status(200).json({
      message: "Products deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

 

export async function getProductById(req, res) {
    try {
        const productId = req.params.id;

       
        const product = await ProductModel.findById(productId).populate('category', 'name');
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ product: product });
    } catch (error) {
        
        return res.status(500).json({ message: "Failed to fetch product", error: error.message });
    }
}

export async function deleteProductImages(req, res) {
  const imageUrl = req.query.img;

  if (!imageUrl) {
    return res.status(400).json({ message: "Image URL is required" });
  }

  try {
    const urlArr = imageUrl.split("/");
    const fileNameWithExtension = urlArr[urlArr.length - 1];
    const folder = urlArr[urlArr.length - 2];
    const fileName = fileNameWithExtension.split(".")[0];
    const publicId = `${folder}/${fileName}`;

    const result = await cloudinary.uploader.destroy(publicId);


    if (result.result !== "ok" && result.result !== "not found") {
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


export async function updateProduct(req, res) {
  try {
    const productId = req.params.id;
    const {
      name, description, price, oldPrice, brand,
      catName, catId, subCatId, subCatName,
      thirdSubCatId, thirdSubCatName,
      countInStock, rating, isFeatured,
      discount, productRam, size, productWeight,
      images, 
    } = req.body;

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    
    if (Array.isArray(images)) {
      product.images = images;
    }

    
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.oldPrice = oldPrice || product.oldPrice;
    product.brand = brand || product.brand;
    product.catName = catName || product.catName;
    product.catId = catId || product.catId;
    product.subCatId = subCatId || product.subCatId;
    product.subCatName = subCatName || product.subCatName;
    product.thirdSubCatId = thirdSubCatId || product.thirdSubCatId;
    product.thirdSubCatName = thirdSubCatName || product.thirdSubCatName;
    product.countInStock = countInStock || product.countInStock;
    product.rating = rating || product.rating;
    product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
    product.discount = discount || product.discount;
    product.productRam = Array.isArray(productRam) ? productRam : [];
    product.size = Array.isArray(size) ? size : [];
    product.productWeight = Array.isArray(productWeight) ? productWeight : [];

    await product.save();

    return res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    
    return res.status(500).json({ message: "Failed to update the product", error: error.message });
  }
}



export async function filterProducts(req, res) {
  try {
    const { catId, subCatId, minPrice, maxPrice,stockStatus,
 rating, page = 1, limit = 10 } = req.body;

    
    const filters = {};

    if (catId.length) {
      filters.catId = {$in: catId};
    }

    if (subCatId.length) {
      filters.subCatId = {$in: subCatId};
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filters.price = {$gte: +minPrice || 0 , $lte : +maxPrice || Infinity};
    }

    if (rating.length) {
      filters.rating = { $in: rating };
    }
    if (stockStatus.length) {
      const stockConditions = [];
      if (stockStatus.includes('available')) {
        stockConditions.push({ countInStock: { $gt: 10 } });
      }
      if (stockStatus.includes('limited')) {
        stockConditions.push({ countInStock: { $gt: 0, $lte: 10 } });
      }
      if (stockStatus.includes('outofstock')) {
        stockConditions.push({ countInStock: 0 });
      }
      if (stockConditions.length) {
        filters.$or = stockConditions;
      }
    }


    
    const products = await ProductModel.find(filters).populate("category").skip((page -1) * limit).limit(parseInt(limit))
    
    const total = await ProductModel.countDocuments(filters);

    res.json({
      success: true,
      data: products,
      total:total,
      page:parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    
    res.status(500).json({ success: false, message: "Server error" });
  }
}

const sortItems = (products, sortBy, order) => {
  return products.sort((a, b) => {
    if (sortBy === "name") {
      return order === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    if (sortBy === "price") {
      return order === "asc" ? a.price - b.price : b.price - a.price;
    }
    return 0;
  }); 
};

export async function sortByProducts(req, res) {
  try {
    const { products, sortBy, order } = req.body;
    const sortedItems = sortItems([...products], sortBy, order);

    res.json({
      success: true,
      data: sortedItems,
      page: 0,
      totalPages: 0,
    });
  } catch (error) {
    console.error("Error sorting products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}


export async function searchProducts(req, res) {
  try {
    const { keyword, page, limit } = req.body;

    if (!keyword) {
      return res.status(400).json({ message: 'Keyword is required' });
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 3;

    const query = {
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { catName: { $regex: keyword, $options: 'i' } },
        { subCatName: { $regex: keyword, $options: 'i' } },
        { brand: { $regex: keyword, $options: 'i' } }
      ]
    };

    
    const total = await ProductModel.countDocuments(query);

    
    const products = await ProductModel.find(query)
      .populate("category")
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.json({
      data: products,
      total: total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      success: true
    });
  } catch (error) {
    
    res.status(500).json({ message: 'Server error' });
  }
}
