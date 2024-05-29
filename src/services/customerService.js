import { CustomerModel, ReservationRequestModel, TableModel, TableTypeModel } from "../model/index.js";
import { json } from "sequelize";
import chatBotService from "../services/chatBotService.js";

const IMAGE_MAIN_MENU4 = "https://bit.ly/3PEVSVH"

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
        if (!data.email || !data.phone || !data.timeOrder || !data.TypeId) {
            return {
                errCode: 1,
                message: "Missing required parameters"
            };
        }

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

        let tableType = await TableTypeModel.findOne({
            where: { id: data.TypeId },
            include: [
                {
                    model: TableModel,
                    as: "tables",
                },
            ],
        });

        if (!tableType || !tableType.tables.length) {
            return {
                errCode: 1,
                message: "Table not found"
            };
        }
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

        let reservationRequest = await ReservationRequestModel.create({
            timeOrder: data.timeOrder,
            tableId: selectedTableId,
            customerId: customerId,
        });
        let response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": `Thông tin khách đặt bàn:
                            \nHọ và tên: ${customer.name}
                            \nEmail: ${customer.email}
                            \nSố điện thoại: ${customer.phone}
                            \nNgày đặt bàn: ${reservationRequest.timeOrder}
                            \nLoại bàn: ${tableType.name}`,
                            "image_url": IMAGE_MAIN_MENU4,
                            "buttons": [
                                {
                                    "type": "web_url",
                                    "url": `${process.env.URL_WEB_VIEW_ORDER}/${data.psid}`,
                                    "title": "Thay doi Thoi Gian dat ban",
                                    "webview_height_ratio": "tall",
                                    "messenger_extensions": true
                                },
                                {
                                    "type": "web_url",
                                    "url": `${process.env.URL_WEB_VIEW_EDIT}/${data.psid}/${reservationRequest.id}`,
                                    "title": "Thay doi Thoi Gian dat ban",
                                    "webview_height_ratio": "tall",
                                    "messenger_extensions": true
                                }
                            ],
                        }
                    ]
                }
            }
        };
        await chatBotService.sendMessage(req.body.psid, response1);
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
