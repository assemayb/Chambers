import axios from "axios";

export const authAxios = axios.create({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
});
