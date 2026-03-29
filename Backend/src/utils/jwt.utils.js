import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import AppError from "./appError.js";

//SIGN ACCESS TOKENS
export const signAccessToken = (payload) => {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn,
  });
};

// SIGN REFRESH TOKENS
export const signRefreshToken = (payload) => {
    return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });

}
//VERIFY TOKENS

export const verifyAccessToken = (token) => {
    try{
        return jwt.verify(token , config.jwt.accessSecret);
    }catch(err){
        throw new AppError('Invalid access token', 401);
    }
}

export const verifyRefreshToken = (token) => {
    try{
        return jwt.verify(token , config.jwt.refreshSecret);
    }catch(err){
        throw new AppError('Invalid refresh token', 401);
    }
}