import {DataTypes} from "sequelize";
import sequelize from "../config/database.js";

const ReservationRequest = sequelize.define("reservation_request", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    timeOrder: {
        field: "time_order",
        type: DataTypes.DATE,
    },
    status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
    },
    customerId: {
        field: "customer_id",
        type: DataTypes.INTEGER,
        foreignKey: true,
    },
    tableId: {
        field: "table_id",
        type: DataTypes.INTEGER,
        foreignKey: true,
    },
    createdAt: {
        field: "created_at",
        type: DataTypes.DATE,
    },
    updatedAt: {
        field: "updated_at",
        type: DataTypes.DATE,
    },
});

export default ReservationRequest;
