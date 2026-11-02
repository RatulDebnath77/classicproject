import type { RowDataPacket } from "mysql2/promise";
import type { Office, ProductLine, Product, FullProduct } from "@commonproject/common";

export interface TestRow extends RowDataPacket {
  test: string;
}

export interface OfficeRow extends Office, RowDataPacket {}

export interface ProductLineRow extends ProductLine, RowDataPacket {}

export interface ProductRow extends Product, RowDataPacket {}

export interface FullProductRow extends FullProduct, RowDataPacket {}
