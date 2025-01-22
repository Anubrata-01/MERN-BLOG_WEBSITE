import UserSchema from "../Models/Users.js";
import jwt from "jsonwebtoken"
const authenticateMiddleware=async(req,res,next)=>{
    try{
        const {accessToken,refreshaccessToken}=req.cookies;
        const isaccessTokenSecret=process.env.TOKEN_SECRET;
        const isrefreshaccessTokenSecret=process.env.REFRESH_TOKEN_SECRET;

        const decode=jwt.verify(accessToken,isaccessTokenSecret) || jwt.verify(refreshaccessToken,isrefreshaccessTokenSecret);
        if (!decode) {
            return res.status(401).json({ error: 'Invalid token.' });
          }
         console.log(decode)
          const user = await UserSchema.findById(decode.user?._id).select('-password');
      
          if (!user) {
            return res.status(401).json({ error: 'User not found.' });
          }
      
          req.user = user;
          next();
    }catch(error){
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: 'Invalid token.' });
          }
        console.error('Authentication error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
export default authenticateMiddleware;