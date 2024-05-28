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

        let tables = await TableTypeModel.findOne({
            where: { id: data.TypeId },
            include: [
                {
                    model: TableModel,
                    as: "tables",
                },
            ],
        });

        if (!tables.tables.length) {
            return {
                errCode: 1,
                message: "Table not found"
            };
        }

        // Chọn ngẫu nhiên một bàn từ danh sách
        let randomIndex = Math.floor(Math.random() * tables.tables.length);
        let selectedTable = tables.tables[randomIndex];
        let selectedTableId = selectedTable.id;
        console.log("Selected Table Id:", selectedTableId);

        if (!selectedTableId) {
            return {
                errCode: 1,
                message: "Selected table not found"
            };
        }

        // Tạo yêu cầu đặt bàn
        let reservationRequest = await ReservationRequestModel.findOrCreate({
            where: {
                customerId: customer.id,
            },
            timeOrder: data.timeOrder,
            tableId: selectedTableId.id,
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


module.exports = {
    findRequestWithCustomerAndTable,
    makeReservationRequest,
    confirmReservationRequest,
    freeReservationRequest,
    findAvailableTableByType,
    postBookAppointment,
};
