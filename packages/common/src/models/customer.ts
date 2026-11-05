export interface Customer {
  customerNumber: number;
  customerName: string;
  contactName: string;
  phone: string;
  city: string;
  state?: string;
  country: string;
  creditLimit: number;
}
