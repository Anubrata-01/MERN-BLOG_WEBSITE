import UserSchema from "../Models/Users.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const createToken=(user)=>{
    try{
        return jwt.sign({user},process.env.TOKEN_SECRET,{expiresIn:'2d'});
    }catch(error){
        console.error('Token creation error:',error);
    }
    
}
const refreshToken=(user)=>{
    try{
        return jwt.sign({user},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'7d'});
    }catch(error){
        console.error('Refresh Token creation error:',error);
    }
}
export const SignUpFunction=async(req,res)=>{
    try{
        const {username,email,password}=req.body;
        if ( !username||!password || !email) {
            return res.status(400).send(" username, email, and password.");
        }
        const existingUser=await UserSchema.findOne({email});
        console.log(existingUser);
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const user=new UserSchema({username,email,password:hashedPassword});
        await user.save();
        const token=createToken(user);
        const refresh= refreshToken(user);;
        res.cookie('accessToken', token, { httpOnly: true, maxAge: 2 * 24 * 60 * 60 * 1000 }); // Secure cookie for 2 days
        res.cookie('refreshaccessToken', refresh, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // Secure cookie for 2 days
           
        return res.status(201).json({
            message: "User created successfully",
            user: {
                username: user.username,
                email: user.email,
            }
        });
    }catch(error){
        console.error('Signup error:',error);
        res.status(500).json({message:"Signup failed"});
    }
}

export const SignInFunction = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).send("Please provide both email and password.");
      }
  
      const user = await UserSchema.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const token = createToken(user);
      const refresh = refreshToken(user);;
      if (!token || !refresh) {
        return res.status(500).json({ message: 'Error creating token' });
      }
  
      res.cookie('accessToken', token, { httpOnly: true, maxAge: 2 * 24 * 60 * 60 * 1000 }); // Secure cookie for 2 days
      res.cookie('refreshaccessToken', refresh, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // Secure cookie for 2 days
    
      return res.status(200).json({
        message: 'Sign in successful',
        user: {
          username: user.username,
          email: user.email, // Avoid sending sensitive information like password in the response
        },
      });
    } catch (error) {
      console.error('Signin error:', error);
      res.status(500).json({ message: 'Signin failed' });
    }
  };

  export const Logout=async(req,res)=>{
    try{
        res.clearCookie('accessToken');
        res.clearCookie('refreshaccessToken');
        return res.status(200).json({message:"Logged out successfully"});
    }catch(error){
        console.error('Logout error:',error);
        res.status(500).json({message:"Logout failed"});
    }
  }
export const UserInfo=async(req,res)=>{
  try{
    const user = req.user; 

        if (!user) {
            return res.status(404).send("User not found!");
        }
        
        return res.status(200).json({
            message: "User information retrieved successfully",
            user: { _id: user._id, email: user.email,username:user.username,isAdmin:user?.isAdmin}
        });
  }catch(err){
    console.log("error in getting userinfo",err)
  }
}

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to see all users'));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const users = await UserSchema.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await UserSchema.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await UserSchema.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};
