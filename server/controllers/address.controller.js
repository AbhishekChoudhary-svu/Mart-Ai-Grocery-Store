import AddressModel from "../models/address.model.js"
import UserModel from '../models/user.model.js';


export async function addAddressController( req, res){
     try {
    const {address_line, city ,userName,  state,  pincode, country,  mobile,  status,  } = req.body;
    const userId = req.userId;

    const newAddress = new AddressModel({
      userName,
      address_line,
      city,
      state,
      pincode,
      country,
      mobile,
      status,
      userId
    });

    const saved = await newAddress.save();
    await UserModel.updateOne({_id: userId},{
        $push:{
            address_details:saved?._id
        }
    })

    res.status(201).json({ success: true,message:"Add Address Successfull", data: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}



export async function getAddressById (req,res){
   try {
    const address = await AddressModel.find({userId: req?.params?.userId});
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }
    res.status(200).json({ success: true, data: address });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}


export async function updateAddressById (req,res){
  try {
    const updated = await AddressModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    res.status(200).json({ success: true, message: "Address Updated Successfully", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }

}


export async function deleteAddressById (req,res){
  try {
    const userId = req.userId;
    const deleted = await AddressModel.findByIdAndDelete(req.params.id);
    const updateUserAddress = await UserModel.updateOne({_id: userId},{
        $pull:{
            address_details:deleted?._id
        }
    })
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }
    res.status(200).json({ success: true, message: "Address deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}


export async function selectAddress(req, res) {
  const selectedId = req.params.id;

  try {
    
    const selectedAddress = await AddressModel.findById(selectedId);
    if (!selectedAddress) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    const userId = selectedAddress.userId;

    
    await AddressModel.updateMany({ userId }, { $set: { status: false } });

   
    await AddressModel.findByIdAndUpdate(selectedId, { status: true });

    res.status(200).json({ success: true, message: "Selected address updated" });

  } catch (error) {
    console.error("Error updating selected address:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}
