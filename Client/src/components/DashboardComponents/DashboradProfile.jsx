import PropTypes from "prop-types";
import { useRef, useState } from "react";
import {  useNavigate } from "react-router-dom";
import { deleteUserProfile, logoutfunction, updateProfile } from "../../Functions/handlingFunction";
import { userInfoAtom } from "../../StoreContainer/store";
import {supabase} from "../../supabase.js"
import { useAtom } from "jotai";

const DashboardProfile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [updatedSuccessMessage,setUpdatedSuccessMessage]=useState(false)
  // const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const imageRef = useRef(null);

  const { username, email, isAdmin, _id, profilePicture } = userInfo?.user || {};

  const handleUpdateProfile = async () => {
    try {
      setIsUpdating(true);
      setUpdatedSuccessMessage(true);
      await updateProfile(profileData, _id, setUserInfo);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsUpdating(false)
      setTimeout(() => {
        setUpdatedSuccessMessage(false)
      }, 5000);
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // You can add your image upload logic here (e.g., upload to server).
        console.log("Selected file:", file);
        // setImageFile(file);
        setImageFileUrl(URL.createObjectURL(file) )
        const fileName= `${Date.now()}.${file.name.split('.').pop()}`;
        const { data, error } = await supabase.storage
        .from('profileImages')
        .upload(fileName, file);
        if (error) throw error;

      // Generate the public URL for the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('profileImages')
        .getPublicUrl(fileName);

      // Update the profile picture in the user's profile
      const updatedData = { profilePicture: publicUrlData.publicUrl };
      console.log(updatedData)
      setProfileData({...profileData,profilePicture: publicUrlData.publicUrl })
      } catch (error) {
        console.error("Error updating profile picture:", error);
      }
    }
  };

  console.log(imageFileUrl)
  console.log(profileData)

  const handleDeleteAccount = async () => {
    try {
      console.log("Account deleted");
      setShowDeleteModal(false);
      await deleteUserProfile(_id, navigate);
      setUserInfo("");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <main className="flex-1 bg-gray-900 p-8 flex flex-col items-center md:items-center">
      <h1 className="text-2xl font-bold mb-6 text-center md:text-left">Profile</h1>
      <div className="flex flex-col items-center md:items-center space-y-6">
        {/* Profile Image */}
        <div
          className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center cursor-pointer"
          onClick={() => imageRef.current.click()}
        >
          {profilePicture ? (
            <img src={ imageFileUrl?`${imageFileUrl}`:profilePicture} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-white text-2xl font-bold">
              {username?.[0]?.toUpperCase() || "U"}
            </span>
          )}
          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            ref={imageRef}
            className="hidden"
            // defaultValue={profilePicture}
            onChange={handleImageChange}
          />
        </div>

        {/* Input Fields */}
        <div className="space-y-4 w-full max-w-sm">
          <input
            type="text"
            // value={profileData.username || username || ""}
            defaultValue={username}
            placeholder="Username"
            className="w-full p-3 bg-gray-800 rounded-md text-gray-400"
            onChange={(e) =>
              setProfileData((prev) => ({
                ...prev,
                username: e.target.value,
              }))
            }
          />
          <input
            type="email"
            value={profileData.email || email || ""}
            defaultValue={email}
            placeholder="Email"
            className="w-full p-3 bg-gray-800 rounded-md text-gray-400"
            onChange={(e) =>
              setProfileData((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
          />
          <input
            type="password"
            placeholder="Password"
            value={profileData.password || ""}
            className="w-full p-3 bg-gray-800 rounded-md text-gray-400"
            onChange={(e) =>
              setProfileData((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
          />
        </div>
        <div className="flex justify-between w-full max-w-sm">
          <button
            className={`mt-6 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-md ${
              isUpdating ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleUpdateProfile}
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update"}
          </button>
          {isAdmin && (
            <button
              className="mt-6 px-6 py-2 bg-gradient-to-r from-red-500 to-purple-500 text-white font-medium rounded-md"
              onClick={() => navigate("/createpost")}
            >
              Create Post
            </button>
          )}
        </div>
      </div>
      {/* Footer Actions */}
      <div className="flex justify-between w-full max-w-sm mt-8 text-red-500">
        <button className="hover:underline" onClick={() => setShowDeleteModal(true)}>
          Delete Account
        </button>
        <button className="hover:underline" onClick={() => logoutfunction(navigate, setUserInfo)}>
          Sign out
        </button>
      </div>
      {updatedSuccessMessage && <p className="text-lg text-green-600 font-bold text-center">User Updated Successfully</p>}
      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-md w-full max-w-sm text-center">
            <h2 className="text-xl font-semibold text-white mb-4">Are you sure you want to delete this account?</h2>
            <div className="flex justify-between">
              <button
                className="px-6 py-2 bg-red-500 text-white font-medium rounded-md"
                onClick={handleDeleteAccount}
              >
                Yes
              </button>
              <button
                className="px-6 py-2 bg-gray-500 text-white font-medium rounded-md"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

DashboardProfile.propTypes = {
  userInfo: PropTypes.shape({
    user: PropTypes.shape({
      username: PropTypes.string,
      email: PropTypes.string,
      profilePicture: PropTypes.string,
    }),
  }),
};

export default DashboardProfile;



