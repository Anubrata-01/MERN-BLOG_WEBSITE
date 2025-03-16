import './App.css';
import Navbar from './components/Navbar';
import { Navigate, Outlet, RouterProvider, createHashRouter } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import { useAtom } from 'jotai';
import { userInfoAtom } from './StoreContainer/store.js';
import PropTypes from 'prop-types';

import Home from './page/Home';
import About from './page/About';
import Projects from './page/Projects';
import ErrorPage from './page/ErrorPage';
import Profile from './page/Profile.jsx';
import CreatePost from './page/CreatePost.jsx';
import PostPage from './page/PostPage.jsx';
import SignIn from './page/SignIn.jsx';
import SignUp from './page/SignUp.jsx';
import Layout from './page/Layout.jsx';

import { ProtectedRoute, SecureRoute } from './utilities/ProtectedRoute.jsx';
import { getUserInfo } from './Functions/handlingFunction.js';
import PageSkeleton from './components/Shimmer/PageSkeleton.jsx';


const Redirect = ({ children }) => {
  const [userInfo] = useAtom(userInfoAtom);

  if (userInfo?.user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

Redirect.propTypes = {
  children: PropTypes.node.isRequired,
};

const router = createHashRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: (
      <Suspense fallback={<PageSkeleton />}>
        <ErrorPage />
      </Suspense>
    ),
    children: [
      {
        path: '/',
        element: (
          <Layout>
            <Suspense fallback={<PageSkeleton />}>
              <Home />
            </Suspense>
          </Layout>
        ),
      },
      {
        path: '/about',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <About />
          </Suspense>
        ),
      },
      {
        path: '/projects',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageSkeleton />}>
              <Projects />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/signin',
        element: (
          <Redirect>
            <Suspense fallback={<PageSkeleton />}>
              <SignIn />
            </Suspense>
          </Redirect>
        ),
      },
      {
        path: '/signup',
        element: (
          <Redirect>
            <Suspense fallback={<PageSkeleton />}>
              <SignUp />
            </Suspense>
          </Redirect>
        ),
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageSkeleton />}>
              <Profile />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '/createpost',
        element: (
          <SecureRoute>
            <Suspense fallback={<PageSkeleton />}>
              <CreatePost />
            </Suspense>
          </SecureRoute>
        ),
      },
      {
        path: '/post/:postSlug',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <PostPage />
          </Suspense>
        ),
      },
    ],
  },
]);

function AppLayout() {
  const [, setUserInfo] = useAtom(userInfoAtom);

  useEffect(() => {
    getUserInfo(setUserInfo);
  }, [setUserInfo]);

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;

