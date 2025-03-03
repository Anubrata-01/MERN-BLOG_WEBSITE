const DashboardComments = () => {
  const comments = [
    { content: "nice job", likes: 1 },
    { content: "nice job bro", likes: 1 },
    {
      content:
        "Congratulations! You’ve successfully set up Tailwind CSS with Vite...",
      likes: 2,
    },

  ];
  return (
    <div>
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">Recent Comments</h3>
        <button className="text-purple-400 border border-purple-400 px-3 py-1 rounded-md">
          See all
        </button>
      </div>
      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            <th className="py-2 text-gray-400">Comment Content</th>
            <th className="py-2 text-gray-400">Likes</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment, index) => (
            <tr key={index} className="border-b border-gray-700">
              <td className="py-2 text-white">{comment.content}</td>
              {/* <td className="py-2">{comment.likes}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default DashboardComments;
