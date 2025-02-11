import PropTypes from "prop-types";

const DashboradPosts = ({ posts }) => {
  
console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);

  return (
    <div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Recent Posts</h3>
          <button className="text-purple-400 border border-purple-400 px-3 py-1 rounded-md hover:bg-purple-400 hover:text-white transition">
            See all
          </button>
        </div>

        {/* Table */}
        {posts.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="">
                <th className="py-2 text-gray-400"> Image</th>
                <th className="py-2 px-3 text-gray-400"> Title</th>
                <th className="py-2 text-gray-400">Category</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, index) => {
                const { image, title, category } = post;
      
                console.log(image, title, category);
                return (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="py-2">
                      {post.image ? (
                       <img
                       src={`${post?.image}`|| post?.image} // Construct full URL
                       alt={title}
                       className="w-8 h-8 object-cover rounded"
                   />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                        {post.title.charAt(0).toUpperCase()}
                      </div>
                      )}
                    </td>
                    <td className="py-2 px-3 text-white">{post.title}</td>
                    <td className="py-2 text-gray-300">{post.category}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-500 text-center">No posts available</div>
        )}
      </div>
    </div>
  );
};

// PropTypes Validation
DashboradPosts.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
      title: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
    })
  ),
};

// Default Props
DashboradPosts.defaultProps = {
  posts: [],
};

export default DashboradPosts;
