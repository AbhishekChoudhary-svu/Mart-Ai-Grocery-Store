import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
  name: {   
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  images:[
    {
    type: String,
    }
  ],
   parentCatName: {
    type: String,
    },
    parentId: {
    type: mongoose.Schema.Types.ObjectId,   
    ref: "Category",
    default: null,
    },
    
    }, {
    timestamps: true,
    });

    const CategoryModel = mongoose.model("Category", categorySchema);

    
    export default CategoryModel;