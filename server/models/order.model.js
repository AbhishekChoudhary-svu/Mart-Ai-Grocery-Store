import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', 
    },
    products:[{
        productId:{
            type:String,
       },
        productTitle:{
            type:String,
       },
        quantity:{
            type:Number,
       },
        price:{
            type:Number,
       },
        image:{
            type:String,
       },
       subTotal:{
        type:Number
       }
    }

    ],
    paymentId: {
        type: String,
        default: "",
    },
   paymentStatus: {
        type: String,
        default: '', 
    },
    orderStatus:{
          type: String,
        default: 'Pending', 
    },
    deliveryAddress: {
        type: mongoose.Schema.ObjectId,
        ref: 'Address', 
    },
    totalAMT : {
        type: Number,
        default: 0, 
    },
      deliveredDate: { type: Date },
      shippedDate: { type: Date },
  cancelledDate: { type: Date },
  estimatedDelivery: { type: Date },

    
    
}, {
    timestamps: true, 
});
const OrderModel = mongoose.model('Order', orderSchema);
export default OrderModel;