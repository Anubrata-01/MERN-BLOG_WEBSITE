import { useAtom } from "jotai";
import { userInfoAtom } from "../StoreContainer/store";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [userInfo] = useAtom(userInfoAtom);

  if (userInfo?.user) {
    return children;
  } else {
    return <Navigate to="/signin" replace />;
  }
};

export default ProtectedRoute;
