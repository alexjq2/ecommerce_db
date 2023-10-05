const catchError = require('../utils/catchError');
const Product = require('../models/Product');
const Image = require('../models/Image');
const Cart = require('../models/Cart');


const getAll = catchError(async (req, res) => {
    const {id} = req.user
    const cart = await Cart.findAll({
        include: [{
            model: Product,
            include: [Image]
        }],
        where: {userId: id}
    });
    return res.json(cart);
});

const create = catchError(async (req, res) => {
    const {productId, quantity} = req.body;
    const cart = await Cart.create({
        productId,
        quantity,
        userId: req.user.id
    });
    return res.status(201).json(cart);
});

const remove = catchError(async (req, res) => {
    const { id } = req.params;
    await Cart.destroy({ where: { id } });
    return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
    const { id } = req.params;
    const {quantity} = re.body;
    const cart = await Cart.update({
        quantity
    }, 
    { where: {id}, returning: true });
    if (cart[0] === 0) return res.sendStatus(404);
    return res.json(cart[1][0]);
});

module.exports = {
    getAll,
    create,
    remove,
    update
};