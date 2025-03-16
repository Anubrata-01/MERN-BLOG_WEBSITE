import { useState, useEffect, useMemo } from "react";
import { TypeAnimation } from "react-type-animation";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPostsdata } from "../Functions/handlingFunction.js";
import { darkModeAtom, userInfoAtom } from "../StoreContainer/store.js";
import { useAtom } from "jotai";
import PostCard from "../components/PostCard";

const Home = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [limit, setLimit] = useState(4);
  const [darkMode] = useAtom(darkModeAtom);
  const [userInfo] = useAtom(userInfoAtom);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["recentPosts", limit, userInfo],
    queryFn: () => fetchPostsdata(limit),
    staleTime: 5000,
    cacheTime: 60000,
    keepPreviousData: true, // prevents flashing when refetching
  });

  // Only update the date string when currentDate changes
  const formattedDate = useMemo(
    () =>
      currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [currentDate]
  );

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleShowMore = async () => {
    setLimit((prev) => prev + 2);
    await refetch(); // no need to manually handle posts, React Query handles data
  };

  const renderPostList = () => {
    if (isLoading && !data?.posts?.length) {
      return <p className="text-center py-3">Loading...</p>;
    }

    if (isError) {
      return <p className="text-red-500 text-center py-3">An error occurred!</p>;
    }

    if (!data?.posts?.length) {
      return <p className="text-center py-3">No recent posts available!</p>;
    }

    return data.posts.map((post) => (
      <div
        key={post?.slug}
        className={`cursor-pointer p-6 rounded-lg shadow-md transition-all ${
          darkMode ? "bg-gray-700" : "bg-gray-100"
        }`}
      >
        <PostCard post={post} />
      </div>
    ));
  };

  return (
    <div
      className={`min-h-screen py-20 px-6 sm:px-12 lg:px-24 flex flex-col justify-center items-center transition-colors duration-300
        ${darkMode ? "bg-gray-900 text-white" : "bg-orange-100 text-gray-900"}`}
    >
      <div className="max-w-4xl w-full text-center">
        {/* Header */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
          Welcome to{" "}
          <span className={darkMode ? "text-indigo-400" : "text-orange-600"}>
            AbcBlog
          </span>
        </h1>

        {/* Typing animation */}
        <div className="text-2xl md:text-3xl font-medium mb-8">
          <TypeAnimation
            sequence={[
              "Sharing Knowledge",
              1000,
              "Inspiring Creativity",
              1000,
              "Exploring New Ideas",
              1000,
            ]}
            wrapper="span"
            repeat={Infinity}
          />
        </div>

        {/* Subtitle */}
        <p className="text-lg md:text-xl mb-12 leading-relaxed">
          A space for thoughts, experiences, and discoveries. Join me on this journey of learning and growth.
        </p>

        {/* Action buttons */}
        <div className="flex space-x-4 justify-center mb-12">
          <Link
            to="/projects"
            className={`inline-flex items-center px-6 py-3 text-base font-medium rounded-md shadow-sm transition-all 
              ${darkMode ? "bg-indigo-600 hover:bg-indigo-700" : "bg-orange-500 hover:bg-orange-600"} text-white`}
          >
            View Projects
          </Link>
          <Link
            to="/about"
            className={`inline-flex items-center px-6 py-3 border text-base font-medium rounded-md shadow-sm transition-all 
              ${
                darkMode
                  ? "border-gray-700 text-gray-300 bg-gray-800 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 bg-green-400 hover:bg-green-500"
              }`}
          >
            View Posts
          </Link>
        </div>

        {/* Date */}
        <p className="text-sm">{formattedDate}</p>

        {/* Posts Section */}
        <div className="w-full">
          <h2 className="text-xl font-extrabold mb-10 mt-10">Recent Posts</h2>
          <div
            className={`p-10 rounded-md grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto transition-all ${
              darkMode ? "bg-gray-800 text-gray-100" : "bg-orange-200 text-gray-800"
            }`}
          >
            {renderPostList()}
          </div>
        </div>

        {/* Show More Button */}
        <button
          onClick={handleShowMore}
          disabled={isLoading} // prevent spam clicks
          className={`w-full text-lg py-7 transition-all ${
            darkMode
              ? "text-indigo-400 hover:text-indigo-500"
              : "text-orange-600 hover:text-orange-700"
          } disabled:opacity-50`}
        >
          {isLoading ? "Loading..." : "Show more"}
        </button>
      </div>
    </div>
  );
};

export default Home;

