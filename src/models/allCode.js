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
            Allcode.hasMany(models.User, { foreignKey: 'roleid', as: 'poisitionData' })
        }
    }
    User.init({
        key: DataTypes.STRING,
        type: DataTypes.STRING,
        ValueEn: DataTypes.BOOLEAN,
        valueVi: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'allCode',
    });
    return allCode;
};