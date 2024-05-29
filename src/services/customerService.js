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

const postBookAppointment = async (data) => {
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
        const [customer, created] = await CustomerModel.findOrCreate({
            where: {
                email: data.email,
                phone: data.phone
            },
            defaults: {
                name: data.name
            }
        });
        const customerId = customer.id;
        console.log("Customer Id:", customerId);

        // Find the table type with tables
        const tableType = await TableTypeModel.findOne({
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
        const randomIndex = Math.floor(Math.random() * tableType.tables.length);
        const selectedTable = tableType.tables[randomIndex];
        const selectedTableId = selectedTable.id;
        console.log("Selected Table Id:", selectedTableId);

        if (!selectedTableId) {
            return {
                errCode: 1,
                message: "Selected table not found"
            };
        }

        // Create a reservation request
        const reservationRequest = await ReservationRequestModel.create({
            timeOrder: data.timeOrder,
            tableId: selectedTableId,
            customerId: customerId,
        });

        // Prepare the response payload for the chatbot
        // const response = {
        //     "attachment": {
        //         "type": "template",
        //         "payload": {
        //             "template_type": "generic",
        //             "elements": [
        //                 {
        //                     "title": `Thông tin khách đặt bàn:
        //                     \nHọ và tên: ${customer.name}
        //                     \nEmail: ${customer.email}
        //                     \nSố điện thoại: ${customer.phone}
        //                     \nNgày đặt bàn: ${reservationRequest.timeOrder}
        //                     \nLoại bàn: ${tableType.name}`,
        //                     "image_url": IMAGE_MAIN_MENU4,
        //                     "buttons": [
        //                         {
        //                             "type": "web_url",
        //                             "url": `${process.env.URL_WEB_VIEW_ORDER}/${data.psid}`,
        //                             "title": "Thay đổi Thời Gian đặt bàn",
        //                             "webview_height_ratio": "tall",
        //                             "messenger_extensions": true
        //                         },
        //                         {
        //                             "type": "web_url",
        //                             "url": `${process.env.URL_WEB_VIEW_EDIT}/${data.psid}/${reservationRequest.id}`,
        //                             "title": "Thay đổi Thời Gian đặt bàn",
        //                             "webview_height_ratio": "tall",
        //                             "messenger_extensions": true
        //                         }
        //                     ],
        //                 }
        //             ]
        //         }
        //     }
        // };
        let response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Vimaru restaurant",
                            "subtitle": "Xin cảm ơn bạn đã tin tưởng nhà hàng chúng tôi, xin hãy để lại đánh giá để bọn tôi có thể phục vụ bạn tốt hơn trong lần sau",
                            "image_url": "https://bit.ly/imageToSend",
                            "buttons": [
                                {
                                    "type": "web_url",
                                    "url": `${process.env.URL_WEB_VIEW_EDIT}/${data.psid}/${reservationRequest.id}`,
                                    "title": "Thay doi",
                                    "webview_height_ratio": "tall",
                                    "messenger_extensions": true
                                },
                                {
                                    "type": "web_url",
                                    "url": `${process.env.URL_WEB_VIEW_EDIT}/${data.psid}`,
                                    "title": "Đặt bàn",
                                    "webview_height_ratio": "tall",
                                    "messenger_extensions": true
                                }
                            ],
                        }]
                }
            }
        };

        // Send the response message via chatbot service
        await chatBotService.sendMessage(data.psid, response);

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
