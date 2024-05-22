import {DataTypes} from "sequelize";
import sequelize from "../config/database.js";

const DishType = sequelize.define("dish_type", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
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

export default DishType;
