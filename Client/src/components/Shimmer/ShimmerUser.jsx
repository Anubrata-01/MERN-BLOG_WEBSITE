const ShimmerUsers = () => {
    return (
      <div className="p-6 bg-gray-900 min-h-screen text-white">
        <h1 className="text-3xl font-bold mb-6 text-center text-teal-400">
          User List
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-700 animate-pulse"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-gray-700"></div>
              <div className="mt-4 text-center">
                <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto"></div>
                <div className="h-3 bg-gray-600 rounded w-1/2 mx-auto mt-2"></div>
              </div>
              <div className="mt-4 h-3 bg-gray-600 rounded w-2/3 mx-auto"></div>
              <div className="mt-4 flex justify-center">
                <div className="h-8 bg-gray-700 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default ShimmerUsers;