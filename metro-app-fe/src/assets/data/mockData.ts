import { RouteWithStations } from "src/types/routes.type";
import { StationsResponse } from "src/types/stations.type";
import { TicketTypeResponse } from "src/types/tickets.type";
import { AuthProvider, User } from "src/types/user.type";

const generateNumericId = () => Date.now() + Math.floor(Math.random() * 1000);

export const initialUsers: User[] = [
  {
    userId: generateNumericId(),
    name: "Admin A",
    email: "admin.a@metro.hcm",
    role: "admin",
    authProvider: AuthProvider.LOCAL,
    isStudent: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    username: "",
  },
  {
    userId: generateNumericId(),
    name: "User B",
    email: "user.b@example.com",
    role: "user",
    authProvider: AuthProvider.LOCAL,
    isStudent: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    username: "",
  },
  {
    userId: generateNumericId(),
    name: "User C",
    email: "user.c@example.com",
    role: "user",
    authProvider: AuthProvider.LOCAL,
    isStudent: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    username: "",
  },
];

export const initialRoutes: RouteWithStations[] = [
  {
    routeId: 1,
    routeName: "Tuyến số 1: Bến Thành - Suối Tiên",
    routeCode: "L1-BTST",
    distanceInKm: 19.7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stations: [],
  },
  {
    routeId: 2,
    routeName: "Tuyến số 2: Bến Thành - Tham Lương",
    routeCode: "L2-BTTL",
    distanceInKm: 11.2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stations: [],
  },
];

export const initialTicketTypes: TicketTypeResponse[] = [
  {
    id: generateNumericId(),
    name: "Vé lượt",
    description: "Vé đi một lượt trên một tuyến",
    price: 15000,
    validityDuration: 1, // Valid for 1 day (or could be 0 for immediate use/no duration)
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateNumericId(),
    name: "Vé tháng (toàn tuyến)",
    description: "Vé đi không giới hạn trong 30 ngày",
    price: 300000,
    validityDuration: 30, // Valid for 30 days
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateNumericId(),
    name: "Vé tuần",
    description: "Vé đi không giới hạn trong 7 ngày",
    price: 80000,
    validityDuration: 7,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateNumericId(),
    name: "Vé sinh viên (3 tháng)",
    description: "Vé ưu đãi cho sinh viên, có giá trị trong 3 tháng",
    price: 250000,
    validityDuration: 90, // Approximately 3 months
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateNumericId(),
    name: "Vé khứ hồi",
    description: "Vé đi hai lượt trong cùng một ngày",
    price: 25000,
    validityDuration: 1, // Valid for 1 day for a round trip
    isActive: false, // Example of an inactive ticket type
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const initialStations: StationsResponse[] = [
  {
    stationId: generateNumericId(),
    stationCode: "NHTP",
    name: "Ga Nhà hát Thành phố",
    address: "123 Đồng Khởi, Q1",
    latitude: 10.7766,
    longitude: 106.7023,
    sequenceOrder: 1,
    status: "under_construction",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    routeId: 1,
  },
  {
    stationId: generateNumericId(),
    stationCode: "BAS",
    name: "Ga Ba Son",
    address: "2 Tôn Đức Thắng, Q1",
    latitude: 10.7801,
    longitude: 106.7098,
    sequenceOrder: 2,
    status: "under_construction",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    routeId: 1,
  },
  {
    stationId: generateNumericId(),
    stationCode: "TD",
    name: "Ga Tao Đàn",
    address: "56 Trương Định, Q3",
    latitude: 10.7725,
    longitude: 106.6925,
    sequenceOrder: 1,
    status: "operational",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    routeId: 2,
  },
  {
    stationId: generateNumericId(),
    stationCode: "DC",
    name: "Ga Dân Chủ",
    address: "32 CMT8, Q3",
    latitude: 10.7828,
    longitude: 106.6833,
    sequenceOrder: 2,
    status: "operational",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    routeId: 2,
  },
];
