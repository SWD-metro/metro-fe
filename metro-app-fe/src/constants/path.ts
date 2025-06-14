const path = {
  home: "/",
  login: "/auth/login",
  register: "/auth/register",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
  verifyOtp: "/auth/verify-otp",
  logout: "/logout",
  services: "/services",
  aboutUs: "/about-us",
  buyTicket: "/buy-ticket",
  stationMap: "/station-map",
  profile: "profile",
} as const;
export default path;
