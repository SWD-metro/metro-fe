export interface ApiResponse<Data> {
  status: number;
  message: string;
  data?: Data;
}
