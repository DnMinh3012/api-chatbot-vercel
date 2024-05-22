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
        return json({ message: "Table not available" });
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
        return json({ message: "Table not available" });
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
        return json({ message: "Table not booked" });
    }
    table.status = "available";
    await table.save();
    reservationRequest.status = "completed";
    await reservationRequest.save();
    return reservationRequest.get({ plain: true });
}


async function findAvailableTable() {
    let availableTables = await Table.findAll({
        where: { status: "available" }
    });

    if (availableTables.length === 0) {
        throw new Error("No available tables found");
    }

    let randomIndex = Math.floor(Math.random() * availableTables.length);
    let selectedTable = availableTables[randomIndex];

    return selectedTable.id;
}
let postBookAppointment = async (data) => {
    console.log(data);
    try {
        // Kiểm tra các tham số bắt buộc
        if (!data.email || !data.phone || !data.timeOrder) {
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

        // Tìm bàn trống
        let tableId = await findAvailableTable();

        // Tạo yêu cầu đặt chỗ
        let reservationRequest = await makeReservationRequest(data.timeOrder, tableId, customerId);

        // Xác nhận yêu cầu đặt chỗ
        let confirmedRequest = await confirmReservationRequest(reservationRequest.id);

        // Trả về yêu cầu đặt chỗ đã xác nhận
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


export {
    findRequestWithCustomerAndTable,
    makeReservationRequest,
    confirmReservationRequest,
    freeReservationRequest,
    findAvailableTable,
    postBookAppointment
}