import sequelize from "../config/database.js";
import {DataTypes} from "sequelize";

const Table = sequelize.define("table", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    image: {
        type: DataTypes.STRING,
        notNull: false,
    },
    numberOfSeats: {
        field: "number_of_seats",
        type: DataTypes.INTEGER,
    },
    status: {
        type: DataTypes.ENUM("available", "booked"),
        defaultValue: "available",
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

export default Table;

