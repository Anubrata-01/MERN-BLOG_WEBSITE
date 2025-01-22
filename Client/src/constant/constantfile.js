export const ProdUrl = "https://job-board-mern-application-backend.onrender.com";
export const DevUrl = "http://localhost:7000";
export const HOST = import.meta.env.PROD ? ProdUrl : DevUrl;

export const AUTH_ROUTES=`${HOST}/api/auth`;
export const SIGNUP_URL=`${AUTH_ROUTES}/signup`
export const SIGNIN_URL=`${AUTH_ROUTES}/signin`
export const INFO_URL=`${AUTH_ROUTES}/userinfo`
export const LOGOUT_URL=`${AUTH_ROUTES}/logout`
export const FETCH_USER_URL=`${AUTH_ROUTES}/getusers`