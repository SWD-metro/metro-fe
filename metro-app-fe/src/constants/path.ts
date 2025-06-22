const path = {
  home: "/",
  services: "/services",
  aboutUs: "/about-us",
  buyTicket: "/buy-ticket",
  stationMap: "/station-map",
  profile: "profile",
  orderPage: "/order/:type/:slug",
  paymentResult: "/payment-result",

  auth: "/auth",
  login: "/auth/login",
  register: "/auth/register",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
  verifyOtp: "/auth/verify-otp",
  logout: "/logout",
  oauth2: "/oauth2/redirect",

  admin: "/admin",
} as const;
export default path;
