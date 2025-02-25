import { useState, } from "react";
import { FaThumbsUp, FaReply, FaTrash } from "react-icons/fa";
import { darkModeAtom, userInfoAtom } from "../StoreContainer/store";
import { useAtom } from "jotai";
import { CREATE_COMMENT_URL, FETCH_COMMENTS_URL, DELETE_COMMENT_URL } from "../constant/constantfile";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const CommentSection = ({ postId }) => {
  const [darkMode] = useAtom(darkModeAtom);
  const [userInfo] = useAtom(userInfoAtom);
  const [input, setInput] = useState("");
  const queryClient = useQueryClient();

  // Fetch comments from the backend
  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const response = await fetch(`${FETCH_COMMENTS_URL}${postId}`,{
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch comments");
      return response.json();
    },
    enabled: !!postId,
  });

  // Mutation for adding a new comment
  const addCommentMutation = useMutation({
    mutationFn: async (newComment) => {
      const response = await fetch(CREATE_COMMENT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to add comment");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postId]); // Refetch comments
      setInput("");
    },
  });

  // Mutation for deleting a comment
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      const response = await fetch(`${DELETE_COMMENT_URL}/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete comment");
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries(["comments", postId]),
  });

  // Handle adding a comment
  const handleAddComment = () => {
    if (input.trim()) {
      const newComment = {
        postId,
        content: input,
        userId: userInfo?.user?._id,
      };
      addCommentMutation.mutate(newComment);
    }
  };

  // Handle deleting a comment
  const handleDeleteComment = (commentId) => deleteCommentMutation.mutate(commentId);

  return (
    <div className={`max-w-2xl mx-auto p-4 rounded-lg shadow-md ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      <h2 className="text-lg font-semibold mb-2">Comments</h2>

      {/* Comment Input */}
      <div className="mb-4 flex items-center gap-2 w-full">
        <div className="relative ml-4">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 text-white">
            {userInfo?.user?.profilePicture ? (
              <img src={userInfo.user.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-xl font-bold">{userInfo?.user?.username?.[0]?.toUpperCase() || "U"}</span>
            )}
          </button>
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-transparent w-full"
        />
        <button onClick={handleAddComment} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
          Comment
        </button>
      </div>

      {/* Comment List */}
      {isLoading ? (
        <p>Loading comments...</p>
      ) : (
        <ul className="space-y-4 w-full">
          {comments?.map((comment) => (
            <li key={comment._id} className={`p-3 rounded-md shadow ${darkMode ? "bg-gray-700" : "bg-gray-100"} w-full`}>
              <div className="flex items-start gap-3 w-full flex-wrap sm:flex-nowrap">
                <div className="w-10 h-10 flex items-center justify-center text-white font-bold rounded-full">
                  {comment.user?.profilePicture ? (
                    <img src={comment.user.profilePicture} alt="Profile" className="w-6 h-6 rounded-full" />
                  ) : (
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-700 text-white font-bold">
                      {comment.user?.username?.[0]?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                <div className="flex-1 w-full">
                  <p className="font-semibold">{comment.user?.username || "User"}</p>
                  <p className="text-gray-700 dark:text-gray-500 break-words">{comment.content}</p>
                  <small className="text-gray-500 dark:text-gray-400">{new Date(comment.createdAt).toLocaleString()}</small>
                  <div className="flex gap-4 mt-2 text-sm text-gray-600 dark:text-gray-300 flex-wrap">
                    <button className="flex items-center gap-1 hover:text-blue-500">
                      <FaThumbsUp /> {comment.likes || 0}
                    </button>
                    <button className="flex items-center gap-1 hover:text-green-500">
                      <FaReply /> Reply
                    </button>
                    {userInfo?.user?._id === comment.user?._id && (
                      <button onClick={() => handleDeleteComment(comment._id)} className="flex items-center gap-1 hover:text-red-500">
                        <FaTrash /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentSection;

