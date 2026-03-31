import * as authService from "../services/auth.service.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Register
export const register = async (req, res) => {
  const { user, accessToken, refreshToken } =
    await authService.register(req.body);

  res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

  res.status(201).json({
    status: "success",
    data: {
      user,
      accessToken,
    },
  });
};

// Login
export const login = async (req, res) => {
  const { user, accessToken, refreshToken } =
    await authService.login(req.body);

  res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

  res.status(200).json({
    status: "success",
    data: {
      user,
      accessToken,
    },
  });
};

// Refresh
export const refresh = async (req, res) => {
  const { refreshToken } = req.cookies;

  const {
    accessToken,
    refreshToken: newRefreshToken,
  } = await authService.refresh(refreshToken);

  res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);

  res.status(200).json({
    status: "success",
    data: { accessToken },
  });
};

// Logout
export const logout = async (req, res) => {
  await authService.logout(req.cookies.refreshToken);

  res.clearCookie("refreshToken");

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};