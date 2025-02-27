import PropTypes from "prop-types";
import CommentItem from "./CommentItem";

const CommentList = ({ comments,userInfo, onReply, onDelete, replyToCommentId, handleReplyToComment, darkMode }) => {
  return (
    <div>
      {comments?.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          userInfo={userInfo}
          user={comment.user}
          onReply={onReply}
          onDelete={onDelete}
          replyToCommentId={replyToCommentId}
          handleReplyToComment={handleReplyToComment}
          darkMode={darkMode}
        />
      ))}
    </div>
  );
};

CommentList.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
      parentId: PropTypes.string,
    })
  ),
  onReply: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  replyToCommentId: PropTypes.string,
  handleReplyToComment: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
};

export default CommentList;

