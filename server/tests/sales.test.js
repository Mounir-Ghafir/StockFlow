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
const Sale = require('../src/models/Sale');
const PurchaseOrder = require('../src/models/PurchaseOrder');

describe('sales and purchase-order logic', () => {
  let admin;
  let employee;
  let adminToken;
  let employeeToken;
  let category;
  let supplier;
  let product;
  let dashboardProduct;
  let sale;
  let purchaseOrder;

  beforeAll(async () => {
    await connectDatabase();
    const passwordHash = await bcrypt.hash('password123', 12);
    admin = await User.create({
      name: 'Sales Admin',
      email: `sales-admin-${Date.now()}@example.com`,
      passwordHash,
      role: 'Admin',
    });
    employee = await User.create({
      name: 'Sales Employee',
      email: `sales-employee-${Date.now()}@example.com`,
      passwordHash,
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
    category = await Category.create({ name: `Sales Category ${Date.now()}` });
    supplier = await Supplier.create({
      name: `Sales Supplier ${Date.now()}`,
      email: `sales-supplier-${Date.now()}@example.com`,
      phone: '+123456789',
    });
    product = await Product.create({
      sku: `SALES-${Date.now()}`,
      name: 'Sales Test Product',
      category: category._id,
      supplier: supplier._id,
      price: 20,
      quantityInStock: 10,
      lowStockThreshold: 5,
    });
  });

  afterAll(async () => {
    await Sale.deleteMany({ employee: employee._id });
    await PurchaseOrder.deleteMany({ _id: purchaseOrder?._id });
    if (dashboardProduct) {
      await Product.deleteOne({ _id: dashboardProduct._id });
    }
    await Product.deleteMany({ _id: product._id });
    await Category.deleteMany({ _id: category._id });
    await Supplier.deleteMany({ _id: supplier._id });
    await User.deleteMany({ _id: { $in: [admin._id, employee._id] } });
    await mongoose.disconnect();
  });

  test('creates a sale and atomically decrements stock', async () => {
    const response = await request(app)
      .post('/api/sales')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ items: [{ product: product._id.toString(), quantity: 3 }] });

    expect(response.status).toBe(201);
    sale = response.body.data;
    expect(Number(sale.totalAmount.$numberDecimal || sale.totalAmount)).toBe(60);

    const updatedProduct = await Product.findById(product._id);
    expect(updatedProduct.quantityInStock).toBe(7);
  });

  test('rejects a sale that exceeds available stock without changing stock', async () => {
    const response = await request(app)
      .post('/api/sales')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ items: [{ product: product._id.toString(), quantity: 8 }] });

    expect(response.status).toBe(409);
    expect(response.body.error.message).toBe('Insufficient stock');
    expect((await Product.findById(product._id)).quantityInStock).toBe(7);
  });

  test('scopes sale history by role', async () => {
    const employeeHistory = await request(app)
      .get('/api/sales')
      .set('Authorization', `Bearer ${employeeToken}`);
    const adminHistory = await request(app)
      .get('/api/sales')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(employeeHistory.status).toBe(200);
    expect(employeeHistory.body.data.some((item) => item._id === sale._id)).toBe(true);
    expect(adminHistory.status).toBe(200);
    expect(adminHistory.body.data.some((item) => item._id === sale._id)).toBe(true);

    const detail = await request(app)
      .get(`/api/sales/${sale._id}`)
      .set('Authorization', `Bearer ${employeeToken}`);
    expect(detail.status).toBe(200);
    expect(detail.body.data.items[0].product.sku).toBe(product.sku);
  });

  test('returns the dashboard stock and recent-sales summary for admins', async () => {
    const baselineResponse = await request(app)
      .get('/api/dashboard/summary')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(baselineResponse.status).toBe(200);
    const baseline = baselineResponse.body.data;

    dashboardProduct = await Product.create({      sku: `SALES-DASH-${Date.now()}`,
      name: 'Dashboard Summary Product',
      category: category._id,
      supplier: supplier._id,
      price: 50,
      quantityInStock: 6,
      lowStockThreshold: 3,
    });

    const saleResponse = await request(app)
      .post('/api/sales')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ items: [{ product: dashboardProduct._id.toString(), quantity: 2 }] });
    expect(saleResponse.status).toBe(201);

    const response = await request(app)
      .get('/api/dashboard/summary')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.stockValue).toBeCloseTo(baseline.stockValue + 200, 2);
    expect(response.body.data.lowStockCount).toBe(baseline.lowStockCount);
    expect(response.body.data.recentSalesTotal).toBeCloseTo(baseline.recentSalesTotal + 100, 2);
  });

  test('receives a purchase order and increments stock once', async () => {
    const create = await request(app)
      .post('/api/purchase-orders')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        supplier: supplier._id.toString(),
        items: [{ product: product._id.toString(), quantity: 5, unitCost: 10 }],
        status: 'Ordered',
        expectedAt: '2026-09-01T00:00:00.000Z',
      });
    expect(create.status).toBe(201);
    purchaseOrder = create.body.data;

    const receive = await request(app)
      .post(`/api/purchase-orders/${purchaseOrder._id}/receive`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(receive.status).toBe(200);
    expect(receive.body.data.status).toBe('Received');
    expect((await Product.findById(product._id)).quantityInStock).toBe(12);

    const duplicateReceive = await request(app)
      .post(`/api/purchase-orders/${purchaseOrder._id}/receive`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(duplicateReceive.status).toBe(404);
    expect((await Product.findById(product._id)).quantityInStock).toBe(12);
  });
});
