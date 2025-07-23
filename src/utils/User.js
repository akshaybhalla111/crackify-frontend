// src/utils/User.js
export const User = {
  me: async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return null;

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) return null;

      return await res.json();
    } catch (err) {
      console.error("Error fetching user profile:", err);
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  }
};
