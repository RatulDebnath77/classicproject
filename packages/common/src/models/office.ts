export interface Office {
  officeCode: number;
  city: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  state?: string;
  country: string;
  postalCode: string;
  territory: string;
}
