import  { useState } from 'react';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMatchError(true);
      return; // Stop form submission
    } else {
        setPasswordMatchError(false)
    }

    // Handle Sign Up Logic Here (e.g., API call)
    console.log("Signing up with:", name, email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-purple-700 dark:to-indigo-800 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Name</label>
            <input
              type="text"
              id="name"
              className="border rounded-md w-full px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="border rounded-md w-full px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="border rounded-md w-full px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6} // Example: Minimum password length
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="border rounded-md w-full px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {passwordMatchError && (
              <p className="text-red-500 text-sm mt-1">Passwords do not match.</p>
            )}
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-400"
            >
              Sign Up
            </button>
          </div>
          <div className="text-center mt-4">
            <Link to="/signin" className="text-blue-500 hover:underline">
              Already have an account? Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;