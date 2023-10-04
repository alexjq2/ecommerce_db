const request = require('supertest');
const app = require('../app');

let id;
let token;

beforeAll(async () => {
  const loginBody = {
    email:'alex45@gmail.com',
    password: 'usuarioprueba'
  };
  const res = await request(app).post('/users/login').send(loginBody)
  token = res.body.token
});

test('GET /categories debe traer todas las categorias', async () => {
  const res = await request(app).get('/categories');
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
});

test('POST /categories debe crear una categoria', async () => {
  const category= { 
    name: "Electronica"
  };
  const res = await request(app).post('/categories').send(category).set('Authorization', `Bearer ${token}`);
  id = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
  expect(res.body.name).toBe(category.name);
});

test('PUT /categories/:id debe actualizar una categoria', async () => {
  const categoryUpdated = { 
    name: "Cocina"
  }
  const res = await request(app).put(`/categories/${id}`).send(categoryUpdated).set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.id).toBeDefined();
  expect(res.body.name).toBe(categoryUpdated.name);
});

test('DELETE /categories/:id debe eliminar una categoria', async () => {
  const res = await request(app).delete(`/categories/${id}`).set('Authorization', `Bearer ${token}`);
  expect(res.status).toBe(204);
});