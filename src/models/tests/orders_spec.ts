
import { UserType, User } from '../user';
import { ProductType, Product } from '../product';
import { OrderType, OrderProductType, Order } from '../order';
import client from '../../database';
import supertest from 'supertest';
import app from '../../index';

const user = new User();
const product = new Product();
const order = new Order();

describe('Order Model', () => {

    it('should have index method', () => {
      expect(order.index).toBeDefined();
    });

    it('should have show method', () => {
      expect(order.show).toBeDefined();
    });

    it('should have getUserOrders method', () => {
      expect(order.getUserOrders).toBeDefined();
    });

    it('should have getOrderDetails method', () => {
      expect(order.getOrderDetails).toBeDefined();
    });

    it('should have getUserClosedOrders method', () => {
      expect(order.getUserClosedOrders).toBeDefined();
    });

    it('should have create method', () => {
      expect(order.create).toBeDefined();
    });

    it('should have addProductToOrder method', () => {
      expect(order.addProductToOrder).toBeDefined();
    });

    it('should have updateOrderStatusToClosed method', () => {
      expect(order.updateOrderStatusToClosed).toBeDefined();
    });

    it('index method should array of created orders', async () => {
      // create new user
      const newUser: UserType = {
        username: 'user',
        useremail: 'user@gmail.com',
        userpassword: 'user123'
      };
      let createdUser = await user.create(newUser);
      newUser.id = createdUser.id;

      //create new order
      const newOrder: OrderType = {
        orderstatus: 'open',
        userId: Number(newUser.id)
      };
      let createdOrder = await order.create(
        String(newOrder.userId),
        newOrder.userId
      );
      newOrder.id = createdOrder.id;

      // test index method
      const result: OrderType[] = await order.index();
      expect(result.length).toBe(1);

      const conn = await client.connect();
      const sql = 'DELETE FROM orders;';
      await conn.query(sql);
      conn.release();

      const connection = await client.connect();
      const sqlQuery = 'DELETE FROM users;';
      await connection.query(sqlQuery);
      connection.release();
    });

    it('show method should return "order" when passing id of specific order', async () => {
      // create new user
      const newUser: UserType = {
        username: 'user',
        useremail: 'user@gmail.com',
        userpassword: 'user123'
      };
      let createdUser = await user.create(newUser);
      newUser.id = createdUser.id;

      //create new order
      const newOrder: OrderType = {
        orderstatus: 'open',
        userId: Number(newUser.id)
      };
      let createdOrder = await order.create(
        String(newOrder.userId),
        newOrder.userId
      );
      newOrder.id = createdOrder.id;

      // test show method
      const result: OrderType = await order.show(String(newOrder.id));
      expect(result.orderstatus).toEqual('open');
      expect(result.id).toEqual(newOrder.id);

      const conn = await client.connect();
      const sql = 'DELETE FROM orders;';
      await conn.query(sql);
      conn.release();

      const connection = await client.connect();
      const sqlQuery = 'DELETE FROM users;';
      await connection.query(sqlQuery);
      connection.release();
    });

    it('create method should create a new order and return it', async () => {
      // create new user
      const newUser: UserType = {
        username: 'user',
        useremail: 'user@gmail.com',
        userpassword: 'user123'
      };
      let createdUser = await user.create(newUser);
      newUser.id = createdUser.id;

      //test create order
      const newOrder: OrderType = {
        orderstatus: 'open',
        userId: Number(newUser.id)
      };
      let createdOrder = await order.create(
        String(newOrder.userId),
        newOrder.userId
      );
      newOrder.id = createdOrder.id;

      expect(createdOrder.id).toEqual(newOrder.id);
      expect(createdOrder.orderstatus).toEqual(newOrder.orderstatus);

      const conn = await client.connect();
      const sql = 'DELETE FROM orders;';
      await conn.query(sql);
      conn.release();

      const connection = await client.connect();
      const sqlQuery = 'DELETE FROM users;';
      await connection.query(sqlQuery);
      connection.release();
    });

    it('getUserOrders method should return "order" of specific user id', async () => {
      // create new user
      const newUser: UserType = {
        username: 'user',
        useremail: 'user@gmail.com',
        userpassword: 'user123'
      };
      let createdUser = await user.create(newUser);
      newUser.id = createdUser.id;

      //create new order
      const newOrder: OrderType = {
        orderstatus: 'open',
        userId: Number(newUser.id)
      };
      let createdOrder = await order.create(
        String(newOrder.userId),
        newOrder.userId
      );
      newOrder.id = createdOrder.id;

      // test getUserOrders method
      const result = await order.getUserOrders(String(newUser.id));
      expect(result[0].orderstatus).toEqual('open');
      expect(result[0].id).toEqual(newOrder.id);

      const conn = await client.connect();
      const sql = 'DELETE FROM orders;';
      await conn.query(sql);
      conn.release();

      const connection = await client.connect();
      const sqlQuery = 'DELETE FROM users;';
      await connection.query(sqlQuery);
      connection.release();
    });

    it('addProductToOrder method should add a specific product to an existing order', async () => {
      // create new user
      const newUser: UserType = {
        username: 'user',
        useremail: 'user@gmail.com',
        userpassword: 'user123'
      };
      let createdUser = await user.create(newUser);
      newUser.id = createdUser.id;

      //create new product
      const newProduct: ProductType = {
        productname: 'product 1',
        productprice: 300
      };
      let createdProduct = await product.create(newProduct);
      newProduct.id = createdProduct.id;

      //create new order
      const newOrder: OrderType = {
        orderstatus: 'open',
        userId: Number(newUser.id)
      };
      let createdOrder = await order.create(
        String(newOrder.userId),
        newOrder.userId
      );
      newOrder.id = createdOrder.id;

      let quantity: number = 1;

      // test addProductToOrder method
      const result: OrderProductType = await order.addProductToOrder(
        quantity,
        String(newOrder.id),
        Number(newProduct.id)
      );
      expect(result.quantity).toEqual(1);

      const connection3 = await client.connect();
      const sqlQuery3 = 'DELETE FROM order_products;';
      await connection3.query(sqlQuery3);
      connection3.release();

      const connection2 = await client.connect();
      const sqlQuery2 = 'DELETE FROM products;';
      await connection2.query(sqlQuery2);
      connection2.release();

      const conn = await client.connect();
      const sql = 'DELETE FROM orders;';
      await conn.query(sql);
      conn.release();

      const connection = await client.connect();
      const sqlQuery = 'DELETE FROM users;';
      await connection.query(sqlQuery);
      connection.release();
    });

  });

  describe('Orders Routes', () => {

    const request = supertest(app);

    it('index method should return all the orders with status 200 if the token is valid', async () => {
      // create new user
      const newUser: UserType = {
        username: 'user',
        useremail: 'user@gmail.com',
        userpassword: 'user123'
      };
      let createdUser = await user.create(newUser);
      newUser.id = createdUser.id;

      //login
      const res = await request
        .post('/login')
        .set('content-type', 'application/json')
        .send({
          useremail: 'user@gmail.com',
          userpassword: 'user123'
        });
      let token: string = res.body;

      //create new order
      const newOrder: OrderType = {
        orderstatus: 'open',
        userId: Number(newUser.id)
      };
      let createdOrder = await order.create(
        String(newOrder.userId),
        newOrder.userId
      );
      newOrder.id = createdOrder.id;

      // test get all orders endpoint
      const response = await request
        .get('/orders')
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);

      const conn = await client.connect();
      const sql = 'DELETE FROM orders;';
      await conn.query(sql);
      conn.release();

      const connection = await client.connect();
      const sqlQuery = 'DELETE FROM users;';
      await connection.query(sqlQuery);
      connection.release();
    });

    it('show order by id method should return the specified order with status 200 if the token is valid', async () => {
      // create new user
      const newUser: UserType = {
        username: 'user',
        useremail: 'user@gmail.com',
        userpassword: 'user123'
      };
      let createdUser = await user.create(newUser);
      newUser.id = createdUser.id;

      //login
      const res = await request
        .post('/login')
        .set('content-type', 'application/json')
        .send({
          useremail: 'user@gmail.com',
          userpassword: 'user123'
        });
      let token: string = res.body;

      //create new order
      const newOrder: OrderType = {
        orderstatus: 'open',
        userId: Number(newUser.id)
      };
      let createdOrder = await order.create(
        String(newOrder.userId),
        newOrder.userId
      );
      newOrder.id = createdOrder.id;

      // test show order by id endpoint
      const response = await request
        .get(`/orders/${String(newOrder.id)}`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);

      const conn = await client.connect();
      const sql = 'DELETE FROM orders;';
      await conn.query(sql);
      conn.release();

      const connection = await client.connect();
      const sqlQuery = 'DELETE FROM users;';
      await connection.query(sqlQuery);
      connection.release();
    });

    it('create method should response with the created order and with status 201 created if the token is valid', async () => {
      // create new user
      const newUser: UserType = {
        username: 'user',
        useremail: 'user@gmail.com',
        userpassword: 'user123'
      };
      let createdUser = await user.create(newUser);
      newUser.id = createdUser.id;
      //login
      const res = await request
        .post('/login')
        .set('content-type', 'application/json')
        .send({
          useremail: 'user@gmail.com',
          userpassword: 'user123'
        });
      let token: string = res.body;

      // test create order enpoint 
      const response = await request
        .post(`/users/${String(newUser.id)}/orders`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          orderstatus: 'open',
          userId: Number(newUser.id)
        });
      expect(response.status).toBe(201);

      const conn = await client.connect();
      const sql = 'DELETE FROM orders;';
      await conn.query(sql);
      conn.release();

      const connection = await client.connect();
      const sqlQuery = 'DELETE FROM users;';
      await connection.query(sqlQuery);
      connection.release();
    });

    it('addProductToOrder method should add an existing product to a specific order  with status 200 if the token is valid', async () => {
      // create new user
      const newUser: UserType = {
        username: 'user',
        useremail: 'user@gmail.com',
        userpassword: 'user123'
      };
      let createdUser = await user.create(newUser);
      newUser.id = createdUser.id;

      //login
      const res = await request
        .post('/login')
        .set('content-type', 'application/json')
        .send({
          useremail: 'user@gmail.com',
          userpassword: 'user123'
        });
      let token: string = res.body;

      //create new product
      const newProduct: ProductType = {
        productname: 'product 1',
        productprice: 300
      };
      let createdProduct = await product.create(newProduct);
      newProduct.id = createdProduct.id;

      //create new order
      const newOrder: OrderType = {
        orderstatus: 'open',
        userId: Number(newUser.id)
      };
      let createdOrder = await order.create(
        String(newOrder.userId),
        newOrder.userId
      );
      newOrder.id = createdOrder.id;

      // test add product to order endpoint
      const response = await request
        .post(`/add-products/orders/${String(newOrder.id)}`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          quantity: 1,
          productId: Number(newProduct.id)
        });
      expect(response.status).toBe(200);

      const connection3 = await client.connect();
      const sqlQuery3 = 'DELETE FROM order_products;';
      await connection3.query(sqlQuery3);
      connection3.release();

      const connection2 = await client.connect();
      const sqlQuery2 = 'DELETE FROM products;';
      await connection2.query(sqlQuery2);
      connection2.release();

      const conn = await client.connect();
      const sql = 'DELETE FROM orders;';
      await conn.query(sql);
      conn.release();

      const connection = await client.connect();
      const sqlQuery = 'DELETE FROM users;';
      await connection.query(sqlQuery);
      connection.release();
    });

    it('getUserOrders method should return the orders done by specific user with status 200 if the token is valid', async () => {
      // create new user
      const newUser: UserType = {
        username: 'user',
        useremail: 'user@gmail.com',
        userpassword: 'user123'
      };
      let createdUser = await user.create(newUser);
      newUser.id = createdUser.id;

      //login
      const res = await request
        .post('/login')
        .set('content-type', 'application/json')
        .send({
          useremail: 'user@gmail.com',
          userpassword: 'user123'
        });
      let token: string = res.body;

      //create new order
      const newOrder: OrderType = {
        orderstatus: 'open',
        userId: Number(newUser.id)
      };
      let createdOrder = await order.create(
        String(newOrder.userId),
        newOrder.userId
      );
      newOrder.id = createdOrder.id;

      // test get the orders of specific user endpoint
      const response = await request
        .get(`/users/${String(newUser.id)}/orders`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);

      const conn = await client.connect();
      const sql = 'DELETE FROM orders;';
      await conn.query(sql);
      conn.release();

      const connection = await client.connect();
      const sqlQuery = 'DELETE FROM users;';
      await connection.query(sqlQuery);
      connection.release();
    });

    it('getUserClosedOrders method should return the orders with order status = "closed"  done by specific user with status 200 if the token is valid', async () => {
      // create new user
      const newUser: UserType = {
        username: 'user',
        useremail: 'user@gmail.com',
        userpassword: 'user123'
      };
      let createdUser = await user.create(newUser);
      newUser.id = createdUser.id;

      //login
      const res = await request
        .post('/login')
        .set('content-type', 'application/json')
        .send({
          useremail: 'user@gmail.com',
          userpassword: 'user123'
        });
      let token: string = res.body;

      //create new order
      const newOrder: OrderType = {
        orderstatus: 'closed',
        userId: Number(newUser.id)
      };
      let createdOrder = await order.create(
        String(newOrder.userId),
        newOrder.userId
      );
      newOrder.id = createdOrder.id;

      // test get user orders with orderstatus=closed endpoint
      const response = await request
        .get(`/users/${String(newUser.id)}/closed-orders`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);

      const conn = await client.connect();
      const sql = 'DELETE FROM orders;';
      await conn.query(sql);
      conn.release();

      const connection = await client.connect();
      const sqlQuery = 'DELETE FROM users;';
      await connection.query(sqlQuery);
      connection.release();
    });

    it('updateOrderStatusToClosed method should update a specific order with order status = "closed" with status 200 if the token is valid', async () => {
      // create new user
      const newUser: UserType = {
        username: 'user',
        useremail: 'user@gmail.com',
        userpassword: 'user123'
      };
      let createdUser = await user.create(newUser);
      newUser.id = createdUser.id;

      //login
      const res = await request
        .post('/login')
        .set('content-type', 'application/json')
        .send({
          useremail: 'user@gmail.com',
          userpassword: 'user123'
        });
      let token: string = res.body;

      //create new order
      const newOrder: OrderType = {
        orderstatus: 'open',
        userId: Number(newUser.id)
      };
      let createdOrder = await order.create(
        String(newOrder.userId),
        newOrder.userId
      );
      newOrder.id = createdOrder.id;

      // test update order status from open to closed endpoint
      const response = await request
        .patch(`/closed-order/${String(newOrder.id)}`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          orderstatus: 'closed'
        });
      expect(response.status).toBe(200);

      const conn = await client.connect();
      const sql = 'DELETE FROM orders;';
      await conn.query(sql);
      conn.release();

      const connection = await client.connect();
      const sqlQuery = 'DELETE FROM users;';
      await connection.query(sqlQuery);
      connection.release();
    });

  });