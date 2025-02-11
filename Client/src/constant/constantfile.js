export const ProdUrl = "https://mern-blog-website-h9r2.onrender.com";
export const HOST = import.meta.env.PROD ? ProdUrl : import.meta.env.VITE_BACKEND_URL;

export const AUTH_ROUTES=`${HOST}/api/auth`;
export const SIGNUP_URL=`${AUTH_ROUTES}/signup`
export const SIGNIN_URL=`${AUTH_ROUTES}/signin`
export const SIGNIN_WITH_GOOGLE_URL=`${AUTH_ROUTES}/google`
export const INFO_URL=`${AUTH_ROUTES}/userinfo`
export const LOGOUT_URL=`${AUTH_ROUTES}/logout`
export const FETCH_USER_URL=`${AUTH_ROUTES}/getusers`
export const UPLOAD_URL=`${AUTH_ROUTES}/upload`
export const CREATE_POST_URL=`${AUTH_ROUTES}/createpost`
export const EDIT_POST_URL=`${AUTH_ROUTES}/editpost`
export const FETCH_POSTS_URL=`${AUTH_ROUTES}/getposts`
export const UPDATE_PROFILE_URL=`${AUTH_ROUTES}/update/`
export const DELETE_USER_PROFILE_URL=`${AUTH_ROUTES}/delete/`
