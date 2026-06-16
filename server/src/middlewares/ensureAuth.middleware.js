import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

const ensureAuthentication= async(req,res,next)=>{
    try{
        let token;
        const authHeader=req.headers.authorization;
        if(authHeader && authHeader.startsWith("Bearer ")){
            token = authHeader.split(" ")[1];
        } else if(req.query && req.query.token) {
            // Fallback for SSE (EventSource can't set headers)
            token = req.query.token;
        } else {
            return res.status(401).json({ message: "No access token provided" });
        }
        let decoded;
        try{
            decoded=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        }catch(err){
            if(err.name==="TokenExpiredError"){
                return res.status(401).json({message:"Access Token Expired", code:"ACCESS_TOKEN_EXPIRED"});
            }
            return res.status(401).json({message:"Invalid Access Token"});
        }
        const user= await userModel.findById(decoded.id);
        if(!user){
            return res.status(401).json({message:"User not found"});
        }
        req.user=user;
        next();
        
    }catch (err) {
        return res.status(500).json({ message: "Authentication failed" });
    }
}

export default ensureAuthentication;
