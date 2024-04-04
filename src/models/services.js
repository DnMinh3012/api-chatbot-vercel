'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class services extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            services.belongsTo(models.User,
                {
                    foreignKey: 'customerid', targetKey: 'id', as: 'customerData'
                })
        }
    }
    services.init({
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