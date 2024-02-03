/* All API calls should be defined in this file. */

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
