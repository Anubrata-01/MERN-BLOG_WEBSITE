const DashboradPosts = () => {
  const posts = [
    { title: "How to use React effectively", author: "John Doe", views: 150 },
    {
      title: "Understanding JavaScript closures",
      author: "Jane Smith",
      views: 230,
    },
    { title: "Tailwind CSS for modern UI", author: "Alex Johnson", views: 110 },
    { title: "Tips for debugging Node.js", author: "Chris Lee", views: 90 },
  ];
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Recent Posts</h3>
        <button className="text-purple-400 border border-purple-400 px-3 py-1 rounded-md">
          See all
        </button>
      </div>
      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            <th className="py-2 text-gray-400">Title</th>
            <th className="py-2 text-gray-400">Author</th>
            <th className="py-2 text-gray-400">Views</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <tr key={index} className="border-b border-gray-700">
              <td className="py-2">{post.title}</td>
              <td className="py-2">{post.author}</td>
              <td className="py-2">{post.views}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboradPosts;
