import { useState } from "react";
import PropTypes from "prop-types";
import CommentInput from "./CommentInput";

const CommentItem = ({ 
  comment, 
  userInfo, 
  onReply, 
  onDelete, 
  replyToCommentId, 
  handleReplyToComment, 
  darkMode 
}) => {
  const [showReplies, setShowReplies] = useState(false);

  const canDelete = comment.user?._id=== userInfo?.user?._id;
  const profilePic = comment.user?.profilePicture;
  const username = comment.user?.username || "Unknown";
  const initial = username.charAt(0).toUpperCase();

  return (
    <div className={`p-3 border-b ${darkMode ? "border-gray-600" : "border-gray-300"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-400 text-white font-bold">
              {initial}
            </div>
          )}
          <p className="font-semibold">{username}</p>
        </div>
        {canDelete && (
          <button 
            onClick={() => onDelete(comment._id)} 
            className="text-red-500 text-sm hover:underline"
          >
            Delete
          </button>
        )}
      </div>

      <p className="mt-1">{comment.content}</p>

      <div className="flex gap-2 mt-2 text-sm">
        <button 
          onClick={() => onReply(comment._id)} 
          className="text-blue-500 hover:underline"
        >
          Reply
        </button>
        {comment.replies?.length > 0 && (
          <button 
            onClick={() => setShowReplies(!showReplies)} 
            className="text-gray-500 hover:underline"
          >
            {showReplies ? "Hide Replies" : `View Replies (${comment.replies.length})`}
          </button>
        )}
      </div>

      {replyToCommentId === comment._id && (
        <div className="mt-2">
          <CommentInput 
          userInfo={userInfo}
            onAddComment={handleReplyToComment} 
            parentId={comment._id} 
            darkMode={darkMode} 
          />
        </div>
      )}

      {showReplies && comment.replies?.length > 0 && (
        <div className="ml-6 border-l pl-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              userInfo={userInfo}
              onReply={onReply}
              onDelete={onDelete}
              replyToCommentId={replyToCommentId}
              handleReplyToComment={handleReplyToComment}
              darkMode={darkMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ✅ Adding PropTypes validation
CommentItem.propTypes = {
  comment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    user: PropTypes.shape({
      _id: PropTypes.string,
      username: PropTypes.string,
      profilePicture: PropTypes.string,
    }),
    replies: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  userInfo: PropTypes.shape({
    user: PropTypes.shape({
      _id: PropTypes.string,
    }),
  }),
  onReply: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  replyToCommentId: PropTypes.string,
  handleReplyToComment: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
};

export default CommentItem;


