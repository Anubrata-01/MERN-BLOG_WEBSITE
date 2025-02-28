import PropTypes from "prop-types";
import CommentItem from "./CommentItem";

const CommentList = ({ comments,userInfo, onReply, onDelete, replyToCommentId, handleReplyToComment,handleDeleteCommentReply, darkMode }) => {
  console.log(comments)
  return (
    <div>
      {comments?.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          userInfo={userInfo}
          // user={comment.user}
          onReply={onReply}
          onDelete={onDelete}
          replyToCommentId={replyToCommentId}
          handleDeleteCommentReply={handleDeleteCommentReply}
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
      parentId: PropTypes.string,
    })
  ).isRequired,
  userInfo: PropTypes.shape({
    user: PropTypes.shape({
      _id: PropTypes.string,
    }),
  }),
  onReply: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  replyToCommentId: PropTypes.string,
  handleDeleteCommentReply: PropTypes.func.isRequired,
  handleReplyToComment: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
};


export default CommentList;

