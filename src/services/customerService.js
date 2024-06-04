import { CustomerModel, ReservationRequestModel, TableModel, TableTypeModel } from "../model/index.js";
import { json } from "sequelize";
import chatBotService from "../services/chatBotService.js";

let IMAGE_MAIN_MENU4 = "https://bit.ly/3PEVSVH"

async function findRequestWithCustomerAndTable(id) {
    let data = await ReservationRequestModel.findOne({
        where: { id: id },
        include: [
            {
                model: CustomerModel,
                as: 'customer',
            },
            {
                model: TableModel,
                as: 'table',
                include: [
                    {
                        model: TableTypeModel,
                        as: 'tableType',
                    }
                ]
            }
        ]
    });
    return data.get({ plain: true });
}

async function makeReservationRequest(
    timeOrder,
    tableId,
    customerId
) {
    let table = await TableModel.findByPk(tableId);
    if (table === null) {
        throw new Error("Table not found");
    }
    if (table.status !== "available") {
        throw new Error("Table not available");
    }
    let customer = await CustomerModel.findByPk(customerId);
    if (customer === null) {
        throw new Error("Customer not found");
    }
    let reservationRequest = await ReservationRequestModel.create({
        timeOrder: timeOrder,
        tableId: tableId,
        customerId: customerId,
    });
    await reservationRequest.save();
}

async function confirmReservationRequest(id) {
    let reservationRequest = await ReservationRequestModel.findByPk(id);
    if (reservationRequest === null) {
        throw new Error("Reservation request not found");
    }
    let table = await TableModel.findByPk(reservationRequest.tableId);
    if (table === null) {
        throw new Error("Table not found");
    }
    if (table.status !== "available") {
        throw new Error("Table not available");
    }
    table.status = "booked";
    await table.save();
    reservationRequest.status = "approved";
    await reservationRequest.save();
}

async function freeReservationRequest(id) {
    let reservationRequest = await ReservationRequestModel.findByPk(id);
    if (reservationRequest === null) {
        throw new Error("Reservation request not found");
    }
    let table = await TableModel.findByPk(reservationRequest.tableId);
    if (table === null) {
        throw new Error("Table not found");
    }
    if (table.status !== "booked") {
        throw new Error("Table not booked");
    }
    table.status = "available";
    await table.save();
    reservationRequest.status = "completed";
    await reservationRequest.save();
}

async function findAvailableTableByType(tableTypeId) {
    let tableType = await TableTypeModel.findOne({
        where: { id: tableTypeId },
        include: [
            {
                model: TableModel,
                as: "tables",
            },
        ],
    });
    let randomIndex = Math.floor(Math.random() * availableTables.length);
    let availableTables = tableType.tables;
    let SelectedTable = availableTables[randomIndex]

    if (!availableTables) {
        throw new Error("No available tables found");
    }
    console.log("Table Selected:", SelectedTable.id)
    return SelectedTable.id;
}
let RequestId = "";
let postBookAppointment = async (data) => {
    console.log("Customer Data:", data);

    // Validate required parameters
    if (!data.email || !data.phone || !data.timeOrder || !data.TypeId) {
        return {
            errCode: 1,
            message: "Missing required parameters"
        };
    }

    try {
        // Find or create the customer
        let [customer, created] = await CustomerModel.findOrCreate({
            where: {
                email: data.email,
                phone: data.phone
            },
            defaults: {
                name: data.name
            }
        });
        let customerId = customer.id;
        console.log("Customer Id:", customerId);

        // Find the table type with tables
        let tableType = await TableTypeModel.findOne({
            where: { id: data.TypeId },
            include: [
                {
                    model: TableModel,
                    as: "tables",
                }
            ],
        });

        if (!tableType || !tableType.tables.length) {
            return {
                errCode: 1,
                message: "Table not found"
            };
        }

        // Select a random table from the available tables
        let randomIndex = Math.floor(Math.random() * tableType.tables.length);
        let selectedTable = tableType.tables[randomIndex];
        let selectedTableId = selectedTable.id;
        console.log("Selected Table Id:", selectedTableId);

        if (!selectedTableId) {
            return {
                errCode: 1,
                message: "Selected table not found"
            };
        }

        // Create a reservation request
        let reservationRequest = await ReservationRequestModel.create({
            timeOrder: data.timeOrder,
            tableId: selectedTableId,
            customerId: customerId,
        });

        return {
            errCode: 0,
            message: "Booking successful",
            data: reservationRequest
        };

    } catch (e) {
        console.error("Error in postBookAppointment:", e);
        return {
            errCode: 2,
            message: e.message
        };
    }
};

let EditAppointment = async (data) => {
    console.log("Customer Data:", data);

    // Validate required parameters
    if (!data.email || !data.phone || !data.timeOrder || !data.reservationRequest) {
        return {
            errCode: 1,
            message: "Missing required parameters"
        };
    }
    try {
        let reservation = await ReservationRequestModel.findOne({ where: { id: data.reservationRequestId } });
        let table = await TableModel.findOne({ where: { id: reservation.tableId } });
        let customer = await CustomerModel.findOne({ where: { id: reservation.customerId } });
        customer.email = data.email;
        customer.phone = data.phone;
        reservation.timeOrder = data.timeOrder;
        table.numberOfSeats = data.numberOfSeats

        reservation.save();
        table.save();
        customer.save();

        return {
            errCode: 0,
            message: "Update Booking successful",
            data: reservationRequest
        };

    } catch (e) {
        console.error("Error in Update Booking:", e);
        return {
            errCode: 2,
            message: e.message
        };
    }
};
let DeleteAppointment = async (data) => {
    console.log("Customer Data:", data);
    if (!data.email || !data.phoneNumber || !data.reservationRequestId) {
        return {
            errCode: 1,
            message: "Missing required parameters"
        };
    }

    try {
        let result = await ReservationRequestModel.destroy({
            where: { id: data.reservationRequestId },
        });

        if (result === 0) {
            return {
                errCode: 3,
                message: "No reservation found with the provided ID",
            };
        }

        return {
            errCode: 0,
            message: "Delete successful",
        };

    } catch (e) {
        console.error("Error in DeleteAppointment:", e);
        return {
            errCode: 2,
            message: e.message
        };
    }
};

module.exports = {
    findRequestWithCustomerAndTable,
    makeReservationRequest,
    confirmReservationRequest,
    freeReservationRequest,
    findAvailableTableByType,
    postBookAppointment,
    RequestId,
    DeleteAppointment,
    EditAppointment
};
