export interface EmployeeMin {
  employeeNumber: number;
  employeeName: string;
  reportsTo: number;
}

export interface Employee {
  employeeNumber: number;
  employeeName: string;
  email: string;
  officeCity: string;
  officeCountry: string;
  totalCreditLimit: number;
}
