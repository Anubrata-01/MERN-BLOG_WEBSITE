import UserSchema from "../Models/Users.js";
import jwt from "jsonwebtoken";

const authenticateMiddleware = async (req, res, next) => {
  try {
    // Dynamically extract access token from multiple sources
    const accessToken =req.cookies.accessToken 

    if (!accessToken) {
      return res.status(401).json({ error: "Access token is missing." });
    }
    const accessTokenSecret = process.env.TOKEN_SECRET;

    let decoded;

    // Attempt to verify access token
    try {
      decoded = jwt.verify(accessToken, accessTokenSecret);
    } catch (error) {
      console.log("Access token invalid or expired.");
      return res.status(401).json({ error: "Invalid or expired access token." });
    }

    // Find user by decoded token's user ID
    const user = await UserSchema.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default authenticateMiddleware;


