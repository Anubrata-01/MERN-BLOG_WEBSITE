import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import {
  fetchPostsdata,
  fetchPostsdataBySlug,
} from "../Functions/handlingFunction.js";
import "../utilities/PostPage.css";
import CommentSection from "../components/CommentSection.jsx";
import PostCard from "../components/PostCard.jsx";
import { darkModeAtom } from "../StoreContainer/store.js";
import { useAtom } from "jotai";

const PostPage = () => {
  const { postSlug } = useParams(); // Get slug from URL
  const [darkMode] = useAtom(darkModeAtom); // Using Jotai Atom

  const { data, isError, isLoading } = useQuery({
    queryKey: ["blogDetails", postSlug],
    queryFn: ({ queryKey }) => {
      const [, slug] = queryKey;
      return fetchPostsdataBySlug(slug); // Fetch blog details by slug
    },
    enabled: !!postSlug, // Ensure slug is defined
  });

  const { data: post } = useQuery({
    queryKey: ["recentPosts", 4, data?.posts?.length],
    queryFn: ({ queryKey }) => {
      const [, limit, startIndex] = queryKey;
      return fetchPostsdata(limit, startIndex);
    },
    enabled: !!postSlug,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-800">
        <div className="loader"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Error fetching blog details. Please try again later.
      </div>
    );
  }

  if (!data || !data.posts || data.posts.length === 0) {
    return <div className="text-center">No blog found for the given slug.</div>;
  }

  const { title, category, image, content } = data.posts[0];

  return (
    <div
      className={`w-full min-h-screen ${
        darkMode
          ? "bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100"
          : "bg-gradient-to-b from-white to-gray-200 text-gray-900"
      }`}
    >
      <div
        className={`p-8 max-w-3xl mx-auto rounded-lg shadow-lg ${
          darkMode
            ? "bg-gray-800 bg-opacity-80 backdrop-blur-md"
            : "bg-white bg-opacity-90 backdrop-blur-md"
        }`}
      >
        <h1 className="text-4xl font-extrabold text-center mb-4">{title}</h1>

        <p
          className={`w-[10%] p-2 text-sm relative left-[45%] text-center font-medium rounded-md ${
            darkMode
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
              : "bg-gradient-to-r from-blue-400 to-green-400 text-gray-900"
          }`}
        >
          {category}
        </p>

        {image && (
          <div className="mb-6">
            <img
              src={image.startsWith("http") ? image : `${import.meta.env.VITE_BACKEND_URL}${image}`} 
              alt={title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        )}

        <div
          className={`leading-relaxed text-lg ${
            darkMode ? "text-gray-300" : "text-gray-800"
          }`}
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      </div>

      {/* Comment Section */}
      <div className="p-6 max-w-3xl mx-auto">
        <CommentSection />
      </div>

      {/* Recent Posts Section */}
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4">Recent Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {post?.posts.length > 0
            ? post?.posts.map((post) => (
                <div
                  key={post?.slug}
                  className={`cursor-pointer rounded-lg p-4 transition-transform duration-300 hover:scale-105 ${
                    darkMode
                      ? "bg-gray-800 bg-opacity-80 shadow-lg"
                      : "bg-white bg-opacity-90 shadow-md"
                  }`}
                >
                  <PostCard post={post} />
                </div>
              ))
            : "No recent posts available!"}
        </div>
      </div>
    </div>
  );
};

// PropTypes validation
PostPage.propTypes = {
  fetchPostsdataBySlug: PropTypes.func,
  userInfo: PropTypes.shape({
    user: PropTypes.shape({
      isAdmin: PropTypes.bool.isRequired,
    }),
  }),
};

export default PostPage;
