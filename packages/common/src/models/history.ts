import { type CreditType } from "../enums/index.ts";

export interface History {
  id: string;
  type: CreditType;
  amount: number;
  date: Date;
}
