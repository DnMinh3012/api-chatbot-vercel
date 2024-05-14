'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ReservationRequest extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    ReservationRequest.init({
        customer_id: DataTypes.STRING,
        table_id: DataTypes.STRING,
        timestamps: DataTypes.DATE,
        status: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'ReservationRequest',
    });
    return ReservationRequest;
};