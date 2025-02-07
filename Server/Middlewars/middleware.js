import UserSchema from "../Models/Users.js";
import jwt from "jsonwebtoken";

const authenticateMiddleware = async (req, res, next) => {
  try {
    // Dynamically extract tokens from multiple sources
    const accessToken =
      req.cookies.accessToken || 
      req.cookies.access_token || 
      req.headers.authorization?.split(" ")[1] || 
      req.query.access_token;

    const refreshToken =
      req.cookies.refreshaccessToken || 
      req.cookies.refresh_access_token || 
      req.headers["x-refresh-token"] || 
      req.query.refresh_token;

    const accessTokenSecret = process.env.TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    let decoded;

    // Attempt to verify access token first
    if (accessToken) {
      try {
        decoded = jwt.verify(accessToken, accessTokenSecret);
      } catch (error) {
        console.log("Access token invalid or expired. Trying refresh token.");
      }
    }

    // If no valid access token, verify refresh token
    if (!decoded && refreshToken) {
      try {
        decoded = jwt.verify(refreshToken, refreshTokenSecret);
      } catch (error) {
        console.log("Refresh token invalid or expired.");
        return res.status(401).json({ error: "Authentication failed. Please log in again." });
      }
    }

    // If no token is valid
    if (!decoded) {
      return res.status(401).json({ error: "Invalid or missing tokens." });
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

