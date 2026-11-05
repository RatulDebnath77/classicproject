import type {
  Health,
  ProductLine,
  Product,
  FullProduct,
  ProductSold,
  Customer,
  Employee,
  EmployeeNode,
} from '@commonproject/common'

const API_URL = import.meta.env.API_URL ?? 'http://localhost:3000'

export async function getPing() {
  const res = await fetch(`${API_URL}/ping`)
  return await res.text()
}

export async function getHealth(): Promise<Health> {
  const res = await fetch(`${API_URL}/health`)
  return await res.json()
}

export async function postProductLine(productLine: string) {
  const res = await fetch(`${API_URL}/productline`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productLine }),
  })
  return await res.text()
}

export async function deleteProductLine(productLine: string) {
  const res = await fetch(`${API_URL}/productline/${productLine}`, { method: 'DELETE' })
  return await res.text()
}

export async function getProductLines(): Promise<ProductLine[]> {
  const res = await fetch(`${API_URL}/productlines`)
  return await res.json()
}

export async function getProducts(
  productLine?: string,
  page = 1,
  sort: string = '',
): Promise<Product[]> {
  const params = new URLSearchParams({ sort, page: page.toString() })
  const res = await fetch(`${API_URL}/products${productLine ? `/${productLine}` : ''}?${params}`)
  return await res.json()
}

export async function getProduct(productCode: string): Promise<FullProduct> {
  const res = await fetch(`${API_URL}/product/${productCode}`)
  return await res.json()
}

export async function getProductSold(productCode: string): Promise<ProductSold> {
  const res = await fetch(`${API_URL}/product-sold/${productCode}`)
  return await res.json()
}

export async function getCustomers(employeeNumber: number): Promise<Customer[]> {
  const res = await fetch(`${API_URL}/customers/${employeeNumber}`)
  return await res.json()
}

export async function getSalesReps(): Promise<Employee[]> {
  const res = await fetch(`${API_URL}/sales-reps`)
  return await res.json()
}

export async function getEmployees(): Promise<EmployeeNode[]> {
  const res = await fetch(`${API_URL}/employees`)
  return await res.json()
}
