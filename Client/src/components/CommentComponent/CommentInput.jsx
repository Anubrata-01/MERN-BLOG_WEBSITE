import { useState } from "react";
import PropTypes from "prop-types"; // Importing PropTypes

const CommentInput = ({ onAddComment, userInfo, darkMode, parentId }) => {
  const [input, setInput] = useState("");
  const [showButtons, setShowButtons] = useState(false);
  const [error, setError] = useState(""); // State for error message
 console.log(userInfo)
  const handleAddComment = () => {
    if (!userInfo?.user) {
      setError("You must be logged in to reply.");
      return;
    }

    if (input.trim()) {
      onAddComment(input, parentId);
      setInput("");
      setShowButtons(false);
      setError(""); // Clear error on successful comment
    }
  };

  return (
    <div className="mb-4 flex items-center gap-2 w-full relative">
      {/* User Profile Picture */}
      <div className="relative ml-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 text-white">
          {userInfo?.user?.profilePicture ? (
            <img
              src={userInfo.user.profilePicture}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-xl font-bold">
              {userInfo?.user?.username?.[0]?.toUpperCase() || "U"}
            </span>
          )}
        </button>
      </div>

      {/* Comment Input Field */}
      <div className="w-full relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a comment..."
          onFocus={() => setShowButtons(true)}
          onBlur={(e) => {
            if (!e.relatedTarget || !e.relatedTarget.classList.contains("keep-visible")) {
              setShowButtons(false);
            }
          }}
          className={`flex-1 p-2 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-500 bg-transparent w-full ${
            darkMode ? "text-white" : "text-black"
          } ${!userInfo ? "opacity-50 cursor-not-allowed" : ""}`} // Disable input if not logged in
          disabled={!userInfo?.user}
        />

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

        {/* Action Buttons */}
        {showButtons && (
          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={handleAddComment}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 keep-visible disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!userInfo?.user} // Disable button if not logged in
            >
              Reply
            </button>
            <button
              onClick={() => {
                setInput("");
                setShowButtons(false);
                setError(""); // Clear error when canceling
              }}
              className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500 keep-visible"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// **Prop Types Validation**
CommentInput.propTypes = {
  onAddComment: PropTypes.func.isRequired, // Function that handles adding a comment
  userInfo: PropTypes.shape({
    user: PropTypes.shape({
      _id: PropTypes.string,
      username: PropTypes.string,
      profilePicture: PropTypes.string,
    }),
  }), 
  darkMode: PropTypes.bool,
  error: PropTypes.string,
};

// **Default Props (Optional)**
CommentInput.defaultProps = {
  userInfo: {}, // Default to null if no user is logged in
  darkMode: false, // Default to light mode
 
};

export default CommentInput;

