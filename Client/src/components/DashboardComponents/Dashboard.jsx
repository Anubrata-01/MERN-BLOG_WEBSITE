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
  const limit = 3;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["usersData", userInfo?.user?.isAdmin, limit],
    queryFn: ({ queryKey }) => {
      const [, , limit] = queryKey;
      return fetchUsersData(limit);
    },
    enabled: userInfo?.user?.isAdmin,
  });

  const { data: post } = useQuery({
    queryKey: ["postsData", userInfo?.user?.isAdmin, 3], 
    queryFn: ({ queryKey }) => {
      const [, , limit] = queryKey;
      return fetchPostsdata(limit);
    },
    enabled: userInfo?.user?.isAdmin,
  });

  console.log(post);
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
    <div className="h-auto md:min-h-screen bg-gray-700 text-gray-900 p-6 space-y-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-6 rounded-lg shadow-md bg-slate-600 text-white"
          >
            <div>
              <h3 className="text-sm text-gray-400">{stat.title}</h3>
              <p className="text-3xl font-bold">{stat.count}</p>
              <p className="text-sm text-green-400">{stat.change}</p>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </div>
            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${stat.bgColor}`}>
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
        <DashboradPosts posts={posts} />
      </div>
    </div>
  );
};

export default Dashboard;


