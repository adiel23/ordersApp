import pool from "../db/pool.js";

class Product {
    constructor({productId, name, price}) {
        this.productId = productId;
        this.name = name;
        this.price = price;
    }

    static async getById(id) {
        const [results] = await pool.query(`
            select
            id as productId,
            name,
            price
            from products where
            id = ?
            `, [id]);

        if (results.length > 0) {
            return new Product(results[0]);
        }

        return null;
    }

    static async get(query, params) {
        return pool.query(query, params);
    }
}

export default Product;