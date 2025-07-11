import sendEmailFun from "../config/sendEmail.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";
import orderConfirmationEmailTemplate from "../utils/orderConfirmationTemplete.js";

export const createOrder = async (req, res) => {
  try {
    const { userId, products, paymentId, paymentStatus, deliveryAddress, totalAMT } = req.body;

    if (!userId || !products || products.length === 0 || !deliveryAddress || !totalAMT) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const validatedProducts = [];

    for (let p of products) {
      const product = await ProductModel.findById(p.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${p.productId}` });
      }

      
      if (product.countInStock < p.quantity) {
        return res.status(400).json({
          message: `Not enough stock for product: ${product.name}`
        });
      }

     
      product.countInStock -= p.quantity;
      await product.save();

      validatedProducts.push({
        productId: p.productId,
        productTitle: product.name,
        quantity: p.quantity,
        price: product.price,
        image: Array.isArray(product.images) ? product.images[0] : "",
        subTotal: product.price * p.quantity
      });
    }



  
const newOrder = await OrderModel.create({
  userId,
  products: validatedProducts,
  paymentId: paymentId || "",
  paymentStatus: paymentStatus || "Pending",
  orderStatus: "Pending",
  deliveryAddress,
  totalAMT: totalAMT,
  estimatedDelivery : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
});


const populatedOrder = await OrderModel.findById(newOrder._id).populate('deliveryAddress');


const user = await UserModel.findById(userId);
if (user) {
  await sendEmailFun({
    sendTo: user.email,
    subject: 'Order Confirmation',
    text: '',
    html: orderConfirmationEmailTemplate(user.name, populatedOrder)
  });


}


    return res.status(201).json({
      message: "Order created successfully",
      success:true,
      order: newOrder
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const  userId  = req.userId;  

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const orders = await OrderModel.find({ userId })
      .populate("deliveryAddress userId")   
      .sort({ createdAt: -1 });       

    res.status(200).json({
      message: "User orders fetched successfully",
      data:orders
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate("deliveryAddress userId") 
      .sort({ createdAt: -1 });          

    res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



export const updateOrderStatus = async (req, res) => {
  try {
    const { _id, orderStatus } = req.body;

    let update = { orderStatus };

    if (orderStatus === "Shipped") {
      update.shippedDate = new Date();
      update.deliveredDate = null;
      update.cancelledDate = null;
    }
    if (orderStatus === "Delivered") {
      update.deliveredDate = new Date();
      
      update.cancelledDate = null;
    }
    if (orderStatus === "Cancelled") {
      update.cancelledDate = new Date();
      update.shippedDate = null;
      update.deliveredDate = null;
    }
    if (orderStatus === "Pending") {
      
      update.shippedDate = null;
      update.deliveredDate = null;
      update.cancelledDate = null;
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      _id,
      update,
      { new: true }
    );

    res.status(200).json({ message: "Order status updated", data: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


 