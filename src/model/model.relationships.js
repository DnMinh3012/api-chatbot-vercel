import Customer from "./customer.js";
import DishType from "./dish_type.js";
import Dish from "./dish.js";
import Menu from "./menu.js";
import DishMenu from "./dish_menus.js";
import TableType from "./table_types.js";
import Table from "./table.js";
import ReservationRequest from "./reservation_request.js";
import User from "./user.js";

Dish.belongsTo(DishType, {
    foreignKey: "dish_type_id",
    as: "dishType",
});

Menu.belongsToMany(Dish, {
    through: DishMenu,
    as: "dishes",
    foreignKey: "menu_id",
});
Dish.belongsToMany(Menu, { through: DishMenu });

Table.belongsTo(TableType, {
    foreignKey: "table_type_id",
    as: "tableType",
});

ReservationRequest.belongsTo(Table, {
    foreignKey: "table_id",
    as: "table",
});

ReservationRequest.belongsTo(Customer, {
    foreignKey: "customer_id",
    as: "customer",
});

export {
    Customer,
    DishType,
    Dish,
    DishMenu,
    Menu,
    TableType,
    Table,
    ReservationRequest,
    User,
}