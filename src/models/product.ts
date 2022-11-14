import client from "../database";

export type ProductType ={
    id?: number;
    productname: string;
    productprice: number;
};

export class Product{
    // get all products
    async index(): Promise<ProductType[]>{
        try{
            const conn = await client.connect();
            const sql = 'SELECT * FROM products;';
            const result = await conn.query(sql);
            conn.release();
            const products = result.rows;
            return products;
        }catch(error){
            throw new Error(`couldn't get products, Error: ${(error as Error).message}`);
        }
    };

    // get specific product by id
    async show(id: string): Promise<ProductType>{
        try{
            const conn = await client.connect();
            const sql = 'SELECT * FROM products WHERE id = ($1);';
            const result = await conn.query(sql, [id]);
            conn.release();
            const product = result.rows[0];
            return product;
        }catch(error){
            throw new Error(`couldn't get product ${id}, Error: ${(error as Error).message}`);
        }
    };

    // create product (secured route)
    async create(p: ProductType): Promise<ProductType> {
        try {
            const conn = await client.connect();
            const sql  = 'INSERT INTO products (productname, productprice) VALUES($1, $2) RETURNING *';
            const result = await conn.query(sql, [p.productname, p.productprice]);
            conn.release();
            const product = result.rows[0];
            return product;
        } catch (err) {
            throw new Error(`couldn't add new product ${p.productname}, Error: ${(err as Error).message}`);
        }
    };

    // update data of a specific product (secured route)
    async update(id: string, productname: string, productprice: number): Promise<ProductType> {
        try{
            const conn = await client.connect();
            const sql = 'UPDATE products SET productname=($2), productprice=($3) WHERE id=($1) RETURNING *;';
            const result = await conn.query(sql, [id, productname, productprice]);
            conn.release();
            const product = result.rows[0];
            return product;
        }catch(error){
            throw new Error(`couldn't update product ${id}, Error: ${(error as Error).message}`);
        }
    };

    // delete a specific product (secured route)
    async destroy(id: string): Promise<number>{
        try{
            const conn = await client.connect();
            const sql = 'DELETE FROM products WHERE id = ($1);';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rowCount;
        }catch(error){
            throw new Error(`couldn't delete product ${id}, Error: ${(error as Error).message}`);
        }
    };

}