import { useAtom } from "jotai";
import { userInfoAtom } from "../StoreContainer/store";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { fetchUsersData } from "../Functions/handlingFunction";
import { useState,  } from "react";
import ShimmerUsers from "./Shimmer/ShimmerUser";
import { DELETE_USER_PROFILE_URL, MAKE_ADMIN_URL } from "../constant/constantfile";

const UserComponent = () => {
  const [limit, setLimit] = useState(3);
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userInfo] = useAtom(userInfoAtom);

  const queryClient = useQueryClient();

  // Fetch users data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["usersData", userInfo?.user?.isAdmin, limit],
    queryFn: () => fetchUsersData(limit),
    enabled: userInfo?.user?.isAdmin,
  });

  // Show and hide message for 3 seconds
  const displayMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleClickDelete = (user) =>{
    setShowModal(true);
    setSelectedUser(user);
  }
  // Handle Delete User
  const handleConfirmDelete = async () => {
    try {
      const res = await fetch(`${DELETE_USER_PROFILE_URL}${selectedUser._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete user");

      queryClient.invalidateQueries(["usersData"]);
      setShowModal(false);
      displayMessage("User deleted successfully");
    } catch (err) {
      displayMessage("Error deleting user",err);
    }
  };

  // Handle Toggle Admin Role
  const handleToggleUserRole = async (user) => {
    try {
      const res = await fetch(`${MAKE_ADMIN_URL}/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update role");

      const data = await res.json();
      queryClient.invalidateQueries(["usersData"]);
      displayMessage(data.message);
    } catch (err) {
      displayMessage("Error updating role",err);
    }
  };

  if (isLoading) return <ShimmerUsers />;
  if (isError)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Error loading users. Please try again later.
      </div>
    );

  const users = data?.users || [];
  const isMoreUsers = data?.totalUsers > users.length;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-teal-400">User List</h1>

      {/* Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user._id} className="bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-700 hover:shadow-xl transform transition hover:scale-105">
            <img src={user.profilePicture} alt={user.username} className="w-16 h-16 mx-auto rounded-full object-cover border-2 border-teal-400" />
            <div className="mt-2 text-center">
              <h2 className="text-lg font-semibold text-teal-400">{user.username}</h2>
              <p className="text-sm text-gray-400">{user.email}</p>
              <p className="text-sm text-gray-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
              <p className={`mt-1 font-medium ${user.isAdmin ? "text-red-500" : "text-gray-400"}`}>
                {user.isAdmin ? "Admin" : "User"}
              </p>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              {userInfo?.user?._id !== user._id && (
                <button
                  className={`text-sm text-white px-3 py-2 rounded-md ${
                    user.isAdmin ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-500 hover:bg-blue-600"
                  }`}
                  onClick={() => handleToggleUserRole(user)}
                >
                  {user.isAdmin ? "Make User" : "Make Admin"}
                </button>
              )}
              <button className="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md" onClick={()=>handleClickDelete(user)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {isMoreUsers && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setLimit((prev) => prev + 2)}
            className="px-6 py-3 bg-teal-400 text-gray-900 rounded-lg hover:bg-teal-500 transition shadow-md font-medium"
          >
            Show More
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl text-white mb-4">Are you sure you want to delete this user?</h2>
            <div className="flex justify-center gap-4">
              <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600" onClick={handleConfirmDelete}>
                Yes
              </button>
              <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Message */}
      {message && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md shadow-md text-white text-center ${message.includes("Error") ? "bg-red-600" : "bg-green-600"}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default UserComponent;

