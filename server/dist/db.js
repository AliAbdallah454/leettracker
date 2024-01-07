import mysql2 from 'mysql2';
import env from 'dotenv';
env.config();
const pool = mysql2.createPool({
    host: "localhost",
    user: "root",
    database: "ts_db",
    password: process.env.DB_PASSWORD
});
const promisePool = pool.promise();
export { promisePool };
//# sourceMappingURL=db.js.map