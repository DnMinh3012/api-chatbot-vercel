'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    User.init({
        dishName: DataTypes.STRING,
        image: DataTypes.STRING,
        description: DataTypes.STRING,
        menuid: DataTypes.STRING,
        price: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'dish',
    });
    return dish;
};