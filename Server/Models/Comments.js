import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        postId: {
            type: String,
        },
        userId: {
            type: String,
        },
        user:{
            type: Object,
        },
        content: {
            type: String,
            required: true,
        },
        likes: {
            type: Number,
            default: 0,
        },
        replies: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
    
);

 const Comment = mongoose.model("Comment", commentSchema);
 export default Comment;