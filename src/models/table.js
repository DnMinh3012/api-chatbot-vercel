'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class table extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    table.init({
        tableName: DataTypes.STRING,
        image: DataTypes.STRING,
        description: DataTypes.STRING,
        statusid: DataTypes.STRING,
        currentNumber: DataTypes.INTEGER,
        maxNumber: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'table',
    });
    return table;
};