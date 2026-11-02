import express, { type Request, type Response } from "express";
import cors from "cors";
import { tx } from "./db.ts";
import type { FullProductRow, OfficeRow, ProductLineRow, ProductRow, TestRow } from "./row.ts";
import { coerceInt } from "@commonproject/common";
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
  const size = coerceInt(req.query.size, 10, 1, 20);

  return tx(async (conn) => {
    const [result] = await conn.execute<ProductRow[]>(
      `SELECT productCode, productName, productDescription, quantityInStock, MSRP FROM products WHERE (? IS NULL OR productLine = ?) ${sort} LIMIT ? OFFSET ?`,
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

const server = app.listen(port).on("listening", () => {
  console.log(`Listening on port ${port}`);
});
process.on("SIGTERM", server.close);
