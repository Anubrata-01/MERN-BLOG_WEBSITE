import { useAtom } from 'jotai';
import { userInfoAtom } from '../StoreContainer/store';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardComponents/DashboardSidebar';
import Dashboard from '../components/DashboardComponents/Dashboard';
import DashboradProfile from '../components/DashboardComponents/DashboradProfile';
import PostDashboard from '../components/PostDashboard';
import UserComponent from '../components/UserComponent';

const Profile = () => {
  const [userInfo] = useAtom(userInfoAtom);
  const location = useLocation();
  const [tab, setTab] = useState('');

  // Extract the 'tab' parameter from the URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <DashboardSidebar tab={tab} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'profile' && <DashboradProfile userInfo={userInfo} />}
        {tab === 'users' && <UserComponent />}
        {tab === 'post' && <PostDashboard />}
      </div>
    </div>
  );
};

export default Profile;
