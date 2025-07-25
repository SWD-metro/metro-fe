const path = {
  home: "/",
  services: "/services",
  aboutUs: "/about-us",
  buyTicket: "/buy-ticket",
  stationMap: "/station-map",
  profile: "profile",
  orderPage: "/order/:type/:slug",
  paymentResult: "/payment-result",
  myTicket: "/my-tickets",
  orderHistory: "/order-history",
  changePassword: "/change-password",
  studentRequest: "/student-request",
  feedback: "/feedback",

  auth: "/auth",
  login: "/auth/login",
  register: "/auth/register",
  verifyOtp: "/auth/verify-otp",
  logout: "/logout",
  oauth2: "/login",

  admin: "/admin",
  dashboard: "/admin/dashboard",
} as const;
export default path;
