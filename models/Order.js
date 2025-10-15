import pool from "../db/pool.js";
import OrderItem from "./OrderItem.js";
import User from "./User.js";

class Order {
    constructor({orderId, userId, createdAt, total = 0}) {
        this.orderId = orderId;
        this.userId = userId;
        this.createdAt = createdAt;
        this.total = total;
        this.user = null;
        this.orderItems = [];
    }

    static async create(data) {
        const order = new Order(data);

        order.user = await User.getById(order.userId);

        order.orderItems = await OrderItem.getByOrderId(order.orderId);

        return order;
    }

    async insert (conn) {
        const [result] = await conn.query('insert into orders (user_id, created_at, total) values (?, ?, ?)', [this.userId, this.createdAt, this.total]);

        this.orderId = result.insertId;
    }

    async update(conn) {
        return conn.query('update orders set total = ? where id = ?', [this.total, this.orderId]);
    }

    static async get(query, params) {
        const [rows] = await pool.query(query, params);

        return Promise.all(rows.map(row => Order.create(row)));
    }
}

export default Order;