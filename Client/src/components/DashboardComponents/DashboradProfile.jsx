import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const DashboradProfile = ({ userInfo }) => {
  const navigate = useNavigate();
  const { username, email,isAdmin } = userInfo?.user || {};
  return (
    <main className="flex-1 bg-gray-900 p-8 flex flex-col items-center md:items-center">
      <h1 className="text-2xl font-bold mb-6 text-center md:text-left">
        Profile
      </h1>
      <div className="flex flex-col items-center md:items-center space-y-6 md:space-y-6">
        {/* Profile Image */}
        <button className="ml-4 flex items-center justify-center w-24 h-24 rounded-full bg-gray-700 text-white text-xl">
          {userInfo?.user?.username?.[0].toUpperCase() || "U"}
        </button>
        {/* Input Fields */}
        <div className="space-y-4 w-full max-w-sm">
          <input
            type="text"
            value={username || "anubratachanda0874"}
            disabled
            className="w-full p-3 bg-gray-800 rounded-md text-gray-400"
          />
          <input
            type="email"
            value={email || "iamvk473@gmail.com"}
            disabled
            className="w-full p-3 bg-gray-800 rounded-md text-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-gray-800 rounded-md text-gray-400"
          />
        </div>
        <div className=" flex justify-between w-full max-w-sm">
          <button className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-md">
            Update
          </button>
          {
            isAdmin &&(
              <button
              className="mt-6 px-6 py-2 bg-gradient-to-r from-red-500 to-purple-500 text-white font-medium rounded-md"
              onClick={() => navigate("/createpost")}
            >
              Create Post
            </button>
            )
          }
         
        </div>
      </div>
      {/* Footer Actions */}
      <div className="flex justify-between w-full max-w-sm mt-8 text-red-500">
        <button className="hover:underline">Delete Account</button>
        <button className="hover:underline">Sign out</button>
      </div>
    </main>
  );
};
DashboradProfile.propTypes = {
  userInfo: PropTypes.shape({
    user: PropTypes.shape({
      username: PropTypes.string,
      email: PropTypes.string,
    }),
  }),
};
export default DashboradProfile;
