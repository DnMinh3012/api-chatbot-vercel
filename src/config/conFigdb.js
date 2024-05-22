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

let connectDB = async () => { //async ham bat dong bo: can thoi gian de tra ket qua
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = connectDB;