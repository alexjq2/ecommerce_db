const catchError = require('../utils/catchError');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getAll = catchError(async (req, res) => {
    const user = await User.findAll();
    return res.json(user);
});

const create = catchError(async (req, res) => {
    const {password, firstName, lastName, email, phone} = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword
    });
    return res.status(201).json(user);
});


const remove = catchError(async (req, res) => {
    const { id } = req.params;
    await User.destroy({ where: { id } });
    return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
    const { id } = req.params;
    const {firstName, lastName, phone} = req.body
    const user = await User.update({
        firstName,
        lastName,
        phone,
    }, { where: {id}, returning: true });
    if (user[0] === 0) return res.sendStatus(404);
    return res.json(user[1][0]);
});
const login = catchError(async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({where: {email}});
    if(!user) return res.status(401).json({message: 'invalid credentials'});
    const isValid = await bcrypt.compare(password, user.password);
    if(!isValid) return res.status(401).json({message: 'invalid credentials'});
    const token = jwt.sign(
        {user},
        process.env.TOKEN_SECRET,
        {expiresIn: '1d'}
    )
    return res.json({user, token})
});



module.exports = {
    getAll,
    create,
    remove,
    update,
    login
};