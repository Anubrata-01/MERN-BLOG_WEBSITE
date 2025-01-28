import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { userInfoAtom } from "../StoreContainer/store";
import { fetchPostsdata } from "../Functions/handlingFunction";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PostDashboard = () => {
  const [userInfo] = useAtom(userInfoAtom);
  const [limit, setLimit] = useState(3); // Initialize with 2 posts
  const [showMore, setShowMore] = useState(true); // Track if there are more posts to show
  const [posts,setPosts]=useState([]);
  

  const backendUrl = "http://localhost:7000";

  const { data: post,isLoading } = useQuery({
    queryKey: ["postsData", userInfo?.user?.isAdmin, limit], 
    queryFn: ({ queryKey }) => {
      const [, , limit] = queryKey; 
      return fetchPostsdata(limit); // Fetch posts based on the `limit`
    },
    enabled: userInfo?.user?.isAdmin,
  });
  useEffect(() => {
    if (post?.posts) {
      setPosts(post?.posts);
    }
  }, [post?.posts]);
  console.log(posts)
  const isMorePosts = post?.posts.length >= limit;
  const handleShowMore = () => {
    setLimit(prevLimit => prevLimit + 2); // Increase the limit by 2 posts
    if(!isMorePosts){
        setShowMore(false)
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-gray-100">
      <div className="overflow-x-auto shadow-lg rounded-lg bg-gray-800 max-h-[calc(100vh-100px)] lg:max-h-screen">
        {/* Container for large screens with scrolling */}
        <div className="lg:max-h-[calc(100vh-100px)] overflow-auto hidden lg:block">
          <table className="table-auto w-full text-left border-collapse">
            <thead className="bg-gray-700 text-gray-300">
              <tr>
                <th className="px-4 py-3">Date Updated</th>
                <th className="px-4 py-3">Post Image</th>
                <th className="px-4 py-3">Post Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-center">Delete</th>
                <th className="px-4 py-3 text-center">Edit</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id} className="border-t border-gray-700 hover:bg-gray-700">
                  <td className="px-4 py-3 text-gray-300">
                    {post?.updatedAt && new Date(post.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/post/${post.slug}`}>
                    <img
                      src={`${backendUrl}${post?.image}`}
                      alt={post.slug}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    </Link>
                   
                  </td>
                  <td className="px-4 py-3 text-gray-100 font-medium">
                    <Link to={`/post/${post.slug}`}>
                    {post.slug}
                    </Link>
                    
                  </td>
                  <td className="px-4 py-3 text-gray-300">{post.category}</td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-red-400 hover:underline">Delete</button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-blue-400 hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* For smaller devices, use card-like display for posts */}
        <div className="lg:hidden mt-4">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-gray-700 rounded-lg mb-4 p-4 flex flex-col space-y-4"
            >
              <div className="flex justify-between">
                <p className="text-gray-300">{new Date(post.updatedAt).toLocaleDateString()}</p>
                <Link to={`/post/${post.slug}`}>
                    <img
                      src={`${backendUrl}${post?.image}`}
                      alt={post.slug}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    </Link>
              </div>
              <h3 className="text-gray-100 font-medium">
              <Link to={`/post/${post.slug}`}>
                    {post.slug}
                    </Link>
              </h3>
              <p className="text-gray-300">{post.category}</p>
              <div className="flex justify-between">
                <button className="text-red-400 hover:underline">Delete</button>
                <button className="text-blue-400 hover:underline">Edit</button>
              </div>
            </div>
          ))}
        </div>

        {/* Show more button */}
        {showMore && isMorePosts && (
          <button
            onClick={handleShowMore}
            className="w-full text-teal-500 self-center text-sm py-7"
          >
            Show more
          </button>
        )}
         {isLoading && (
          <p className="text-gray-300 text-center py-3">Loading...</p>
        )}
        {!isMorePosts && (
          <p className="text-gray-300 text-center py-3">No more posts to display.</p>
        )}
        {post?.posts.length === 0 && <p>You have no posts yet!</p>}
      </div>
    </div>
  );
};

export default PostDashboard;

