const request = require('supertest');
const app = require('../app');

let id;
let token;

test('POST /users debe crear un usuario', async () => {
  const user = { 
    firstName: "alex",
    lastName: "quispe",
    email: "alex@gmail.com",
    password: "usuarioprueba",
    phone: "947585595"
  };
  const res = await request(app).post('/users').send(user);
  id = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
  expect(res.body.firstName).toBe(user.firstName);
});

test('POST /users/login', async () => {
    const bodyLogin = {
        email:'alex@gmail.com',
        password: 'usuarioprueba'
    };
    const res = await request(app).post('/users/login').send(bodyLogin);
    token = res.body.token;
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toBeDefined();
});

test('POST /users/login con credenciales invalidas', async () => {
    const bodyLogin = {
        email:'alex@gmail.com',
        password: 'usuarioprrrrueba'
    };
    const res = await request(app).post('/users/login').send(bodyLogin);
    expect(res.status).toBe(401);
});

test('GET /users debe traer todos los usuarios', async () => {
  const res = await request(app).get('/users').set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
});


test('PUT /users/:id debe actualizar un usuario', async () => {
  const userUpdated = { 
    firstName: "junior",
  }
  const res = await request(app).put(`/users/${id}`).send(userUpdated).set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.id).toBeDefined();
  expect(res.body.firstName).toBe(userUpdated.firstName);
});


test('DELETE /users/:id debe eliminar un usuario', async () => {
  const res = await request(app).delete(`/users/${id}`).set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(204);
});