import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";

export async function addToCart(req, res) {
  try {
    const userId = req.userId; 
    const { productId, quantity } = req.body; 

    if (!userId || !productId) {
      return res.status(400).json({ message: "User ID and Product ID are required" });
    }

    
    let existingCartItem = await CartModel.findOne({ userId, productId });
    if (existingCartItem) {
      // Increment quantity
      existingCartItem.quantity += quantity;
      existingCartItem.subTotal = existingCartItem.quantity * existingCartItem.price;
      await existingCartItem.save();

      return res.status(200).json({
        success: true,
        message: "Cart updated successfully",
        cartItem: existingCartItem
      });
    }

    
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const price = product.price;
    const subTotal = price * quantity;

    
    const cartItem = new CartModel({
      userId,
      productId,
      productName: product.name,
      image: product.images[0],
      price,
      countInStock: product.countInStock,
      quantity,
      subTotal
    });

    await cartItem.save();

    res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      cartItem
    });

  } catch (error) {
    
    res.status(500).json({ message: error.message});
  }
}
export async function addMultipleToCart(req, res) {
  try {
    const userId = req.userId; 
    const { items } = req.body; // items: [{ productId, quantity }]

    if (!userId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "User ID and products list are required" });
    }

    const updatedCartItems = [];

    for (const item of items) {
      const { productId, quantity } = item;
      if (!productId || !quantity || quantity <= 0) continue; // skip invalid items

      // Check if product exists
      const product = await ProductModel.findById(productId);
      if (!product) continue; // skip if product not found

      const price = product.price;
      const subTotal = price * quantity;

      // Check if item already in cart
      let existingCartItem = await CartModel.findOne({ userId, productId });
      if (existingCartItem) {
        existingCartItem.quantity += quantity;
        existingCartItem.subTotal = existingCartItem.quantity * price;
        await existingCartItem.save();
        updatedCartItems.push(existingCartItem);
      } else {
        const newCartItem = new CartModel({
          userId,
          productId,
          productName: product.name,
          image: product.images[0],
          price,
          countInStock: product.countInStock,
          quantity,
          subTotal
        });
        await newCartItem.save();
        updatedCartItems.push(newCartItem);
      }
    }

    res.status(200).json({
      success: true,
      message: "Items added to cart successfully",
      cartItems: updatedCartItems
    });

  } catch (error) {
    
    res.status(500).json({ message: error.message });
  }
}



export async function getCartItems(req, res) {
    try {
        const userId = req.userId; 
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const cartItems = await CartModel.find({ userId }).populate("productId");
        res.status(200).json({
            data:cartItems,
            success:true
        });
    } catch (error) {
        
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function updateCartItem(req, res) {
  try {
    const { cartProductId, quantity } = req.body; // cartProductId = _id of cart document
    const userId = req.userId;

    if (!cartProductId || !quantity) {
      return res.status(400).json({ message: "Cart product ID and quantity are required" });
    }

    
    const cartItem = await CartModel.findOne({ _id: cartProductId, userId });
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    
    cartItem.quantity = quantity;
    cartItem.subTotal = quantity * cartItem.price;

    await cartItem.save();

    res.status(200).json({
      data:cartItem,
      success:true,
      message: "Cart item updated successfully"
    });
  } catch (error) {
    
    res.status(500).json({ message: "Internal server error" });
  }
}


export async function deleteCartItem(req, res) {
    try {
        const  cartProductId  = req.params.id; 
        const userId = req.userId; 

        if (!cartProductId) {
            return res.status(400).json({ message: "Cart Product ID is required" });
        }

        const deletedCartItem = await CartModel.findOneAndDelete({ userId:userId, _id:cartProductId });

        
       

        res.status(200).json({ message: "Cart item deleted successfully" ,
            data:deletedCartItem,
            success:true
        });
    } catch (error) {
        
        res.status(500).json({ message: "Internal server error" });
    }
}


export async function emptyCart(req, res) {
  try {
    const userId = req.params.id;
    await CartModel.deleteMany({userId:userId});
    res.status(200).json({
            
            success:true
        });
    
  } catch (error) {
    res.status(500).json({ message: error.message});
  }
}