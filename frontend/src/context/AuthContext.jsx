import { useMemo, useState } from "react";
import { AuthContext } from "./auth-context";

const LOGIN_API_URL = "http://localhost:5001/api/users/login";
const REGISTER_API_URL = "http://localhost:5001/api/users";

function getInitialUser() {
  try {
    const savedUser = localStorage.getItem("todo_user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error("Không đọc được user từ localStorage:", error);
    return null;
  }
}

function getInitialToken() {
  try {
    return localStorage.getItem("todo_token") || "";
  } catch (error) {
    console.error("Không đọc được token từ localStorage:", error);
    return "";
  }
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);
  const [token, setToken] = useState(getInitialToken);

  const login = async (username, password) => {
    try {
      if (!username || !password) {
        return {
          success: false,
          message: "Vui lòng nhập đầy đủ tài khoản và mật khẩu",
        };
      }

      const response = await fetch(LOGIN_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || "Đăng nhập thất bại",
        };
      }

      const loggedInUser = data.user || data.data?.user || null;
      const accessToken = data.token || data.data?.token || "";

      if (!loggedInUser) {
        return {
          success: false,
          message: "Backend không trả về thông tin user",
        };
      }

      localStorage.setItem("todo_user", JSON.stringify(loggedInUser));
      if (accessToken) {
        localStorage.setItem("todo_token", accessToken);
      }

      setUser(loggedInUser);
      setToken(accessToken);

      return {
        success: true,
        user: loggedInUser,
        token: accessToken,
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Không kết nối được server",
      };
    }
  };

  const register = async (payload) => {
    try {
      const { username, email, password, display_name } = payload;
  
      if (!username || !email || !password || !display_name) {
        return {
          success: false,
          message: "Vui lòng nhập đầy đủ thông tin đăng ký",
        };
      }
  
      const response = await fetch(REGISTER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          display_name,
          role: "user",
          active: true,
        }),
      });
  
      const data = await response.json().catch(() => ({}));
  
      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || "Đăng ký thất bại, vui lòng thử lại",
        };
      }
  
      return {
        success: true,
        message: data.message || "Đăng ký thành công",
      };
    } catch (error) {
      console.error("Register error:", error);
      return {
        success: false,
        message: "Không kết nối được server",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("todo_user");
    localStorage.removeItem("todo_token");
    setUser(null);
    setToken("");
  };

  const value = useMemo(() => {
    return {
      user,
      token,
      isAuthenticated: !!user,
      login,
      register,
      logout,
    };
  }, [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}