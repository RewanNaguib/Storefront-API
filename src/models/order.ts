import client from '../database';

export type OrderType = {
  id?: number;
  orderstatus: string;
  userId: number;
};

export type OrderProductType = {
  id?: number;
  quantity: number;
  orderId: number;
  productId: number;
};

export class Order {
  // get all orders for all the users (secured route)
  async index(): Promise<OrderType[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM orders;';
      const result = await conn.query(sql);
      conn.release();
      const orders = result.rows;
      return orders;
    } catch (error) {
      throw new Error(
        `couldn't get orders, Error: ${(error as Error).message}`
      );
    }
  }

  // get specific order by id (secured route)
  async show(id: string): Promise<OrderType> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM orders WHERE id = ($1);';
      const result = await conn.query(sql, [id]);
      conn.release();
      const order = result.rows[0];
      return order;
    } catch (error) {
      throw new Error(
        `couldn't get order ${id}, Error: ${(error as Error).message}`
      );
    }
  }

  // get order details of a specific user (secured Route)
  async getUserOrders(userId: string): Promise<OrderType[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM orders WHERE userId = ($1);';
      const result = await conn.query(sql, [userId]);
      conn.release();
      const orders = result.rows;
      return orders;
    } catch (error) {
      throw new Error(
        `couldn't get orders for user ${userId}, Error: ${
          (error as Error).message
        }`
      );
    }
  }

  // get order details of a specific order (secured Route)
  async getOrderDetails(orderId: string): Promise<OrderProductType[]> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM order_products WHERE orderId = ($1);';
      const result = await conn.query(sql, [orderId]);
      conn.release();
      const orderDetails = result.rows;
      return orderDetails;
    } catch (error) {
      throw new Error(
        `couldn't get details of order ${orderId}, Error: ${
          (error as Error).message
        }`
      );
    }
  }

  // get closed orders of a specific order (secured Route)
  async getUserClosedOrders(userId: string): Promise<OrderType[]> {
    try {
      const conn = await client.connect();
      const sql =
        'SELECT * FROM orders WHERE userId = ($1) AND orderstatus = ($2);';
      const result = await conn.query(sql, [userId, 'closed']);
      conn.release();
      const closedOrders = result.rows;
      return closedOrders;
    } catch (error) {
      throw new Error(
        `couldn't get closed orders of user ${userId}, Error: ${
          (error as Error).message
        }`
      );
    }
  }

  // create order (secured route)
  async create(id: string, userId: number): Promise<OrderType> {
    try {
      const conn = await client.connect();
      const sql = 'INSERT INTO orders (userId) VALUES($1) RETURNING *';
      const result = await conn.query(sql, [userId]);
      conn.release();
      const order = result.rows[0];
      return order;
    } catch (err) {
      throw new Error(
        `couldn't add new order for userId ${userId}, Error: ${
          (err as Error).message
        }`
      );
    }
  }

  // specific user add product(s) to order
  async addProductToOrder(
    quantity: number,
    orderId: string,
    productId: number
  ): Promise<OrderProductType> {
    //get order to see it's status if it's (open) or (closed), if it's (closed) the product can't be added to this order
    try {
      const conn = await client.connect();
      const sql = 'SELECT * FROM orders WHERE id=($1);';
      const result = await conn.query(sql, [orderId]);
      conn.release();
      const orderstatus = result.rows[0].orderstatus;
      if (orderstatus !== 'open') {
        throw new Error(
          `could not add product ${productId} to order ${orderId} because order status is ${orderstatus}`
        );
      }
    } catch (error) {
      throw new Error(
        `order ${orderId} not found, Error:${(error as Error).message}`
      );
    }

    try {
      const conn = await client.connect();
      const sql =
        'INSERT INTO order_products (quantity, orderId, productId) VALUES ($1, $2, $3) RETURNING *;';
      const result = await conn.query(sql, [quantity, orderId, productId]);
      conn.release();
      const orderProductsDetails = result.rows[0];
      return orderProductsDetails;
    } catch (error) {
      throw new Error(
        `can not add product ${productId} to order ${orderId} ${
          (error as Error).message
        }`
      );
    }
  }

  // update order status to closed (secured route)
  async updateOrderStatusToClosed(orderId: string): Promise<OrderType> {
    try {
      const conn = await client.connect();
      const sql =
        'UPDATE orders SET orderstatus = ($2) WHERE id=($1) RETURNING *;';
      const result = await conn.query(sql, [orderId, 'closed']);
      conn.release();
      const Closedorder = result.rows[0];
      return Closedorder;
    } catch (error) {
      throw new Error(
        `couldn't update status of order ${orderId} to closed, Error: ${
          (error as Error).message
        }`
      );
    }
  }
}
