
import { useAtom } from 'jotai';
import { userInfoAtom } from '../StoreContainer/store';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardComponents/DashboardSidebar';
import Dashboard from '../components/DashboardComponents/Dashboard';
import DashboradProfile from '../components/DashboardComponents/DashboradProfile';
import PostDashboard from '../components/PostDashboard';


const Profile = () => {
    const [userInfo] = useAtom(userInfoAtom);
    const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  console.log(tab)
    
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <DashboardSidebar tab={tab}/>
      {tab=="dashboard" && <Dashboard/>}
      {/* Main Content */}
      {
        tab=="profile" &&(
          <DashboradProfile userInfo={userInfo}/>
        )
      }
     {
      tab =="post" && (
        <PostDashboard/>
      )
     }
    </div>
  );
};

export default Profile;

