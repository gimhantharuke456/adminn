import axiosClient from "../api/axiosClient";

const svcService = {
  addSvc: async (data) => {
    try {
      const response = await axiosClient.post("/api/admin/add-svc", data);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          success: false,
          message: "Network error occurred",
        }
      );
    }
  },

  bulkAddSvc: async (data) => {
    try {
      const response = await axiosClient.post("/api/admin/bulk-add-svc", data);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          success: false,
          message: "Network error occurred",
        }
      );
    }
  },

  getAllSvc: async () => {
    try {
      const response = await axiosClient.get("/api/admin/list-svc");
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          success: false,
          message: "Network error occurred",
        }
      );
    }
  },

  getSvcById: async (id) => {
    try {
      const response = await axiosClient.get(`/api/admin/svc/${id}`);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          success: false,
          message: "Network error occurred",
        }
      );
    }
  },

  updateSvc: async (id, data) => {
    try {
      const response = await axiosClient.put(`/api/admin/svc/${id}`, data);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          success: false,
          message: "Network error occurred",
        }
      );
    }
  },

  deleteSvc: async (id) => {
    try {
      const response = await axiosClient.delete(`/api/admin/svc/${id}`);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          success: false,
          message: "Network error occurred",
        }
      );
    }
  },

  bulkDeleteSvc: async (ids) => {
    try {
      const response = await axiosClient.delete("/api/admin/bulk-delete-svc", {
        data: { ids },
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          success: false,
          message: "Network error occurred",
        }
      );
    }
  },

  toggleSvcStatus: async (id) => {
    try {
      const response = await axiosClient.patch(
        `/api/admin/svc/${id}/toggle-status`
      );
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          success: false,
          message: "Network error occurred",
        }
      );
    }
  },
};

export default svcService;
