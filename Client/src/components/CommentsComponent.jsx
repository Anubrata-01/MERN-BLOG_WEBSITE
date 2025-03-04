import { useQuery } from "@tanstack/react-query";
import { fetchAllComments } from "../Functions/handlingFunction";
import { useAtom } from "jotai";
import { userInfoAtom } from "../StoreContainer/store";
import PropTypes from "prop-types";
import { useState } from "react";

const CommentsComponent = () => {
  const [userInfo] = useAtom(userInfoAtom);
  const [limit, setLimit] = useState(4);

  // Fetching comments
  const { data: commentsData, isLoading } = useQuery({
    queryKey: ["commentsData", userInfo?.user?.isAdmin, limit],
    queryFn: ({ queryKey }) => {
      const [, , limit] = queryKey;
      return fetchAllComments(limit);
    },
    enabled: userInfo?.user?.isAdmin,
  });

  const comments = commentsData?.comments || [];

  // Function to load more comments
  const loadMoreComments = () => {
    setLimit((prevLimit) => prevLimit + 4);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md max-w-5xl mx-auto">
      <h3 className="text-lg font-bold text-white mb-4 text-center sm:text-left">
        Recent Comments
      </h3>

      {/* Large Screen - Table Format with Replies */}
      <div className="hidden sm:block overflow-x-auto">
        {isLoading ? (
          // Shimmer effect
          <div className="animate-pulse space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-10 bg-gray-600 rounded w-full"></div>
            ))}
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="py-2 text-gray-400">Username</th>
                <th className="py-2 text-gray-400">Comment</th>
                <th className="py-2 text-gray-400">Date</th>
                <th className="py-2 text-gray-400">Post ID</th>
                <th className="py-2 text-gray-400">Replies</th>
                <th className="py-2 text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {comments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-gray-400 py-4">
                    No comments available.
                  </td>
                </tr>
              ) : (
                comments.map((comment) => (
                  <>
                    <tr
                      key={comment._id}
                      className="border-b border-gray-700 hover:bg-gray-700 transition"
                    >
                      <td className="py-2 text-white">{comment.user?.username || "Unknown"}</td>
                      <td className="py-2 text-white">{comment.content}</td>
                      <td className="py-2 text-gray-300">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 text-gray-300">{comment.postId}</td>
                      <td className="py-2 text-gray-300">
                        {comment.replies?.length > 0 ? (
                          <ul className="list-disc ml-4">
                            {comment.replies.map((reply) => (
                              <li key={reply._id} className="text-gray-200 text-xs">
                                <span className="font-bold">{reply.user?.username || "Unknown"}:</span> {reply.content}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-500">No replies</span>
                        )}
                      </td>
                      <td className="py-2">
                        <button className="text-red-400 border border-red-400 px-2 py-1 rounded-md hover:bg-red-500 hover:text-white transition">
                          Delete
                        </button>
                      </td>
                    </tr>
                  </>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile View: Card-based Layout */}
      <div className="sm:hidden space-y-4">
        {isLoading ? (
          [...Array(4)].map((_, index) => (
            <div key={index} className="h-20 bg-gray-600 rounded w-full animate-pulse"></div>
          ))
        ) : comments.length === 0 ? (
          <p className="text-center text-gray-400 py-4">No comments available.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="bg-gray-700 p-4 rounded-lg shadow flex flex-col space-y-2">
              <p className="text-sm text-white">
                <span className="font-bold">User:</span> {comment.user?.username || "Unknown"}
              </p>
              <p className="text-sm text-gray-300">
                <span className="font-bold">Comment:</span> {comment.content}
              </p>
              <p className="text-sm text-gray-400">
                <span className="font-bold">Date:</span>{" "}
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-400">
                <span className="font-bold">Post ID:</span> {comment.postId}
              </p>

              {/* Replies for Mobile */}
              {comment.replies?.length > 0 && (
                <div className="mt-2 border-l-4 border-gray-500 pl-2">
                  <h4 className="text-sm font-semibold text-white mb-1">Replies:</h4>
                  {comment.replies.map((reply) => (
                    <p key={reply._id} className="text-xs text-gray-300">
                      <span className="font-bold">{reply.user?.username || "Unknown"}:</span>{" "}
                      {reply.content}
                    </p>
                  ))}
                </div>
              )}

              <button className="w-full text-red-400 border border-red-400 px-3 py-1 rounded-md hover:bg-red-500 hover:text-white transition">
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* Show More Comments Button */}
      {comments.length >= limit && (
        <div className="text-center mt-4">
          <button
            onClick={loadMoreComments}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Show More Comments
          </button>
        </div>
      )}
    </div>
  );
};

// PropTypes validation
CommentsComponent.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      postId: PropTypes.string.isRequired,
      user: PropTypes.shape({
        username: PropTypes.string,
      }),
      content: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      replies: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          user: PropTypes.shape({
            username: PropTypes.string,
          }),
          content: PropTypes.string.isRequired,
        })
      ),
    })
  ),
};

export default CommentsComponent;


