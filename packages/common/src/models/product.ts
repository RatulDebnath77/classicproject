export interface Product {
  productCode: string;
  productName: string;
  productDescription: string;
  quantityInStock: number;
  productLine: string;
  productVendor: string;
}

export interface FullProduct extends Product {
  productScale: string;
  buyPrice: number;
  MSRP: number;
}
