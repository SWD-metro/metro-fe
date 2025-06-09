export interface ResponseApi<Data> {
  status: number;
  message: string;
  data?: Data;
}
