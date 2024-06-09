import {DataTypes} from "sequelize";
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
    createdAt: {
        field: "created_at",
        type: DataTypes.DATE,
    },

    reservationRequest: {
        field: "reservation_request_id",
        type: DataTypes.INTEGER,
        foreignKey: true,
    },

    updatedAt: {
        field: "updated_at",
        type: DataTypes.DATE,
    },
});

export default Feedback;