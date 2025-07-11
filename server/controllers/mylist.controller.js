import MyListModel from "../models/mylist.model.js";
import ProductModel from "../models/product.model.js";

export async function addToMyList(req, res) {
    try {
        const {
            productId,

        } = req.body;
        const userId = req.userId;

        if (!userId || !productId) {
            return res.status(400).json({ message: "User ID and Product ID are required" });
        }
        const alreadyExists = await MyListModel.findOne({ userId, productId });
        if (alreadyExists) {
            return res.status(200).json({ message: "Product already in My List" });
        }
        
         const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

        // Prevent duplicates
        

        const newItem = new MyListModel({
            userId,
            productId,
            productTitle:product.name,
            brand:product.brand,
            image:product.images[0],
            rating:product.rating,
            price:product.price,
            oldPrice:product.oldPrice,
            discount:product.discount
        });

        await newItem.save();

        res.status(201).json({
            message: "Product added to My List",
            item: newItem,
            success:true
        });
    } catch (error) {
        console.error("Error adding to My List:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteFromMyList(req, res) {
  try {
    const userId = req.userId;
    const productId = req.params.id;
    
    if (!productId) {
      return res.status(404).json({ message: "Item not found in My List", success: false });
    }

    const deletedItem = await MyListModel.findOneAndDelete({ userId: userId, _id: productId });
    
    res.status(200).json({ message: "Item removed from My List", success: true, data: deletedItem });
  } catch (error) {
    console.error("Error deleting item from My List:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
}


export async function getMyList(req, res) {
    try {
        const userId = req.userId;
        const items = await MyListModel.find({ userId });

        res.status(200).json(items);
    } catch (error) {
        console.error("Error fetching My List:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}



