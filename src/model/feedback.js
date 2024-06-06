import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Feedback = sequelize.define("feedback", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    content: {
        type: DataTypes.STRING,
    },
    ReservationRequestid: {
        field: "reservationRequest_id",
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

export default Feedback;