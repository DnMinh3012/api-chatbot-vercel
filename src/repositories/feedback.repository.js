import {FeedbackModel} from "../model";

const makeFeedback = async (reservationRequestId, content) => {
    return await FeedbackModel.create({
        content,
        reservationRequestId,
    });
}

module.exports = {
    makeFeedback,
}