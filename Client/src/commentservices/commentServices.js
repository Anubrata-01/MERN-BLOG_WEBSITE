// commentService.js
import axios from "axios";
import {
  CREATE_COMMENT_URL,
  FETCH_COMMENTS_URL,
  DELETE_COMMENT_URL,
  REPLY_COMMENT_URL,
  AUTH_ROUTES,
} from "../constant/constantfile";

export const fetchComments = async (postId) => {
  const response = await axios.get(`${FETCH_COMMENTS_URL}${postId}`, {
    withCredentials: true, // Ensure credentials are included if needed
  });
  return response.data;
};

export const addComment = async (comment) => {
  const response = await axios.post(`${CREATE_COMMENT_URL}`, comment, {
    withCredentials: true, // Moved inside the config object
  });
  return response.data;
};

export const deleteComment = async (commentId) => {
  await axios.delete(`${DELETE_COMMENT_URL}/${commentId}`, {
    withCredentials: true,
  });
};

export const replyToComment = async (newCommentReply, parentId) => {
  const response = await axios.post(`${REPLY_COMMENT_URL}${parentId}`, newCommentReply, {
    withCredentials: true,
  });
  return response.data;
};

export const deleteCommentReply = async (commentId, replyId) => {
  await axios.delete(`${AUTH_ROUTES}/comments/${commentId}/replies/${replyId}`, {
    withCredentials: true,
  });
}