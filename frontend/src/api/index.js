import axiosInstance from "@/api/axios";

export const createWhiteboardApi = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "whiteboards/new/",
      payload
    );
    return response;
  } catch (error) {
    console.error("Error creating whiteboard:", error);
  }
};

export const fetchWhiteboardsApi = async () => {
  try {
    const response = await axiosInstance.get(
      "whiteboards/"
    );
    return response;
  } catch (error) {
    console.error("Error fetching whiteboards:", error);
  }
};