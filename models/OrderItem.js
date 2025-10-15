import Product from "./Product.js";
import pool from "../db/pool.js";

class OrderItem {
    constructor({orderId, productId, quantity, subtotal}) {
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
        this.subtotal = subtotal;
        this.order = null;
        this.product = null;
    }

    static async create(data) {
        const orderItem = new OrderItem(data);
        orderItem.product = await Product.getById(data.productId);
        orderItem.subtotal = orderItem.quantity * orderItem.product.price;
        return orderItem;
    }

    static async getByOrderId(orderId) {
        const [rows] = await pool.query(`
            select
            order_id as orderId,
            product_id as productId,
            quantity,
            subtotal
            from order_item 
            where order_id = ?`, [orderId]);

        return Promise.all(rows.map(row => OrderItem.create(row)));
    }

    async insert (conn) {
        await conn.query('insert into order_item (order_id, product_id, quantity, subtotal) values (?, ?, ?, ?)', [this.orderId, this.productId, this.quantity, this.subtotal]);
    }
}

export default OrderItem;