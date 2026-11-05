import type { EmployeeMin } from "./employee.ts";

export interface EmployeeNode {
  id: number;
  name: string;
  employees: EmployeeNode[];
}

export function findReportsTo(employee: EmployeeMin, nodes: EmployeeNode[]): EmployeeNode | void {
  for (const node of nodes) {
    if (employee.reportsTo === node.id) return node;
    const found = findReportsTo(employee, node.employees);
    if (found) return found;
  }
}
