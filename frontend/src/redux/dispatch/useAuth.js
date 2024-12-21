import { useSelector, useDispatch } from "react-redux";
import {
  loginFailure,
  loginStart,
  loginSuccess,
  logout,
} from "../features/userSlice";
import { initializeSocket, disconnectSocket } from "../features/socketSlice";
import { useCookies } from "react-cookie";
import { toast } from "sonner";
import axiosInstance from "@/api/axios";

const useAuth = () => {
  const isProduction = import.meta.env.VITE_NODE_ENV === "production";
  //console.log(isProduction, process.env.REACT_APP_NODE_ENV);
  const auth = useSelector((state) => state.auth);
  const socket = useSelector((state) => state.socket.socket);
  const [cookies, setCookie, removeCookie] = useCookies(["auth_token"]);

  const dispatch = useDispatch();

  const setAuth = (user, token) => {
    dispatch(loginSuccess({ user, token }));
  };

  const isAuthenticated = auth.user !== null;
  const isAdmin = auth.user?.isAdmin || false;

  const signup = async (userName, email, password) => {
    dispatch(loginStart());
    try {
      await axiosInstance.post("/auth/signup", {
        username: userName,
        email,
        password,
      });
      dispatch(loginSuccess({ user: null, token: null }));
      toast.success(
        "Account created successfully,\n Please verify your email.",
      );
      return true;
    } catch (err) {
      dispatch(loginFailure());
      toast.error(err.response.data);
      return err.response.data;
    }
  };

  const login = async (email, password) => {
    dispatch(loginStart());
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });

      setCookie("auth_token", res.data.token, {
        path: "/",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        secure: isProduction,
      });

      dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
      dispatch(initializeSocket());
      toast.success("Login Successful");
      return isProduction;
    } catch (err) {
      toast.error(err.response.data);
      dispatch(loginFailure());
      return err.response.data;
    }
  };


  const refershToken = async () => {
    dispatch(loginStart());
    try {
      if (!cookies.auth_token) {
        dispatch(loginFailure());
        return;
      }

      if (!cookies.auth_token.length > 0) {
        return;
      }

      const res = await axiosInstance.post(
        "/auth/token",
        {},
        {
          headers: {
            Authorization: `Bearer ${cookies.auth_token}`,
          },
        },
      );

      setCookie("auth_token", res.data.token, {
        path: "/",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        secure: isProduction,
      });

      dispatch(loginSuccess({ user: res.data.user, token: res.data.token }));
      dispatch(initializeSocket());
    } catch (err) {
      console.log(err);
      dispatch(loginFailure());
    }
  };

  const logoutUser = () => {
    removeCookie("auth_token", { path: "/" });
    dispatch(logout());
    dispatch(disconnectSocket()); // Disconnect socket on logout
    toast.success("Logged out successfully");
  };

  return {
    auth,
    socket,
    login,
    signup,
    refershToken,
    logoutUser,
    setAuth,
    isAuthenticated,
  };
};

export default useAuth;
