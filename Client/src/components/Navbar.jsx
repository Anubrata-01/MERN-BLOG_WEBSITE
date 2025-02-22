import { useAtom } from "jotai";
import { useState, useEffect } from "react";
import { FaMoon, FaSun, FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { userInfoAtom,darkModeAtom } from "../StoreContainer/store.js";
import { getUserInfo, logoutfunction } from "../Functions/handlingFunction.js";

const Navbar = () => {
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);
 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const navigate = useNavigate();

  useEffect(() => {
    getUserInfo(setUserInfo);
  }, [setUserInfo]);

  // useEffect(() => {
  //   localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  //   document.documentElement.classList.toggle("dark", isDarkMode);
  // }, [isDarkMode]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
  const toggleTheme = () => setDarkMode((prev) => !prev);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/projects", label: "Projects" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-colors duration-300 
      ${darkMode ? "bg-gray-900/70 text-white" : "bg-white shadow-md"}`}
      style={{ backdropFilter: "blur(30px)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="font-bold text-xl transition-colors duration-300"
            >
              AbcBlog
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-4 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 
                  ${location.pathname === link.to ? "bg-blue-500 text-white" : "hover:bg-blue-200 dark:hover:bg-blue-700"}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center">
            {/* Theme Toggle Button */}
            <button onClick={toggleTheme} className="ml-4">
              {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>

            {/* User Profile */}
            {userInfo?.user ? (
              <div className="relative ml-4">
                <button
                  onClick={toggleProfileMenu}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 text-white"
                >
                  {userInfo?.user?.profilePicture ? (
                    <img
                      src={userInfo.user.profilePicture}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold">
                      {userInfo?.user?.username?.[0]?.toUpperCase() || "U"}
                    </span>
                  )}
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2">
                    {userInfo?.user?.isAdmin && (
                      <Link
                        to="/profile?tab=dashboard"
                        className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Dashboard
                      </Link>
                    )}
                    <Link
                      to="/profile?tab=profile"
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => logoutfunction(navigate, setUserInfo)}
                      className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/signin" className="ml-4">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400"
            >
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden px-2 pt-2 pb-3 space-y-1 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors 
              ${location.pathname === link.to ? "bg-blue-500 text-white" : "hover:bg-blue-200 dark:hover:bg-blue-700"}`}
              onClick={toggleMobileMenu}
            >
              {link.label}
            </Link>
          ))}
          {userInfo?.user && (
            <div className="mt-4">
              <button onClick={toggleProfileMenu} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 text-white mx-auto">
                {userInfo?.user?.profilePicture ? (
                  <img src={userInfo?.user?.profilePicture} alt="Profile" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-xl font-bold">
                    {userInfo?.user?.username?.[0]?.toUpperCase() || "U"}
                  </span>
                )}
              </button>
              {isProfileMenuOpen && (
                <div className="mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2">
                  <Link to="/profile?tab=profile" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Profile
                  </Link>
                  <button onClick={() => logoutfunction(navigate, setUserInfo)} className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
