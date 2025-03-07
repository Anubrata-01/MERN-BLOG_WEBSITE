import UserSchema from "../Models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { errorHandler } from "../utils/error.js";
import Post from "../Models/Post.js";
import { query } from "express";
import Comment from "../Models/Comments.js";
dotenv.config();
const createToken = (user) => jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1D' });
// const refreshToken = (user) => jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });


export const SignUpFunction = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !password || !email) {
      return res.status(400).send(" username, email, and password.");
    }
    const existingUser = await UserSchema.findOne({ email });
    console.log(existingUser);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new UserSchema({ username, email, password: hashedPassword });
    await user.save();
    const token = createToken(user);
    const secureCookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 2 * 24 * 60 * 60 * 1000,
    };
    res.cookie("accessToken", token, secureCookieOptions);
    

    return res.status(201).json({
      message: "User created successfully",
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Signup failed" });
  }
};

// export const SignInFunction = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).send("Please provide both email and password.");
//     }

//     const user = await UserSchema.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const token = createToken(user);
//     const refresh = refreshToken(user);
//     if (!token || !refresh) {
//       return res.status(500).json({ message: "Error creating token" });
//     }

//     res.cookie("accessToken", token, {
//       httpOnly: true,
//       maxAge: 2 * 24 * 60 * 60 * 1000,
//     }); // Secure cookie for 2 days
//     res.cookie("refreshaccessToken", refresh, {
//       httpOnly: true,
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     }); // Secure cookie for 2 days

//     return res.status(200).json({
//       message: "Sign in successful",
//       user: {
//         username: user.username,
//         email: user.email, // Avoid sending sensitive information like password in the response
//       },
//     });
//   } catch (error) {
//     console.error("Signin error:", error);
//     res.status(500).json({ message: "Signin failed" });
//   }
// };

// Signin with Google

// export const SigninWithGoogle = async (req, res, next) => {
//   const { email, name, googlePhotoUrl } = req.body;
//   try {
//     const user = await UserSchema.findOne({ email });
//     if (user) {
//       const token = createToken(user);
//       const refresh = refreshToken(user);
//       const { password, ...rest } = user._doc;

//       res.cookie("access_token", token, {
//         httpOnly: true,
//         maxAge: 2 * 24 * 60 * 60 * 1000,
//       });
//       res.cookie("refresh_access_token", refresh, {
//         httpOnly: true,
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//       });
//       return res.status(201).json({
//         message: "Signed in successfully",
//         rest,
//       });
//     }
//     else{
//       const generatedPassword =
//         Math.random().toString(36).slice(-8) +
//         Math.random().toString(36).slice(-8);
//       const hashedPassword = await bcrypt.hash(generatedPassword, 10);
//       const newUser = new UserSchema({
//         username:
//           name.toLowerCase().split(' ').join('') +
//           Math.random().toString(9).slice(-4),
//         email,
//         password: hashedPassword,
//         profilePicture: googlePhotoUrl,
//       });
//       await newUser.save();
//       const token = createToken(user);
//       const refresh = refreshToken(user);
//       const { password, ...rest } = user._doc;

//       res.cookie("access_token", token, {
//         httpOnly: true,
//         maxAge: 2 * 24 * 60 * 60 * 1000,
//       });
//       res.cookie("refresh_access_token", refresh, {
//         httpOnly: true,
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//       });
//       return res.status(201).json({
//         message: "Signed in successfully",
//         rest,
//       });
//     }
//   } catch (error) {
//     next(error)
//     console.log("Error in sign in with google", error);
//   }
// };


export const SignInFunction = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Please provide both email and password.");
    }

    const user = await UserSchema.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate access token
    const accessToken = createToken(user);
    if (!accessToken) {
      return res.status(500).json({ message: "Error creating tokens" });
    }

    const secureCookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 2 * 24 * 60 * 60 * 1000,
    };

    // Set access token cookie
    res.cookie("accessToken", accessToken, secureCookieOptions);

    return res.status(200).json({
      message: "Sign in successful",
      user: {
        username: user.username,
        email: user.email,
        token: accessToken,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Signin failed" });
  }
};



export const SigninWithGoogle = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await UserSchema.findOne({ email });
    if (user) {
      console.log(user);
      const token = createToken(user);
      if (!token) {
        return res.status(500).json({ message: "Error creating tokens" });
      }
      const { password, ...rest } = user._doc;

      const secureCookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 2 * 24 * 60 * 60 * 1000,
      };

      res.cookie("accessToken", token, secureCookieOptions);

      return res.status(201).json({
        message: "Signed in successfully",
        user: rest
      });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      const newUser = new UserSchema({
        username: name.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      const savedUser = await newUser.save();
      const token = createToken(savedUser);
      const { password, ...rest } = savedUser._doc;

      const secureCookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 2 * 24 * 60 * 60 * 1000,
      };

      res.cookie("accessToken", token, secureCookieOptions);

      return res.status(201).json({
        message: "Signed in successfully",
        user: rest
      });
    }
  } catch (error) {
    next(error);
    console.error("Error in sign in with Google:", error);
  }
};


// ... (createToken and refreshToken functions remain the same)
export const Logout = async (req, res) => {
  try {
    res.clearCookie("accessToken",{
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    // res.clearCookie("access_token");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed" });
  }
};
export const UserInfo = async (req, res) => {
  try {
    const user = req.user;
    // console.log(user)
    if (!user) {
      return res.status(404).send("User not found!");
    }

    return res.status(200).json({
      message: "User information retrieved successfully",
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        isAdmin: user?.isAdmin,
        profilePicture:user?.profilePicture
      },
    });
  } catch (err) {
    console.log("error in getting userinfo", err);
  }
};


// getuser functionality

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

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

    // Calculate one month ago correctly
    let oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    // Add one day to make the comparison strictly greater than
    const oneDayLater = new Date(oneMonthAgo.getTime() + 24 * 60 * 60 * 1000);

    const lastMonthUsers = await UserSchema.countDocuments({
      createdAt: { $gte: oneDayLater }, // Use $gte for inclusive comparison
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

// *updateprofile* function



export const updateUserProfile = async (req, res, next) => {
  const { username, email, password, profilePicture } = req.body;

  if (!username || username.length < 7 || username.length > 20) {
    return next(errorHandler(400, "Username must be between 7 and 20 characters"));
  }
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return next(errorHandler(400, "Username can only contain letters and numbers"));
  }
  if (password && password.length < 6) {
    return next(errorHandler(400, "Password must be at least 6 characters"));
  }

  try {
    // Fetch existing user
    const existingUser = await UserSchema.findById(req.params.userId);
    if (!existingUser) {
      return next(errorHandler(404, "User not found"));
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : existingUser.password;

    // Update user
    const updatedUser = await UserSchema.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username,
          email,
          password: hashedPassword,
          profilePicture
        },
      },
      { new: true }
    );

    const { password: _, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};



// deleteUser 

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to delete this user"));
  }
  try {
    await UserSchema.findByIdAndDelete(req.params.userId);
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}_${req.user._id}${path.extname(file.originalname)}`);
//   },
// });


// // Multer configuration
// export const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: function (req, file, cb) {
//     if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
//       return cb(new Error("Only image files are allowed!"), false);
//     }
//     cb(null, true);
//   },
// }).single("image");


// Upload image function

// export const uploadImage = async (req, res) => {
//   upload(req, res, function (err) {
//     if (err instanceof multer.MulterError) {
//       return res.status(400).json({ error: err.message });
//     } else if (err) {
//       return res
//         .status(500)
//         .json({ error: "An error occurred while uploading the file." });
//     }

//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded." });
//     }

//     res.status(200).json({
//       message: "File uploaded successfully",
//       filename: req.file.filename,
//       path: `/uploads/${req.file.filename}`, // This is the path where the image can be accessed
//     });
//   });
// };


// createpost function 

export const createPost = async (req, res, next) => {
  console.log(req.user);

  // Authorization check
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  }

  // Validate required fields
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }

  // Generate slug
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  try {
    let post;

    // Handle image upload if present
    if (req.file) {
      const imageUrl = `${process.env.CORS_ORIGIN}/uploads/${req.file.filename}`; // Adjust URL based on deployment
      post = new Post({
        ...req.body,
        slug,
        author: req.user._id,
        image: imageUrl,
      });
    } else {
      // Use default image if no file uploaded
      post = new Post({ ...req.body, slug, author: req.user._id });
    }

    await post.save();
    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    next(error);
  }
};


// getpost functionality
export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req, query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalPosts = await Post.countDocuments();
    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};



// editpost functionality


export const editPost=async(req,res)=>{
  try{
    const post = await Post.findByIdAndUpdate(req.params.postId, {
      $set: req.body,
    }, { new: true });
    res.status(200).json(post);
  }catch(error){
    console.log(error);
    res.status(500).json({ message: "Post could not be updated" });
  }
}


export const deletePost = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to delete this post"));
  }

  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }

    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json({ message: "Post has been deleted successfully" });
  } catch (error) {
    next(errorHandler(500, "Something went wrong while deleting the post"));
  }
};


// Create Comments

export const createComment = async (req, res) => {
  try {
    const { postId, content, userId } = req.body;
    if (!postId || !content || !userId) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }
    const commentedUser=await UserSchema.findById(userId);
    console.log(commentedUser);
    const newComment = new Comment({ postId, content, user:commentedUser });
    await newComment.save();
    res.status(201).json({ message: "Comment created successfully", comment: newComment });
  } catch (error) {
    console.error("Create comment error:", error);
    res.status(500).json({ message: "Comment creation failed" });
  }
}

export const getCommentsForPost = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId });
    res.status(200).json(comments);
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
}

export const getAllComments = async (req, res) =>{
  try{
    const startIndex = parseInt(req, query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;
    const comments = await Comment.find().sort({ createdAt: sortDirection }).skip(startIndex).limit(limit);
    const totalComments = await Comment.countDocuments();
    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      comments,
      totalComments,
      lastMonthComments,
    });
  }catch(error){
    console.error("Get all comments error:", error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
}

export const deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({ message: "Failed to delete comment" });
  }
}


// Reply to a comment


export const createCommentReply = async (req, res) => {
  try {
    const { postId, content, userId } = req.body;
    const { parentId } = req.params;

    if (!postId || !content || !userId) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

   
    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      return res.status(400).json({ message: "Invalid parentId format" });
    }

    // Validate user
    const commentedUser = await UserSchema.findById(userId);
    if (!commentedUser) {
      return res.status(404).json({ message: "User not found" });
    }

   
    let parentComment = await Comment.aggregate([
      { $match: { $or: [{ _id: new mongoose.Types.ObjectId(parentId) }, { "replies._id": new mongoose.Types.ObjectId(parentId) }] } },
    ]);

    if (parentComment.length === 0) {
      return res.status(404).json({ message: "Parent comment not found" });
    }

    parentComment = await Comment.findById(parentComment[0]._id);

   
    const newReply = {
      _id: new mongoose.Types.ObjectId(),
      userId: userId,
      content: content,
      createdAt: new Date(),
      user: {
        _id: commentedUser._id,
        username: commentedUser.username,
        profilePicture: commentedUser.profilePicture,
        email: commentedUser.email,
      },
      replies: [],
    };

    const addReplyToNested = (repliesArray, parentId, newReply) => {
      for (let reply of repliesArray) {
        if (reply._id.toString() === parentId) {
          reply.replies.push(newReply);
          return true;
        }
      
        if (addReplyToNested(reply.replies, parentId, newReply)) {
          return true;
        }
      }
      return false;
    };

    
    if (parentComment._id.toString() === parentId) {
      parentComment.replies.push(newReply);
    } else {

      if (!addReplyToNested(parentComment.replies, parentId, newReply)) {
        return res.status(404).json({ message: "Parent reply not found" });
      }
    }

    await parentComment.save();

    res.status(201).json({ message: "Reply added successfully", reply: newReply });
  } catch (error) {
    console.error("Create comment error:", error);
    res.status(500).json({ message: "Failed to add reply to comment", error: error.message });
  }
};


export const deleteCommentReply = async (req, res) => {
  try {
    const { commentId, replyId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(commentId) || !mongoose.Types.ObjectId.isValid(replyId)) {
      return res.status(400).json({ message: "Invalid commentId or replyId format" });
    }

    let comment = await Comment.aggregate([
      { $match: { "replies._id": new mongoose.Types.ObjectId(replyId) } },
    ]);

    if (comment.length === 0) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment = await Comment.findById(comment[0]._id);

    const deleteReplyFromNested = (repliesArray, replyId) => {
      for (let reply of repliesArray) {
        if (reply._id.toString() === replyId) {
          repliesArray.pull({ _id: replyId });
          return true;
        }
        if (deleteReplyFromNested(reply.replies, replyId)) {
          return true;
        }
      }
      return false;
    };

    if (!deleteReplyFromNested(comment.replies, replyId)) {
      return res.status(404).json({ message: "Reply not found" });
    }

    await comment.save();

    res.status(200).json({ message: "Reply deleted successfully" });
  } catch (error) {
    console.error("Delete reply error:", error);
    res.status(500).json({ message: "Failed to delete reply", error: error.message });
  }
}



// make admin

export const makeAdmin = async (req, res, next) => {
  try {
    // Fetch the current user
    const user = await UserSchema.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle the isAdmin field
    const updatedUser = await UserSchema.findByIdAndUpdate(
      req.params.userId,
      { $set: { isAdmin: !user.isAdmin } }, // Toggle admin status
      { new: true }
    );

    res.status(200).json({
      message: updatedUser.isAdmin
        ? "User is now an admin"
        : "User is now a regular user",
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        profilePicture: updatedUser.profilePicture,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      },
    });
  } catch (error) {
    console.error("Error toggling admin status:", error);
    res.status(500).json({ message: "Could not update user admin status", error });
  }
};
