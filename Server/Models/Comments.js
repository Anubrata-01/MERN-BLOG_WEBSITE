import mongoose from "mongoose";


const replySchema = new mongoose.Schema(
    {
      userId: { type: String,  required: true },
      user: { type: Object, required: true },
      content: { type: String, required: true },
      likes: {
        type: Number,
        default: 0,
    },
    replies: [{ type: Object, ref: "Reply" }],
      createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true, _id: true }
  ); 
const commentSchema = new mongoose.Schema(
    {
        postId: {
            type: String,
        },
        userId: {
            type: String,
        },
        user: {
            type: Object,  // Consider refining this with a more specific schema if needed
        },
        content: {
            type: String,
            required: true,
        },
        likes: {
            type: Number,
            default: 0,
        },
        replies:[replySchema],
    },
    { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
