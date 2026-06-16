import bcrypt from "bcryptjs";
import { clearRefreshTokenCookie, generateAccessToken, generateRefreshToken, saveRefreshToken, setRefreshTokenCookie } from "../utils/token.utils.js";
import userModel from "../models/user.model.js";
import refreshTokenModel from "../models/refreshToken.model.js";

const register=async(req,res)=>{
    try{
        const {username, email, password}=req.body;
        const existingUser=await userModel.findOne({email});
        if(existingUser){
            return res.status(409).json({message:"User already exists"})
        }
        
        const hashedPassword=await bcrypt.hash(password,10);
        const user=await userModel.create({username,email,password:hashedPassword});
        
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken();
        
        await saveRefreshToken({ userId: user._id, token: refreshToken });
        setRefreshTokenCookie(res, refreshToken);

        return res.status(201).json({ accessToken, user });

    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error on registration"});
    }
}

const login=async (req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await userModel.findOne({email});
        if(!user || (!user.password && user.googleId)){
            return res.status(401).json({message:"Invalid email or password."});
        }
        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(401).json({message:"Invalid email or password."});
        }
        const oldToken = req.cookies.refreshToken;
        if (oldToken) {
            await refreshTokenModel.findOneAndUpdate({ token: oldToken }, { isRevoked: true });
        }
        const accessToken=generateAccessToken(user._id);
        const refreshToken=generateRefreshToken();
        await saveRefreshToken({userId:user._id,token:refreshToken});
        setRefreshTokenCookie(res,refreshToken);
        return res.status(200).json({accessToken, user});
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error on login"});
    }
}

const refreshTokens=async(req,res)=>{
    try{
        const incomingRefreshToken=req.cookies.refreshToken;
        if(!incomingRefreshToken){
            return res.status(401).json({message:"Refresh token not found"});
        }
        const storedRefreshToken=await refreshTokenModel.findOne({token:incomingRefreshToken});

        if(!storedRefreshToken){
            clearRefreshTokenCookie(res);
            return res.status(401).json({message:"you are using an expired or invalid refreshtoken"});
        }

        if(storedRefreshToken.isRevoked){
            clearRefreshTokenCookie(res);
            return res.status(401).json({message:"Token reuse detected. Possible account compromise."});
        }

        if(storedRefreshToken.expiresAt < Date.now()){
            storedRefreshToken.isRevoked = true;
            await storedRefreshToken.save();
            clearRefreshTokenCookie(res);
            return res.status(401).json({message:"Refresh token expired"});
        }

        storedRefreshToken.isRevoked=true;
        await storedRefreshToken.save();

        const newRefreshToken=generateRefreshToken();
        await saveRefreshToken({userId:storedRefreshToken.userId,token:newRefreshToken});
        setRefreshTokenCookie(res,newRefreshToken);

        const newAccessToken=generateAccessToken(storedRefreshToken.userId);
        const user=await userModel.findById(storedRefreshToken.userId);
        return res.status(200).json({accessToken:newAccessToken, user})

    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error on refresh"});
    }
}

const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      await refreshTokenModel.findOneAndUpdate({ token }, { isRevoked: true });
      clearRefreshTokenCookie(res);
    }
    return res.status(200).json({ message: "Logged out" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Logout failed" });
  }
};

export {register, login, refreshTokens, logout}
