import mongoose from "mongoose";

const mylistSchema = new mongoose.Schema({
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
    productTitle: {
        type : String,
        required:true
    },
    brand: {
        type : String,
        required:true
    },
    image:{
        type : String,
        required:true
    },
    rating:{
        type : Number,
        required:true
    },
    price:{
        type : Number,
        required:true
    },
    oldPrice:{
        type : Number,
        required:true
    },
    discount:{
        type : Number,
        required:true
    },


    
}, { timestamps: true });

const MyListModel = mongoose.model("MyList", mylistSchema);

export default MyListModel;
