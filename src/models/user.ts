import client from '../database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = process.env.SALT_ROUNDS;

export type UserType = {
  id?: number;
  username: string;
  useremail: string;
  userpassword: string;
};

export class User {
  // get all users (secured route)
  async index(): Promise<UserType[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM users;';
      const result = await conn.query(sql);
      conn.release();
      const users = result.rows;
      return users;
    } catch (error) {
      throw new Error(`couldn't get users, Error: ${(error as Error).message}`);
    }
  }

  // get specific user by id (secured route)
  async show(id: string): Promise<UserType> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM users WHERE id = ($1);';
      const result = await conn.query(sql, [id]);
      conn.release();
      const user = result.rows[0];
      return user;
    } catch (error) {
      throw new Error(
        `couldn't get user ${id}, Error: ${(error as Error).message}`
      );
    }
  }

  // signup (registeration)
  async create(u: UserType): Promise<UserType> {
    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO users (username,useremail,userpassword) VALUES($1, $2, $3) RETURNING *';
      const hash: string = bcrypt.hashSync(
        u.userpassword + pepper,
        parseInt(saltRounds as string)
      );
      const result = await conn.query(sql, [u.username, u.useremail, hash]);
      conn.release();
      const user = result.rows[0];
      return user;
    } catch (err) {
      throw new Error(
        `couldn't add new user ${u.username}, Error: ${(err as Error).message}`
      );
    }
  }

  // login
  async authenticate(
    useremail: string,
    userpassword: string
  ): Promise<UserType | null> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM users WHERE useremail = ($1);';
      const result = await conn.query(sql, [useremail]);
      if (result.rowCount) {
        const user: UserType = result.rows[0] as UserType;
        // will compare the password that the user enters with the password returned from the SELECT query
        if (bcrypt.compareSync(userpassword + pepper, user.userpassword)) {
          return user;
        }
      }
      return null;
    } catch (error) {
      throw new Error(`you must signup first: ${(error as Error).message}`);
    }
  }

  // update data of a specific user (secured route)
  async update(
    id: string,
    username: string,
    useremail: string,
    userpassword: string
  ): Promise<UserType> {
    try {
      const conn = await client.connect();
      const sql =
        'UPDATE users SET username=($2), useremail=($3), userpassword=($4) WHERE id=($1) RETURNING *;';
      const result = await conn.query(sql, [
        id,
        username,
        useremail,
        userpassword
      ]);
      conn.release();
      const user = result.rows[0];
      return user;
    } catch (error) {
      throw new Error(
        `couldn't update user ${id}, Error: ${(error as Error).message}`
      );
    }
  }

  // delete a specific user (secured route)
  async destroy(id: string): Promise<number> {
    try {
      const conn = await client.connect();
      const sql = 'DELETE FROM users WHERE id = ($1);';
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rowCount;
    } catch (error) {
      throw new Error(
        `couldn't delete user ${id}, Error: ${(error as Error).message}`
      );
    }
  }
}
