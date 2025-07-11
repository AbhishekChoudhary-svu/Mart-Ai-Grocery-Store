import mongoose, { mongo } from "mongoose";
const productSchema = new mongoose.Schema({
  name: {   
    type: String,
    required: true,
  },
    description: {
    type: String,
    required: true,
    },
    images: [{
    type: String,
    
    }],
    brand: {
    type: String,
    default: "",
    },
    price: {
    type: Number,
    default: 0,
    },
    oldPrice: {
    type: Number,
    default: 0,
    },
    catName: {
    type: String,
   default: "",
    },
    catId: {
     type: String,
   default: "",
    },
    subCatId: {
    type: String,
    default: "",
     },
     subCatName: {
    type: String,
    default: "",
    },
    thirdSubCatId: {
    type: String,
    default: "",
    },
    thirdSubCatName: {
    type: String,
    default: "",
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    countInStock: {
    type: Number,
    required: true,
    },
    rating: {
    type: Number,
    default: 0,
    },
    isFeatured: {
    type: Boolean,
    default: false,
    },
    discount: {
    type: Number,
    required: true,
    },
    productRam: [{
    type: String,
    default: null
    }],
    size: [{ 
    type: String,
    default: null
    }],
    productWeight: [{
    type: String,
    default: null
    }],
    createdAt: {
    type: Date,
    default: Date.now,
    },
    updatedAt: {
    type: Date,
    default: Date.now,
    },
    }, {
    timestamps: true,
    });

    
const ProductModel = mongoose.model("Product", productSchema);

 export default ProductModel;