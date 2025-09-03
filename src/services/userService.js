import axiosClient from "../api/axiosClient";

const userService = {
  register: async (data) => {
    try {
      const response = await axiosClient.post("/registration", data);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          status: false,
          error: "Network error occurred",
        }
      );
    }
  },

  login: async (data) => {
    try {
      const response = await axiosClient.post("/login", data);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          status: false,
          error: "Network error occurred",
        }
      );
    }
  },

  verifyToken: async (token) => {
    try {
      const response = await axiosClient.post("/verify", { token });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          status: false,
          message: "Network error occurred",
        }
      );
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await axiosClient.post("/profile", data);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          status: false,
          message: "Network error occurred",
        }
      );
    }
  },

  getProfile: async (id) => {
    try {
      const response = await axiosClient.get(`/profile/${id}`);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          status: false,
          error: "Network error occurred",
        }
      );
    }
  },
  getAllUsers: async () => {
    try {
      const response = await axiosClient.get(`/users`);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          status: false,
          error: "Network error occurred",
        }
      );
    }
  },
};

export default userService;
