import {
  FETCH_POSTS_URL,
  FETCH_USER_URL,
  INFO_URL,
  LOGOUT_URL,
  SIGNIN_URL,
  SIGNUP_URL,
} from "../constant/constantfile";

export const UserAuthenticationFunction = async (
  isSign,
  data,
  navigate,
  setErrorMessage,
  setIsFormSubmitting,
  setUserIno
) => {
  setIsFormSubmitting(true);
  setErrorMessage(null);

  try {
    const endpoint = isSign ? `${SIGNIN_URL}` : `${SIGNUP_URL}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Authentication failed");
    }

    console.log("Success:", responseData);
    setUserIno(responseData);
    if (isSign) {
      localStorage.setItem("token", responseData.token);
      navigate("/");
    } else {
      navigate("/signin");
    }
  } catch (error) {
    console.error("Authentication error:", error);
    setErrorMessage(error.message);
  } finally {
    setIsFormSubmitting(false);
  }
};

export const logoutfunction = async (navigate, setUserIno) => {
  try {
    const response = await fetch(LOGOUT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    console.log("Success:", response.statusText);
    localStorage.removeItem("token");
    setUserIno(null);
    navigate("/");
  } catch (error) {
    console.error("Logout error:", error);
  }
};
// utils/api.js or any suitable file
export const getUserInfo = async (setUserIno) => {
  try {
    const response = await fetch(INFO_URL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      console.error("Failed to fetch user info:", response.statusText);
      // Return null on failure
    }

    const data = await response.json();
    setUserIno(data); // Return the fetched data
  } catch (error) {
    console.error("Error fetching user info:", error);
    // Return null in case of an error
  }
};

export const fetchUsersData = async (
) => {
  try {
    const response = await fetch(`${FETCH_USER_URL}?limit=3`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await response.json();
    if (response.ok) {
        console.log(data)
       return data;
   
      
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
};

export const fetchPostsdata=async(limit)=>{
  try {
    const response = await fetch(`${FETCH_POSTS_URL}?limit=${limit}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await response.json();
    if (response.ok) {
        console.log(data)
       return data;
   
      
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
}
