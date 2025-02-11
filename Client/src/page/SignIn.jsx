import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getUserInfo, SigninFunction } from "../Functions/handlingFunction";
import { useAtom } from "jotai";
import { userInfoAtom } from "../StoreContainer/store";
import Oauth from "../components/Oauth";

const SignIn = () => {
  const [, setUserInfo] = useAtom(userInfoAtom);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const onSubmit = (data) => {
    console.log("SignIn Data:", data);
    SigninFunction(data, setUserInfo, navigate).then(() => {
      getUserInfo(setUserInfo);
    });

    // Add your sign-in logic here (e.g., API call)
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 dark:from-purple-700 dark:to-blue-800 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg flex md:flex-row flex-col"
      >
        <div className="md:w-1/2 p-10 bg-blue-100 dark:bg-gray-700 rounded-l-lg flex flex-col justify-center items-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl font-bold text-blue-800 dark:text-blue-300 mb-4"
          >
            Welcome Back!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-700 dark:text-gray-200 text-center"
          >
            Please sign in to continue exploring amazing features.
          </motion.p>
        </div>
        <div className="md:w-1/2 p-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            Sign In
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Enter a valid email address",
                  },
                })}
                className={`border rounded-md w-full px-3 py-2 focus:outline-none focus:ring focus:ring-teal-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`border rounded-md w-full px-3 py-2 focus:outline-none focus:ring focus:ring-teal-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 focus:outline-none focus:ring focus:ring-teal-300 dark:bg-teal-500 dark:hover:bg-teal-600 dark:focus:ring-teal-400"
              >
                Sign In
              </button>
            </div>
          </form>
          <Oauth />
          <div className="text-center mt-4">
            <Link to="/signup" className="text-blue-500 hover:underline">
              {`Don't`} have an account? Sign Up
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
