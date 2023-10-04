const request = require('supertest');
const app = require('../app');
require('../models')

let token;
let id;

beforeAll(async () => {
  const loginBody = {
    email:'alex45@gmail.com',
    password: 'usuarioprueba'
  };
  const res = await request(app).post('/users/login').send(loginBody)
  token = res.body.token
});

test('GET /cart', async() => {
    const res = await request(app).get('/cart').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
});

test('POST /cart', async() => {
    const cartBody = {quantity: 5}
    const res = await request(app)
    .post('/cart')
    .send(cartBody)
    .set('Authorization', `Bearer ${token}`);
    id = res.body.id
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.quantity).toBe(cartBody.quantity);
});
test('DELETE /cart/:id', async() => {
    const res = await request(app)
    .delete(`/cart/${id}`)
    .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
});