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
        name: DataTypes.STRING,
        image: DataTypes.STRING,
        description: DataTypes.STRING,
        status: DataTypes.STRING,
        number_of_seats: DataTypes.INTEGER,
        table_type_id: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'table',
    });
    return table;
};