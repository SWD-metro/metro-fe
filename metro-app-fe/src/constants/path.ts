const path = {
  home: "/",
  services: "/services",
  aboutUs: "/about-us",
  buyTicket: "/buy-ticket",
  stationMap: "/station-map",
  profile: "profile",

  auth: "/auth",
  login: "/auth/login",
  register: "/auth/register",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
  verifyOtp: "/auth/verify-otp",
  logout: "/logout",

  admin: "/admin",
} as const;
export default path;
