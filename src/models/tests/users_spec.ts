
import { UserType, User } from '../user';
import client from '../../database';
import supertest from 'supertest';
import app from '../../index';

const user = new User();

describe('User Model', () => {

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
      // create new user
      const newUser: UserType = {
        username: 'user',
        useremail: 'user@gmail.com',
        userpassword: 'user123'
      };
      let createdUser = await user.create(newUser);
      newUser.id = createdUser.id;

      // test authenticate method
      const result = await user.authenticate(
        newUser.useremail,
        newUser.userpassword
      );
      expect(result?.username).toEqual(newUser.username);
      expect(result?.useremail).toEqual(newUser.useremail);

      const conn = await client.connect();
      const sql = 'DELETE FROM users;';
      await conn.query(sql);
      conn.release();
    });

    it('authenticate method should return null when entering not registerd user data or wrong credentials', async () => {
      // create new user
      const newUser: UserType = {
        username: 'user',
        useremail: 'user@gmail.com',
        userpassword: 'user123'
      };
      let createdUser = await user.create(newUser);
      newUser.id = createdUser.id;

      // test autenticate method to return null if user is not authenticated
      const result = (await user.authenticate(
        'wrongemail@gmail.com',
        'worngpassword123'
      )) as UserType;
      expect(result).toBeNull;

      const conn = await client.connect();
      const sql = 'DELETE FROM users;';
      await conn.query(sql);
      conn.release();
    });

    it('create method should register/create a new user and return it', async () => {
      // test create user method
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
      const sql = 'DELETE FROM users;';
      await conn.query(sql);
      conn.release();
    });

    it('index method should return array of all the created users', async () => {
      // create new method
      const newUser: UserType = {
        username: 'user',
        useremail: 'user@gmail.com',
        userpassword: 'user123'
      };
      let createdUser = await user.create(newUser);
      newUser.id = createdUser.id;

      // test index method
      const result: UserType[] = await user.index();
      expect(result.length).toBe(1);

      const conn = await client.connect();
      const sql = 'DELETE FROM users;';
      await conn.query(sql);
      conn.release();
    });

    it('show method should return "user" when passing id of specific user', async () => {
      // create new user
      const newUser: UserType = {
        username: 'user',
        useremail: 'user@gmail.com',
        userpassword: 'user123'
      };
      let createdUser = await user.create(newUser);
      newUser.id = createdUser.id;

      // test show method
      const result: UserType = await user.show(String(newUser.id));
      expect(result.username).toEqual(newUser.username);
      expect(result.useremail).toEqual(newUser.useremail);
      expect(result.id).toEqual(newUser.id);

      const conn = await client.connect();
      const sql = 'DELETE FROM users;';
      await conn.query(sql);
      conn.release();
    });

    it('update method should update the data of existing user and return the updated version of it', async () => {
      // create new user
      const newUser: UserType = {
        username: 'user',
        useremail: 'user@gmail.com',
        userpassword: 'user123'
      };
      let createdUser = await user.create(newUser);
      newUser.id = createdUser.id;

      // test update method
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
      const sql = 'DELETE FROM users;';
      await conn.query(sql);
      conn.release();
    });

    it('destroy method should delete existing user when passing id of specific user', async () => {
      // create new user
      const newUser: UserType = {
        username: 'user',
        useremail: 'user@gmail.com',
        userpassword: 'user123'
      };
      let createdUser = await user.create(newUser);
      newUser.id = createdUser.id;

      // test destroy method
      const result: number = await user.destroy(String(newUser.id));
      expect(result).toEqual(1);

      const conn = await client.connect();
      const sql = 'DELETE FROM users;';
      await conn.query(sql);
      conn.release();
    });

  });

  describe('Users Routes', () => {

    const request = supertest(app);

    it('authenticate method response should be token and status 200 if the user is authenticated', async () => {
      // create new user
      const newUser: UserType = {
        username: 'user',
        useremail: 'user@gmail.com',
        userpassword: 'user123'
      };
      let createdUser = await user.create(newUser);
      newUser.id = createdUser.id;

      // test login end point
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
      const sql = 'DELETE FROM users;';
      await conn.query(sql);
      conn.release();
    });

    it('authenticate method response status 401 if the user is unauthorized', async () => {
      // create new user
      const newUser: UserType = {
        username: 'user',
        useremail: 'user@gmail.com',
        userpassword: 'user123'
      };
      let createdUser = await user.create(newUser);
      newUser.id = createdUser.id;

      // test login end point, it should return status 401 "unauthorized" if the user is not authenticated
      const response = await request
        .post('/login')
        .set('content-type', 'application/json')
        .send({
          useremail: 'wrong@gmail.com',
          userpassword: 'wrong123'
        });
      expect(response.status).toBe(401);

      const conn = await client.connect();
      const sql = 'DELETE FROM users;';
      await conn.query(sql);
      conn.release();
    });

    it('create method should response with the created user and with status 201 created', async () => {
      // test signup endpoint
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
      const sql = 'DELETE FROM users;';
      await conn.query(sql);
      conn.release();
    });

    it('index method should return all the created users with status 200 if the token is valid ', async () => {
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

      // test get all users end point
      const response = await request
        .get('/users')
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);

      const conn = await client.connect();
      const sql = 'DELETE FROM users;';
      await conn.query(sql);
      conn.release();
    });

    it('show user by id method should return the specified user with status 200 if the token is valid ', async () => {
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

      // test show user by id end point
      const response = await request
        .get(`/users/${String(newUser.id)}`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);

      const conn = await client.connect();
      const sql = 'DELETE FROM users;';
      await conn.query(sql);
      conn.release();
    });

    it('update user by id method should return the updated data of specified user with status 200 if the token is valid ', async () => {
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

      // test update user by id end point
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
      const sql = 'DELETE FROM users;';
      await conn.query(sql);
      conn.release();
    });

    it('delete user by id method should delete the specified user with status 204 No Content if the token is valid ', async () => {
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

      // test delete user by id endpoint
      const response = await request
        .delete(`/users/${String(newUser.id)}`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(204);

      const conn = await client.connect();
      const sql = 'DELETE FROM users;';
      await conn.query(sql);
      conn.release();
    });

  });