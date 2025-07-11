import {Router} from 'express';
import { addReviews, authWithGoogle, forgetPasswordController, getAllUserData, getAllUsersWithOrderCount, getReviewByProductId, getUserDetailsController, loginUserController, logoutUserController, refreshTokenController, registerUserController, removeAvatarController, resetPasswordController, updateUserDetails, useAvatarController, verifyEmailController, verifyForgetPasswordOtpController } from '../controllers/user.controller.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';


const userRouter = Router();
userRouter.post('/register', registerUserController);
userRouter.post('/verifyEmail', verifyEmailController);
userRouter.post('/authWithGoogle', authWithGoogle);
userRouter.post('/login', loginUserController);
userRouter.get('/logout',auth, logoutUserController);
userRouter.put('/user-avatar',auth,upload.array("avatar"), useAvatarController);
userRouter.delete('/deleteImages',auth, removeAvatarController);
userRouter.put('/:id',auth, updateUserDetails);
userRouter.post('/forget-password', forgetPasswordController);
userRouter.post('/verify-forget-password-otp', verifyForgetPasswordOtpController);
userRouter.post('/reset-password', resetPasswordController);
userRouter.post('/refresh-token', refreshTokenController);
userRouter.get('/user-details',auth, getUserDetailsController);
userRouter.post('/addReview',auth, addReviews);
userRouter.get('/getReviews/:id', getReviewByProductId);
userRouter.get('/',auth, getAllUserData);
userRouter.get('/orderCount',auth, getAllUsersWithOrderCount);


export default userRouter;