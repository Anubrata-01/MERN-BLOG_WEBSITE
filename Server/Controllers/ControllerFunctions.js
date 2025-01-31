import UserSchema from "../Models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import { errorHandler } from "../utils/error.js";
import Post from "../Models/Post.js";
import { query } from "express";
dotenv.config();
const createToken = (user) => {
  try {
    return jwt.sign({ user }, process.env.TOKEN_SECRET, { expiresIn: "2d" });
  } catch (error) {
    console.error("Token creation error:", error);
  }
};
const refreshToken = (user) => {
  try {
    return jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });
  } catch (error) {
    console.error("Refresh Token creation error:", error);
  }
};
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
    const refresh = refreshToken(user);
    res.cookie("accessToken", token, {
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000,
    }); // Secure cookie for 2 days
    res.cookie("refreshaccessToken", refresh, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }); // Secure cookie for 2 days

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

    const token = createToken(user);
    const refresh = refreshToken(user);
    if (!token || !refresh) {
      return res.status(500).json({ message: "Error creating token" });
    }

    res.cookie("accessToken", token, {
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000,
    }); // Secure cookie for 2 days
    res.cookie("refreshaccessToken", refresh, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }); // Secure cookie for 2 days

    return res.status(200).json({
      message: "Sign in successful",
      user: {
        username: user.username,
        email: user.email, // Avoid sending sensitive information like password in the response
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Signin failed" });
  }
};

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

export const SigninWithGoogle = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await UserSchema.findOne({ email });
    if (user) {
      // User already exists
      const token = createToken(user);
      const refresh = refreshToken(user);
      const { password, ...rest } = user._doc;

      res.cookie("access_token", token, {
        httpOnly: true,
        maxAge: 2 * 24 * 60 * 60 * 1000,
      });
      res.cookie("refresh_access_token", refresh, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(201).json({
        message: "Signed in successfully",
        user: rest, // Correct variable name
      });
    } else {
      // User does not exist, create a new one
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      const newUser = new UserSchema({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      const savedUser = await newUser.save(); // Save the new user
      const token = createToken(savedUser); // Use savedUser instead of user
      const refresh = refreshToken(savedUser);
      const { password, ...rest } = savedUser._doc; // Use savedUser

      res.cookie("access_token", token, {
        httpOnly: true,
        sameSite: 'None',
        maxAge: 2 * 24 * 60 * 60 * 1000,
      });
      res.cookie("refresh_access_token", refresh, {
        httpOnly: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(201).json({
        message: "Signed in successfully",
        user: rest, // Correct variable name
      });
    }
  } catch (error) {
    next(error); // Pass the error to middleware for handling
    console.error("Error in sign in with Google:", error);
  }
};


export const Logout = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("access_token");
    res.clearCookie("refreshaccessToken");
    res.clearCookie("refresh_access_token");

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed" });
  }
};
export const UserInfo = async (req, res) => {
  try {
    const user = req.user;

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
export const updateUserProfile = async (req, res, next) => {
  const { username, email, password,profilePicture } = req.body;
  // Validation
  if (!username || username.length < 7 || username.length > 20) {
    return next(
      errorHandler(400, "Username must be between 7 and 20 characters")
    );
  }
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return next(
      errorHandler(400, "Username can only contain letters and numbers")
    );
  }
  if (password && password.length < 6) {
    return next(errorHandler(400, "Password must be at least 6 characters"));
  }

  try {
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    const updatedUser = await UserSchema.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username,
          email,
          password: hashedPassword || req.user.password,
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

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this user"));
  }
  try {
    await UserSchema.findByIdAndDelete(req.params.userId);
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${req.user._id}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
}).single("image");

export const uploadImage = async (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res
        .status(500)
        .json({ error: "An error occurred while uploading the file." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    res.status(200).json({
      message: "File uploaded successfully",
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`, // This is the path where the image can be accessed
    });
  });
};

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
