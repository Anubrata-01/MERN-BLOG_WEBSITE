
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
