import sequelize from "../config/database.js";
import {DataTypes} from "sequelize";

const DishMenu = sequelize.define("dish_menu", {
    menuId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: "menu_id",
    },
    dishId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: "dish_id",
    },

}, {
    timestamps: false,
});

export default DishMenu;