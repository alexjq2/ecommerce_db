const catchError = require('../utils/catchError');
const Purchase = require('../models/Purchase');
const Cart = require('../models/Cart');
const Image = require('../models/Image');
const Product = require('../models/Product');


const getAll = catchError(async (req, res) => {
    const userId = req.user.id
    const purchase = await Purchase.findAll({
        where: {userId: userId},
        include: [{
            model: Product,
            include: [Image]
        }],
    });
    return res.json(purchase);
});

const create = catchError(async (req, res) => {
    const userId = req.user.id
    const carts = await Cart.findAll({
        where: {userId},
        attributes: ['userId', 'productId', 'quantity'],
        raw: true
    });
    const purchase = await Purchase.bulkCreate(carts);
    await Cart.destroy({where: {userId}});
    return res.status(201).json(purchase);
});

module.exports = {
    getAll,
    create
};