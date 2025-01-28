import { useAtom } from "jotai";
import { useState, useEffect } from "react";
import { FaMoon, FaSun, FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { userInfoAtom } from "../StoreContainer/store.js";
import { getUserInfo, logoutfunction } from "../Functions/handlingFunction.js";

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme === "dark";
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const navigate = useNavigate();
  useEffect(() => {
    getUserInfo(setUserInfo);
  }, [setUserInfo]);
  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, [isDarkMode]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/projects", label: "Projects" },
  ];
  console.log(userInfo);
  // const profileInitial = userInfo?.user?.username?.[0]?.toUpperCase() || "";

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-md transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900/70" : "bg-gray-200"
      }`}
      style={{ backdropFilter: "blur(30px)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/"
                className={`font-bold text-xl transition-colors duration-300 ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                AbcBlog
              </Link>
            </div>
            {/* Desktop NavLinks */}
            <div className="hidden md:flex ml-10 space-x-4 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                    location.pathname === link.to
                      ? "bg-gray-700 text-white dark:bg-gray-600 dark:text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          {/* Right Section */}
          {/* Right Section */}
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <FaTimes size={20} />
                ) : (
                  <FaBars size={20} />
                )}
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="ml-4 focus:outline-none"
              >
                {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
              </button>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="ml-4 focus:outline-none"
              >
                {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
              </button>
              {userInfo?.user ? (
                <div className="relative">
                  <button
                    onClick={toggleProfileMenu}
                    className="ml-4 flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 text-white"
                  >
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                      {userInfo?.user?.profilePicture ? (
                        <img
                          src={userInfo?.user?.profilePicture}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-2xl font-bold">
                          {userInfo?.user?.username?.[0]?.toUpperCase() || "U"}
                        </span>
                      )}
                    </div>
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
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className={`md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3 transition-colors duration-300 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === link.to
                  ? "bg-gray-200 dark:bg-gray-700"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
              onClick={toggleMobileMenu}
            >
              {link.label}
            </Link>
          ))}
          {/* Profile in Mobile Menu */}
          {userInfo?.user ? (
            <div className="mt-4">
              <button
                onClick={toggleProfileMenu}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 text-white mx-auto"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                  {userInfo?.user?.profilePicture ? (
                    <img
                      src={userInfo?.user?.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-2xl font-bold">
                      {userInfo?.user?.username?.[0]?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>
              </button>
              {isProfileMenuOpen && (
                <div className="mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2">
                  {userInfo?.user?.isAdmin && (
                    <Link
                      to="/profile?tab=dashboard"
                      className="block px-4 py-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
            <Link
              to="/signin"
              className="text-center block px-3 py-2 rounded-md text-base font-medium"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
