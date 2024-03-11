import sqlConfig from "./config";

const mssql = require("mssql");

class DBconn {
  static async pool(sqlConfig) {
    return await mssql.connect(sqlConfig);
  }
}

const pool = DBconn.pool(sqlConfig);
export { DBconn, pool };
