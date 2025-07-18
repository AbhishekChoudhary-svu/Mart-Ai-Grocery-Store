import UserModel from '../models/user.model.js';
import ReviewModel from '../models/review.model.js';
import OrderModel from '../models/order.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmailFun from '../config/sendEmail.js';
import verificationEmailTemplate from '../utils/verifyEmailTemplete.js';
import generatedAccessToken from '../utils/generatedAccessToken.js';
import { generatedRefreshToken } from '../utils/generatedRefreshToken.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});


export async function registerUserController (req,res){
    try {
        let user;
         const { name, email, password } = req.body;

         if (!name || !email || !password) {
            return res.status(400).json({
                 message: 'All fields are required' ,
                 error : true,
                 success : false
            });
           
        }
        const verifyCode = Math.floor(100000 + Math.random() * 900000);

       

        // Check if user already exists
         user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Email already exists' , error : true,
                 success : false});
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
       
        const hashedPassword = await bcrypt.hash(password, salt);
        
         user = new UserModel({
            name: name,
            email: email,
            password: hashedPassword,
            otp: verifyCode,
            otpExpires: Date.now() + 10 * 60 * 1000 // OTP valid for 10 minutes
        });
        
        await user.save();
        
        await sendEmailFun ({
            sendTo: email,
            subject: 'Verify Your Email',
            text: "",
            html : verificationEmailTemplate( name, verifyCode)
        });

        const token = jwt.sign (
            { email: user.email, id: user._id },
            process.env.JWT_SECRET_KEY,
            
        )
        return res.status(200).json({
            message: 'User registered successfully',
            success : true,
            error : false,
            token:token,
        });





    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function verifyEmailController (req, res) {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: 'Email and OTP are required',
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                error: true,
                success: false
            });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({
                message: 'Invalid or expired OTP',
                error: true,
                success: false
            });
        }

        user.verify_email = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        return res.status(200).json({
            message: 'Email verified successfully',
            success: true,
            error: false
        });



    } catch (error) {
        
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function authWithGoogle (req,res){
    const {name, email ,password, avatar , mobile  , role }= req.body;
    try {
        const existingUser = await UserModel.findOne({email:email});
        if(!existingUser){
            const user = await UserModel.create({
                name:name,
                mobile:mobile,
                email:email,
                password:"null",
                avatar:avatar,
                role:role,
                verify_email:true,
                signUpWithGoogle:true
            })
            await user.save();


             const accessToken = await generatedAccessToken(user._id);
            const refreshToken = await generatedRefreshToken(user._id);

            await UserModel.findByIdAndUpdate(
             user?._id,
            {
                 Last_login_date: new Date() },
            );

        const cookieOptions = {
            httpOnly : true,
            secure : true,
            sameSite : 'None',
        }
        res.cookie('accessToken', accessToken, cookieOptions);
        res.cookie('refreshToken', refreshToken, cookieOptions);

    

        return res.status(200).json({
            message: 'Login successful',
            success: true,
            error: false,
            data : {
                accessToken,
                refreshToken,
               
            }
        });
        }else{
              const accessToken = await generatedAccessToken(existingUser._id);
            const refreshToken = await generatedRefreshToken(existingUser._id);

            await UserModel.findByIdAndUpdate(
             existingUser?._id,
            {
                 Last_login_date: new Date() },
            );

        const cookieOptions = {
            httpOnly : true,
            secure : true,
            sameSite : 'None',
        }
        res.cookie('accessToken', accessToken, cookieOptions);
        res.cookie('refreshToken', refreshToken, cookieOptions);

    

        return res.status(200).json({
            message: 'Login successful',
            success: true,
            error: false,
            data : {
                accessToken,
                refreshToken,
               
            }
        });

        }
        
    } catch (error) {
        return res.status(500).json({ 
            message: error.message || error ,
            error: true,
            success:false
        });
    }
}

export async function loginUserController (req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required',
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                error: true,
                success: false
            });
        }
        if(user.status === 'Active') {
            return res.status(403).json({
                message: 'Your account is blocked, please contact support',
                error: true,
                success: false
            });
        }
        if(user.verify_email === false) {
            return res.status(403).json({   
                message: 'Please verify your email first',
                error: true,
                success: false
            });
        }


        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials',
                error: true,
                success: false
            });
        }

        if (!user.verify_email) {
            return res.status(403).json({
                message: 'Please verify your email first',
                error: true,
                success: false
            });
        }
       
        const accessToken = await generatedAccessToken(user._id);
       const refreshToken = await generatedRefreshToken(user._id);
       

      await UserModel.findByIdAndUpdate(
             user?._id,
            {
                 Last_login_date: new Date() },
        );

        const cookieOptions = {
            httpOnly : true,
            secure : true,
            sameSite : 'None',
        }
        res.cookie('accessToken', accessToken, cookieOptions);
        res.cookie('refreshToken', refreshToken, cookieOptions);

    

        return res.status(200).json({
            message: 'Login successful',
            success: true,
            error: false,
            data : {
                accessToken,
                refreshToken,
               
            }
        });

    } catch (error) {
        
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function logoutUserController (req, res) {
    try {
        const { userId } = req;

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        };

         res.clearCookie('accessToken', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);

        await UserModel.findByIdAndUpdate(userId, {
            refresh_token: ""
        });

       

        return res.status(200).json({
            message: 'Logout successful',
            success: true,
            error: false
        });

    } catch (error) {
        
        return res.status(500).json({ message: 'Internal server error' });
    }
}


export async function useAvatarController(req, res) {
    try {
        const userId = req.userId;
        const imagesArr = [];
        const image = req.files;

        const user = await UserModel.findById(userId);

         if (!user) {
            return res.status(404).json({
                message: 'User not found',
                error: true,
                success: false
            });
        }


         const imageUrl = user.avatar;
         const urlArr = imageUrl.split('/');
         const imageName = urlArr[urlArr.length - 1].split('.')[0];

         if (imageName) {
             try {
                  await cloudinary.uploader.destroy(imageName);
     
                 }
             catch (error) {
                   console.error('Error deleting image from Cloudinary:', error);    }
                        }

       

        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false
                        };

        for (let i = 0; i < image?.length; i++) {
            
            const result = await cloudinary.uploader.upload(image[i].path, options);
            imagesArr.push(result.secure_url);

            
            if (fs.existsSync(image[i].path)) {
                fs.unlinkSync(image[i].path);
            } 

            
        }

        user.avatar = imagesArr[0];
        await user.save();

        return res.status(200).json({
            _id: userId,
            avatar1: imagesArr[0]
        });

    } catch (error) {
        
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function removeAvatarController(req, res) {
  
  const imageUrl = req.query.img;
  const urlArr = imageUrl.split('/');
  const imageName = urlArr[urlArr.length - 1].split('.')[0];

  if (imageName) {
    try {
      await cloudinary.uploader.destroy(imageName);
      return res.status(200).json({
        message: 'Image deleted successfully',
        success: true,
        error: false
      });
    } catch (error) {
      
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export async function updateUserDetails(req, res) {
    try {
        const userId = req.userId;
        const { name, email, mobile ,password } = req.body;

       const userExists = await UserModel.findById(userId);

       if(!userExists) {
            return res.status(404).json({
                message: 'User not found',
                error: true,
                success: false
            });
        }

        let verifyCode = ""
        if(email !== userExists.email) {
            verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
            }

        let hashPassword =""
        if(password) {
            const salt = await bcrypt.genSalt(10);
            hashPassword = await bcrypt.hash(password, salt);
        }else {
            hashPassword = userExists.password;
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                name: name ,
                email: email ,
                verify_email: email !== userExists.email ? false : true,
                mobile: mobile ,
                password: hashPassword,
                otp: verifyCode!=="" ? verifyCode : null,
                otpExpires: verifyCode!=="" ? Date.now() + 10 * 60 * 1000 : ""
            },
            { new: true }
        );

        
      
            if (email !== userExists.email) {
                await sendEmailFun({
                    sendTo: email,
                    subject: 'Verify Your Email',
                    text: "",
                    html: verificationEmailTemplate(name, verifyCode)
                });
            }
        
            return res.status(200).json({
                message: 'User details updated successfully',
                success: true,
                error: false,
                data:{ updateUser: updatedUser }
            });

    } catch (error) {
        console.error('Error updating user details:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function forgetPasswordController(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: 'Email is required',
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                error: true,
                success: false
            });
        }

        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        

        user.otp = verifyCode;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save(); 

        await sendEmailFun({
            sendTo: email,
            subject: 'Reset Password',
            text: "",
            html: verificationEmailTemplate(user?.name, verifyCode)
        });
        return res.status(200).json({
            message: 'Reset password Code sent to your email',
            success: true,
            error: false
        });

    

    } catch (error) {
        
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function verifyForgetPasswordOtpController(req, res) {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: 'Email and OTP are required',
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                error: true,
                success: false
            });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({
                message: 'Invalid or expired OTP',
                error: true,
                success: false
            });
        }
        user.otp = "";
        user.otpExpires = "";
        await user.save();

        return res.status(200).json({
            message: 'OTP verified successfully',
            success: true,
            error: false
        });

    } catch (error) {
        
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function resetPasswordController(req, res) {
    try {
        const { email, newPassword ,confirmPassword } = req.body;

        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: 'Email, new password, and confirm password are required',
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                error: true,
                success: false
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: 'New password and confirm password do not match',
                error: true,
                success: false
            });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.otp = "";
        user.otpExpires = "";
        await user.save();

        return res.status(200).json({
            message: 'Password reset successfully',
            success: true,
            error: false
        });

    } catch (error) {
        
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function refreshTokenController(req, res) {
    try {
        const  refreshToken  = req.cookies.refreshToken || req?.headers?.authorization?.split(' ')[1];

        if (!refreshToken) {
            return res.status(401).json({
                message: 'Refresh token is required',
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ refresh_token: refreshToken });

        if (!user) {
            return res.status(403).json({
                message: 'Invalid refresh token',
                error: true,
                success: false
            });
        }

        const newAccessToken = await generatedAccessToken(user._id);
        const newRefreshToken = await generatedRefreshToken(user._id);

        user.refresh_token = newRefreshToken;
        await user.save();

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        };

        res.cookie('accessToken', newAccessToken, cookieOptions);
        res.cookie('refreshToken', newRefreshToken, cookieOptions);

        return res.status(200).json({
            message: 'Tokens refreshed successfully',
            success: true,
            error: false,
            data: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            }
        });

    } catch (error) {
        
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getUserDetailsController(req, res) {
    try {
        const userId = req.userId;

        const user = await UserModel.findById(userId).select('-password -otp -otpExpires -refresh_token');
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                error: true,
                success: false
            });
        }
        return res.status(200).json({
            message: 'User details retrieved successfully',
            success: true,
            error: false,
            data: user
        });

    }
    catch (error) {
        
        return res.status(500).json({ message: 'Internal server error' });
    }
 }


export async function addReviews(req,res){
    try {
        const { userId , userName ,productId, review ,rating } = req.body;

        const reviews = new ReviewModel({
            userName:userName,
            review:review,
            rating:rating,
            userId: userId,
            productId:productId
        }) 
        await reviews.save();
        res.status(201).json({ 
            error: false,
            message: "Review created successfully",
             });
        
    } catch (error) {
        return res.status(500).json({ 
            message: error.message || error ,
            error: true,
            success:false
        });
    }

}


export async function getReviewByProductId(req,res){
try {
    const productId = req.params.id;

   const reviews = await ReviewModel.find({ productId:productId }).sort({ createdAt: -1 });

   


    res.status(200).json({ error: false, data: reviews });

    
} catch (error) {
     return res.status(500).json({ 
            message: error.message || error ,
            error: true,
            success:false
        });
    
}

}

export async function getAllUserData(req, res) {
  try {
    const users = await UserModel.find().sort({ createdAt: -1 }); 

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
}


export async function getAllUsersWithOrderCount(req, res) {
  try {
    const orderCounts = await OrderModel.aggregate([
      { $match: { userId: { $ne: null } } },
      { $group: { _id: "$userId", count: { $sum: 1 } } }
    ]);

    const orderCountMap = {};
    orderCounts.forEach(item => {
      orderCountMap[item._id.toString()] = item.count;
    });

    const users = await UserModel.find().sort({ createdAt: -1 }).lean();

    const usersWithOrderCount = users.map(user => ({
      ...user,
      orderCount: orderCountMap[user._id.toString()] || 0
    }));

    res.status(200).json({
      success: true,
      data: usersWithOrderCount
    });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: "Failed to fetch users with order count",
      error: error.message
    });
  }
}


    