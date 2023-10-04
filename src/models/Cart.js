const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const NombreModelo = sequelize.define('nombreModelo', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = NombreModelo;