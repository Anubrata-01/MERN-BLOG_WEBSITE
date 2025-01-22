import mongoose from "mongoose";
const connectToDB = async () => {
    const connectionUrl = process.env.MONGO_URI;
  try {
    await mongoose.connect(connectionUrl);
    console.log("myblogCollections Database connection is successful");
  } catch (error) {
    console.error("Database connection error:", error.message);
  }
};

export default connectToDB;