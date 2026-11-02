import mysql, { PoolConnection } from "mysql2/promise";

const pool = mysql.createPool(process.env.DATABASE_URL!);
process.on("SIGTERM", pool.end);

export async function tx(cb: (conn: PoolConnection) => void | Promise<void>, readOnly = true) {
  const conn = await pool.getConnection();
  try {
    await (readOnly ? conn.query("START TRANSACTION READ ONLY") : conn.beginTransaction());
    await cb(conn);
    await conn.commit();
  } catch (err) {
    try {
      await conn.rollback();
    } catch (rollbackErr) {
      console.error(rollbackErr);
    }
    throw err;
  } finally {
    conn.release();
  }
}
