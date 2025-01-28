
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getUserInfo, SigninFunction } from '../Functions/handlingFunction';
import { useAtom } from 'jotai';
import { userInfoAtom } from '../StoreContainer/store';
import Oauth from '../components/Oauth';


const SignIn = () => {
  const [ ,setUserInfo]=useAtom(userInfoAtom)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
 const navigate=useNavigate()
  const onSubmit = (data) => {
    console.log('SignIn Data:', data);
     SigninFunction(data,setUserInfo,navigate).then(()=>{
      getUserInfo(setUserInfo);
     })
  
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
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Enter a valid email address',
                  },
                })}
                className={`border rounded-md w-full px-3 py-2 focus:outline-none focus:ring focus:ring-teal-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.email ? 'border-red-500' : ''
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
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className={`border rounded-md w-full px-3 py-2 focus:outline-none focus:ring focus:ring-teal-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.password ? 'border-red-500' : ''
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
              <Oauth/>
            </div>
            <div className="text-center mt-4">
              <Link to="/signup" className="text-blue-500 hover:underline">
                {`Don't`} have an account? Sign Up
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;


// import { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { Link, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { getUserInfo, UserAuthenticationFunction } from '../Functions/handlingFunction.js';
// import { useAtom } from 'jotai';
// import { userInfoAtom } from '../StoreContainer/store.js';

// const AuthForm = ({ isSignIn }) => {
//   const navigate = useNavigate();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     watch,
//   } = useForm();

//   const password = watch("password");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errorMessage, setErrorMessage] = useState(null);
//   const [, setUserInfo] = useAtom(userInfoAtom);

//   // Fetch user information when component mounts
//   useEffect(() => {
//     getUserInfo(setUserInfo);
//   }, [setUserInfo]);

//   const onSubmit = async (data) => {
//     setIsSubmitting(true);
//     try {
//       await UserAuthenticationFunction(isSignIn, data, navigate, setErrorMessage, setIsSubmitting, setUserInfo);
//       await getUserInfo(setUserInfo);
//     } catch (error) {
//       setErrorMessage(error.message || 'An unexpected error occurred.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <motion.div
//       className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 flex flex-col items-center"
//       initial={{ opacity: 0, scale: 0.9 }}
//       animate={{ opacity: 1, scale: 1 }}
//       transition={{ duration: 0.5 }}
//     >
//       <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
//         {isSignIn ? 'Sign In' : 'Sign Up'}
//       </h2>

//       {errorMessage && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
//           <strong className="font-bold">Error:</strong>
//           <span className="block sm:inline ml-2">{errorMessage}</span>
//         </div>
//       )}

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
//         {!isSignIn && (
//           <div>
//             <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
//               Name
//             </label>
//             <motion.input
//               whileFocus={{ scale: 1.02, boxShadow: '0 0 5px rgba(0, 0, 255, 0.2)' }}
//               transition={{ type: 'spring', stiffness: 100 }}
//               type="text"
//               id="username"
//               {...register('username', { required: 'Name is required' })}
//               className="border rounded-md w-full px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             />
//             {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
//           </div>
//         )}

//         <div>
//           <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
//             Email
//           </label>
//           <motion.input
//             whileFocus={{ scale: 1.02, boxShadow: '0 0 5px rgba(0, 0, 255, 0.2)' }}
//             transition={{ type: 'spring', stiffness: 100 }}
//             type="email"
//             id="email"
//             {...register('email', {
//               required: 'Email is required',
//               pattern: {
//                 value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                 message: 'Invalid email address',
//               },
//             })}
//             className="border rounded-md w-full px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//           />
//           {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
//         </div>

//         <div>
//           <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
//             Password
//           </label>
//           <motion.input
//             whileFocus={{ scale: 1.02, boxShadow: '0 0 5px rgba(0, 0, 255, 0.2)' }}
//             transition={{ type: 'spring', stiffness: 100 }}
//             type="password"
//             id="password"
//             {...register('password', {
//               required: 'Password is required',
//               minLength: {
//                 value: 6,
//                 message: 'Password must be at least 6 characters long',
//               },
//             })}
//             className="border rounded-md w-full px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//           />
//           {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
//         </div>

//         {!isSignIn && (
//           <div>
//             <label htmlFor="confirmPassword" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
//               Confirm Password
//             </label>
//             <motion.input
//               whileFocus={{ scale: 1.02, boxShadow: '0 0 5px rgba(0, 0, 255, 0.2)' }}
//               transition={{ type: 'spring', stiffness: 100 }}
//               type="password"
//               id="confirmPassword"
//               {...register('confirmPassword', {
//                 required: 'Confirm Password is required',
//                 validate: (value) => value === password || "Passwords do not match",
//               })}
//               className="border rounded-md w-full px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             />
//             {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
//           </div>
//         )}

//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           type="submit"
//           disabled={isSubmitting}
//           className={`w-full py-2 rounded-md transition duration-300 ${
//             isSubmitting
//               ? 'bg-gray-400 cursor-not-allowed'
//               : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-400'
//           }`}
//         >
//           {isSubmitting ? 'Submitting...' : isSignIn ? 'Sign In' : 'Sign Up'}
//         </motion.button>

//         <div className="text-center mt-4">
//           <Link to={isSignIn ? '/signup' : '/signin'} className="text-blue-500 hover:underline dark:text-indigo-300">
//             {isSignIn ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
//           </Link>
//         </div>
//       </form>
//     </motion.div>
//   );
// };

// export const SignIn = () => (
//   <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-purple-700 dark:to-indigo-800 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
//     <AuthForm isSignIn={true} />
//   </div>
// );

// export const SignUp = () => (
//   <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-purple-700 dark:to-indigo-800 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
//     <AuthForm isSignIn={false} />
//   </div>
// );


