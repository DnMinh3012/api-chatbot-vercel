import Customer from "./customer.js";
import DishType from "./dish_type.js";
import Dish from "./dish.js";
import Menu from "./menu.js";
import DishMenu from "./dish_menus.js";
import TableType from "./table_types.js";
import Table from "./table.js";
import ReservationRequest from "./reservation_request.js";
import User from "./user.js";
import Feedback from "./feedback.js"

Dish.belongsTo(DishType, {
    foreignKey: "dish_type_id",
    as: "dishType",
});

Menu.belongsToMany(Dish, {
    through: DishMenu,
    as: "dishes",
    foreignKey: "menu_id",
});


Table.belongsTo(TableType, {
    foreignKey: "table_type_id",
    as: "tableType",
});
TableType.hasMany(Table, {
    foreignKey: "table_type_id",
    as: "tables",
});

ReservationRequest.belongsTo(Table, {
    foreignKey: "table_id",
    as: "table",
});

ReservationRequest.belongsTo(Customer, {
    foreignKey: "customer_id",
    as: "customer",
});

Feedback.belongsTo(ReservationRequest, {
    foreignKey: "reservation_request_id",
    as: "reservationRequest",
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
    Feedback
}