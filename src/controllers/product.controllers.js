const catchError = require('../utils/catchError');
const Product = require('../models/Product');
const Image = require('../models/Image')
const {Op} = require('sequelize')

const getAll = catchError(async (req, res) => {
    const {title, categoryId} = req.query;
    const where = {};
    if (title) where.title = { [Op.iLike]: `%${title}%`};
    if (categoryId) where.categoryId = categoryId;
    const product = await Product.findAll(
        {include: [Image],
        where
        });
    return res.json(product);
});

const create = catchError(async (req, res) => {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
});

const getOne = catchError(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByPk(id , {include: [Image]});
    return res.json(product);
});

const remove = catchError(async (req, res) => {
    const { id } = req.params;
    await Product.destroy({ where: { id } });
    return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
    const { id } = req.params;
    const product = await Product.update(req.body, { where: {id}, returning: true });
    if (product[0] === 0) return res.sendStatus(404);
    return res.json(product[1][0]);
});
const setProductImages = catchError(async(req, res) => {
    const {id} = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({message: 'Product not found'});
    await product.setImages(req.body);
    const images = await product.getImages();
    return res.json(images);
});

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    setProductImages
};