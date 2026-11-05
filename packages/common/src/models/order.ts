import { type OrderStatus } from "../enums/index.ts";

export interface Order {
  orderNumber: number;
  orderDate: Date;
  requiredDate: Date;
  shippedDate?: Date;
  status: OrderStatus;
  comments?: string;
  quantityOrdered: number;
  priceEach: number;
  productCode: string;
  productName: string;
  productLine: string;
  MSRP: number;
}
