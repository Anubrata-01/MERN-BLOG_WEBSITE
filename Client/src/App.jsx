import './App.css';
import Navbar from './components/Navbar';
import { Navigate, Outlet, RouterProvider,createHashRouter } from 'react-router-dom';
import Home from './page/Home';
import About from './page/About';
import Projects from './page/Projects';
import ErrorPage from './page/ErrorPage';
import { useAtom } from 'jotai';
import { userInfoAtom } from './StoreContainer/store.js';

import Profile from './page/Profile.jsx';
import PropTypes from 'prop-types';
import CreatePost from './page/CreatePost.jsx';
import { ProtectedRoute, SecureRoute } from './utilities/ProtectedRoute.jsx';
import PostPage from './page/PostPage.jsx';
import SignIn from './page/SignIn.jsx';
import SignUp from './page/SignUp.jsx';
import { useEffect } from 'react';
import { getUserInfo } from './Functions/handlingFunction.js';
import Layout from './page/Layout.jsx';

const Redirect=({children})=>{
   const [userInfo] = useAtom(userInfoAtom);
   if(userInfo?.user){
    return <Navigate to="/" replace />;
   }
   return children
}
Redirect.propTypes ={
  children:PropTypes.node.isRequired
}

const router = createHashRouter([
  {
    path: "/",
    element: <AppLayout />, // Use a layout component
    errorElement: <ErrorPage/>,
    children: [
      {
        path: "/",
        element: <Layout><Home/></Layout>,
      },
      {
        path: "/about",
        element: <About/>,
      },
      {
        path: "/projects",
        element: <ProtectedRoute><Projects/></ProtectedRoute>,
      },
       {
        path: "/signin",
        element: <Redirect><SignIn/></Redirect>,
      },
      {
        path: "/signup",
        element: <Redirect><SignUp/></Redirect>,
      },
      {
        path:"/profile",
        element:<ProtectedRoute><Profile/></ProtectedRoute>
      },
      {
        path:"/createpost",
        element:<SecureRoute><CreatePost/></SecureRoute>
      },
      {
        path:'/post/:postSlug',
        element:<PostPage/>
      }
    ],
  },
]);

function AppLayout() {
  const [,setUserInfo]=useAtom(userInfoAtom);
  useEffect(()=>{
    getUserInfo(setUserInfo)
  },[setUserInfo])

  return (
    <div>
      <Navbar />
      <Outlet/> 
    </div>
  );
}

function App() {
  
  return (
    <RouterProvider router={router} />
  );
}

export default App;
