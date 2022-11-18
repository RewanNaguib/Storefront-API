import { UserType, User } from '../user';
import { ProductType, Product } from '../product';
import client from '../../database';
import supertest from 'supertest';
import app from '../../index';

const user = new User();
const product = new Product();

describe('Product Model', () => {

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
      // create new product
      const newProduct: ProductType = {
        productname: 'product 1',
        productprice: 300
      };
      let createdProduct = await product.create(newProduct);
      newProduct.id = createdProduct.id;

      // test index method 
      const result: ProductType[] = await product.index();
      expect(result.length).toBe(1);

      const conn = await client.connect();
      const sql = 'DELETE FROM products;';
      await conn.query(sql);
      conn.release();
    });

    it('show method should return "product" when passing id of specific product', async () => {
      // create new product
      const newProduct: ProductType = {
        productname: 'product 1',
        productprice: 300
      };
      let createdProduct = await product.create(newProduct);
      newProduct.id = createdProduct.id;

      // test show method
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
      // create new product
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
      // create new product
      const newProduct: ProductType = {
        productname: 'product 1',
        productprice: 300
      };
      let createdProduct = await product.create(newProduct);
      newProduct.id = createdProduct.id;

      // test update method
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
      // create new product
      const newProduct: ProductType = {
        productname: 'product 1',
        productprice: 300
      };
      let createdProduct = await product.create(newProduct);
      newProduct.id = createdProduct.id;

      // test destrory method
      const result: number = await product.destroy(String(newProduct.id));
      expect(result).toEqual(1);

      const conn = await client.connect();
      const sql = 'DELETE FROM products;';
      await conn.query(sql);
      conn.release();
    });

  });

  describe('Products Routes', () => {

    const request = supertest(app);

    it('index method should return all the products with status 200 without need for token', async () => {
      // create new product
      const newProduct: ProductType = {
        productname: 'product 1',
        productprice: 300
      };
      let createdProduct = await product.create(newProduct);
      newProduct.id = createdProduct.id;

      // test get all products end point
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
      // create new product
      const newProduct: ProductType = {
        productname: 'product 1',
        productprice: 300
      };
      let createdProduct = await product.create(newProduct);
      newProduct.id = createdProduct.id;

      // test show product by id end point
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

      // test create product end point
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
      await conn.query('DELETE FROM products;');
      const sqlQuery = 'DELETE FROM users;';
      await conn.query(sqlQuery);
      conn.release();
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
        
        // test delete product by id end point
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

      // test update product by id end point
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
    
  });