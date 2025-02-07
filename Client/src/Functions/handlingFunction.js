import {
  DELETE_USER_PROFILE_URL,
  FETCH_POSTS_URL,
  FETCH_USER_URL,
  INFO_URL,
  LOGOUT_URL,
  SIGNIN_URL,
  SIGNUP_URL,
  UPDATE_PROFILE_URL,
} from "../constant/constantfile";

export const SignupFunction = async (data, navigate, setUserInfo) => {
  if (data.password !== data.confirmPassword) {
    return alert("Passwords do not match!");
  }
  try {
    const response = await fetch(SIGNUP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Authentication failed");
    } else {
      console.log("Success:", responseData);
      setUserInfo(responseData?.user);
      navigate("/");
    }
  } catch (err) {
    console.log("Error in SignUp", err);
  }
};

export const SigninFunction = async (data, navigate, setUserInfo) => {
  try {
    const response = await fetch(SIGNIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        responseData.message || "Sign-in failed. Please try again."
      );
    }

    console.log("Sign-in Successful:", responseData);

    setUserInfo(responseData?.user); // Save user info to state or context
    navigate("/"); // Redirect to the home page or desired route
  } catch (err) {
    console.error("Error in SignIn:", err.message);
    alert(err.message || "An error occurred during sign-in.");
  }
};

export const logoutfunction = async (navigate, setUserInfo) => {
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

    setUserInfo(null);
    navigate("/");
  } catch (error) {
    console.error("Logout error:", error);
  }
};
// utils/api.js or any suitable file
export const getUserInfo = async (setUserInfo) => {
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
    setUserInfo(data); // Return the fetched data
  } catch (error) {
    console.error("Error fetching user info:", error);
    // Return null in case of an error
  }
};

// update profile
export const updateProfile = async (profileData, userId, setUserInfo) => {
  try {
    const response = await fetch(`${UPDATE_PROFILE_URL}${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(profileData),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setUserInfo((prev) => ({
        ...prev,
        user: { ...prev.user, ...data },
      }));
    } else {
      const error = await response.json();
      throw new Error(error.message || "Failed to update profile");
    }
  } catch (err) {
    console.error("Error updating profile:", err);
  }
};

export const deleteUserProfile = async (userId, navigate) => {
  const response = await fetch(`${DELETE_USER_PROFILE_URL}${userId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to delete account");
  }
  navigate("/signin");
};
export const fetchUsersData = async (limit=2) => {
  try {
    const response = await fetch(`${FETCH_USER_URL}?limit=${limit}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await response.json();
    if (response.ok) {
      console.log(data);
      return data;
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
};

export const fetchPostsdata = async (limit, startIndex) => {
  try {
    const response = await fetch(
      `${FETCH_POSTS_URL}?limit=${limit}&startIndex=${startIndex}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    const data = await response.json();
    if (response.ok) {
      console.log(data);
      return data;
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
};

export const fetchPostsdataBySlug = async (postSlug) => {
  try {
    const response = await fetch(`${FETCH_POSTS_URL}?slug=${postSlug}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await response.json();
    if (response.ok) {
      console.log(data);
      return data;
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
};
