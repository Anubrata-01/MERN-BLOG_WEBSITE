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

const PostPage = () => {
  const { postSlug } = useParams(); // Get slug from URL
  const backendUrl = "http://localhost:7000";

  const { data, isError, isLoading } = useQuery({
    queryKey: ["blogDetails", postSlug],
    queryFn: ({ queryKey }) => {
      const [, slug] = queryKey;
      return fetchPostsdataBySlug(slug); // Fetch blog details by slug
    },
    enabled: !!postSlug, // Ensure slug is defined
  });

  const { data: post } = useQuery({
    queryKey: ["recentPosts", 4,data?.posts.length],
    queryFn: ({ queryKey }) => {
      const [, limit,startIndex] = queryKey;
      return fetchPostsdata(limit,startIndex);
    },
    enabled: !!postSlug,
  });
  console.log(data?.posts.length)
  console.log(data);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-800">
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
    <div className="w-full bg-slate-800">
      <div className="p-6 bg-gray-900 text-gray-100 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>

        <p className=" w-[10%] p-1 text-sm relative left-[45%] text-gray-200 bg-gray-500 mb-6 border-2 rounded-md">
          {" "}
          {category}
        </p>

        {image && (
          <div className="mb-6">
            <img
              src={image.startsWith("http") ? image : `${backendUrl}${image}`} // Handle both relative and absolute paths
              alt={title}
              className="w-full h-auto rounded-md shadow"
            />
          </div>
        )}
        <div
          className="text-gray-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }} // Assuming content contains HTML
        ></div>
      </div>
      <div className="p-6  text-gray-100 max-w-3xl mx-auto">
        <CommentSection />
      </div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-100 max-w-3xl mx-auto">
        {post?.posts.length > 0
          ? post?.posts.map((post) => {
              return (
                <div key={post?.slug} className=" cursor-pointer">
                  <PostCard post={post} />
                </div>
              );
            })
          : "No reecent Post available!"}
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
