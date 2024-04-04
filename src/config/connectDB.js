const { Sequelize } = require('sequelize');
// Option 2: Passing parameters separately (sqlite)
const sequelize = new Sequelize('sql6696672', 'sql6696672', 'JKWByPJCeQ', {
    host: 'sql6.freesqldatabase.com',
    dialect: 'mysql',
});
let connectDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
module.exports = connectDb;
