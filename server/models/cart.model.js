import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    subTotal:{
        type:Number,
        required:true
    },
    
    countInStock:{
        type:Number,
        required:true
    },
    productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
    
    }, {
    timestamps: true, 
    });

const CartModel = mongoose.model("Cart", cartSchema);
export default CartModel;