import express, { type Request, type Response } from "express";
import cors from "cors";
import { tx } from "./db.ts";
import type {
  CustomerRow,
  EmployeeMinRow,
  EmployeeRow,
  FullProductRow,
  OfficeRow,
  ProductLineRow,
  ProductRow,
  ProductSoldRow,
  TestRow,
} from "./row.ts";
import { coerceInt, type EmployeeNode, findReportsTo } from "@commonproject/common";
import { type ResultSetHeader } from "mysql2";

const port = 3000;

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (_req: Request, res: Response) => {
  res.redirect("http://localhost:5173");
});

app.get("/ping", (_req: Request, res: Response) => {
  res.type("text");
  res.send("pong");
});

app.get("/health{/:test}", (req: Request, res: Response) => {
  return tx(async (conn) => {
    let health;
    try {
      const [result] = await conn.execute<TestRow[]>("SELECT ? AS test", [
        (req.params.test ??= "test"),
      ]);
      health = result[0].test == req.params.test;
    } catch (err) {
      console.error(err);
      health = false;
    }
    res.json({ health });
  });
});

app.get("/offices", (_req: Request, res: Response) => {
  return tx(async (conn) => {
    const [result] = await conn.execute<OfficeRow[]>(
      "SELECT officeCode, city, phone, addressLine1, addressLine2, state, country, postalCode, territory FROM offices",
    );
    res.json(result);
  });
});

app.get("/productlines", (_req: Request, res: Response) => {
  return tx(async (conn) => {
    const [result] = await conn.execute<ProductLineRow[]>(
      "SELECT productLine, textDescription FROM productlines",
    );
    res.json(result);
  });
});

app.post("/productline", (req: Request, res: Response) => {
  return tx(async (conn) => {
    const [result] = await conn.execute<ResultSetHeader>(
      "INSERT INTO productlines(productLine) VALUES(?)",
      [req.body.productLine],
    );
    res.json(result.info);
  }, false);
});

app.delete("/productline/:productLine", (req: Request, res: Response) => {
  return tx(async (conn) => {
    const [result] = await conn.execute<ResultSetHeader>(
      "" + "DELETE FROM productlines WHERE productLine = ?",
      [req.params.productLine],
    );
    res.json(result.info);
  }, false);
});

app.get("/products{/:productLine}", (req: Request, res: Response) => {
  const productLine = req.params.productLine ?? null;
  let sort;
  switch (((req.query.sort as string) ?? "").toLowerCase()) {
    case "asc":
      sort = "ORDER BY quantityInStock";
      break;
    case "desc":
      sort = "ORDER BY quantityInStock DESC";
      break;
    default:
      sort = "";
      break;
  }
  const page = coerceInt(req.query.page, 1, 1, 20);
  const size = coerceInt(req.query.size, 18, 1, 20);

  return tx(async (conn) => {
    const [result] = await conn.execute<ProductRow[]>(
      `SELECT productCode, productName, productLine, productDescription, productVendor, quantityInStock FROM products WHERE (? IS NULL OR productLine = ?) ${sort} LIMIT ? OFFSET ?`,
      [productLine, productLine, size, (page - 1) * size],
    );
    res.json(result);
  });
});

app.get("/product/:productCode", (req: Request, res: Response) => {
  return tx(async (conn) => {
    const [result] = await conn.execute<FullProductRow[]>(
      "SELECT productCode, productName, productLine, productScale, productVendor, productDescription, quantityInStock, buyPrice, MSRP FROM products WHERE productCode = ?",
      [req.params.productCode],
    );
    if (result.length) {
      res.json(result[0]);
    } else {
      res.sendStatus(404);
    }
  });
});

app.get("/product-sold/:productCode", (req: Request, res: Response) => {
  let day = coerceInt(req.query.day, 30, 1, 60);
  day *= 1000;

  return tx(async (conn) => {
    const [result] = await conn.execute<ProductSoldRow[]>(
      `
            SELECT COALESCE(COUNT(1), 0) AS reviewCount,
            COALESCE(SUM(od.quantityOrdered), 0) AS productSold,
            COALESCE(MIN(od.priceEach), 0) AS lowestPrice
            FROM orderdetails od JOIN orders o ON od.orderNumber = o.orderNumber
            WHERE od.productCode = ? AND o.orderDate > CURRENT_DATE() - INTERVAL ? DAY
        `,
      [req.params.productCode, day],
    );
    res.json(result[0]);
  });
});

app.get("/sales-reps", (req: Request, res: Response) => {
  return tx(async (conn) => {
    const [result] = await conn.execute<EmployeeRow[]>(
      `
            SELECT e.employeeNumber, CONCAT(e.firstName, ' ', e.lastName) AS employeeName, e.email,
                   o.city AS officeCity, o.country AS officeCountry, COALESCE(SUM(c.creditLimit), 0) AS totalCreditLimit
            FROM employees e JOIN offices o ON e.officeCode = o.officeCode JOIN customers c ON e.employeeNumber = c.salesRepEmployeeNumber
            WHERE e.jobTitle = 'Sales Rep'
            GROUP BY e.employeeNumber, e.firstName, e.lastName, e.email, e.jobTitle`,
    );
    res.json(result);
  });
});

app.get("/employees", (req: Request, res: Response) => {
  return tx(async (conn) => {
    const [result] = await conn.execute<EmployeeMinRow[]>(
      `SELECT employeeNumber, CONCAT(firstName, ' ', lastName) AS employeeName, reportsTo FROM employees`,
    );

    const employees: EmployeeNode[] = [];
    while (result.length) {
      for (const employee of result) {
        const found = employee.reportsTo
          ? findReportsTo(employee, employees)
          : { id: 0, name: "", employees };
        if (found) {
          found.employees.push({
            id: employee.employeeNumber,
            name: employee.employeeName,
            employees: [],
          });
          result.splice(result.indexOf(employee), 1);
          break;
        }
      }
    }
    res.json(employees);
  });
});

app.get("/customers/:employeeNumber", (req: Request, res: Response) => {
  return tx(async (conn) => {
    const [result] = await conn.execute<CustomerRow[]>(
      `SELECT customerNumber, customerName, phone, city, country FROM customers WHERE salesRepEmployeeNumber = ?`,
      [req.params.employeeNumber],
    );
    res.json(result);
  });
});

const server = app.listen(port).on("listening", () => {
  console.log(`Listening on port ${port}`);
});
process.on("SIGTERM", server.close);
