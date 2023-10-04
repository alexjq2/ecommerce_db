const sequelize = require('../utils/connection');
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

const main = async() => {
    try{
        // Acciones a ejecutar antes de los tests
        sequelize.sync();

        const user = await User.findOne({where: {email: 'alex45@gmail.com'}});
        if(!user) {
        const userTest = {
            firstName: "test",
            lastName: "test",
            email: "alex45@gmail.com",
            password: "usuarioprueba",
            phone: "9475855"
        };
        await request(app).post('/users').send(userTest);
    }
        process.exit();
    } catch(error){
        console.log(error);
    }
}

main();
