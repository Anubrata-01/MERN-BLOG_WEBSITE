// import { useState } from "react";
// import { FaThumbsUp, FaReply, FaTrash } from "react-icons/fa";
// import { darkModeAtom, userInfoAtom } from "../StoreContainer/store";
// import { useAtom } from "jotai";
// import {
//   CREATE_COMMENT_URL,
//   FETCH_COMMENTS_URL,
//   DELETE_COMMENT_URL,
//   REPLY_COMMENT_URL,
// } from "../constant/constantfile";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import CommentInput from "./CommentInput";

// const CommentSection = ({ postId }) => {
//   const [darkMode] = useAtom(darkModeAtom);
//   const [userInfo] = useAtom(userInfoAtom);
//   const queryClient = useQueryClient();
//   const [replyToCommentId, setReplyToCommentId] = useState(null);

//   const { data: comments, isLoading } = useQuery({
//     queryKey: ["comments", postId],
//     queryFn: async () => {
//       const response = await fetch(`${FETCH_COMMENTS_URL}${postId}`, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//       });
//       if (!response.ok) throw new Error("Failed to fetch comments");
//       return response.json();
//     },
//     enabled: !!postId,
//   });

//   const addCommentMutation = useMutation({
//     mutationFn: async (newComment) => {
//       const response = await fetch(CREATE_COMMENT_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newComment),
//         credentials: "include",
//       });
//       if (!response.ok) throw new Error("Failed to add comment");
//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(["comments", postId]);
//       setReplyToCommentId(null);
//     },
//   });

//   const replyCommentMutation = useMutation({
//     mutationFn: async ({ newCommentReply, parentId }) => {
//       const response = await fetch(`${REPLY_COMMENT_URL}${parentId}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newCommentReply),
//         credentials: "include",
//       });
//       if (!response.ok) throw new Error("Failed to reply to comment");
//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(["comments", postId]);
//       setReplyToCommentId(null);
//     },
//   });

//   const deleteCommentMutation = useMutation({
//     mutationFn: async (commentId) => {
//       const response = await fetch(`${DELETE_COMMENT_URL}/${commentId}`, {
//         method: "DELETE",
//         credentials: "include",
//       });
//       if (!response.ok) throw new Error("Failed to delete comment");
//       return response.json();
//     },
//     onSuccess: () => queryClient.invalidateQueries(["comments", postId]),
//   });

//   const handleAddComment = (input, parentId = null) => {
//     const newComment = {
//       postId,
//       content: input,
//       userId: userInfo?.user?._id,
//       parentId,
//     };
//     addCommentMutation.mutate(newComment);
//   };

//   const handleReplyComment = (commentId) => {
//     setReplyToCommentId(replyToCommentId === commentId ? null : commentId);
//   };

//   const handleReplyToComment = (input, parentId) => {
//     const newCommentReply = {
//       postId,
//       content: input,
//       userId: userInfo?.user?._id,
//       parentId,
//     };
//     replyCommentMutation.mutate({ newCommentReply, parentId });
//   };

//   const handleDeleteComment = (commentId) => deleteCommentMutation.mutate(commentId);

//   return (
//     <div className={`max-w-2xl mx-auto p-4 rounded-lg shadow-md ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
//       <h2 className="text-lg font-semibold mb-2">Comments</h2>
//       <CommentInput onAddComment={handleAddComment} userInfo={userInfo} darkMode={darkMode} />
//       {isLoading ? (
//         <p>Loading comments...</p>
//       ) : (
//         <ul className="space-y-4 w-full">
//           {comments?.map((comment) => (
//             <li key={comment._id} className={`p-3 rounded-md shadow ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
//               <div className="flex items-start gap-3 w-full">
//                 <p className="font-semibold">{comment.user?.username || "User"}</p>
//                 <p>{comment.content}</p>
//                 <div className="flex gap-4 mt-2 text-sm">
//                   <button className="hover:text-blue-500"><FaThumbsUp /> {comment.likes || 0}</button>
//                   <button onClick={() => handleReplyComment(comment._id)} className="hover:text-green-500"><FaReply /> Reply</button>
//                   {userInfo?.user?._id === comment.user?._id && (
//                     <button onClick={() => handleDeleteComment(comment._id)} className="hover:text-red-500"><FaTrash /> Delete</button>
//                   )}
//                 </div>
//                 {replyToCommentId === comment._id && (
//                   <CommentInput onAddComment={(input) => handleReplyToComment(input, comment._id)} userInfo={userInfo} darkMode={darkMode} />
//                 )}
//                 {comment.replies?.length > 0 && (
//                   <ul className="mt-2 pl-6">
//                     {comment.replies.map((reply) => (
//                       <li key={reply._id} className={`p-2 rounded-md shadow ${darkMode ? "bg-gray-600" : "bg-gray-50"}`}>
//                         <p className="font-semibold">{reply.user?.username || "User"}</p>
//                         <p>{reply.content}</p>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default CommentSection;


// CommentSection.jsx
// CommentSection.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import { useAtom } from "jotai";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { darkModeAtom, userInfoAtom } from "../StoreContainer/store";

import { addComment, deleteComment, deleteCommentReply, fetchComments, replyToComment } from "../commentservices/commentServices";
import CommentInput from "./CommentComponent/CommentInput";
import CommentList from "./CommentComponent/CommentList";

const CommentSection = ({ postId }) => {
  const [darkMode] = useAtom(darkModeAtom);
  const [userInfo] = useAtom(userInfoAtom);
  const queryClient = useQueryClient();
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),  // ✅ Correctly passing function reference
    enabled: !!postId,
  });
  
  const addCommentMutation = useMutation({
    mutationFn: (newComment) => addComment(newComment),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postId]);
      setReplyToCommentId(null);
    },
  });
  
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId) => deleteComment(commentId),
    onSuccess: () => queryClient.invalidateQueries(["comments", postId]),
  });
  
  const replyCommentMutation = useMutation({
    mutationFn: ({ newCommentReply, parentId }) => replyToComment(newCommentReply, parentId),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postId]);
      setReplyToCommentId(null);
    },
  });
  
  const deleteCommentReplyMutation = useMutation({
    mutationFn: ({ commentId, replyId }) => deleteCommentReply(commentId, replyId),
    onSuccess: () => queryClient.invalidateQueries(["comments"]),
  })

  const handleAddComment = (input, parentId = null) => {
    const newComment = { postId, content: input, userId: userInfo?.user?._id, parentId };
    addCommentMutation.mutate(newComment);
  };
  const handleReplyComment = (commentId) => {
    console.log(commentId);
        setReplyToCommentId(replyToCommentId === commentId ? null : commentId);
      }
  const handleReplyToComment = (input, parentId) => {
    const newCommentReply = { postId, content: input, userId: userInfo?.user?._id, parentId };
    replyCommentMutation.mutate({ newCommentReply, parentId });
  };

  const handleDeleteComment = (commentId) => {
    deleteCommentMutation.mutate(commentId);
  };
 const handleDeleteCommentReply = (commentId, replyId) =>{
    deleteCommentReplyMutation.mutate({commentId, replyId});
 }
  return (
    <div className={`max-w-2xl mx-auto p-4 rounded-lg shadow-md ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      <h2 className="text-lg font-semibold mb-4">Comments</h2>
      <CommentInput onAddComment={handleAddComment} userInfo={userInfo} darkMode={darkMode} />
      {isLoading ? (
        <p>Loading comments...</p>
      ) : (
        <CommentList
          comments={comments}
          userInfo={userInfo}
          onReply={handleReplyComment}
          onDelete={handleDeleteComment}
          replyToCommentId={replyToCommentId}
          handleDeleteCommentReply={handleDeleteCommentReply}
          handleAddComment={handleAddComment}
          handleReplyToComment={handleReplyToComment}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

CommentSection.propTypes = {
  postId: PropTypes.string.isRequired,
};

export default CommentSection;
