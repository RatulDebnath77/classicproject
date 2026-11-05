import { type OrderStatus } from "../enums/index.ts";

export interface Order {
  orderNumber: number;
  orderDate: Date;
  requiredDate: Date;
  shippedDate: Date;
  status: OrderStatus;
  comments?: string;
}
