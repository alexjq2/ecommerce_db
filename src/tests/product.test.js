const request = require('supertest');
const app = require('../app');
const Category = require('../models/Category');
const Image = require('../models/Image');
require('../models')

let token;

beforeAll(async () => {
  const loginBody = {
    email:'alex45@gmail.com',
    password: 'usuarioprueba'
  };
  const res = await request(app).post('/users/login').send(loginBody)
  token = res.body.token
});

test('GET /products debe traer todos los productos', async () => {
    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  test('POST /products debe crear un producto', async () => {
    const category = await Category.create({name: 'muebles'});
    const product= { 
      title: "testtt",
      description: "LoremLoremLorem",
      brand: "test lorem",
      price: 789,
      categoryId: category.id
    };
    const res = await request(app)
    .post('/products').send(product)
    .set('Authorization', `Bearer ${token}`);
    await category.destroy();
    id = res.body.id;
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.title).toBe(product.title);
  });

  test('PUT /products/:id debe actualizar un producto', async () => {
    const productUpdated = { 
      title: "test",
    };
    const res = await request(app).put(`/products/${id}`).send(productUpdated).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBeDefined();
    expect(res.body.title).toBe(productUpdated.title);
  });

  test('Post /products/:id/images debe setear una imagen a un producto', async () =>{
    const image = await Image.create({url: 'http://imagetest.jpg', publicId: 'id'});
    const res = await request(app)
    .post(`/products/${id}/images`)
    .send([image.id])
    .set('Authorization', `Bearer ${token}`);
    await image.destroy();
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1)
  });
  
  test('DELETE /products/:id debe eliminar un producto', async () => {
    const res = await request(app)
    .delete(`/products/${id}`)
    .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
  });
