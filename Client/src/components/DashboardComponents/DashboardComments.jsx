import PropTypes from "prop-types";

const DashboardComments = ({ comments }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">Recent Comments</h3>
        <button className="text-purple-400 border border-purple-400 px-3 py-1 rounded-md hover:bg-purple-500 hover:text-white transition">
          See all
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm" role="table">
          <thead>
            <tr>
              <th className="py-2 text-gray-400">Comment Content</th>
              <th className="py-2 text-gray-400">Likes</th>
            </tr>
          </thead>
          <tbody>
            {comments.length === 0 ? (
              <tr>
                <td colSpan="2" className="text-center text-gray-400 py-4">
                  No comments available.
                </td>
              </tr>
            ) : (
              comments.map((comment, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="py-2 text-white">{comment.content}</td>
                  <td className="py-2 text-gray-300">{comment.likes ?? 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// **PropTypes Validation**
DashboardComments.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string.isRequired,
      likes: PropTypes.number, // Optional, defaults to 0 if missing
    })
  ),
};

// **Default Props**
DashboardComments.defaultProps = {
  comments: [],
};

export default DashboardComments;

