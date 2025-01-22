import { FaBars, FaTimes, FaSignOutAlt, FaUser, FaHome, FaUsers, FaComments, FaLink } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { userInfoAtom } from '../../StoreContainer/store.js';
import { useAtom } from 'jotai';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const DashboardSidebar = ({ tab }) => {
  const [activeTab, setActiveTab] = useState('');
  const [userInfo] = useAtom(userInfoAtom);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for controlling the hamburger menu

  useEffect(() => {
    // Sync activeTab with the tab prop (from URL query parameter)
    setActiveTab(tab?.toLowerCase() || '');
  }, [tab]);

  const links = [
    { name: 'dashboard', icon: <FaHome className="text-xl" />, path: '/profile?tab=dashboard' },
    { name: 'profile', icon: <FaUsers className="text-xl" />, path: '/profile?tab=profile' },
    { name: 'post', icon: <FaUsers className="text-xl" />, path: '/profile?tab=post' },
    { name: 'comments', icon: <FaComments className="text-xl" />, path: '/profile?tab=comments' },
    { name: 'users', icon: <FaLink className="text-xl" />, path: '/profile?tab=users' },
  ];

  return (
    <aside className="w-full md:w-[18%] bg-gray-800 p-6 flex flex-col items-center md:items-start space-y-6 md:h-full">
      {/* Hamburger Menu for Small Screens */}
      <div className="flex justify-between items-center w-full md:hidden">
        <button
          className="text-white text-xl"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <span className="text-white text-xl font-bold">Dashboard</span>
      </div>

      {/* Profile Section */}
      <button
        className="w-full md:w-auto border-2 p-3 rounded-md bg-slate-700 flex items-center space-x-3 hover:bg-gray-700 transition"
        onClick={() => setActiveTab('profile')} // Handle profile click
      >
        <FaUser className="text-white text-xl" />
        <div className="flex gap-32 md:gap-6">
          <span className="text-lg font-medium">Profile</span>
          <span
            className={`text-xs px-2 py-1 rounded-md ${
              userInfo?.user?.isAdmin ? 'bg-red-500 text-white font-bold' : 'bg-gray-800 text-gray-300'
            }`}
          >
            {userInfo?.user?.isAdmin ? 'Admin' : 'User'}
          </span>
        </div>
      </button>

      {/* Navigation Links */}
      <nav
        className={`${
          isMenuOpen ? 'flex' : 'hidden'
        } md:flex flex-col w-full space-y-4 transition-all duration-300`}
      >
        {userInfo.user?.isAdmin &&
          links.map((link) => (
            <Link
              to={link.path}
              key={link.name}
              className={`flex items-center w-full md:w-auto space-x-2 px-4 py-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition ${
                activeTab === link.name ? 'bg-gray-700 text-white' : ''
              }`}
              onClick={() => {
                setActiveTab(link.name);
                setIsMenuOpen(false); // Close the menu when a link is clicked
              }}
            >
              {link.icon}
              <span className="text-lg capitalize">{link.name}</span>
            </Link>
          ))}
      </nav>

      {/* Sign Out Button */}
      <button
        className="flex items-center space-x-2 text-gray-400 hover:text-white"
        onClick={() => setActiveTab('signout')} // Handle signout click
      >
        <FaSignOutAlt className="text-xl" />
        <span className="text-lg">Sign out</span>
      </button>
    </aside>
  );
};

DashboardSidebar.propTypes = {
  tab: PropTypes.string, // Define 'tab' as a string
};

export default DashboardSidebar;



