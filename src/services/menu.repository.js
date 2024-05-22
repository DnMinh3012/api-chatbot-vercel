import {DishModel, DishTypeModel, MenuModel} from "../model/index.js";

async function findMenuWithDishes(id) {
    let data =  await MenuModel.findOne({
        where: {id: id},
        include: [{
            model: DishModel,
            as: 'dishes',
            include: [
                {
                    model: DishTypeModel,
                    as: 'dishType',
                }
            ]
        }],
    });
    return data.get({plain: true});
}

export {
    findMenuWithDishes
}