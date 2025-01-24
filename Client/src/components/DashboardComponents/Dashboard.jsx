import { FaUserFriends, FaComments, FaClipboardList } from "react-icons/fa";
import DashboardUser from "./DashboardUser";
import DashboardComments from "./DashboardComments";
import DashboradPosts from "./DashboradPosts";
import { userInfoAtom } from "../../StoreContainer/store.js";
import { useAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { fetchPostsdata, fetchUsersData } from "../../Functions/handlingFunction.js";

const Dashboard = () => {
  const [userInfo] = useAtom(userInfoAtom);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["usersData", userInfo?.user?.isAdmin],
    queryFn: fetchUsersData,
    enabled: userInfo?.user?.isAdmin,
  });

  const { data: post } = useQuery({
    queryKey: ["postsData", userInfo?.user?.isAdmin, 3], // Pass `limit` as part of the query key
    queryFn: ({ queryKey }) => {
      const [, , limit] = queryKey; // Destructure the query key to access the `limit`
      return fetchPostsdata(limit);
    },
    enabled: userInfo?.user?.isAdmin,
  });
console.log(post)
  const totalUsers = data?.totalUsers ?? 0;
  const totalPosts = post?.totalPosts ?? 0;
  const lastMonthUsers = data?.lastMonthUsers ?? 0;
  const lastMonthPosts = post?.lastMonthPosts ?? 0;
  const users = data?.users ?? [];
  const posts = post?.posts ?? [];

  const stats = [
    {
      title: "Total Users",
      count: totalUsers,
      change: `+${lastMonthUsers}`,
      description: "Last month",
      icon: <FaUserFriends className="text-2xl text-white" />,
      bgColor: "bg-teal-600",
    },
    {
      title: "Total Comments",
      count: 14,
      change: "+2",
      description: "Last month",
      icon: <FaComments className="text-2xl text-white" />,
      bgColor: "bg-purple-600",
    },
    {
      title: "Total Posts",
      count: totalPosts,
      change: `+${lastMonthPosts}`,
      description: "Last month",
      icon: <FaClipboardList className="text-2xl text-white" />,
      bgColor: "bg-green-600",
    },
  ];

  if (isLoading) return <div className="text-center text-white">Loading...</div>;
  if (isError) return <div className="text-center text-red-500">Error fetching data</div>;

  return (
    <div className="h-auto md:min-h-screen bg-gray-900 text-white p-6 space-y-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-6 rounded-lg bg-gray-800 shadow-md"
          >
            <div>
              <h3 className="text-gray-400 text-sm">{stat.title}</h3>
              <p className="text-3xl font-bold">{stat.count}</p>
              <p className="text-sm text-green-400">{stat.change}</p>
              <p className="text-gray-500 text-xs">{stat.description}</p>
            </div>
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full ${stat.bgColor}`}
            >
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Users, Comments, and Posts Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Users */}
        <DashboardUser users={users} />

        {/* Recent Comments */}
        <DashboardComments />

        {/* Recent Posts */}
        <DashboradPosts posts={posts}/>
      </div>
    </div>
  );
};

export default Dashboard;

// import { FaUserFriends, FaComments, FaClipboardList } from "react-icons/fa";
// import DashboardUser from "./DashboardUser";
// import DashboardComments from "./DashboardComments";
// import DashboradPosts from "./DashboradPosts";
// import { userInfoAtom } from "../../StoreContainer/store.js";
// import { useAtom } from "jotai";
// import { useQueryClient } from "@tanstack/react-query";
// import { fetchPostsdata, fetchUsersData } from "../../Functions/handlingFunction.js";
// import { useEffect, useState } from "react";

// const Dashboard = () => {
//   const [userInfo] = useAtom(userInfoAtom);
//   const queryClient = useQueryClient();

//   const [usersData, setUsersData] = useState(null);
//   const [postsData, setPostsData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isError, setIsError] = useState(false);

//   const fetchData = async () => {
//     try {
//       setIsLoading(true);
//       setIsError(false);

//       if (userInfo?.user?.isAdmin) {
//         const [users, posts] = await Promise.all([fetchUsersData(), fetchPostsdata()]);
//         setUsersData(users);
//         setPostsData(posts);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setIsError(true);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch data only once when the component is mounted
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleRefresh = () => {
//     fetchData(); // Manually trigger fetching data on button click
//     queryClient.invalidateQueries(); // Optional: Clear cached queries
//   };

//   const totalUsers = usersData?.totalUsers ?? 0;
//   const totalPosts = postsData?.totalPosts ?? 0;
//   const lastMonthUsers = usersData?.lastMonthUsers ?? 0;
//   const lastMonthPosts = postsData?.lastMonthPosts ?? 0;
//   const users = usersData?.users ?? [];
//   const posts = postsData?.posts ?? [];

//   const stats = [
//     {
//       title: "Total Users",
//       count: totalUsers,
//       change: `+${lastMonthUsers}`,
//       description: "Last month",
//       icon: <FaUserFriends className="text-2xl text-white" />,
//       bgColor: "bg-teal-600",
//     },
//     {
//       title: "Total Comments",
//       count: 14,
//       change: "+2",
//       description: "Last month",
//       icon: <FaComments className="text-2xl text-white" />,
//       bgColor: "bg-purple-600",
//     },
//     {
//       title: "Total Posts",
//       count: totalPosts,
//       change: `+${lastMonthPosts}`,
//       description: "Last month",
//       icon: <FaClipboardList className="text-2xl text-white" />,
//       bgColor: "bg-green-600",
//     },
//   ];

//   if (isLoading) return <div className="text-center text-white">Loading...</div>;
//   if (isError) return <div className="text-center text-red-500">Error fetching data</div>;

//   return (
//     <div className="h-auto md:min-h-screen bg-gray-900 text-white p-6 space-y-8">
//       {/* Refresh Button */}
//       <button
//         onClick={handleRefresh}
//         className="mb-1 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500"
//       >
//         Refresh Data
//       </button>

//       {/* Stats Section */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {stats.map((stat, index) => (
//           <div
//             key={index}
//             className="flex items-center justify-between p-6 rounded-lg bg-gray-800 shadow-md"
//           >
//             <div>
//               <h3 className="text-gray-400 text-sm">{stat.title}</h3>
//               <p className="text-3xl font-bold">{stat.count}</p>
//               <p className="text-sm text-green-400">{stat.change}</p>
//               <p className="text-gray-500 text-xs">{stat.description}</p>
//             </div>
//             <div
//               className={`flex items-center justify-center w-12 h-12 rounded-full ${stat.bgColor}`}
//             >
//               {stat.icon}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Recent Users, Comments, and Posts Section */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Recent Users */}
//         <DashboardUser users={users} />

//         {/* Recent Comments */}
//         <DashboardComments />

//         {/* Recent Posts */}
//         <DashboradPosts posts={posts} />
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
