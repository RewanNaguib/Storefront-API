import { UserType, User } from '../user';
import { ProductType, Product } from '../product';
import { OrderType, OrderProductType, Order } from '../order';
import client from '../../database';
import supertest from 'supertest';
import app from '../../index';
import { Connection } from 'pg';

const user = new User();
const product = new Product();
const order = new Order();
describe('Full Ptoject', () => {
  beforeEach(function (done) {
    global.jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
    setTimeout(function () {
      console.log('inside timeout');
      done();
    }, 1000);
  });

  describe('User Model', () => {
    // beforeEach(function (done) {
    //     global.jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    //     setTimeout(function () {
    //         console.log('inside timeout');
    //         done();
    //     }, 500);
    // });
    // beforeAll(function() {
    //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
    // });

    // const newUser: UserType = {
    //     username: 'user',
    //     useremail: 'user@gmail.com',
    //     userpassword: 'user123',
    // };
    // // const createdUser = {...newUser, id:1};

    // beforeAll(async()=>{
    //     console.log('before all');
    //     let createdUser = await user.create(newUser);
    //     newUser.id = createdUser.id;
    // });

    // afterAll(async()=>{
    //     console.log('after all');
    //     const conn = await client.connect();
    //     const sql = 'ALTER SEQUENCE users_id_seq RESTART WITH 1;'
    //     // const sql = 'DELETE FROM users;';
    //     await conn.query(sql);
    //     conn.release();
    // });

    it('should have create method', () => {
      expect(user.create).toBeDefined();
    });

    it('should have authenticate method', () => {
      expect(user.authenticate).toBeDefined();
    });

    it('should have index method', () => {
      expect(user.index).toBeDefined();
    });

    it('should have show method', () => {
      expect(user.show).toBeDefined();
    });

    it('should have update method', () => {
      expect(user.update).toBeDefined();
    });

    it('should have destroy method', () => {
      expect(user.destroy).toBeDefined();
    });

    it('authenticate method should return a user that is already registered', async () => {
      const newUser: UserType = {
        username: 'user',
        useremail: 'user@gmail.com',
        userpassword: 'user123'
      };
      let createdUser = await user.create(newUser);
      newUser.id = createdUser.id;

      const result = await user.authenticate(
        newUser.useremail,
        newUser.userpassword
      );
      expect(result?.username).toEqual(newUser.username);
      expect(result?.useremail).toEqual(newUser.useremail);

      const conn = await client.connect();
      // const sql = 'ALTER SEQUENCE users_id_seq RESTART WITH 1;'
      const sql = 'DELETE FROM users;';
      await conn.query(sql);
      conn.release();
    });

    it('authenticate method should return null when entering not registerd user data or wrong credentials', async () => {
      const newUser: UserType = {
        username: 'user',
        useremail: 'user@gmail.com',
        userpassword: 'user123'
      };
      let createdUser = await user.create(newUser);
      newUser.id = createdUser.id;

      const result = (await user.authenticate(
        'wrongemail@gmail.com',
        'worngpassword123'
      )) as UserType;
      expect(result).toBeNull;

      const conn = await client.connect();
      // const sql = 'ALTER SEQUENCE users_id_seq RESTART WITH 1;'
      const sql = 'DELETE FROM users;';
      await conn.query(sql);
      conn.release();
    });

    it('create method should register/create a new user and return it', async () => {
      const newUser: UserType = {
        username: 'user',
        useremail: 'user@gmail.com',
        userpassword: 'user123'
      };
      let createdUser = await user.create(newUser);
      newUser.id = createdUser.id;

      expect(createdUser.id).toEqual(newUser.id);
      expect(createdUser.username).toEqual(newUser.username);
      expect(createdUser.useremail).toEqual(newUser.useremail);

      const conn = await client.connect();
      // const sql = 'ALTER SEQUENCE users_id_seq RESTART WITH 1;'
      const sql = 'DELETE FROM users;';
      await conn.query(sql);
      conn.release();
    });

    it('index method should return array of all the created users', async () => {
      const newUser: UserType = {
        username: 'user',
        useremail: 'user@gmail.com',
        userpassword: 'user123'
      };
      let createdUser = await user.create(newUser);
      newUser.id = createdUser.id;

      const result: UserType[] = await user.index();
      expect(result.length).toBe(1);

      const conn = await client.connect();
      // const sql = 'ALTER SEQUENCE users_id_seq RESTART WITH 1;'
      const sql = 'DELETE FROM users;';
      await conn.query(sql);
      conn.release();
    });

    it('show method should return "user" when passing id of specific user', async () => {
      const newUser: UserType = {
        username: 'user',
        useremail: 'user@gmail.com',
        userpassword: 'user123'
      };
      let createdUser = await user.create(newUser);
      newUser.id = createdUser.id;

      const result: UserType = await user.show(String(newUser.id));
      expect(result.username).toEqual(newUser.username);
      expect(result.useremail).toEqual(newUser.useremail);
      expect(result.id).toEqual(newUser.id);

      const conn = await client.connect();
      // const sql = 'ALTER SEQUENCE users_id_seq RESTART WITH 1;'
      const sql = 'DELETE FROM users;';
      await conn.query(sql);
      conn.release();
    });

    it('update method should update the data of existing user and return the updated version of it', async () => {
      const newUser: UserType = {
        username: 'user',
        useremail: 'user@gmail.com',
        userpassword: 'user123'
      };
      let createdUser = await user.create(newUser);
      newUser.id = createdUser.id;

      const result: UserType = await user.update(
        String(newUser.id),
        'userupdate',
        'userupdate@gmail.com',
        'user123'
      );
      expect(result.username).toEqual('userupdate');
      expect(result.useremail).toEqual('userupdate@gmail.com');
      expect(result.id).toEqual(newUser.id);

      const conn = await client.connect();
      // const sql = 'ALTER SEQUENCE users_id_seq RESTART WITH 1;'
      const sql = 'DELETE FROM users;';
      await conn.query(sql);
      conn.release();
    });

    it('destroy method should delete existing user when passing id of specific user', async () => {
      const newUser: UserType = {
        username: 'user',
        useremail: 'user@gmail.com',
        userpassword: 'user123'
      };
      let createdUser = await user.create(newUser);
      newUser.id = createdUser.id;

      const result: number = await user.destroy(String(newUser.id));
      expect(result).toEqual(1);

      const conn = await client.connect();
      // const sql = 'ALTER SEQUENCE users_id_seq RESTART WITH 1;'
      const sql = 'DELETE FROM users;';
      await conn.query(sql);
      conn.release();
    });
  });

  describe('Users Routes(Handler)', () => {
    // beforeEach(function (done) {
    //     global.jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    //     setTimeout(function () {
    //         console.log('inside timeout');
    //         done();
    //     }, 500);
    // });

    // beforeAll(function() {
    //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000;
    // });

    const request = supertest(app);

    it('authenticate method response should be token and status 200 if the user is authenticated', async () => {
      const newUser: UserType = {
        username: 'user',
        useremail: 'user@gmail.com',
        userpassword: 'user123'
      };
      let createdUser = await user.create(newUser);
      newUser.id = createdUser.id;

      const response = await request
        .post('/login')
        .set('content-type', 'application/json')
        .send({
          useremail: 'user@gmail.com',
          userpassword: 'user123'
        });
      expect(response.status).toBe(200);
      const { token: userToken } = response.body;
      const token = userToken;

      const conn = await client.connect();
      // const sql = 'ALTER SEQUENCE users_id_seq RESTART WITH 1;'
      const sql = 'DELETE FROM users;';
      await conn.query(sql);
      conn.release();
    });

    it('authenticate method response status 401 if the user is unauthorized', async () => {
      const newUser: UserType = {
        username: 'user',
        useremail: 'user@gmail.com',
        userpassword: 'user123'
      };
      let createdUser = await user.create(newUser);
      newUser.id = createdUser.id;

      const response = await request
        .post('/login')
        .set('content-type', 'application/json')
        .send({
          useremail: 'wrong@gmail.com',
          userpassword: 'wrong123'
        });
      expect(response.status).toBe(401);

      const conn = await client.connect();
      // const sql = 'ALTER SEQUENCE users_id_seq RESTART WITH 1;'
      const sql = 'DELETE FROM users;';
      await conn.query(sql);
      conn.release();
    });

    it('create method should response with the created user and with status 201 created', async () => {
      const response = await request
        .post('/signup')
        .set('content-type', 'application/json')
        .send({
          username: 'user',
          useremail: 'user@gmail.com',
          userpassword: 'user123'
        });
      expect(response.status).toBe(201);

      const conn = await client.connect();
      // const sql = 'ALTER SEQUENCE users_id_seq RESTART WITH 1;'
      const sql = 'DELETE FROM users;';
      await conn.query(sql);
      conn.release();
    });

    it('index method should return all the created users with status 200 if the token is valid ', async () => {
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

      const response = await request
        .get('/users')
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);

      const conn = await client.connect();
      // const sql = 'ALTER SEQUENCE users_id_seq RESTART WITH 1;'
      const sql = 'DELETE FROM users;';
      await conn.query(sql);
      conn.release();
    });

    it('show user by id method should return the specified user with status 200 if the token is valid ', async () => {
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

      const response = await request
        .get(`/users/${String(newUser.id)}`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);

      const conn = await client.connect();
      // const sql = 'ALTER SEQUENCE users_id_seq RESTART WITH 1;'
      const sql = 'DELETE FROM users;';
      await conn.query(sql);
      conn.release();
    });

    it('update user by id method should return the updated data of specified user with status 200 if the token is valid ', async () => {
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

      const response = await request
        .patch(`/users/${String(newUser.id)}`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          username: 'user upadte',
          useremail: 'userupdate@gmail.com',
          userpassword: 'user123update'
        });
      expect(response.status).toBe(200);

      const conn = await client.connect();
      // const sql = 'ALTER SEQUENCE users_id_seq RESTART WITH 1;'
      const sql = 'DELETE FROM users;';
      await conn.query(sql);
      conn.release();
    });

    it('delete user by id method should delete the specified user with status 204 No Content if the token is valid ', async () => {
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

      const response = await request
        .delete(`/users/${String(newUser.id)}`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(204);

      const conn = await client.connect();
      // const sql = 'ALTER SEQUENCE users_id_seq RESTART WITH 1;'
      const sql = 'DELETE FROM users;';
      await conn.query(sql);
      conn.release();
    });
  });

  describe('Product Model', () => {
    // beforeEach(function (done) {
    //     global.jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
    //     setTimeout(function () {
    //         console.log('inside timeout');
    //         done();
    //     }, 500);
    // });
    // beforeAll(function() {
    //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000000;
    // });

    it('should have index method', () => {
      expect(product.index).toBeDefined();
    });

    it('should have show method', () => {
      expect(product.show).toBeDefined();
    });

    it('should have create method', () => {
      expect(product.create).toBeDefined();
    });

    it('should have update method', () => {
      expect(product.update).toBeDefined();
    });

    it('should have destroy method', () => {
      expect(product.destroy).toBeDefined();
    });

    it('index method should array of created products', async () => {
      const newProduct: ProductType = {
        productname: 'product 1',
        productprice: 300
      };
      let createdProduct = await product.create(newProduct);
      newProduct.id = createdProduct.id;

      const result: ProductType[] = await product.index();
      expect(result.length).toBe(1);

      const conn = await client.connect();
      const sql = 'DELETE FROM products;';
      await conn.query(sql);
      conn.release();
    });

    it('show method should return "product" when passing id of specific product', async () => {
      const newProduct: ProductType = {
        productname: 'product 1',
        productprice: 300
      };
      let createdProduct = await product.create(newProduct);
      newProduct.id = createdProduct.id;

      const result: ProductType = await product.show(String(newProduct.id));
      expect(result.productname).toEqual(newProduct.productname);
      expect(result.productprice).toEqual(newProduct.productprice);
      expect(result.id).toEqual(newProduct.id);

      const conn = await client.connect();
      const sql = 'DELETE FROM products;';
      await conn.query(sql);
      conn.release();
    });

    it('create method should create a new product and return it', async () => {
      const newProduct: ProductType = {
        productname: 'product 1',
        productprice: 300
      };
      let createdProduct = await product.create(newProduct);
      newProduct.id = createdProduct.id;

      expect(createdProduct.id).toEqual(newProduct.id);
      expect(createdProduct.productname).toEqual(newProduct.productname);
      expect(createdProduct.productprice).toEqual(newProduct.productprice);

      const conn = await client.connect();
      const sql = 'DELETE FROM products;';
      await conn.query(sql);
      conn.release();
    });

    it('update method should update the data of existing product and return the updated version of it', async () => {
      const newProduct: ProductType = {
        productname: 'product 1',
        productprice: 300
      };
      let createdProduct = await product.create(newProduct);
      newProduct.id = createdProduct.id;

      const result: ProductType = await product.update(
        String(newProduct.id),
        'product 1 update',
        500
      );
      expect(result.productname).toEqual('product 1 update');
      expect(result.productprice).toEqual(500);
      expect(result.id).toEqual(newProduct.id);

      const conn = await client.connect();
      const sql = 'DELETE FROM products;';
      await conn.query(sql);
      conn.release();
    });

    it('destroy method should delete existing product when passing id of specific product', async () => {
      const newProduct: ProductType = {
        productname: 'product 1',
        productprice: 300
      };
      let createdProduct = await product.create(newProduct);
      newProduct.id = createdProduct.id;

      const result: number = await product.destroy(String(newProduct.id));
      expect(result).toEqual(1);

      const conn = await client.connect();
      const sql = 'DELETE FROM products;';
      await conn.query(sql);
      conn.release();
    });
  });

  describe('Products Routes(Handler)', () => {
    // beforeEach(function (done) {
    //     global.jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
    //     setTimeout(function () {
    //         console.log('inside timeout');
    //         done();
    //     }, 1000);
    // });

    // beforeAll(function() {
    //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000000;
    // });

    const request = supertest(app);

    it('index method should return all the products with status 200 without need for token', async () => {
      const newProduct: ProductType = {
        productname: 'product 1',
        productprice: 300
      };
      let createdProduct = await product.create(newProduct);
      newProduct.id = createdProduct.id;

      const response = await request
        .get('/products')
        .set('content-type', 'application/json');
      expect(response.status).toBe(200);

      const conn = await client.connect();
      const sql = 'DELETE FROM products;';
      await conn.query(sql);
      conn.release();
    });

    it('show product by id method should return the specified product with status 200 without need for token', async () => {
      const newProduct: ProductType = {
        productname: 'product 1',
        productprice: 300
      };
      let createdProduct = await product.create(newProduct);
      newProduct.id = createdProduct.id;

      const response = await request
        .get(`/products/${String(newProduct.id)}`)
        .set('content-type', 'application/json');
      expect(response.status).toBe(200);

      const conn = await client.connect();
      const sql = 'DELETE FROM products;';
      await conn.query(sql);
      conn.release();
    });

    it('create method should response with the created product and with status 201 created if the token is valid', async () => {
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

      const response = await request
        .post('/products')
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productname: 'product 1',
          productprice: 300
        });
      expect(response.status).toBe(201);

      const conn = await client.connect();
      const sql = 'DELETE FROM products;';
      await conn.query(sql);
      conn.release();

      const connection = await client.connect();
      const sqlQuery = 'DELETE FROM users;';
      await connection.query(sqlQuery);
      connection.release();
    });

    it('update product by id method should return the updated data of specified product with status 200 if the token is valid ', async () => {
      //create new user
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

      const response = await request
        .patch(`/products/${String(newProduct.id)}`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productname: 'product 1 update',
          productprice: 500
        });
      expect(response.status).toBe(200);

      const conn = await client.connect();
      const sql = 'DELETE FROM products;';
      await conn.query(sql);
      conn.release();

      const connection = await client.connect();
      const sqlQuery = 'DELETE FROM users;';
      await connection.query(sqlQuery);
      connection.release();
    });

    it('delete product by id method should delete the specified product with status 204 No Content if the token is valid ', async () => {
      //create new user
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

      const response = await request
        .delete(`/products/${String(newProduct.id)}`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(204);

      const conn = await client.connect();
      const sql = 'DELETE FROM products;';
      await conn.query(sql);
      conn.release();

      const connection = await client.connect();
      const sqlQuery = 'DELETE FROM users;';
      await connection.query(sqlQuery);
      connection.release();
    });
  });

  describe('Order Model', () => {
    // beforeEach(function (done) {
    //     global.jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    //     setTimeout(function () {
    //         console.log('inside timeout');
    //         done();
    //     }, 500);
    // });
    // beforeAll(function() {
    //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000000;
    // });

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
      console.log(newProduct.id, 'newProduct.id');

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
      console.log(newOrder.id, 'newOrder.id');

      let quantity: number = 1;

      const result: OrderProductType = await order.addProductToOrder(
        quantity,
        String(newOrder.id),
        Number(newProduct.id)
      );
      expect(result.quantity).toEqual(1);
      console.log(result.orderId), 'result.orderId';
      console.log(result, 'resultttttttttt');
      //   expect(result.orderId).toEqual(newOrder.id as number);
      //   expect(result.productId).toEqual(newProduct.id as number);

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

  describe('Orders Routes(Handler)', () => {
    // beforeEach(function (done) {
    //     global.jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    //     setTimeout(function () {
    //         console.log('inside timeout');
    //         done();
    //     }, 500);
    // });
    // beforeAll(function() {
    //     jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000000;
    // });

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
});
