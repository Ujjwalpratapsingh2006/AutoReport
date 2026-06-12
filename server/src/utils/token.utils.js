import jwt from "jsonwebtoken";
import crypto from "crypto";
import refreshTokenModel from "../models/refreshToken.model.js";

const generateAccessToken = (userId)=>{
    return jwt.sign({id:userId},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"})
}

const generateRefreshToken = ()=>{
    return crypto.randomBytes(64).toString("hex");
};

const saveRefreshToken= async({userId, token})=>{
    await refreshTokenModel.create({
        userId,
        token,
        expiresAt: new Date(Date.now()+30*24*60*60*1000)
    })
}

const setRefreshTokenCookie=(res,token)=>{
    res.cookie("refreshToken",token,{
        httpOnly:true, //so that js cant access
        secure: process.env.NODE_ENV === 'production', // true only in production
        sameSite:"strict",
        maxAge:30*24*60*60*1000, // 30 days
        path:"/api/auth"
    })
}

const clearRefreshTokenCookie=(res)=>{
    res.clearCookie("refreshToken",{
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict",
        path:"/api/auth"
    });
}
export {generateAccessToken,generateRefreshToken,saveRefreshToken,setRefreshTokenCookie,clearRefreshTokenCookie}
