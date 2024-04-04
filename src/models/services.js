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
            Booking.belongsTo(models.User,
                {
                    foreignKey: 'customerid', targetKey: 'id', as: 'customerData'
                })
        }
    }
    User.init({
        statusid: DataTypes.STRING,
        tableid: DataTypes.STRING,
        customerid: DataTypes.STRING,
        date: DataTypes.DATE,
        timeType: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'services',
    });
    return services;
};