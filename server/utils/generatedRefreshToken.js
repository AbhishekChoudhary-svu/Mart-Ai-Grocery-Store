import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';

export async function generatedRefreshToken(userId) {
    // Generate a refresh token
    const refreshToken =  jwt.sign(
        { id: userId },
        process.env.SECRET_KEY_REFRESH_TOKEN,
        { expiresIn: '7d' } // Refresh token valid for 7 days
    );

    // Store the refresh token in the user's document
    await UserModel.findByIdAndUpdate({_id:userId}, { refresh_token: refreshToken });

    return refreshToken;
}