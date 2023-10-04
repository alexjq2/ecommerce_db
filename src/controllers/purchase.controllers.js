const catchError = require('../utils/catchError');
const Purchase = require('../models/Purchase');
const Cart = require('../models/Cart');

const getAll = catchError(async (req, res) => {
    const {id} = req.user
    const purchase = await Purchase.findAll({
        include: [Product],
        where: {userId: id}
    });
    return res.json(purchase);
});

const create = catchError(async (req, res) => {
    const {id} = req.user;
    const carts = await Cart.findAll({
        where: {id},
        attributes: ['userId', 'productId', 'quantity'],
        raw: true
    });
    const purchase = await Purchase.bulkCreate(carts);
    await Cart.destroy({where: {id}});
    return res.status(201).json(purchase);
});

module.exports = {
    getAll,
    create
};