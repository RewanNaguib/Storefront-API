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
      console.log('before create product');
      try{
        let createdProduct = await product.create(newProduct);
        newProduct.id = createdProduct.id;
      } catch(error){
          console.log(error);
      }
     
      console.log('after product');

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