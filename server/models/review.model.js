import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      default:""
    },
     rating: {
      type: Number,
      required: true,
    },
    review: {
      type: String,
      trim: true

    },
   
    
    
  },
  {
    timestamps: true 
  }
);

const ReviewModel=  mongoose.model("Review", reviewSchema);


export default ReviewModel;