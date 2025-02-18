import { useAtom } from "jotai";
import { userInfoAtom } from "../StoreContainer/store";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { fetchUsersData } from "../Functions/handlingFunction";
import { useEffect, useState } from "react";
import ShimmerUsers from "./Shimmer/ShimmerUser";
import { DELETE_USER_PROFILE_URL } from "../constant/constantfile";

const UserComponent = () => {
  const [limit, setLimit] = useState(3);
  const [userInfo] = useAtom(userInfoAtom);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
 const queryClient=useQueryClient()
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

  const isMoreUsers = data?.totalUsers > allUsers.length;

  const handleShowMore = () => {
    setLimit((prevLimit) => prevLimit + 2);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleConfirmDelete = async() => {
    console.log("Deleting user:", selectedUser);
    try{
      const res=await fetch(`${DELETE_USER_PROFILE_URL}${selectedUser._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
      });
      const data=await res.json();
      if(res.ok){
        console.log("User deleted successfully:", data);
        queryClient.invalidateQueries(["usersData"]);
        setShowModal(false);
      }
    }
    catch(err){
      console.log("Error deleting user:", err);
    }
  };

  if(allUsers.length === 0){
    return <ShimmerUsers/>
  }

  if (isLoading) {
    return <ShimmerUsers />;
  }
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Error loading users. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-teal-400">User List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <h2 className="text-lg font-semibold text-teal-400">{user.username}</h2>
              <p className="text-sm text-gray-400">{user.email}</p>
              <p className="text-sm text-gray-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                className="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md"
                onClick={() => handleDeleteClick(user)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-center w-full">
        {isMoreUsers && (
          <button
            onClick={handleShowMore}
            className="w-full max-w-xs px-6 py-3 bg-teal-400 text-gray-900 rounded-lg hover:bg-teal-500 transition shadow-md font-medium text-center"
          >
            Show More
          </button>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl text-white mb-4">Are you sure you want to delete this user?</h2>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={handleConfirmDelete}
              >
                Yes
              </button>
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserComponent;


