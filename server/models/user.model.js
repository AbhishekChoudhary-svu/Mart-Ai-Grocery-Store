import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true,"Provide your name"],
  },
  email: {
    type: String,
    required: [true, "Provide your email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true,"Provide your password"]
  },
  avatar: {
    type: String,
    default: "",
  },
  mobile: {
    type: Number,
    default: null
  },
  access_token: {
    type: String,
    default: "",
  },
  refresh_token: {
    type: String,
    default: "",
  },
  verify_email: {
    type: Boolean,
    default: false,
  },
  Last_login_date: {
    type: Date,
    default: "",
  },
  status: {
    type: String,
    enum: ["active", "inactive", "banned"],
    default: "active",
  },
  address_details: [{
    type: mongoose.Schema.ObjectId,
    ref: "Address" 
  }],
  orderHistory: [{
    type: mongoose.Schema.ObjectId,
    ref: "order" 
  }],
  otp: {
    type: String,
   
  },
  otpExpires: {
    type: Date,
    
  },
  forget_password_otp: {
    type: String,
    default: null,
  },
  forget_password_expiry: {
    type: Date,
    default: "",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  signUpWithGoogle:{
    type:Boolean,
    default:false
  }
}, {
  timestamps: true, 
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;