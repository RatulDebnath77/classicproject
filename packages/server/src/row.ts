import type { RowDataPacket } from "mysql2/promise";
import type {
  Office,
  ProductLine,
  Product,
  FullProduct,
  ProductSold,
  Customer,
  Employee,
  EmployeeMin,
  Order,
  History,
} from "@commonproject/common";

export interface TestRow extends RowDataPacket {
  test: string;
}

export interface OfficeRow extends Office, RowDataPacket {}

export interface ProductLineRow extends ProductLine, RowDataPacket {}

export interface ProductRow extends Product, RowDataPacket {}

export interface FullProductRow extends FullProduct, RowDataPacket {}

export interface ProductSoldRow extends ProductSold, RowDataPacket {}

export interface CustomerRow extends Customer, RowDataPacket {}

export interface EmployeeMinRow extends EmployeeMin, RowDataPacket {}

export interface EmployeeRow extends Employee, RowDataPacket {}

export interface OrderRow extends Order, RowDataPacket {}

export interface HistoryRow extends History, RowDataPacket {}
