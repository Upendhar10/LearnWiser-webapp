import axiosClient from "@/api/axios";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export const authService = {
  // This a object method Shorthand
  login(payload: LoginPayload) {
    return axiosClient.post("/auth/login", payload);
  },
  logout() {
    localStorage.removeItem("authToken");
  },
  register(payload: RegisterPayload) {
    return axiosClient.post("/auth/register", payload);
  },
};
