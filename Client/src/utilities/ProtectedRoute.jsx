import { useAtom } from "jotai";
import { userInfoAtom } from "../StoreContainer/store";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
export const ProtectedRoute = ({ children }) => {
  const [userInfo] = useAtom(userInfoAtom);

  if (userInfo?.user) {
    return children;
  } else {
    return <Navigate to="/signin" replace />;
  }
};
export const SecureRoute = ({ children }) => {
  const [userInfo] = useAtom(userInfoAtom);

  if (userInfo?.user?.isAdmin) {
    return children;
  } else {
    return <Navigate to="/" replace />;
  }
}
ProtectedRoute.propTypes ={
  children:PropTypes.node.isRequired
}
SecureRoute.propTypes ={
  children:PropTypes.node.isRequired
}

