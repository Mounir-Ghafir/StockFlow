const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../src/app');
const connectDatabase = require('../src/config/db');
const User = require('../src/models/User');
const Category = require('../src/models/Category');
const Supplier = require('../src/models/Supplier');
const Product = require('../src/models/Product');
const productService = require('../src/services/productService');

describe('core CRUD resources', () => {
  let adminToken;
  let employeeToken;
  let admin;
  let employee;
  let category;
  let supplier;
  let product;

  beforeAll(async () => {
    await connectDatabase();
    admin = await User.create({
      name: 'CRUD Admin',
      email: `crud-admin-${Date.now()}@example.com`,
      passwordHash: await bcrypt.hash('password123', 12),
      role: 'Admin',
    });
    employee = await User.create({
      name: 'CRUD Employee',
      email: `crud-employee-${Date.now()}@example.com`,
      passwordHash: await bcrypt.hash('password123', 12),
      role: 'Employee',
    });
    adminToken = jwt.sign({ role: 'Admin' }, process.env.JWT_SECRET, {
      subject: admin._id.toString(),
      expiresIn: '1h',
    });
    employeeToken = jwt.sign({ role: 'Employee' }, process.env.JWT_SECRET, {
      subject: employee._id.toString(),
      expiresIn: '1h',
    });
  });

  afterAll(async () => {
    await Product.deleteMany({ _id: product?._id });
    await Category.deleteMany({ _id: category?._id });
    await Supplier.deleteMany({ _id: supplier?._id });
    await User.deleteMany({ _id: { $in: [admin._id, employee._id] } });
    await mongoose.disconnect();
  });

  test('performs category CRUD and protects mutations', async () => {
    const create = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Electronics' });
    expect(create.status).toBe(201);
    category = create.body.data;

    const list = await request(app)
      .get('/api/categories')
      .set('Authorization', `Bearer ${employeeToken}`);
    expect(list.status).toBe(200);
    expect(list.body.data.some((item) => item._id === category._id)).toBe(true);

    const get = await request(app)
      .get(`/api/categories/${category._id}`)
      .set('Authorization', `Bearer ${employeeToken}`);
    expect(get.status).toBe(200);

    const forbidden = await request(app)
      .put(`/api/categories/${category._id}`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ name: 'Updated Electronics' });
    expect(forbidden.status).toBe(403);

    const update = await request(app)
      .put(`/api/categories/${category._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated Electronics' });
    expect(update.status).toBe(200);
    expect(update.body.data.name).toBe('Updated Electronics');
  });

  test('performs supplier CRUD', async () => {
    const create = await request(app)
      .post('/api/suppliers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Acme Supply', email: 'supply@example.com', phone: '+123456789' });
    expect(create.status).toBe(201);
    supplier = create.body.data;

    expect((await request(app).get('/api/suppliers').set('Authorization', `Bearer ${adminToken}`)).status).toBe(200);
    expect((await request(app).get(`/api/suppliers/${supplier._id}`).set('Authorization', `Bearer ${adminToken}`)).status).toBe(200);

    const update = await request(app)
      .put(`/api/suppliers/${supplier._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated Supply', email: 'updated@example.com', phone: '+987654321' });
    expect(update.status).toBe(200);
    expect(update.body.data.name).toBe('Updated Supply');
  });

  test('performs product CRUD with populated references and query filters', async () => {
    const create = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        sku: `SKU-${Date.now()}`,
        name: 'Low Stock Laptop',
        category: category._id,
        supplier: supplier._id,
        price: 999.99,
        quantityInStock: 2,
        lowStockThreshold: 5,
      });
    expect(create.status).toBe(201);
    product = create.body.data;

    const get = await request(app)
      .get(`/api/products/${product._id}`)
      .set('Authorization', `Bearer ${employeeToken}`);
    expect(get.status).toBe(200);
    expect(get.body.data.category.name).toBe('Updated Electronics');
    expect(get.body.data.supplier.name).toBe('Updated Supply');

    const filtered = await request(app)
      .get('/api/products?page=1&limit=10&search=laptop&lowStock=true')
      .set('Authorization', `Bearer ${employeeToken}`);
    expect(filtered.status).toBe(200);
    expect(filtered.body.pagination).toMatchObject({ page: 1, limit: 10, total: 1, pages: 1 });
    expect(filtered.body.data[0]._id).toBe(product._id);

    const update = await request(app)
      .put(`/api/products/${product._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        sku: product.sku,
        name: 'Updated Laptop',
        category: category._id,
        supplier: supplier._id,
        price: 899.99,
        quantityInStock: 10,
        lowStockThreshold: 3,
      });
    expect(update.status).toBe(200);
    expect(update.body.data.name).toBe('Updated Laptop');

    const invalid = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Missing required fields' });
    expect(invalid.status).toBe(400);

    const remove = await request(app)
      .delete(`/api/products/${product._id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(remove.status).toBe(204);
    product = null;
  });

  test('builds the product filter without database access', () => {
    expect(productService.buildProductFilter({
      search: 'phone',
      category: 'category-id',
      supplier: 'supplier-id',
      lowStock: true,
    })).toEqual({
      $or: [
        { name: { $regex: 'phone', $options: 'i' } },
        { sku: { $regex: 'phone', $options: 'i' } },
      ],
      category: 'category-id',
      supplier: 'supplier-id',
      $expr: { $lte: ['$quantityInStock', '$lowStockThreshold'] },
    });
  });
});
