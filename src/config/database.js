import { Sequelize } from "sequelize";

// import from .env file
import dotenv from "dotenv";

dotenv.config();
const { DB_DATABASE, DB_USERNAME, DB_PASSWORD, DB_HOST } = process.env;

const sequelize = new Sequelize(
  DB_DATABASE,
  DB_USERNAME,
  DB_PASSWORD,
  {
    host: DB_HOST,
    dialect: "mysql",
    logging: false
  }
);

// check connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

export default sequelize;
