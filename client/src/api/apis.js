/* All API calls should be defined in this file. */

/* returns all tweets from the user  */
export async function getUserTweets(userId) {
  const data = await get("/get-tweets/" + userId);
  return data;
}

export async function searchTweets(searchTerm) {
  try {
    const response = await fetch("/search-tweets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ searchTerm: searchTerm }),
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      // Handle HTTP errors
      console.error("Failed to fetch search results:", response.statusText);
      return null;
    }
  } catch (error) {
    // Handle network errors
    console.error("Network error when fetching search results:", error);
    return null;
  }
}

export async function searchUsers(searchTerm) {
  try {
    const response = await fetch("/search-users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ searchTerm: searchTerm }),
    }); // Adjust the endpoint as necessary
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      // Handle HTTP errors
      console.error("Failed to fetch search results:", response.statusText);
      return null;
    }
  } catch (error) {
    // Handle network errors
    console.error("Network error when fetching search results:", error);
    return null;
  }
}

export async function followUser(userId) {
  try {
    const response = await fetch("/follow/" + userId, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      // Handle HTTP errors
      console.error("Failed to fetch search results:", response.statusText);
      return null;
    }
  } catch (error) {
    // Handle network errors
    console.error("Network error when fetching search results:", error);
    return null;
  }
}

export async function unFollowUser(userId) {
  try {
    const response = await fetch("/unfollow/" + userId, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      // Handle HTTP errors
      console.error("Failed to fetch search results:", response.statusText);
      return null;
    }
  } catch (error) {
    // Handle network errors
    console.error("Network error when fetching search results:", error);
    return null;
  }
}

/* fetch user profile with all info (bio, avatar url, etc*/
export async function getUserProfile(userName) {
  const data = await get("/get-profile/" + userName);
  return data;
}

export async function getFollowers(userID) {
  const data = await get("/get-followers/" + userID);
  return data;
}

export async function getFollowing(userID) {
  const data = await get("/get-following/" + userID);
  return data;
}

export async function getAllUsers() {
  const data = await get("/all-users");
  return data;
}

export async function blockUser(userID, isBlocked) {
  try {
    const response = await fetch(`/block-user/${userID}/${isBlocked}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      // Handle HTTP errors
      console.error("Failed to blockUser results:", response.statusText);
      return null;
    }
  } catch (error) {
    // Handle network errors
    console.error("Network error when blocking user:", error);
    return null;
  }
}

export async function deblockUser(userID, isBlocked) {
  try {
    const response = await fetch(`/block-user/${userID}/${isBlocked}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      // Handle HTTP errors
      console.error("Failed to blockUser results:", response.statusText);
      return null;
    }
  } catch (error) {
    // Handle network errors
    console.error("Network error when blocking user:", error);
    return null;
  }
}

export async function deleteUser(userID) {
  try {
    const response = await fetch(`/delete-user/${userID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      // Handle HTTP errors
      console.error("Failed to delete user:", response.statusText);
      return null;
    }
  } catch (error) {
    // Handle network errors
    console.error("Network error when deleting user:", error);
    return null;
  }
}

export async function deleteTweet(tweetID) {
  try {
    const response = await fetch(`/delete-tweet/${tweetID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      // Handle HTTP errors
      console.error("Failed to delete tweet:", response.statusText);
      return null;
    }
  } catch (error) {
    // Handle network errors
    console.error("Network error when deleting tweet:", error);
    return null;
  }
}

async function get(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Failed to get with url", url, response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Network error in get with url", url, error);
    return null;
  }
}
