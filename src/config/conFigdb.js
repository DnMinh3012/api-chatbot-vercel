
// Option 3: Passing parameters separately (other dialects)
// const Sequelize = require("sequelize");
// const sequelize = new Sequelize(
//   'vmu',
//   'minh',
//   '123456',
//   {
//     host: '127.0.0.1',
//     dialect: 'mysql'
//   }
// );
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  'heroku_5329a39999b2108',
  'b38f802097bb1a',
  'afc2b8b0',
  {
    host: 'us-cluster-east-01.k8s.cleardb.net',
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