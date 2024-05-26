import { CustomerModel, ReservationRequestModel, TableModel, TableTypeModel } from "../model/index.js";
import { json } from "sequelize";

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
    return reservationRequest.get({ plain: true });
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
    return reservationRequest.get({ plain: true });
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
    return reservationRequest.get({ plain: true });
}

async function findAvailableTableByType(tableTypeId) {
    let availableTables = await TableModel.findAll({
        where: { status: "available", typeId: tableTypeId }
    });

    if (availableTables.length === 0) {
        throw new Error("No available tables found");
    }

    let randomIndex = Math.floor(Math.random() * availableTables.length);
    let selectedTable = availableTables[randomIndex];

    return selectedTable.id;
}

let postBookAppointment = async (data) => {
    console.log("Customer Data:", data);
    try {
        // Kiểm tra các tham số bắt buộc
        if (!data.email || !data.phone || !data.timeOrder || !data.TypeId) {
            return {
                errCode: 1,
                message: "Missing required parameters"
            };
        }

        // Tìm hoặc tạo khách hàng theo email và phone
        let customer = await CustomerModel.findOrCreate({
            where: {
                email: data.email,
                phone: data.phone
            },
            defaults: {
                name: data.name
            }
        });

        let customerId = customer[0].id;

        // Tìm bàn khả dụng theo loại bàn
        let selectedTableId = await findAvailableTableByType(data.TypeId);

        // Tạo yêu cầu đặt bàn
        let reservationRequest = await makeReservationRequest(data.timeOrder, selectedTableId, customerId);

        // Xác nhận yêu cầu đặt bàn
        let confirmedRequest = await confirmReservationRequest(reservationRequest.id);

        return {
            errCode: 0,
            message: "Booking successful",
            data: confirmedRequest
        };

    } catch (e) {
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
};
