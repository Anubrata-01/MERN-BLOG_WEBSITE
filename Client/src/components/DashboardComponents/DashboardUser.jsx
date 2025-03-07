
import PropTypes from "prop-types"
const DashboardUser = ({users}) => {
  console.log(users)
   if(!users) return "Loading..."
  return (
   <div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Recent Users</h3>
            <button className="text-purple-400 border border-purple-400 px-3 py-1 rounded-md">
              See all
            </button>
          </div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="py-2 text-gray-400">User Image</th>
                <th className="py-2 text-gray-400">Username</th>
                <th className="py-2 text-gray-400">Profile</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="py-2">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className="py-2 text-white">{user.username}</td>
                  <td className="py-2">{user?.isAdmin?(<p className=" text-red-700 font-medium">Admin</p>):(<p className=" text-gray-400">User</p>)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
  )
}
DashboardUser.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
      username: PropTypes.string,
      isAdmin: PropTypes.bool,
    })
  ),
};

export default DashboardUser