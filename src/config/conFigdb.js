
// Option 3: Passing parameters separately (other dialects)
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  'vmu',
  'minh',
  '123456',
  {
    host: '127.0.0.1',
    dialect: 'mysql'
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