import { useAtom } from "jotai";
import { userInfoAtom } from "../StoreContainer/store";
import { useQuery } from "@tanstack/react-query";
import { fetchUsersData } from "../Functions/handlingFunction";
import { useEffect, useState } from "react";

const UserComponent = () => {
  const [limit, setLimit] = useState(3);
  const [userInfo] = useAtom(userInfoAtom);
  const [allUsers, setAllUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["usersData", userInfo?.user?.isAdmin, limit],
    queryFn: ({ queryKey }) => {
      const [, , limit] = queryKey;
      return fetchUsersData(limit);
    },
    enabled: userInfo?.user?.isAdmin,
  });

  useEffect(() => {
    if (data?.users) {
      setAllUsers(data?.users);
    }
  }, [data?.users]);

  const users = data?.users ?? [];
  const isMoreUsers = users.length >= limit;

  const handleShowMore = () => {
    setLimit((prevLimit) => prevLimit + 2);
    if (!isMoreUsers) {
      setShowMore(false);
    }
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Error loading users. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-teal-400">
        User List
      </h1>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 "
        style={{ maxHeight: "85vh" }}
      >
        {allUsers.map((user) => (
          <div
            key={user.email}
            className="bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-700 hover:shadow-xl transform transition hover:scale-105"
          >
            <img
              src={user.profilePicture}
              alt={user.username}
              className="w-16 h-16 mx-auto rounded-full object-cover border-2 border-teal-400"
            />
            <div className="mt-2 text-center">
              <h2 className="text-lg font-semibold text-teal-400">
                {user.username}
              </h2>
              <p className="text-sm text-gray-400">{user.email}</p>
              <p className="text-sm text-gray-500">
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-4 flex justify-between">
              <button
                // onClick={() => handleEditUser(user._id)}
                className="text-sm text-white bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded-md"
              >
                Edit
              </button>
              <button
                // onClick={() => handleDeleteUser(user._id)}
                className="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-col items-center">
        {showMore && isMoreUsers && (
          <button
            onClick={handleShowMore}
            className="px-6 py-2 bg-teal-400 text-gray-900 rounded-lg hover:bg-teal-500 transition shadow-md font-medium"
          >
            Show More
          </button>
        )}
        {isLoading && (
          <p className="text-gray-300 text-center py-3">Loading...</p>
        )}
        {!isMoreUsers && (
          <p className="text-gray-400 text-center py-3">
            No more users to display.
          </p>
        )}
        {data?.users.length === 0 && (
          <p className="text-gray-300 text-center py-3">
            No users available yet!
          </p>
        )}
      </div>
    </div>
  );
};

export default UserComponent;

